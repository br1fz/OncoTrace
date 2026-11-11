// src/dominio/caso-oncologico.ts - Entidades, tipos y transiciones de estado de EST-03 (HU-01)

export const ETAPAS = [
  'Sospecha',
  'Confirmación diagnóstica',
  'Etapificación',
  'Tratamiento',
  'Rehabilitación',
  'Cuidados paliativos y alivio del dolor',
  'Seguimiento y sobrevivientes',
  'Alta y contrarreferencia'
] as const;

export type EtapaTrayectoria = typeof ETAPAS[number];

export function esEtapaValida(etapa: string): etapa is EtapaTrayectoria {
  return (ETAPAS as readonly string[]).includes(etapa);
}

export interface Paciente {
  id?: number;
  run: string;
  nombreCompleto: string;
}

export interface CasoOncologico {
  id?: number;
  numeroCaso: string;
  pacienteId: number;
  especialidad: string;
  codigoDiagnosticoOSospecha: string;
  etapaActual: EtapaTrayectoria;
  fechaIngreso: string;
}

export interface HitoAsistencial {
  id?: number;
  casoId: number;
  tipo: string;
  fechaOcurrencia: string;
  fechaRegistro: string;
  responsable: string;
  rolResponsable: string;
  diasDesdeAnterior?: number;
}

export interface ResolucionComite {
  id?: number;
  casoId: number;
  identificador: string;
  conductaAcordada: string;
  fechaResolucion: string;
  fechaFirma: string;
}

export interface AlertaSeguimiento {
  id?: number;
  casoId: number;
  identificador?: string;
  tipo: string;
  prioridad: string;
  estado: string;
  fechaGeneracion: string;
  garantiaId?: number;
  hitoCumplimientoId?: number;
  motivoCierre?: string;
  fechaCierre?: string;
  responsableCierre?: string;
}

export interface CasoResumenTablero {
  numeroCaso: string;
  run: string;
  nombreCompleto: string;
  especialidad: string;
  codigoDiagnosticoOSospecha: string;
  etapaActual: EtapaTrayectoria;
  ultimoHito?: {
    tipo: string;
    fechaOcurrencia: string;
  };
  alertasPendientes: number;
  alertaMaximaPrioridad?: string;
  marcadorRiesgo: string;
  alertaMasUrgente?: {
    tipo: string;
    tipoGarantia?: string;
    diasRestantes?: number;
    diasInactividad?: number;
  };
}

export interface ResultadoEvaluacionHito {
  esValido: boolean;
  nuevaEtapa: EtapaTrayectoria;
  error?: string;
  esResolucionComite: boolean;
  esInicioTratamiento: boolean;
}

export function normalizarTipoHito(tipo: string): string {
  return tipo.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/**
 * Evalúa las reglas de transición de estado de EST-03 para CasoOncologico:
 * - 'Resolución de comité': Se conserva en Etapificación (no crea etapa Comité).
 * - 'Inicio de tratamiento': Exige resolución de comité previa y estar en Etapificación; pasa a Tratamiento.
 */
export function evaluarTransicionHito(
  etapaActual: EtapaTrayectoria,
  tipoHito: string,
  tieneResolucionPrevia: boolean
): ResultadoEvaluacionHito {
  const norm = normalizarTipoHito(tipoHito);
  const esResolucion = norm.includes('resolucion') && norm.includes('comite');
  const esInicio = norm.includes('inicio') && norm.includes('tratamiento');

  if (esResolucion) {
    return {
      esValido: true,
      nuevaEtapa: etapaActual, // Se conserva en Etapificación (no cambia de etapa)
      esResolucionComite: true,
      esInicioTratamiento: false
    };
  }

  if (esInicio) {
    if (!tieneResolucionPrevia) {
      return {
        esValido: false,
        nuevaEtapa: etapaActual,
        error: 'No se puede registrar inicio de tratamiento sin una resolución de comité previa registrada.',
        esResolucionComite: false,
        esInicioTratamiento: true
      };
    }
    if (etapaActual !== 'Etapificación') {
      return {
        esValido: false,
        nuevaEtapa: etapaActual,
        error: `El caso se encuentra en la etapa '${etapaActual}'; debe estar en 'Etapificación' para iniciar tratamiento.`,
        esResolucionComite: false,
        esInicioTratamiento: true
      };
    }
    return {
      esValido: true,
      nuevaEtapa: 'Tratamiento',
      esResolucionComite: false,
      esInicioTratamiento: true
    };
  }

  // Cualquier otro hito asistencial se registra manteniendo la etapa actual
  return {
    esValido: true,
    nuevaEtapa: etapaActual,
    esResolucionComite: false,
    esInicioTratamiento: false
  };
}

