// src/dominio/calendario-ges.ts - Cálculo de días hábiles y corridos para garantías GES (HU-04 / RF-04)

export const FERIADOS_CHILE_2026 = new Set([
  '2026-01-01', // Año Nuevo
  '2026-04-03', // Viernes Santo
  '2026-04-04', // Sábado Santo
  '2026-05-01', // Día Nacional del Trabajo
  '2026-05-21', // Día de las Glorias Navales
  '2026-06-21', // Día Nacional de los Pueblos Indígenas
  '2026-06-29', // San Pedro y San Pablo
  '2026-07-16', // Día de la Virgen del Carmen
  '2026-08-15', // Asunción de la Virgen
  '2026-09-18', // Independencia Nacional (Fiestas Patrias)
  '2026-09-19', // Día de las Glorias del Ejército
  '2026-10-12', // Encuentro de Dos Mundos
  '2026-10-31', // Día de las Iglesias Evangélicas y Protestantes
  '2026-11-01', // Día de Todos los Santos
  '2026-12-08', // Inmaculada Concepción
  '2026-12-25'  // Navidad
]);

function parsearFechaUtc(fechaStr: string): Date {
  const partes = fechaStr.slice(0, 10).split('-');
  const año = parseInt(partes[0], 10);
  const mes = parseInt(partes[1], 10) - 1;
  const día = parseInt(partes[2], 10);
  return new Date(Date.UTC(año, mes, día));
}

function formatearFechaUtc(d: Date): string {
  const año = d.getUTCFullYear();
  const mes = String(d.getUTCMonth() + 1).padStart(2, '0');
  const día = String(d.getUTCDate()).padStart(2, '0');
  return `${año}-${mes}-${día}`;
}

export function esFinDeSemana(fechaStr: string): boolean {
  const d = parsearFechaUtc(fechaStr);
  const diaSemana = d.getUTCDay(); // 0 = Domingo, 6 = Sábado
  return diaSemana === 0 || diaSemana === 6;
}

export function esFeriado(fechaStr: string): boolean {
  const limpia = fechaStr.slice(0, 10);
  return FERIADOS_CHILE_2026.has(limpia);
}

export function esDiaHabil(fechaStr: string): boolean {
  return !esFinDeSemana(fechaStr) && !esFeriado(fechaStr);
}

/**
 * Calcula los días hábiles restantes hasta fechaLimite inclusive, a partir del día posterior a fechaReferencia.
 * Si fechaLimite es posterior a fechaReferencia: devuelve un entero positivo.
 * Si fechaLimite es anterior a fechaReferencia: devuelve un entero negativo indicando días de rezago/vencimiento.
 */
export function diasHabilesRestantes(fechaLimite: string, fechaReferencia: string): number {
  const limiteStr = fechaLimite.slice(0, 10);
  const refStr = fechaReferencia.slice(0, 10);

  if (limiteStr === refStr) {
    return 0;
  }

  const limiteDate = parsearFechaUtc(limiteStr);
  const refDate = parsearFechaUtc(refStr);

  if (limiteDate > refDate) {
    let count = 0;
    const curr = new Date(refDate.getTime());
    while (curr < limiteDate) {
      curr.setUTCDate(curr.getUTCDate() + 1);
      if (esDiaHabil(formatearFechaUtc(curr))) {
        count++;
      }
    }
    return count;
  } else {
    // Vencida: contar días hábiles en retrospectiva
    let count = 0;
    const curr = new Date(refDate.getTime());
    while (curr > limiteDate) {
      if (esDiaHabil(formatearFechaUtc(curr))) {
        count++;
      }
      curr.setUTCDate(curr.getUTCDate() - 1);
    }
    return -count;
  }
}

/**
 * Calcula la diferencia en días corridos (calendario) entre dos fechas (hasta - desde).
 */
export function diasCorridosEntre(desde: string, hasta: string): number {
  const d1 = parsearFechaUtc(desde);
  const d2 = parsearFechaUtc(hasta);
  const diffMs = d2.getTime() - d1.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Suma una cantidad de días hábiles a una fecha dada, retornando la fecha YYYY-MM-DD resultante.
 */
export function sumarDiasHabiles(fechaInicio: string, diasHabiles: number): string {
  const curr = parsearFechaUtc(fechaInicio);
  let sumados = 0;
  while (sumados < diasHabiles) {
    curr.setUTCDate(curr.getUTCDate() + 1);
    const str = formatearFechaUtc(curr);
    if (esDiaHabil(str)) {
      sumados++;
    }
  }
  return formatearFechaUtc(curr);
}
