// src/dominio/evaluacion.ts - Entidades, tipos y algoritmos de valoración multidimensional (MD-01.D / HU-02)

export const NIVELES_VULNERABILIDAD = ['Bajo', 'Medio', 'Alto'] as const;
export type NivelVulnerabilidad = typeof NIVELES_VULNERABILIDAD[number];

export function esNivelVulnerabilidadValido(nivel: string): nivel is NivelVulnerabilidad {
  return (NIVELES_VULNERABILIDAD as readonly string[]).includes(nivel);
}

export const DOMINIOS = [
  'CLINICO_FUNCIONAL',
  'PSICOEMOCIONAL',
  'CUIDADOR',
  'SOCIOECONOMICO',
  'ESPIRITUAL',
  'COMPRENSION_DIAGNOSTICA'
] as const;
export type TipoDominio = typeof DOMINIOS[number];

export function esTipoDominioValido(tipo: string): tipo is TipoDominio {
  return (DOMINIOS as readonly string[]).includes(tipo);
}

export interface CuidadorAutorizado {
  id?: number;
  pacienteId: number;
  runCuidador: string;
  nombreCompleto: string;
  parentesco: string;
  telefonoContacto: string;
  autorizacionVigente: boolean;
  fechaRegistroAutorizacion: string;
}

export interface DominioValoracion {
  id?: number;
  evaluacionId?: number;
  tipoDominio: TipoDominio;
  descripcionHallazgo: string;
  requiereDerivacion: boolean;
  especialidadDerivada?: string;
  previsionSalud?: string;
  situacionLaboral?: string;
}

export interface EvaluacionMultidimensional {
  id?: number;
  casoId: number;
  identificador: string;
  fechaEvaluacion: string;
  puntajeClinicoFuncional: number; // Escala ECOG / OMS: 0 a 4
  puntajePsicoemocional: number;   // 0: Sin afectación, 1: Afectación leve/moderada, 2: Alteración crítica
  escalaZaritCuidador?: number;    // Escala Zarit: 0 a 88 (opcional si no cuenta con cuidador)
  nivelVulnerabilidad: NivelVulnerabilidad;
  profesionalEvaluador: string;
  dominios?: DominioValoracion[];
  cuidador?: CuidadorAutorizado;
}

export interface EntradaEvaluacionDTO {
  casoId: number;
  profesionalEvaluador: string;
  ecog: number;
  descripcionFuncional: string;
  puntajePsicoemocional: number;
  descripcionPsicoemocional: string;
  requiereDerivacionPsico: boolean;
  especialidadPsico?: string;
  tieneCuidador: boolean;
  cuidador?: {
    runCuidador: string;
    nombreCompleto: string;
    parentesco: string;
    telefonoContacto: string;
  };
  escalaZarit?: number;
  descripcionCuidador: string;
  requiereDerivacionCuidador: boolean;
  especialidadDerivadaCuidador?: string;
  nivelSocioeconomico: 'Bajo' | 'Medio' | 'Alto';
  previsionSalud: string;
  situacionLaboral: string;
  descripcionSocioeconomica: string;
  requiereDerivacionSocial: boolean;
  especialidadSocial?: string;
  descripcionEspiritual: string;
  descripcionComprension: string;
}

export interface ResultadoCalculoVulnerabilidad {
  puntosEcog: number;
  puntosSocioeconomico: number;
  puntosCuidador: number;
  puntajeTotal: number;
  nivelVulnerabilidad: NivelVulnerabilidad;
  sugerenciasDerivacion: string[];
}

/**
 * Valida si el puntaje ECOG se encuentra estrictamente dentro del rango clínico [0, 4]
 */
export function esEcogValido(ecog: unknown): ecog is number {
  if (typeof ecog !== 'number' || Number.isNaN(ecog)) {
    return false;
  }
  return Number.isInteger(ecog) && ecog >= 0 && ecog <= 4;
}

/**
 * Valida si el puntaje Zarit está dentro del rango permitido [0, 88]
 */
export function esZaritValido(zarit?: unknown): boolean {
  if (zarit === undefined || zarit === null || zarit === '') {
    return true;
  }
  const n = Number(zarit);
  return Number.isInteger(n) && n >= 0 && n <= 88;
}

/**
 * Implementa el algoritmo acordado D1:
 * - ECOG 0-1 = 0 pts; ECOG 2 = 1 pt; ECOG 3-4 = 2 pts.
 * - Vulnerabilidad socioeconómica: Bajo = 0 pts; Medio = 1 pt; Alto = 2 pts.
 * - Soporte / cuidador (Zarit):
 *   - Sin sobrecarga (Zarit <= 46): 0 pts.
 *   - Sobrecarga leve (Zarit 47-56): 1 pt.
 *   - Sobrecarga severa (Zarit > 56) o sin cuidador/red de soporte: 2 pts.
 * Total 0-2 -> 'Bajo'; 3-4 -> 'Medio'; 5-6 -> 'Alto'.
 */
export function calcularNivelVulnerabilidad(
  ecog: number,
  nivelSocioeconomico: 'Bajo' | 'Medio' | 'Alto',
  tieneCuidador: boolean,
  escalaZarit?: number,
  puntajePsicoemocional: number = 0
): ResultadoCalculoVulnerabilidad {
  // 1. Puntos ECOG
  let puntosEcog = 0;
  if (ecog === 2) {
    puntosEcog = 1;
  } else if (ecog >= 3) {
    puntosEcog = 2;
  }

  // 2. Puntos Socioeconómico
  let puntosSocioeconomico = 0;
  if (nivelSocioeconomico === 'Medio') {
    puntosSocioeconomico = 1;
  } else if (nivelSocioeconomico === 'Alto') {
    puntosSocioeconomico = 2;
  }

  // 3. Puntos Cuidador
  let puntosCuidador = 0;
  if (!tieneCuidador) {
    puntosCuidador = 2; // Falta de cuidador o red de apoyo primaria
  } else if (typeof escalaZarit === 'number') {
    if (escalaZarit > 56) {
      puntosCuidador = 2; // Sobrecarga severa
    } else if (escalaZarit >= 47) {
      puntosCuidador = 1; // Sobrecarga leve
    } else {
      puntosCuidador = 0; // Sin sobrecarga
    }
  }

  const puntajeTotal = puntosEcog + puntosSocioeconomico + puntosCuidador;

  let nivelVulnerabilidad: NivelVulnerabilidad = 'Bajo';
  if (puntajeTotal >= 5) {
    nivelVulnerabilidad = 'Alto';
  } else if (puntajeTotal >= 3) {
    nivelVulnerabilidad = 'Medio';
  } else {
    nivelVulnerabilidad = 'Bajo';
  }

  // Sugerencias de derivación (HU-02-ESC-01 / HU-02-ESC-02)
  const sugerenciasDerivacion: string[] = [];
  if (puntajePsicoemocional >= 2) {
    sugerenciasDerivacion.push('Derivación prioritaria a Psicooncología / Salud Mental por afectación crítica.');
  }
  if (puntosSocioeconomico >= 2) {
    sugerenciasDerivacion.push('Derivación a Unidad de Servicio Social por alta vulnerabilidad socioeconómica.');
  }
  if (tieneCuidador && typeof escalaZarit === 'number' && escalaZarit > 56) {
    sugerenciasDerivacion.push('Derivación urgente a Unidad de Servicio Social por sobrecarga severa del cuidador principal.');
  }

  return {
    puntosEcog,
    puntosSocioeconomico,
    puntosCuidador,
    puntajeTotal,
    nivelVulnerabilidad,
    sugerenciasDerivacion
  };
}
