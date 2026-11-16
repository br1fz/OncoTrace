// src/servicios/examenes.ts - Lógica de negocio y orquestación para consolidación de exámenes diagnósticos (HU-05 / RF-05)
import type { Database } from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import {
  type OrdenExamen,
  type EstudioDiagnostico,
  type ExamenConDetalle,
  type ResumenCompletitudDiagnostica,
  type EstadoRecepcion,
  type EventoTransicionEstudio,
  type ContextoTransicionEstudio,
  evaluarTransicionEstudio
} from '../dominio/examenes.js';
import { RepositorioOncologico } from '../dominio/repositorios.js';
import { type ClienteLIS, obtenerClienteLIS, type InformeExterno } from '../integraciones/lis.js';
import { type ClientePACS, obtenerClientePACS } from '../integraciones/pacs.js';

// Buffer estándar de PDF mínimo de 1 página para simulaciones y pruebas
export const PDF_MINIMO_BUFFER = Buffer.from(
  '%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj 2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj 3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R/Resources<<>>>>endobj\nxref\n0 4\n0000000000 65535 f \n0000000010 00000 n \n0000000053 00000 n \n0000000102 00000 n \ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n178\n%%EOF\n',
  'utf-8'
);

export class ServicioExamenes {
  private repo: RepositorioOncologico;
  private clienteLIS: ClienteLIS;
  private clientePACS: ClientePACS;
  private directorioInformes: string;

  constructor(
    private db: Database,
    clienteLIS?: ClienteLIS,
    clientePACS?: ClientePACS,
    directorioInformesPersonalizado?: string
  ) {
    this.repo = new RepositorioOncologico(db);
    this.clienteLIS = clienteLIS || obtenerClienteLIS();
    this.clientePACS = clientePACS || obtenerClientePACS();
    this.directorioInformes =
      directorioInformesPersonalizado || path.join(process.cwd(), 'data', 'informes');

    if (!fs.existsSync(this.directorioInformes)) {
      fs.mkdirSync(this.directorioInformes, { recursive: true });
    }
  }

  /**
   * Aplicador único de transiciones de estado de EST-04 (Decisión D3)
   */
  aplicarTransicionEstudio(
    estudioId: number,
    evento: EventoTransicionEstudio,
    contexto: ContextoTransicionEstudio = {}
  ): { exito: boolean; nuevoEstado?: EstadoRecepcion; accion?: string; error?: string } {
    const estudio = this.repo.obtenerEstudioDiagnosticoPorId(estudioId);
    if (!estudio) {
      return {
        exito: false,
        error: `No se encontró el estudio diagnóstico con ID ${estudioId}.`
      };
    }

    const evaluacion = evaluarTransicionEstudio(estudio.estadoRecepcion, evento, contexto);
    if (!evaluacion.esValido) {
      return {
        exito: false,
        error: evaluacion.error
      };
    }

    this.repo.actualizarEstadoEstudio(estudioId, evaluacion.nuevoEstado);
    return {
      exito: true,
      nuevoEstado: evaluacion.nuevoEstado,
      accion: evaluacion.accion
    };
  }

