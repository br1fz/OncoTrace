// src/dominio/alertas.ts - Entidades y tipos para motor de alertas preventivas GES e inactividad (HU-04 / RF-04)
import type { AlertaSeguimiento } from './caso-oncologico.js';

export type EstadoGarantia = 'Pendiente' | 'Cumplida' | 'No aplica';

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
  puntoContactoNormado?: string | null;
  fechaContacto: string;
  canalContacto: string;
  interlocutor?: string | null;
  motivoContacto?: string | null;
  resumenInteraccion: string;
  acuerdosEstablecidos?: string | null;
  responsableRegistro: string;
  estadoContacto: string;
  esAdenda: boolean;
}

export interface AlertaConDetalle extends AlertaSeguimiento {
  numeroCaso: string;
  pacienteNombre: string;
  pacienteRun: string;
  tipoGarantia?: string;
  fechaLimiteGarantia?: string;
  diasRestantes?: number;
  diasInactividad?: number;
}

export interface ResultadoEvaluacionAlertas {
  totalEvaluadas: number;
  alertasGeneradas: number;
  alertasGesGeneradas: number;
  alertasInactividadGeneradas: number;
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
