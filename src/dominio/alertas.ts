// src/dominio/alertas.ts - Entidades y tipos para motor de alertas preventivas GES e inactividad (HU-04 / RF-04)
import type { AlertaSeguimiento } from './caso-oncologico.js';

export type EstadoGarantia = 'Pendiente' | 'Cumplida' | 'No aplica';

export const PUNTOS_CONTACTO_NORMADOS = [
  'P1 Ingreso/Sospecha inicial',
  'P2 Post-confirmación diagnóstica con IPD',
  'P3 Etapificación/Post-resolución de comité',
  'P4 Alta de hospitalización o cirugía',
  'P5 Fin del tratamiento activo y retorno a la vida cotidiana',
  'P6 Derivación a otro establecimiento de la red',
  'No normado'
] as const;

export type PuntoContactoNormado = typeof PUNTOS_CONTACTO_NORMADOS[number];

export type EstadoContactoBitacora = 'Efectivo' | 'No contactable';

export const TEXTOS_MAPEO_HITO_PUNTO: Record<string, PuntoContactoNormado> = {
  // P1
  'ingreso de sospecha': 'P1 Ingreso/Sospecha inicial',
  'recepcion de interconsulta': 'P1 Ingreso/Sospecha inicial',
  'primera consulta': 'P1 Ingreso/Sospecha inicial',
  'derivacion desde urgencia con sospecha': 'P1 Ingreso/Sospecha inicial',
  // P2
  'confirmacion diagnostica': 'P2 Post-confirmación diagnóstica con IPD',
  'confirmacion histologica': 'P2 Post-confirmación diagnóstica con IPD',
  'notificacion diagnostica': 'P2 Post-confirmación diagnóstica con IPD',
  'notificacion ges': 'P2 Post-confirmación diagnóstica con IPD',
  'entrega de ipd': 'P2 Post-confirmación diagnóstica con IPD',
  'informe de biopsia confirmatoria': 'P2 Post-confirmación diagnóstica con IPD',
  'diagnostico confirmado': 'P2 Post-confirmación diagnóstica con IPD',
  // P3
  'resolucion de comite': 'P3 Etapificación/Post-resolución de comité',
  // P4
  'alta hospitalaria': 'P4 Alta de hospitalización o cirugía',
  'intervencion quirurgica': 'P4 Alta de hospitalización o cirugía',
  'cirugia': 'P4 Alta de hospitalización o cirugía',
  // P5
  'termino de quimioterapia': 'P5 Fin del tratamiento activo y retorno a la vida cotidiana',
  'termino de radioterapia': 'P5 Fin del tratamiento activo y retorno a la vida cotidiana',
  'ingreso a seguimiento': 'P5 Fin del tratamiento activo y retorno a la vida cotidiana',
  'sobrevivientes': 'P5 Fin del tratamiento activo y retorno a la vida cotidiana',
  // P6
  'despacho de derivacion': 'P6 Derivación a otro establecimiento de la red'
};

export function mapearHitoAPuntoNormado(tipoHito: string): PuntoContactoNormado | null {
  const norm = tipoHito.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  for (const [texto, punto] of Object.entries(TEXTOS_MAPEO_HITO_PUNTO)) {
    if (norm.includes(texto)) {
      return punto;
    }
  }
  return null;
}

export interface GarantiaGES {
  id?: number;
  casoId: number;
  identificador: string;
  tipoGarantia: string;
  fechaInicio: string;
  fechaLimite: string;
  estadoCumplimiento: EstadoGarantia;
  diasRestantes?: number;
}

export interface EntradaBitacora {
  id?: number;
  casoId: number;
  identificador: string;
  puntoContactoNormado?: PuntoContactoNormado | string | null;
  fechaContacto: string;
  canalContacto: string;
  interlocutor?: string | null;
  motivoContacto?: string | null;
  resumenInteraccion: string;
  acuerdosEstablecidos?: string | null;
  responsableRegistro: string;
  estadoContacto: EstadoContactoBitacora | string;
  esAdenda: boolean;
  fechaProximoContacto?: string | null;
  objetivoProximoContacto?: string | null;
  entradaOriginalId?: string | null;
}

export interface AlertaConDetalle extends AlertaSeguimiento {
  numeroCaso: string;
  pacienteNombre: string;
  pacienteRun: string;
  tipoGarantia?: string;
  fechaLimiteGarantia?: string;
  diasRestantes?: number;
  diasInactividad?: number;
  puntoNormado?: string;
  tipoHitoCumplimiento?: string;
  fechaHitoCumplimiento?: string;
  identificadorEntradaCumplimiento?: string;
  fechaEntradaCumplimiento?: string;
}

export interface ResultadoEvaluacionAlertas {
  totalEvaluadas: number;
  alertasGeneradas: number;
  alertasGesGeneradas: number;
  alertasInactividadGeneradas: number;
  alertasPuntoPendienteGeneradas: number;
  fechaReferencia: string;
}

export interface RegistrarGestionInput {
  resumenInteraccion: string;
  canalContacto?: string;
  interlocutor?: string;
  motivoContacto?: string;
  acuerdosEstablecidos?: string;
  responsableRegistro?: string;
}

export interface RegistrarCumplimientoInput {
  tipoHito: string;
  fechaOcurrencia: string;
  responsable: string;
  rolResponsable: string;
}

export interface CerrarAlertaInput {
  motivoCierre: string;
  fechaCierre: string;
  responsableCierre: string;
}
