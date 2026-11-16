// src/dominio/examenes.ts - Entidades, tipos y transiciones de estado de EST-04 (HU-05 / RF-05)

export const ESTADOS_RECEPCION = [
  'Solicitado',
  'Pendiente de validación',
  'Observado por identificación',
  'Incorporado',
  'Incorporado con hallazgo crítico'
] as const;

export type EstadoRecepcion = typeof ESTADOS_RECEPCION[number];

export function esEstadoRecepcionValido(estado: string): estado is EstadoRecepcion {
  return (ESTADOS_RECEPCION as readonly string[]).includes(estado as EstadoRecepcion);
}

export const ORIGENES_INFORME = [
  'LIS',
  'PACS',
  'Compra externa'
] as const;

export type OrigenInforme = typeof ORIGENES_INFORME[number];

export interface OrdenExamen {
  id?: number;
  casoId: number;
  identificador: string;
  tipoEstudio: string;
  fechaSolicitud: string;
}

export interface EstudioDiagnostico {
  id?: number;
  ordenExamenId?: number | null;
  casoId?: number | null;
  identificadorInforme: string;
  runInformado: string;
  tipoEstudio: string;
  origen: OrigenInforme | string;
  fechaInforme: string;
  estadoValidacion: 'Validado' | 'Pendiente' | string;
  estadoRecepcion: EstadoRecepcion;
  hallazgoCritico: boolean | number;
  archivoAdjunto?: string | null;
  fechaRegistro: string;
}

export interface ExamenConDetalle {
  ordenId: number;
  casoId: number;
  identificadorOrden: string;
  tipoEstudio: string;
  fechaSolicitud: string;
  estudioId?: number | null;
  identificadorInforme?: string | null;
  runInformado?: string | null;
  origen?: string | null;
  fechaInforme?: string | null;
  estadoValidacion?: string | null;
  estadoRecepcion: EstadoRecepcion;
  hallazgoCritico: boolean;
  archivoAdjunto?: string | null;
}

export interface ResumenCompletitudDiagnostica {
  totalSolicitados: number;
  totalIncorporados: number;
  porcentajeCompletitud: number;
  examenesPendientes: number;
}

export type EventoTransicionEstudio =
  | 'emision_orden'
  | 'informe_preliminar'
  | 'adjuntar_externo'
  | 'detectar_discrepancia'
  | 'subsanar_discrepancia'
  | 'incorporar_sin_hallazgo'
  | 'incorporar_con_hallazgo';

export interface ContextoTransicionEstudio {
  runValido?: boolean;
  esPdfValido?: boolean;
  esCompraExterna?: boolean;
  estaEnLisOPacs?: boolean;
  hallazgoCritico?: boolean;
  identificacionRatificada?: boolean;
}

export interface ResultadoEvaluacionEstudio {
  esValido: boolean;
  nuevoEstado: EstadoRecepcion;
  accion?: string;
  error?: string;
}

/**
 * Evalúa las reglas de transición de estado de EST-04 para EstudioDiagnostico (HU-05)
 * Funciona como función pura según Decisiones D2 y D3.
 */
