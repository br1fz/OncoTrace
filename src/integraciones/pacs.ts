// src/integraciones/pacs.ts - Interfaz y adaptador simulado para PACS (Imágenes y Radiología)
import type { InformeExterno } from './lis.js';

export interface ClientePACS {
  consultarInformes(run: string): InformeExterno[];
}

export class ClientePACSSimulado implements ClientePACS {
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
    const logMensaje = `DSS-01 Paso 3: Consultar informes disponibles y su estado de validación en PACS para RUN ${run}`;
    this.ultimasConsultas.push({
      run,
      fecha: new Date().toISOString(),
      mensaje: logMensaje
    });
    console.log(logMensaje);

    const resultados = this.informes.filter(
      (inf) => inf.origen === 'PACS' && (inf.runInformado === run || inf.runInformado === 'RUN-DISCREPANTE')
    );

    console.log(`DSS-01 Paso 5: PACS entrega ${resultados.length} informe(s) para RUN ${run}`);
    return resultados;
  }
}

let instanciaPACS: ClientePACS | null = null;

export function obtenerClientePACS(): ClientePACS {
  if (instanciaPACS) {
    return instanciaPACS;
  }
  const modo = process.env.INTEGRACIONES_MODO || 'simulado';
  if (modo === 'simulado') {
    instanciaPACS = new ClientePACSSimulado();
    return instanciaPACS;
  }
  // En producción o futuro, aquí se instanciaría el cliente DICOM real
  instanciaPACS = new ClientePACSSimulado();
  return instanciaPACS;
}

export function resetearClientePACS(cliente?: ClientePACS): void {
  instanciaPACS = cliente || null;
}