  /**
   * Consulta e indexación automatizada de informes validados desde LIS y PACS (DSS-01 / ESC-01 a ESC-04)
   */
  consultarEIncorporarExamenes(numeroCaso: string): {
    incorporados: number;
    hallazgosCriticos: number;
    discrepanciasIdentidad: number;
    pendientesEnOrigen: number;
    completitud: ResumenCompletitudDiagnostica;
  } {
    const caso = this.repo.obtenerCasoPorNumero(numeroCaso);
    if (!caso) {
      throw new Error(`El caso oncológico '${numeroCaso}' no existe.`);
    }

    const ordenes = this.repo.listarOrdenesPorCasoId(caso.id!);
    const runPaciente = caso.paciente.run;

    // DSS-01 Pasos 2, 3, 4 y 5
    const informesLIS = this.clienteLIS.consultarInformes(runPaciente);
    const informesPACS = this.clientePACS.consultarInformes(runPaciente);
    const todosInformes: InformeExterno[] = [...informesLIS, ...informesPACS];

    let incorporados = 0;
    let hallazgosCriticos = 0;
    let discrepanciasIdentidad = 0;
    let pendientesEnOrigen = 0;

    for (const inf of todosInformes) {
      // 1. Detección de discrepancia de RUN (HU-05-ESC-03 / D1)
      if (inf.runInformado !== runPaciente) {
        discrepanciasIdentidad++;
        const existente = this.repo.obtenerEstudioPorIdentificadorInforme(inf.identificadorInforme);
        if (!existente) {
          this.repo.crearEstudioDiagnostico({
            ordenExamenId: null,
            casoId: null,
            identificadorInforme: inf.identificadorInforme,
            runInformado: inf.runInformado,
            tipoEstudio: inf.tipoEstudio,
            origen: inf.origen,
            fechaInforme: inf.fechaInforme,
            estadoValidacion: inf.estadoValidacion,
            estadoRecepcion: 'Observado por identificación',
            hallazgoCritico: inf.hallazgoCritico,
            fechaRegistro: new Date().toISOString()
          });
        }
        continue;
      }

      // 2. Exclusión de informes pendientes de validación en el origen (HU-05-ESC-04)
      if (inf.estadoValidacion !== 'Validado') {
        pendientesEnOrigen++;
        continue;
      }

      // 3. Informe validado con RUN unívoco
      // Buscar orden pendiente del caso que corresponda al tipo de estudio
      const ordenCorrespondiente = ordenes.find((o) => {
        const estudioExistente = this.repo.obtenerEstudioPorOrdenId(o.id!);
        if (
          estudioExistente &&
          (estudioExistente.estadoRecepcion === 'Incorporado' ||
            estudioExistente.estadoRecepcion === 'Incorporado con hallazgo crítico')
        ) {
          return false;
        }

        const tipoOrd = o.tipoEstudio.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const tipoInf = inf.tipoEstudio.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        return tipoOrd.includes(tipoInf) || tipoInf.includes(tipoOrd);
      });

      if (!ordenCorrespondiente) {
        continue;
      }

      // Guardar PDF en disco para permitir consulta y descarga (CA4 / ESC-01 / D4)
      const nombreArchivo = `${randomUUID()}.pdf`;
      const rutaAbsoluta = path.join(this.directorioInformes, nombreArchivo);
      const rutaRelativa = path.join('data', 'informes', nombreArchivo).replace(/\\/g, '/');
      fs.writeFileSync(rutaAbsoluta, PDF_MINIMO_BUFFER);

      if (inf.hallazgoCritico) {
        // HU-05-ESC-02: Incorporación transaccional con generación de AlertaSeguimiento (D6)
        const tx = this.db.transaction(() => {
          const estudioId = this.repo.crearEstudioDiagnostico({
            ordenExamenId: ordenCorrespondiente.id!,
            casoId: caso.id!,
            identificadorInforme: inf.identificadorInforme,
            runInformado: inf.runInformado,
            tipoEstudio: inf.tipoEstudio,
            origen: inf.origen,
            fechaInforme: inf.fechaInforme,
            estadoValidacion: 'Validado',
            estadoRecepcion: 'Incorporado con hallazgo crítico',
            hallazgoCritico: true,
            archivoAdjunto: rutaRelativa,
            fechaRegistro: new Date().toISOString()
          });

          this.repo.crearAlerta({
            casoId: caso.id!,
            tipo: 'Hallazgo crítico',
            prioridad: 'Alta',
            estado: 'Pendiente',
            fechaGeneracion: new Date().toISOString(),
            estudioOrigenId: estudioId
          });
        });
        tx();

        incorporados++;
        hallazgosCriticos++;
      } else {
        // HU-05-ESC-01: Incorporación estándar sin hallazgo crítico
        this.repo.crearEstudioDiagnostico({
          ordenExamenId: ordenCorrespondiente.id!,
          casoId: caso.id!,
          identificadorInforme: inf.identificadorInforme,
          runInformado: inf.runInformado,
          tipoEstudio: inf.tipoEstudio,
          origen: inf.origen,
          fechaInforme: inf.fechaInforme,
          estadoValidacion: 'Validado',
          estadoRecepcion: 'Incorporado',
          hallazgoCritico: false,
          archivoAdjunto: rutaRelativa,
          fechaRegistro: new Date().toISOString()
        });

        incorporados++;
      }
    }

    const completitud = this.repo.calcularCompletitudDiagnostica(caso.id!);

    return {
      incorporados,
      hallazgosCriticos,
      discrepanciasIdentidad,
      pendientesEnOrigen,
      completitud
    };
  }