export function evaluarTransicionEstudio(
  estadoActual: EstadoRecepcion | null | undefined,
  evento: EventoTransicionEstudio,
  contexto: ContextoTransicionEstudio = {}
): ResultadoEvaluacionEstudio {
  // Transición 1: Emisión inicial de la orden (solo cuando no hay estado previo)
  if (!estadoActual) {
    if (evento === 'emision_orden') {
      return {
        esValido: true,
        nuevoEstado: 'Solicitado',
        accion: 'Emisión de OrdenExamen vinculada al caso'
      };
    }
    return {
      esValido: false,
      nuevoEstado: 'Solicitado',
      error: `No se puede aplicar el evento '${evento}' sin una orden de examen previa emitida.`
    };
  }

  // Transiciones desde 'Solicitado'
  if (estadoActual === 'Solicitado') {
    if (evento === 'informe_preliminar') {
      return {
        esValido: true,
        nuevoEstado: 'Pendiente de validación',
        accion: 'Mantener recepción pendiente'
      };
    }

    if (evento === 'adjuntar_externo') {
      if (contexto.estaEnLisOPacs) {
        return {
          esValido: false,
          nuevoEstado: estadoActual,
          error: 'El informe está disponible en LIS/PACS; no corresponde carga como compra externa.'
        };
      }
      if (contexto.esPdfValido === false) {
        return {
          esValido: false,
          nuevoEstado: estadoActual,
          error: 'El informe externo debe estar en formato PDF.'
        };
      }
      return {
        esValido: true,
        nuevoEstado: 'Incorporado',
        accion: 'Incorporar PDF y actualizar completitud'
      };
    }

    return {
      esValido: false,
      nuevoEstado: estadoActual,
      error: `Transición no permitida: evento '${evento}' no aplicable a un estudio en estado 'Solicitado'.`
    };
  }

  // Transiciones desde 'Pendiente de validación'
  if (estadoActual === 'Pendiente de validación') {
    if (evento === 'detectar_discrepancia') {
      if (contexto.runValido === true) {
        return {
          esValido: false,
          nuevoEstado: estadoActual,
          error: 'El RUN es inequívoco; no puede registrarse como discrepancia de identificación.'
        };
      }
      return {
        esValido: true,
        nuevoEstado: 'Observado por identificación',
        accion: 'Registrar excepción y mantener orden pendiente'
      };
    }

    if (evento === 'incorporar_sin_hallazgo') {
      if (contexto.runValido === false) {
        return {
          esValido: false,
          nuevoEstado: estadoActual,
          error: 'No se puede incorporar el informe: discrepancia en la identificación del paciente (RUN).'
        };
      }
      if (contexto.hallazgoCritico === true) {
        return {
          esValido: false,
          nuevoEstado: estadoActual,
          error: 'El informe contiene hallazgos críticos; debe incorporarse mediante el evento con hallazgo crítico.'
        };
      }
      return {
        esValido: true,
        nuevoEstado: 'Incorporado',
        accion: 'Incorporar copia PDF y actualizar completitud'
      };
    }

    if (evento === 'incorporar_con_hallazgo') {
      if (contexto.runValido === false) {
        return {
          esValido: false,
          nuevoEstado: estadoActual,
          error: 'No se puede incorporar el informe: discrepancia en la identificación del paciente (RUN).'
        };
      }
      if (contexto.hallazgoCritico !== true) {
        return {
          esValido: false,
          nuevoEstado: estadoActual,
          error: 'El informe no contiene hallazgos críticos informados por el origen.'
        };
      }
      return {
        esValido: true,
        nuevoEstado: 'Incorporado con hallazgo crítico',
        accion: 'Incorporar copia PDF y generar alerta de seguimiento tipo Hallazgo crítico'
      };
    }

    return {
      esValido: false,
      nuevoEstado: estadoActual,
      error: `Transición no permitida: evento '${evento}' no aplicable a un estudio en estado 'Pendiente de validación'.`
    };
  }

  // Transiciones desde 'Observado por identificación'
  if (estadoActual === 'Observado por identificación') {
    if (evento === 'subsanar_discrepancia') {
      if (contexto.identificacionRatificada !== true && contexto.runValido !== true) {
        return {
          esValido: false,
          nuevoEstado: estadoActual,
          error: 'Se requiere confirmación y ratificación de la identificación del paciente para subsanar.'
        };
      }
      return {
        esValido: true,
        nuevoEstado: 'Incorporado',
        accion: 'Subsanación de RUN y validación confirmada / Incorporar copia PDF'
      };
    }

    return {
      esValido: false,
      nuevoEstado: estadoActual,
      error: `Transición no permitida: evento '${evento}' no aplicable a un estudio en estado 'Observado por identificación'.`
    };
  }

  // Estados finales: 'Incorporado' e 'Incorporado con hallazgo crítico'
  if (estadoActual === 'Incorporado' || estadoActual === 'Incorporado con hallazgo crítico') {
    return {
      esValido: false,
      nuevoEstado: estadoActual,
      error: `El estudio ya se encuentra en estado terminal '${estadoActual}' y no admite modificaciones.`
    };
  }

  return {
    esValido: false,
    nuevoEstado: estadoActual || 'Solicitado',
    error: `Estado desconocido o combinación no contemplada en EST-04: '${estadoActual}' con evento '${evento}'.`
  };
}
