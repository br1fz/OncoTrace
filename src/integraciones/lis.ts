// src/integraciones/lis.ts - Interfaz y adaptador simulado para LIS (Anatomía Patológica y Laboratorio)
import type { OrigenInforme } from '../dominio/examenes.js';

export interface InformeExterno {
  identificadorInforme: string;
  runInformado: string;
  tipoEstudio: string;
  origen: OrigenInforme;
  fechaInforme: string;
  estadoValidacion: 'Validado' | 'Pendiente';
  hallazgoCritico: boolean;
  contenidoTexto?: string;
}

export interface ClienteLIS {
  consultarInformes(run: string): InformeExterno[];
}

export class ClienteLISSimulado implements ClienteLIS {
  private informes: InformeExterno[] = [];
  public ultimasConsultas: { run: string; fecha: string; mensaje: string }[] = [];

  constructor(informesIniciales?: InformeExterno[]) {
    if (informesIniciales) {
      this.informes = [...informesIniciales];
    }
  }

  agregarInforme(informe: InformeExterno): void {
    this.informes.push(informe);
  }

  limpiarInformes(): void {
    this.informes = [];
    this.ultimasConsultas = [];
  }

  consultarInformes(run: string): InformeExterno[] {
    const logMensaje = `DSS-01 Paso 2: Consultar informes disponibles y su estado de validación en LIS para RUN ${run}`;
    this.ultimasConsultas.push({
      run,
      fecha: new Date().toISOString(),
      mensaje: logMensaje
    });
    console.log(logMensaje);

    // Retornar los informes registrados en el simulador para este RUN
    // o aquellos sin RUN inequívoco si están configurados para prueba de discrepancia
    const resultados = this.informes.filter(
      (inf) => inf.origen === 'LIS' && (inf.runInformado === run || inf.runInformado === 'RUN-DISCREPANTE')
    );

    console.log(`DSS-01 Paso 4: LIS entrega ${resultados.length} informe(s) para RUN ${run}`);
    return resultados;
  }
}

let instanciaLIS: ClienteLIS | null = null;

export const INFORMES_LIS_POR_DEFECTO: InformeExterno[] = [
  {
    identificadorInforme: 'LIS-BIO-2026-01',
    runInformado: '12.345.678-9',
    tipoEstudio: 'Biopsia core mamaria',
    origen: 'LIS',
    fechaInforme: '2026-10-20',
    estadoValidacion: 'Validado',
    hallazgoCritico: false
  },
  {
    identificadorInforme: 'LIS-BIO-CRIT-02',
    runInformado: '9.876.543-2',
    tipoEstudio: 'Colonoscopía con biopsia',
    origen: 'LIS',
    fechaInforme: '2026-10-18',
    estadoValidacion: 'Validado',
    hallazgoCritico: true
  },
  {
    identificadorInforme: 'LIS-BIO-PRELIM-04',
    runInformado: '8.765.432-1',
    tipoEstudio: 'Biopsia prostática transrectal',
    origen: 'LIS',
    fechaInforme: '2026-10-21',
    estadoValidacion: 'Pendiente',
    hallazgoCritico: false
  },
  {
    identificadorInforme: 'LIS-BIO-DISCREP-05',
    runInformado: '99.888.777-K',
    tipoEstudio: 'Biopsia pulmonar percutánea',
    origen: 'LIS',
    fechaInforme: '2026-10-22',
    estadoValidacion: 'Validado',
    hallazgoCritico: false
  }
];

export function obtenerClienteLIS(): ClienteLIS {
  if (instanciaLIS) {
    return instanciaLIS;
  }
  const modo = process.env.INTEGRACIONES_MODO || 'simulado';
  if (modo === 'simulado') {
    instanciaLIS = new ClienteLISSimulado(INFORMES_LIS_POR_DEFECTO);
    return instanciaLIS;
  }
  instanciaLIS = new ClienteLISSimulado(INFORMES_LIS_POR_DEFECTO);
  return instanciaLIS;
}

export function resetearClienteLIS(cliente?: ClienteLIS): void {
  instanciaLIS = cliente || null;
}
