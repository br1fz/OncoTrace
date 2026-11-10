// src/servicios/seguimiento.ts - Casos de uso y lógica asistencial de CU-05 (HU-01)
import type { Database } from 'better-sqlite3';
import {
  ETAPAS,
  type EtapaTrayectoria,
  type CasoResumenTablero,
  type HitoAsistencial,
  type ResolucionComite,
  type AlertaSeguimiento,
  evaluarTransicionHito
} from '../dominio/caso-oncologico.js';
import { RepositorioOncologico } from '../dominio/repositorios.js';

export interface TableroEtapas {
  etapas: {
    nombre: EtapaTrayectoria;
    casos: CasoResumenTablero[];
  }[];
  totalCasos: number;
}

export interface FichaCasoCompleta {
  numeroCaso: string;
  run: string;
  nombreCompleto: string;
  especialidad: string;
  codigoDiagnosticoOSospecha: string;
  etapaActual: EtapaTrayectoria;
  fechaIngreso: string;
  hitos: HitoAsistencial[];
  resoluciones: ResolucionComite[];
  alertas: AlertaSeguimiento[];
  alertasPendientes: number;
  marcadorRiesgo: string;
  ultimoHito?: HitoAsistencial;
}

export interface RegistroHitoInput {
  tipo: string;
  fechaOcurrencia: string;
  responsable: string;
  rolResponsable: string;
  conductaAcordada?: string;
}

export interface ResultadoRegistroHito {
  ok: boolean;
  error?: string;
  nuevaEtapa?: EtapaTrayectoria;
}

export class ServicioSeguimiento {
  private repo: RepositorioOncologico;

  constructor(private db: Database) {
    this.repo = new RepositorioOncologico(db);
  }

  obtenerTablero(): TableroEtapas {
    const todosLosCasos = this.repo.listarCasosResumen();

    const etapas = ETAPAS.map((nombreEtapa) => ({
      nombre: nombreEtapa,
      casos: todosLosCasos.filter((c) => c.etapaActual === nombreEtapa)
    }));

    return {
      etapas,
      totalCasos: todosLosCasos.length
    };
  }

  obtenerFichaCaso(numeroCaso: string): FichaCasoCompleta | null {
    const caso = this.repo.obtenerCasoPorNumero(numeroCaso);
    if (!caso || !caso.id) {
      return null;
    }

    const hitosBrutos = this.repo.listarHitosPorCasoId(caso.id);
    const resoluciones = this.repo.listarResolucionesPorCasoId(caso.id);
    const alertas = this.repo.listarAlertasPorCasoId(caso.id);

    // Calcular días transcurridos entre hitos cronológicos consecutivos
    const hitosConDias: HitoAsistencial[] = hitosBrutos.map((hito, idx) => {
      let diasDesdeAnterior = 0;
      if (idx > 0) {
        const dAnterior = new Date(hitosBrutos[idx - 1].fechaOcurrencia).getTime();
        const dActual = new Date(hito.fechaOcurrencia).getTime();
        if (!isNaN(dAnterior) && !isNaN(dActual)) {
          const diffMs = dActual - dAnterior;
          diasDesdeAnterior = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
        }
      }
      return {
        ...hito,
        diasDesdeAnterior
      };
    });

    const alertasPendientes = alertas.filter((a) =>
      ['Pendiente', 'Generada', 'En gestión', 'Vigente'].includes(a.estado)
    ).length;

    const ultimoHito = hitosConDias.length > 0 ? hitosConDias[hitosConDias.length - 1] : undefined;

    return {
      numeroCaso: caso.numeroCaso,
      run: caso.paciente.run,
      nombreCompleto: caso.paciente.nombreCompleto,
      especialidad: caso.especialidad,
      codigoDiagnosticoOSospecha: caso.codigoDiagnosticoOSospecha,
      etapaActual: caso.etapaActual,
      fechaIngreso: caso.fechaIngreso,
      hitos: hitosConDias,
      resoluciones,
      alertas,
      alertasPendientes,
      marcadorRiesgo: 'Sin evaluar',
      ultimoHito
    };
  }

  registrarHito(numeroCaso: string, input: RegistroHitoInput): ResultadoRegistroHito {
    // 1. Validar campos obligatorios
    if (!input.tipo || !input.tipo.trim()) {
      return { ok: false, error: 'El tipo de hito es obligatorio.' };
    }
    if (!input.fechaOcurrencia || !input.fechaOcurrencia.trim()) {
      return { ok: false, error: 'La fecha de ocurrencia del hito es obligatoria.' };
    }
    if (!input.responsable || !input.responsable.trim()) {
      return { ok: false, error: 'El nombre del profesional responsable es obligatorio.' };
    }
    if (!input.rolResponsable || !input.rolResponsable.trim()) {
      return { ok: false, error: 'El rol del responsable es obligatorio.' };
    }

    const caso = this.repo.obtenerCasoPorNumero(numeroCaso);
    if (!caso || !caso.id) {
      return { ok: false, error: `No se encontró el caso oncológico '${numeroCaso}'.` };
    }

    // 2. Validar consistencia temporal de fechas (HU-01-ESC-04 y HU-01-ESC-05)
    const fechaHoy = new Date().toISOString().split('T')[0];
    if (input.fechaOcurrencia.trim() > fechaHoy) {
      return { ok: false, error: 'La fecha de ocurrencia no puede ser futura' };
    }

    const hitosExistentes = this.repo.listarHitosPorCasoId(caso.id);
    if (hitosExistentes.length > 0) {
      const ultimoHito = hitosExistentes[hitosExistentes.length - 1];
      if (input.fechaOcurrencia.trim() < ultimoHito.fechaOcurrencia) {
        return { ok: false, error: 'La fecha de ocurrencia no puede ser anterior al último hito registrado' };
      }
    }

    // 3. Verificar si tiene resolución de comité previa
    const tieneResolucion = this.repo.tieneResolucionComite(caso.id);

    // 4. Evaluar transiciones de estado EST-03
    const evalTransicion = evaluarTransicionHito(caso.etapaActual, input.tipo, tieneResolucion);

    if (!evalTransicion.esValido) {
      return { ok: false, error: evalTransicion.error };
    }

    // 4. Ejecutar cambios en transacción atómica
    const fechaRegistroIso = new Date().toISOString();

    const tx = this.db.transaction(() => {
      // Registrar resolución de comité si aplica
      if (evalTransicion.esResolucionComite) {
        this.repo.crearResolucionComite({
          casoId: caso.id!,
          identificador: `RES-${Date.now().toString().slice(-6)}`,
          conductaAcordada: input.conductaAcordada?.trim() || 'Conducta consensuada en sesión colegiada de comité',
          fechaResolucion: input.fechaOcurrencia,
          fechaFirma: fechaRegistroIso
        });
      }

      // Actualizar etapa si corresponde a inicio de tratamiento
      if (evalTransicion.esInicioTratamiento && evalTransicion.nuevaEtapa !== caso.etapaActual) {
        this.repo.actualizarEtapaCaso(caso.id!, evalTransicion.nuevaEtapa);
      }

      // Registrar el hito asistencial en la línea de tiempo
      this.repo.crearHito({
        casoId: caso.id!,
        tipo: input.tipo.trim(),
        fechaOcurrencia: input.fechaOcurrencia,
        fechaRegistro: fechaRegistroIso,
        responsable: input.responsable.trim(),
        rolResponsable: input.rolResponsable.trim()
      });
    });

    tx();

    return {
      ok: true,
      nuevaEtapa: evalTransicion.nuevaEtapa
    };
  }
}

