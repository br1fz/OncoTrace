// src/servicios/seguimiento.ts - Casos de uso y lógica asistencial de CU-05 (HU-01)
import type { Database } from 'better-sqlite3';
import { randomUUID } from 'node:crypto';
import {
  ETAPAS,
  type EtapaTrayectoria,
  type CasoResumenTablero,
  type HitoAsistencial,
  type ResolucionComite,
  type AlertaSeguimiento,
  evaluarTransicionHito
} from '../dominio/caso-oncologico.js';
import type { EvaluacionMultidimensional, CuidadorAutorizado } from '../dominio/evaluacion.js';
import {
  mapearHitoAPuntoNormado,
  type GarantiaGES,
  type EntradaBitacora,
  type PuntoContactoNormado,
  type EstadoContactoBitacora
} from '../dominio/alertas.js';
import { diasHabilesRestantes, diasCorridosEntre } from '../dominio/calendario-ges.js';
import { RepositorioOncologico } from '../dominio/repositorios.js';
import { ServicioAlertas } from './alertas.js';

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
  alertas: (AlertaSeguimiento & { tipoGarantia?: string; diasRestantes?: number; diasInactividad?: number })[];
  alertasPendientes: number;
  marcadorRiesgo: string;
  ultimoHito?: HitoAsistencial;
  evaluacionActual?: EvaluacionMultidimensional;
  evaluacionesHistoricas?: EvaluacionMultidimensional[];
  cuidador?: CuidadorAutorizado;
  garantias?: GarantiaGES[];
  entradasBitacora?: EntradaBitacora[];
  indicadorContactabilidad?: 'Contactable' | 'No contactable' | 'Sin registro';
  rachaFallosConsecutivos?: number;
  proximaAccion?: {
    fecha: string;
    objetivo: string;
    identificadorEntrada?: string;
  };
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

export interface RegistrarInteraccionInput {
  puntoContactoNormado?: PuntoContactoNormado | string | null;
  fechaContacto: string;
  canalContacto: string;
  interlocutor: string;
  motivoContacto: string;
  resumenInteraccion: string;
  acuerdosEstablecidos?: string | null;
  estadoContacto: EstadoContactoBitacora | string;
  fechaProximoContacto?: string | null;
  objetivoProximoContacto?: string | null;
}

export interface RegistrarAdendaInput {
  motivoEnmienda: string;
  resumenCorreccion: string;
  acuerdosEstablecidos?: string | null;
}

export class ServicioSeguimiento {
  private repo: RepositorioOncologico;
  private alertasService: ServicioAlertas;

  constructor(private db: Database) {
    this.repo = new RepositorioOncologico(db);
    this.alertasService = new ServicioAlertas(db);
  }

  obtenerTablero(fechaReferencia?: string): TableroEtapas {
    this.alertasService.evaluarAlertas(fechaReferencia);
    const todosLosCasos = this.repo.listarCasosResumen(fechaReferencia);

    const etapas = ETAPAS.map((nombreEtapa) => ({
      nombre: nombreEtapa,
      casos: todosLosCasos.filter((c) => c.etapaActual === nombreEtapa)
    }));

    return {
      etapas,
      totalCasos: todosLosCasos.length
    };
  }