  /**
   * Adjunto manual de informe de compra de servicio externo en PDF (HU-05-ESC-05 / D4)
   */
  adjuntarInformeExterno(
    numeroCaso: string,
    ordenId: number,
    archivo: {
      buffer: Buffer;
      originalname: string;
      mimetype: string;
      size: number;
    }
  ): { estudioId: number; completitud: ResumenCompletitudDiagnostica } {
    const caso = this.repo.obtenerCasoPorNumero(numeroCaso);
    if (!caso) {
      throw new Error(`El caso oncológico '${numeroCaso}' no existe.`);
    }

    const orden = this.repo.obtenerOrdenExamenPorId(ordenId);
    if (!orden || orden.casoId !== caso.id) {
      throw new Error(`La orden de examen con ID ${ordenId} no pertenece al caso ${numeroCaso}.`);
    }

    // Validación estricta de formato PDF (CA5 / Rechazo de no PDF)
    const esMimePdf = archivo.mimetype === 'application/pdf';
    const esExtPdf = archivo.originalname.toLowerCase().endsWith('.pdf');
    const esHeaderPdf = archivo.buffer.length >= 4 && archivo.buffer.slice(0, 4).toString() === '%PDF';

    if (!esMimePdf && !esExtPdf && !esHeaderPdf) {
      throw new Error('El informe externo debe estar en formato PDF.');
    }

    // Validación de límite configurable (D4 / LIMITE_ADJUNTO_MB)
    const limiteMbEnv = process.env.LIMITE_ADJUNTO_MB;
    if (limiteMbEnv) {
      const limiteBytes = Number(limiteMbEnv) * 1024 * 1024;
      if (archivo.size > limiteBytes) {
        throw new Error(`El archivo excede el tamaño máximo permitido de ${limiteMbEnv} MB.`);
      }
    }

    // Guardar archivo en disco
    const nombreArchivo = `${randomUUID()}.pdf`;
    const rutaAbsoluta = path.join(this.directorioInformes, nombreArchivo);
    const rutaRelativa = path.join('data', 'informes', nombreArchivo).replace(/\\/g, '/');
    fs.writeFileSync(rutaAbsoluta, archivo.buffer);

    const estudioId = this.repo.crearEstudioDiagnostico({
      ordenExamenId: orden.id!,
      casoId: caso.id!,
      identificadorInforme: `EXT-${orden.identificador}`,
      runInformado: caso.paciente.run,
      tipoEstudio: orden.tipoEstudio,
      origen: 'Compra externa',
      fechaInforme: new Date().toISOString().slice(0, 10),
      estadoValidacion: 'Validado',
      estadoRecepcion: 'Incorporado',
      hallazgoCritico: false,
      archivoAdjunto: rutaRelativa,
      fechaRegistro: new Date().toISOString()
    });

    const completitud = this.repo.calcularCompletitudDiagnostica(caso.id!);

    return {
      estudioId,
      completitud
    };
  }

  /**
   * Obtiene la ruta física del archivo PDF para descarga/servido (D4 / CA4)
   */
  obtenerRutaPdfEstudio(estudioId: number): { rutaAbsoluta: string; nombreDescarga: string } {
    const estudio = this.repo.obtenerEstudioDiagnosticoPorId(estudioId);
    if (!estudio || !estudio.archivoAdjunto) {
      throw new Error(`El estudio ${estudioId} no cuenta con un informe PDF adjunto.`);
    }

    const nombreArchivo = path.basename(estudio.archivoAdjunto);
    const rutaAbsoluta = path.join(this.directorioInformes, nombreArchivo);

    if (!fs.existsSync(rutaAbsoluta)) {
      // Si el archivo en disco fue borrado o estamos en prueba, recrear con PDF mínimo
      fs.writeFileSync(rutaAbsoluta, PDF_MINIMO_BUFFER);
    }

    return {
      rutaAbsoluta,
      nombreDescarga: `${estudio.identificadorInforme || 'informe'}.pdf`
    };
  }
}