  obtenerFichaCaso(numeroCaso: string, fechaReferencia?: string): FichaCasoCompleta | null {
    this.alertasService.evaluarAlertas(fechaReferencia);
    const caso = this.repo.obtenerCasoPorNumero(numeroCaso);
    if (!caso || !caso.id) {
      return null;
    }

    const hitosBrutos = this.repo.listarHitosPorCasoId(caso.id);
    const resoluciones = this.repo.listarResolucionesPorCasoId(caso.id);
    const alertasRaw = this.repo.listarAlertasPorCasoId(caso.id);

    const ref = fechaReferencia ? fechaReferencia.slice(0, 10) : new Date().toISOString().slice(0, 10);
    const ultimoRegistro = this.repo.obtenerFechaUltimoRegistroAsistencial(caso.id);

    const alertas = alertasRaw.map((a) => {
      let diasRestantes = undefined;
      let diasInactividad = undefined;
      if (a.fechaLimiteGarantia) {
        diasRestantes = diasHabilesRestantes(a.fechaLimiteGarantia, ref);
      } else if (a.tipo === 'Riesgo de Inactividad/Abandono' && ultimoRegistro) {
        diasInactividad = diasCorridosEntre(ultimoRegistro, ref);
      }
      return {
        ...a,
        diasRestantes,
        diasInactividad
      };
    });

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

    // Evaluaciones multidimensionales (HU-02)
    const evaluacionActual = this.repo.obtenerUltimaEvaluacionPorCasoId(caso.id) || undefined;
    const evaluacionesHistoricas = this.repo.listarEvaluacionesPorCasoId(caso.id);
    const cuidador = this.repo.obtenerCuidadorPorPacienteId(caso.pacienteId) || undefined;
    const marcadorRiesgo = evaluacionActual?.nivelVulnerabilidad || 'Sin evaluar';

    // Garantías y Bitácora (HU-04 / HU-03)
    const garantias = this.repo.listarGarantiasPorCasoId(caso.id);
    const entradasBitacora = this.repo.listarEntradasPorCasoId(caso.id);

    // Indicador derivado de contactabilidad (HU-03 / Option A)
    const ultimaAcomp = this.repo.obtenerUltimaEntradaAcompanamiento(caso.id);
    let indicadorContactabilidad: 'Contactable' | 'No contactable' | 'Sin registro' = 'Sin registro';
    if (ultimaAcomp) {
      indicadorContactabilidad = ultimaAcomp.estadoContacto === 'Efectivo' ? 'Contactable' : 'No contactable';
    }
    const rachaFallosConsecutivos = this.repo.contarIntentosFallidosConsecutivos(caso.id);

    // Próxima acción programada (HU-03-ESC-05)
    const entradaConProximo = entradasBitacora.find((e) => Boolean(e.fechaProximoContacto));
    const proximaAccion = entradaConProximo
      ? {
          fecha: entradaConProximo.fechaProximoContacto!,
          objetivo: entradaConProximo.objetivoProximoContacto || 'Seguimiento asistencial programado',
          identificadorEntrada: entradaConProximo.identificador
        }
      : undefined;

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
      marcadorRiesgo,
      ultimoHito,
      evaluacionActual,
      evaluacionesHistoricas,
      cuidador,
      garantias,
      entradasBitacora,
      indicadorContactabilidad,
      rachaFallosConsecutivos,
      proximaAccion
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
    // Se usa fecha local (Chile / entorno) para evitar desfase UTC entre 21:00 y 23:59
    const d = new Date();
    const fechaHoy = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
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

  // --- Bitácora de Acompañamiento (HU-03 / CU-11 / RF-03) ---

  validarRolBitacora(rolActual?: string): void {
    if (rolActual !== 'Gestor/a UGCO' && rolActual !== 'TENS UGCO') {
      const error: any = new Error('Acceso denegado: solo los roles Gestor/a UGCO y TENS UGCO están autorizados para registrar en la bitácora.');
      error.codigo = 'ROL_NO_AUTORIZADO';
      error.status = 403;
      throw error;
    }
  }

  registrarInteraccion(
    numeroCaso: string,
    input: RegistrarInteraccionInput,
    usuario?: string,
    rolActual?: string
  ): { id: number; identificador: string } {
    this.validarRolBitacora(rolActual);

    // Validar campos obligatorios (HU-03-ESC-06)
    const faltantes: string[] = [];
    if (!input.fechaContacto || !input.fechaContacto.trim()) faltantes.push('fecha de contacto');
    if (!input.canalContacto || !input.canalContacto.trim()) faltantes.push('canal de contacto');
    if (!input.interlocutor || !input.interlocutor.trim()) faltantes.push('interlocutor');
    if (!input.motivoContacto || !input.motivoContacto.trim()) faltantes.push('motivo del contacto');
    if (!input.resumenInteraccion || !input.resumenInteraccion.trim()) faltantes.push('resumen de la interacción');

    if (faltantes.length > 0) {
      const error: any = new Error(`Campos obligatorios incompletos: ${faltantes.join(', ')}.`);
      error.codigo = 'DATOS_INCOMPLETOS';
      error.status = 400;
      throw error;
    }

    const caso = this.repo.obtenerCasoPorNumero(numeroCaso);
    if (!caso || !caso.id) {
      const error: any = new Error(`No se encontró el caso oncológico '${numeroCaso}'.`);
      error.status = 404;
      throw error;
    }

    let resultadoId = 0;
    let identificadorFinal = '';

    const tx = this.db.transaction(() => {
      // Generar identificador correlativo BIT-YYYY-NNN
      const anio = input.fechaContacto ? input.fechaContacto.slice(0, 4) : '2026';
      let seq = 1;
      while (true) {
        const candidato = `BIT-${anio}-${String(seq).padStart(3, '0')}`;
        if (!this.repo.obtenerEntradaBitacoraPorIdentificador(candidato)) {
          identificadorFinal = candidato;
          break;
        }
        seq++;
      }

      const estadoContacto = input.estadoContacto === 'No contactable' ? 'No contactable' : 'Efectivo';

      resultadoId = this.repo.crearEntradaBitacora({
        casoId: caso.id!,
        identificador: identificadorFinal,
        puntoContactoNormado: input.puntoContactoNormado?.trim() || null,
        fechaContacto: input.fechaContacto.trim(),
        canalContacto: input.canalContacto.trim(),
        interlocutor: input.interlocutor.trim(),
        motivoContacto: input.motivoContacto.trim(),
        resumenInteraccion: input.resumenInteraccion.trim(),
        acuerdosEstablecidos: input.acuerdosEstablecidos?.trim() || null,
        responsableRegistro: usuario || rolActual || 'Gestor/a UGCO',
        estadoContacto,
        esAdenda: false,
        fechaProximoContacto: input.fechaProximoContacto?.trim() || null,
        objetivoProximoContacto: input.objetivoProximoContacto?.trim() || null
      });

      const ahoraIso = new Date().toISOString();
      const fechaEntradaDia = input.fechaContacto.slice(0, 10);

      // 1. Resolución automática de alertas activas de 'Punto de contacto pendiente' (HU-03-ESC-02 / Task 3.2)
      if (input.puntoContactoNormado && input.puntoContactoNormado !== 'No normado') {
        const alertasCaso = this.repo.listarAlertasPorCasoId(caso.id!);
        const hitosCaso = this.repo.listarHitosPorCasoId(caso.id!);

        for (const a of alertasCaso) {
          if (a.tipo === 'Punto de contacto pendiente' && ['Pendiente', 'En gestión'].includes(a.estado) && a.hitoOrigenId) {
            const hitoOrigen = hitosCaso.find((h) => h.id === a.hitoOrigenId);
            if (hitoOrigen) {
              const puntoOrigen = mapearHitoAPuntoNormado(hitoOrigen.tipo);
              if (puntoOrigen === input.puntoContactoNormado) {
                // Verificar que fecha de entrada >= fecha de hito por día (HU-03-ESC-02)
                if (fechaEntradaDia >= hitoOrigen.fechaOcurrencia.slice(0, 10)) {
                  this.repo.resolverAlertaConEntrada(a.id!, resultadoId, ahoraIso);
                }
              }
            }
          }
        }
      }

      // 2. Si el contacto fue Efectivo, resuelve alertas de Búsqueda activa por no contactabilidad
      if (estadoContacto === 'Efectivo') {
        const alertasCaso = this.repo.listarAlertasPorCasoId(caso.id!);
        for (const a of alertasCaso) {
          if (a.tipo === 'Búsqueda activa por no contactabilidad' && ['Pendiente', 'En gestión'].includes(a.estado)) {
            this.repo.resolverAlertaConEntrada(a.id!, resultadoId, ahoraIso);
          }
        }
      }

      // 3. Si el estado es 'No contactable' y es entrada de acompañamiento con punto normado:
      // Evaluar racha de fallos y detonar alerta de búsqueda activa si racha >= 3 (HU-03-ESC-03 / Task 3.3)
      if (estadoContacto === 'No contactable' && input.puntoContactoNormado) {
        const racha = this.repo.contarIntentosFallidosConsecutivos(caso.id!);
        if (racha >= 3) {
          const tieneAlertaBusqueda = this.repo.existeAlertaActivaPorTipo(caso.id!, 'Búsqueda activa por no contactabilidad');
          if (!tieneAlertaBusqueda) {
            this.repo.crearAlerta({
              casoId: caso.id!,
              identificador: `ALR-${randomUUID().slice(0, 8).toUpperCase()}`,
              tipo: 'Búsqueda activa por no contactabilidad',
              prioridad: 'Alta',
              estado: 'Pendiente',
              fechaGeneracion: `${fechaEntradaDia}T08:00:00Z`,
              entradaOrigenId: resultadoId
            });
          }
        }
      }
    });

    tx();

    return { id: resultadoId, identificador: identificadorFinal };
  }

  registrarAdenda(
    numeroCaso: string,
    identificadorOriginal: string,
    input: RegistrarAdendaInput,
    usuario?: string,
    rolActual?: string
  ): { id: number; identificador: string } {
    this.validarRolBitacora(rolActual);

    if (!input.motivoEnmienda || !input.motivoEnmienda.trim()) {
      const error: any = new Error('El motivo de la enmienda o aclaración es obligatorio.');
      error.codigo = 'DATOS_INCOMPLETOS';
      error.status = 400;
      throw error;
    }
    if (!input.resumenCorreccion || !input.resumenCorreccion.trim()) {
      const error: any = new Error('El detalle de la rectificación asistencial es obligatorio.');
      error.codigo = 'DATOS_INCOMPLETOS';
      error.status = 400;
      throw error;
    }

    const caso = this.repo.obtenerCasoPorNumero(numeroCaso);
    if (!caso || !caso.id) {
      const error: any = new Error(`No se encontró el caso oncológico '${numeroCaso}'.`);
      error.status = 404;
      throw error;
    }

    const original = this.repo.obtenerEntradaBitacoraPorIdentificador(identificadorOriginal);
    if (!original || original.casoId !== caso.id) {
      const error: any = new Error(`Entrada original de bitácora '${identificadorOriginal}' no encontrada para este caso.`);
      error.status = 404;
      throw error;
    }

    let resultadoId = 0;
    let identificadorFinal = '';

    const tx = this.db.transaction(() => {
      const anio = new Date().getFullYear().toString();
      let seq = 1;
      while (true) {
        const candidato = `BIT-${anio}-${String(seq).padStart(3, '0')}`;
        if (!this.repo.obtenerEntradaBitacoraPorIdentificador(candidato)) {
          identificadorFinal = candidato;
          break;
        }
        seq++;
      }

      resultadoId = this.repo.crearEntradaBitacora({
        casoId: caso.id!,
        identificador: identificadorFinal,
        puntoContactoNormado: null,
        fechaContacto: new Date().toISOString(),
        canalContacto: original.canalContacto,
        interlocutor: original.interlocutor,
        motivoContacto: `Adenda / Rectificación: ${input.motivoEnmienda.trim()}`,
        resumenInteraccion: input.resumenCorreccion.trim(),
        acuerdosEstablecidos: input.acuerdosEstablecidos?.trim() || original.acuerdosEstablecidos,
        responsableRegistro: usuario || rolActual || 'Gestor/a UGCO',
        estadoContacto: original.estadoContacto,
        esAdenda: true,
        entradaOriginalId: original.identificador
      });
    });

    tx();

    return { id: resultadoId, identificador: identificadorFinal };
  }

  eliminarEntradaBitacora(): void {
    const error: any = new Error('Operación no permitida: las entradas de bitácora son inmutables y no admiten eliminación física.');
    error.codigo = 'OPERACION_NO_PERMITIDA';
    error.status = 405;
    throw error;
  }
}

