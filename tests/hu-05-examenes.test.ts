// tests/hu-05-examenes.test.ts - Pruebas automáticas completas para HU-05 (Consolidación de exámenes y alerta de hallazgo crítico)
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { crearApp } from '../src/app.js';
import { aplicarMigraciones } from '../src/db/conexion.js';
import { RepositorioOncologico } from '../src/dominio/repositorios.js';
import {
  ESTADOS_RECEPCION,
  ORIGENES_INFORME,
  evaluarTransicionEstudio
} from '../src/dominio/examenes.js';
import { ServicioExamenes, PDF_MINIMO_BUFFER } from '../src/servicios/examenes.js';
import { ServicioAlertas } from '../src/servicios/alertas.js';
import { ServicioSeguimiento } from '../src/servicios/seguimiento.js';
import { ClienteLISSimulado } from '../src/integraciones/lis.js';
import { ClientePACSSimulado } from '../src/integraciones/pacs.js';

describe('HU-05 — Consolidación e indexación automática de exámenes y alertas críticas', () => {
  let db: ReturnType<typeof Database>;
  let repo: RepositorioOncologico;
  let tempDir: string;
  let lisSimulado: ClienteLISSimulado;
  let pacsSimulado: ClientePACSSimulado;
  let servicioExamenes: ServicioExamenes;
  let servicioAlertas: ServicioAlertas;
  let servicioSeguimiento: ServicioSeguimiento;
  let app: ReturnType<typeof crearApp>;

  let pacienteId: number;
  let casoId: number;
  const NUMERO_CASO = 'CASO-TEST-HU05';
  const RUN_PACIENTE = '12.345.678-5';

  beforeEach(() => {
    db = new Database(':memory:');
    aplicarMigraciones(db);
    repo = new RepositorioOncologico(db);

    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'oncotrace-hu05-test-'));
    lisSimulado = new ClienteLISSimulado();
    pacsSimulado = new ClientePACSSimulado();
    servicioExamenes = new ServicioExamenes(db, lisSimulado, pacsSimulado, tempDir);
    servicioAlertas = new ServicioAlertas(db);
    servicioSeguimiento = new ServicioSeguimiento(db);
    app = crearApp(db, servicioExamenes);

    pacienteId = repo.crearPaciente({
      run: RUN_PACIENTE,
      nombreCompleto: 'Marta Elena Fernández Rojas'
    });

    casoId = repo.crearCaso({
      numeroCaso: NUMERO_CASO,
      pacienteId,
      especialidad: 'Tórax',
      codigoDiagnosticoOSospecha: 'C34.9 — Sospecha Cáncer Pulmonar',
      etapaActual: 'Sospecha',
      fechaIngreso: '2026-06-01'
    });
  });

  afterEach(() => {
    db.close();
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  describe('1. Esquema, Tipos y Repositorio (Grupo 1)', () => {
    it('1.1 Debe definir los estados de recepción y orígenes del modelo', () => {
      expect(ESTADOS_RECEPCION).toHaveLength(5);
      expect(ESTADOS_RECEPCION).toContain('Solicitado');
      expect(ESTADOS_RECEPCION).toContain('Pendiente de validación');
      expect(ESTADOS_RECEPCION).toContain('Observado por identificación');
      expect(ESTADOS_RECEPCION).toContain('Incorporado');
      expect(ESTADOS_RECEPCION).toContain('Incorporado con hallazgo crítico');

      expect(ORIGENES_INFORME).toHaveLength(3);
      expect(ORIGENES_INFORME).toContain('LIS');
      expect(ORIGENES_INFORME).toContain('PACS');
      expect(ORIGENES_INFORME).toContain('Compra externa');
    });

    it('1.2 (Completitud 50 %) Debe calcular 50 % cuando un caso tiene dos órdenes y un informe incorporado', () => {
      // Crear 2 órdenes para el caso
      const orden1Id = repo.crearOrdenExamen({
        casoId,
        identificador: 'ORD-TEST-001',
        tipoEstudio: 'Biopsia core pulmonar',
        fechaSolicitud: '2026-06-02'
      });
      const orden2Id = repo.crearOrdenExamen({
        casoId,
        identificador: 'ORD-TEST-002',
        tipoEstudio: 'TC Tórax con contraste',
        fechaSolicitud: '2026-06-02'
      });

      // Inicialmente completitud es 0 %
      let comp = repo.calcularCompletitudDiagnostica(casoId);
      expect(comp.totalSolicitados).toBe(2);
      expect(comp.totalIncorporados).toBe(0);
      expect(comp.porcentajeCompletitud).toBe(0);
      expect(comp.examenesPendientes).toBe(2);

      // Incorporar informe para la orden 1
      repo.crearEstudioDiagnostico({
        ordenExamenId: orden1Id,
        casoId,
        identificadorInforme: 'BIO-2026-001',
        runInformado: RUN_PACIENTE,
        tipoEstudio: 'Biopsia core pulmonar',
        origen: 'LIS',
        fechaInforme: '2026-06-05',
        estadoValidacion: 'Validado',
        estadoRecepcion: 'Incorporado',
        hallazgoCritico: false,
        fechaRegistro: '2026-06-05T10:00:00Z'
      });

      // Ahora la completitud debe ser exactamente 50 %
      comp = repo.calcularCompletitudDiagnostica(casoId);
      expect(comp.totalSolicitados).toBe(2);
      expect(comp.totalIncorporados).toBe(1);
      expect(comp.porcentajeCompletitud).toBe(50);
      expect(comp.examenesPendientes).toBe(1);

      // Verificar que el resumen del tablero también reporte 50 %
      const resumenes = repo.listarCasosResumen();
      const casoResumen = resumenes.find((c) => c.numeroCaso === NUMERO_CASO);
      expect(casoResumen).toBeDefined();
      expect(casoResumen?.completitudDiagnostica).toBe(50);
    });

    it('1.3 (Bandeja de excepciones) Debe listar solo informes en "Observado por identificación" con caso_id y orden nulos', () => {
      // Estudio normal incorporado
      repo.crearEstudioDiagnostico({
        casoId,
        identificadorInforme: 'TC-2026-OK',
        runInformado: RUN_PACIENTE,
        tipoEstudio: 'TC Tórax',
        origen: 'PACS',
        fechaInforme: '2026-06-03',
        estadoValidacion: 'Validado',
        estadoRecepcion: 'Incorporado',
        hallazgoCritico: false,
        fechaRegistro: '2026-06-03T11:00:00Z'
      });

      // Estudio discrepante (excepción)
      const excepcionId = repo.crearEstudioDiagnostico({
        casoId: null,
        ordenExamenId: null,
        identificadorInforme: 'BIO-DISCREP-99',
        runInformado: '99.888.777-K',
        tipoEstudio: 'Biopsia pulmonar',
        origen: 'LIS',
        fechaInforme: '2026-06-04',
        estadoValidacion: 'Validado',
        estadoRecepcion: 'Observado por identificación',
        hallazgoCritico: false,
        fechaRegistro: '2026-06-04T12:00:00Z'
      });

      const bandeja = repo.listarBandejaExcepciones();
      expect(bandeja).toHaveLength(1);
      expect(bandeja[0].id).toBe(excepcionId);
      expect(bandeja[0].identificadorInforme).toBe('BIO-DISCREP-99');
      expect(bandeja[0].estadoRecepcion).toBe('Observado por identificación');
      expect(bandeja[0].casoId).toBeNull();
      expect(bandeja[0].ordenExamenId).toBeNull();
    });

    it('1.4 Las alertas previas de HU-04 conservan estudio_origen_id en null', () => {
      const alertaId = repo.crearAlerta({
        casoId,
        tipo: 'Garantía GES por Vencer',
        prioridad: 'Alta',
        estado: 'Pendiente',
        fechaGeneracion: '2026-06-02T08:00:00Z'
      });

      const alerta = repo.obtenerAlertaPorId(alertaId);
      expect(alerta).toBeDefined();
      expect(alerta?.estudioOrigenId).toBeNull();
    });
  });

  describe('2. Transiciones de Estado EST-04 (Grupo 2)', () => {
    it('2.1 Debe permitir las siete transiciones válidas de EST-04', () => {
      // 1. Emisión de orden
      const t1 = evaluarTransicionEstudio(null, 'emision_orden');
      expect(t1.esValido).toBe(true);
      expect(t1.nuevoEstado).toBe('Solicitado');

      // 2. Solicitado -> Pendiente de validación (informe preliminar en origen)
      const t2 = evaluarTransicionEstudio('Solicitado', 'informe_preliminar');
      expect(t2.esValido).toBe(true);
      expect(t2.nuevoEstado).toBe('Pendiente de validación');

      // 3. Solicitado -> Incorporado (compra de servicio externo en PDF)
      const t3 = evaluarTransicionEstudio('Solicitado', 'adjuntar_externo', {
        esCompraExterna: true,
        estaEnLisOPacs: false,
        esPdfValido: true
      });
      expect(t3.esValido).toBe(true);
      expect(t3.nuevoEstado).toBe('Incorporado');

      // 4. Pendiente de validación -> Observado por identificación (discrepancia RUN)
      const t4 = evaluarTransicionEstudio('Pendiente de validación', 'detectar_discrepancia', {
        runValido: false
      });
      expect(t4.esValido).toBe(true);
      expect(t4.nuevoEstado).toBe('Observado por identificación');

      // 5. Observado por identificación -> Incorporado (subsanación y confirmación)
      const t5 = evaluarTransicionEstudio('Observado por identificación', 'subsanar_discrepancia', {
        identificacionRatificada: true
      });
      expect(t5.esValido).toBe(true);
      expect(t5.nuevoEstado).toBe('Incorporado');

      // 6. Pendiente de validación -> Incorporado (validado sin hallazgo crítico)
      const t6 = evaluarTransicionEstudio('Pendiente de validación', 'incorporar_sin_hallazgo', {
        runValido: true,
        hallazgoCritico: false
      });
      expect(t6.esValido).toBe(true);
      expect(t6.nuevoEstado).toBe('Incorporado');

      // 7. Pendiente de validación -> Incorporado con hallazgo crítico (validado con hallazgo crítico)
      const t7 = evaluarTransicionEstudio('Pendiente de validación', 'incorporar_con_hallazgo', {
        runValido: true,
        hallazgoCritico: true
      });
      expect(t7.esValido).toBe(true);
      expect(t7.nuevoEstado).toBe('Incorporado con hallazgo crítico');
    });

    it('2.2 Debe rechazar transiciones inválidas con mensaje explicativo', () => {
      // Intento de adjunto externo sin formato PDF
      const inv1 = evaluarTransicionEstudio('Solicitado', 'adjuntar_externo', {
        esPdfValido: false
      });
      expect(inv1.esValido).toBe(false);
      expect(inv1.error).toContain('PDF');

      // Intento de adjunto externo cuando el examen está disponible en LIS/PACS
      const inv2 = evaluarTransicionEstudio('Solicitado', 'adjuntar_externo', {
        estaEnLisOPacs: true,
        esPdfValido: true
      });
      expect(inv2.esValido).toBe(false);
      expect(inv2.error).toContain('LIS/PACS');

      // Intento de incorporar con hallazgo crítico cuando el informe no contiene hallazgos
      const inv3 = evaluarTransicionEstudio('Pendiente de validación', 'incorporar_con_hallazgo', {
        runValido: true,
        hallazgoCritico: false
      });
      expect(inv3.esValido).toBe(false);
      expect(inv3.error).toContain('no contiene hallazgos críticos');

      // Intento de modificar un estudio en estado terminal Incorporado
      const inv4 = evaluarTransicionEstudio('Incorporado', 'informe_preliminar');
      expect(inv4.esValido).toBe(false);
      expect(inv4.error).toContain('terminal');
    });

    it('2.3 (aplicarTransicionEstudio) Debe validar y persistir transiciones válidas, y rechazar las inválidas sin alterar el estado', () => {
      const servicio = new ServicioExamenes(db);

      const ordenId = repo.crearOrdenExamen({
        casoId,
        identificador: 'ORD-TRANS-01',
        tipoEstudio: 'Biopsia transcurrente',
        fechaSolicitud: '2026-06-01'
      });

      const estudioId = repo.crearEstudioDiagnostico({
        ordenExamenId: ordenId,
        casoId,
        identificadorInforme: 'EST-TRANS-01',
        runInformado: RUN_PACIENTE,
        tipoEstudio: 'Biopsia transcurrente',
        origen: 'LIS',
        fechaInforme: '2026-06-02',
        estadoValidacion: 'Pendiente',
        estadoRecepcion: 'Solicitado',
        hallazgoCritico: false,
        fechaRegistro: '2026-06-02T09:00:00Z'
      });

      // Transición válida: Solicitado -> Pendiente de validación
      const resValida = servicio.aplicarTransicionEstudio(estudioId, 'informe_preliminar');
      expect(resValida.exito).toBe(true);
      expect(resValida.nuevoEstado).toBe('Pendiente de validación');

      let enDb = repo.obtenerEstudioDiagnosticoPorId(estudioId);
      expect(enDb?.estadoRecepcion).toBe('Pendiente de validación');

      // Transición inválida: desde Pendiente de validación ejecutar 'emision_orden'
      const resInvalida = servicio.aplicarTransicionEstudio(estudioId, 'emision_orden');
      expect(resInvalida.exito).toBe(false);
      expect(resInvalida.error).toBeDefined();

      // El estado en base debe permanecer intacto en 'Pendiente de validación'
      enDb = repo.obtenerEstudioDiagnosticoPorId(estudioId);
      expect(enDb?.estadoRecepcion).toBe('Pendiente de validación');
    });
  });

  describe('3. Integraciones LIS y PACS Simuladas (Grupo 3)', () => {
    it('3.1 Debe soportar los 4 tipos de informes simulados (validado, crítico, pendiente y discrepante)', () => {
      const lis = new ClienteLISSimulado([
        {
          identificadorInforme: 'LIS-001-OK',
          runInformado: RUN_PACIENTE,
          tipoEstudio: 'Biopsia gástrica',
          origen: 'LIS',
          fechaInforme: '2026-06-05',
          estadoValidacion: 'Validado',
          hallazgoCritico: false
        },
        {
          identificadorInforme: 'LIS-002-CRIT',
          runInformado: RUN_PACIENTE,
          tipoEstudio: 'Biopsia bronquial',
          origen: 'LIS',
          fechaInforme: '2026-06-06',
          estadoValidacion: 'Validado',
          hallazgoCritico: true
        },
        {
          identificadorInforme: 'LIS-003-PEND',
          runInformado: RUN_PACIENTE,
          tipoEstudio: 'Citología pleural',
          origen: 'LIS',
          fechaInforme: '2026-06-07',
          estadoValidacion: 'Pendiente',
          hallazgoCritico: false
        },
        {
          identificadorInforme: 'LIS-004-DISC',
          runInformado: 'RUN-DISCREPANTE',
          tipoEstudio: 'Biopsia hepática',
          origen: 'LIS',
          fechaInforme: '2026-06-08',
          estadoValidacion: 'Validado',
          hallazgoCritico: false
        }
      ]);

      const pacs = new ClientePACSSimulado([
        {
          identificadorInforme: 'PACS-001-OK',
          runInformado: RUN_PACIENTE,
          tipoEstudio: 'TC de Abdomen y Pelvis',
          origen: 'PACS',
          fechaInforme: '2026-06-05',
          estadoValidacion: 'Validado',
          hallazgoCritico: false
        }
      ]);

      const resLIS = lis.consultarInformes(RUN_PACIENTE);
      expect(resLIS).toHaveLength(4);

      const resPACS = pacs.consultarInformes(RUN_PACIENTE);
      expect(resPACS).toHaveLength(1);
    });

    it('3.2 Debe registrar cada consulta a LIS y PACS con el mensaje normado del DSS-01', () => {
      const lis = new ClienteLISSimulado();
      const pacs = new ClientePACSSimulado();

      lis.consultarInformes(RUN_PACIENTE);
      pacs.consultarInformes(RUN_PACIENTE);

      expect(lis.ultimasConsultas).toHaveLength(1);
      expect(lis.ultimasConsultas[0].mensaje).toContain('DSS-01 Paso 2');
      expect(lis.ultimasConsultas[0].run).toBe(RUN_PACIENTE);

      expect(pacs.ultimasConsultas).toHaveLength(1);
      expect(pacs.ultimasConsultas[0].mensaje).toContain('DSS-01 Paso 3');
      expect(pacs.ultimasConsultas[0].run).toBe(RUN_PACIENTE);
    });
  });

  describe('4. Incorporación de informes y completitud (Grupo 4)', () => {
    it('4.1 (ESC-01) Debe sincronizar e incorporar informe validado desde LIS/PACS por RUN, dejando copia PDF disponible y segundo examen pendiente', () => {
      const orden1Id = repo.crearOrdenExamen({
        casoId,
        identificador: 'ORD-BIO-001',
        tipoEstudio: 'Biopsia core pulmonar',
        fechaSolicitud: '2026-06-02'
      });
      const orden2Id = repo.crearOrdenExamen({
        casoId,
        identificador: 'ORD-TC-002',
        tipoEstudio: 'TC Tórax con contraste',
        fechaSolicitud: '2026-06-02'
      });

      lisSimulado.agregarInforme({
        identificadorInforme: 'LIS-BIO-2026',
        runInformado: RUN_PACIENTE,
        tipoEstudio: 'Biopsia core pulmonar',
        origen: 'LIS',
        fechaInforme: '2026-06-05',
        estadoValidacion: 'Validado',
        hallazgoCritico: false
      });

      const res = servicioExamenes.consultarEIncorporarExamenes(NUMERO_CASO);
      expect(res.incorporados).toBe(1);
      expect(res.hallazgosCriticos).toBe(0);
      expect(res.discrepanciasIdentidad).toBe(0);
      expect(res.pendientesEnOrigen).toBe(0);
      expect(res.completitud.porcentajeCompletitud).toBe(50);
      expect(res.completitud.totalIncorporados).toBe(1);
      expect(res.completitud.examenesPendientes).toBe(1);

      const estudios = repo.listarEstudiosPorCasoId(casoId);
      expect(estudios).toHaveLength(1);
      expect(estudios[0].identificadorInforme).toBe('LIS-BIO-2026');
      expect(estudios[0].estadoRecepcion).toBe('Incorporado');
      expect(estudios[0].archivoAdjunto).toBeDefined();

      const pdfInfo = servicioExamenes.obtenerRutaPdfEstudio(estudios[0].id!);
      expect(fs.existsSync(pdfInfo.rutaAbsoluta)).toBe(true);
      expect(pdfInfo.nombreDescarga).toBe('LIS-BIO-2026.pdf');

      // Segunda orden sigue pendiente
      const ordenesConDetalle = repo.listarExamenesDetalladosPorCasoId(casoId);
      const examen2 = ordenesConDetalle.find((e) => e.ordenId === orden2Id);
      expect(examen2?.estadoRecepcion).toBe('Solicitado');
    });

    it('4.2 (CA3) Indicador derivado de completitud diagnóstica en ficha del caso y tarjeta del tablero al 50 % sin persistencia en base', () => {
      const orden1Id = repo.crearOrdenExamen({
        casoId,
        identificador: 'ORD-CA3-001',
        tipoEstudio: 'Biopsia pleural',
        fechaSolicitud: '2026-06-02'
      });
      repo.crearOrdenExamen({
        casoId,
        identificador: 'ORD-CA3-002',
        tipoEstudio: 'Resonancia Magnética',
        fechaSolicitud: '2026-06-02'
      });

      repo.crearEstudioDiagnostico({
        ordenExamenId: orden1Id,
        casoId,
        identificadorInforme: 'BIO-CA3-OK',
        runInformado: RUN_PACIENTE,
        tipoEstudio: 'Biopsia pleural',
        origen: 'LIS',
        fechaInforme: '2026-06-05',
        estadoValidacion: 'Validado',
        estadoRecepcion: 'Incorporado',
        hallazgoCritico: false,
        fechaRegistro: '2026-06-05T10:00:00Z'
      });

      const ficha = servicioSeguimiento.obtenerFichaCaso(NUMERO_CASO);
      expect(ficha).toBeDefined();
      expect(ficha?.completitudDiagnostica).toBeDefined();
      expect(ficha?.completitudDiagnostica?.porcentajeCompletitud).toBe(50);
      expect(ficha?.completitudDiagnostica?.totalSolicitados).toBe(2);
      expect(ficha?.completitudDiagnostica?.totalIncorporados).toBe(1);
      expect(ficha?.completitudDiagnostica?.examenesPendientes).toBe(1);

      const tablero = repo.listarCasosResumen();
      const casoTablero = tablero.find((c) => c.numeroCaso === NUMERO_CASO);
      expect(casoTablero?.completitudDiagnostica).toBe(50);

      // Verificar que NO existe columna 'completitud' en caso_oncologico (es derivado)
      const columnas = db.prepare("PRAGMA table_info(caso_oncologico)").all() as { name: string }[];
      const tieneColumnaCompletitud = columnas.some((col) => col.name === 'completitud' || col.name === 'completitud_diagnostica');
      expect(tieneColumnaCompletitud).toBe(false);
    });

    it('4.3 (ESC-03) Discrepancia en la identificación del paciente debe derivar a bandeja de excepciones y mantener examen pendiente', () => {
      const ordenDiscrepId = repo.crearOrdenExamen({
        casoId,
        identificador: 'ORD-DISC-003',
        tipoEstudio: 'Biopsia hepática',
        fechaSolicitud: '2026-06-03'
      });

      lisSimulado.agregarInforme({
        identificadorInforme: 'LIS-DISCREP-99',
        runInformado: 'RUN-DISCREPANTE',
        tipoEstudio: 'Biopsia hepática',
        origen: 'LIS',
        fechaInforme: '2026-06-06',
        estadoValidacion: 'Validado',
        hallazgoCritico: false
      });

      const res = servicioExamenes.consultarEIncorporarExamenes(NUMERO_CASO);
      expect(res.discrepanciasIdentidad).toBe(1);

      const excepciones = repo.listarBandejaExcepciones();
      const excepcion = excepciones.find((e) => e.identificadorInforme === 'LIS-DISCREP-99');
      expect(excepcion).toBeDefined();
      expect(excepcion?.estadoRecepcion).toBe('Observado por identificación');
      expect(excepcion?.casoId).toBeNull();
      expect(excepcion?.ordenExamenId).toBeNull();

      // La orden sigue sin estudio incorporado
      const orden = repo.obtenerEstudioPorOrdenId(ordenDiscrepId);
      expect(orden).toBeNull();
    });

    it('4.4 (ESC-04) Debe excluir informes con validación preliminar o pendiente en el origen', () => {
      const ordenPendId = repo.crearOrdenExamen({
        casoId,
        identificador: 'ORD-PEND-004',
        tipoEstudio: 'Citología pleural',
        fechaSolicitud: '2026-06-04'
      });

      lisSimulado.agregarInforme({
        identificadorInforme: 'LIS-PRELIM-01',
        runInformado: RUN_PACIENTE,
        tipoEstudio: 'Citología pleural',
        origen: 'LIS',
        fechaInforme: '2026-06-07',
        estadoValidacion: 'Pendiente',
        hallazgoCritico: false
      });

      const res = servicioExamenes.consultarEIncorporarExamenes(NUMERO_CASO);
      expect(res.pendientesEnOrigen).toBe(1);

      const estudio = repo.obtenerEstudioPorOrdenId(ordenPendId);
      expect(estudio).toBeNull();
    });

    it('4.5 Pruebas HTTP con Supertest: POST /casos/:numeroCaso/examenes/consultar y GET /casos/:numeroCaso/examenes/:id/informe.pdf', async () => {
      repo.crearOrdenExamen({
        casoId,
        identificador: 'ORD-HTTP-001',
        tipoEstudio: 'Biopsia pulmonar',
        fechaSolicitud: '2026-06-01'
      });

      lisSimulado.agregarInforme({
        identificadorInforme: 'LIS-HTTP-001',
        runInformado: RUN_PACIENTE,
        tipoEstudio: 'Biopsia pulmonar',
        origen: 'LIS',
        fechaInforme: '2026-06-02',
        estadoValidacion: 'Validado',
        hallazgoCritico: false
      });

      // POST consulta
      const resPost = await request(app)
        .post(`/casos/${NUMERO_CASO}/examenes/consultar`)
        .set('Cookie', ['rol=Gestor/a UGCO'])
        .set('Accept', 'application/json');

      expect(resPost.status).toBe(200);
      expect(resPost.body.ok).toBe(true);
      expect(resPost.body.resultado.incorporados).toBe(1);

      // Obtener el estudio incorporado para descargar su PDF
      const estudios = repo.listarEstudiosPorCasoId(casoId);
      expect(estudios.length).toBeGreaterThan(0);
      const estudioId = estudios[0].id!;

      const resGetPdf = await request(app)
        .get(`/casos/${NUMERO_CASO}/examenes/${estudioId}/informe.pdf`)
        .set('Cookie', ['rol=Gestor/a UGCO']);

      expect(resGetPdf.status).toBe(200);
      expect(resGetPdf.headers['content-type']).toBe('application/pdf');
      expect(resGetPdf.headers['content-disposition']).toContain('inline');
      expect(resGetPdf.body.slice(0, 4).toString()).toBe('%PDF');
    });

    it('4.6 Verificación de HTML de caso.ejs con subpanel de exámenes, barra de progreso y enlaces de descarga', async () => {
      const orden1Id = repo.crearOrdenExamen({
        casoId,
        identificador: 'ORD-HTML-001',
        tipoEstudio: 'Biopsia gástrica',
        fechaSolicitud: '2026-06-01'
      });
      repo.crearOrdenExamen({
        casoId,
        identificador: 'ORD-HTML-002',
        tipoEstudio: 'Endoscopia Digestiva Alta',
        fechaSolicitud: '2026-06-01'
      });

      repo.crearEstudioDiagnostico({
        ordenExamenId: orden1Id,
        casoId,
        identificadorInforme: 'BIO-HTML-001',
        runInformado: RUN_PACIENTE,
        tipoEstudio: 'Biopsia gástrica',
        origen: 'LIS',
        fechaInforme: '2026-06-02',
        estadoValidacion: 'Validado',
        estadoRecepcion: 'Incorporado',
        hallazgoCritico: false,
        archivoAdjunto: 'data/informes/test-html.pdf',
        fechaRegistro: '2026-06-02T10:00:00Z'
      });

      const resHtml = await request(app)
        .get(`/casos/${NUMERO_CASO}`)
        .set('Cookie', ['rol=Gestor/a UGCO']);

      expect(resHtml.status).toBe(200);
      expect(resHtml.text).toContain('Exámenes Diagnósticos');
      expect(resHtml.text).toContain('Completitud');
      expect(resHtml.text).toContain('Sincronizar exámenes LIS/PACS');
      expect(resHtml.text).toContain('informe.pdf');
    });
  });

  describe('5. Compra de servicio externo en PDF (Grupo 5)', () => {
    it('5.1 (ESC-05) Gestora UGCO adjunta informe de compra externa en PDF: registra origen Compra externa, actualiza completitud y sirve copia PDF', async () => {
      const ordenExtId = repo.crearOrdenExamen({
        casoId,
        identificador: 'ORD-EXT-PET',
        tipoEstudio: 'PET-CT Oncológico',
        fechaSolicitud: '2026-06-05'
      });

      const resAdjunto = await request(app)
        .post(`/casos/${NUMERO_CASO}/examenes/${ordenExtId}/adjunto`)
        .set('Cookie', ['rol=Gestor/a UGCO'])
        .set('Accept', 'application/json')
        .attach('archivo', PDF_MINIMO_BUFFER, 'informe-petct.pdf');

      expect(resAdjunto.status).toBe(200);
      expect(resAdjunto.body.ok).toBe(true);

      const estudioExt = repo.obtenerEstudioPorOrdenId(ordenExtId);
      expect(estudioExt).toBeDefined();
      expect(estudioExt?.origen).toBe('Compra externa');
      expect(estudioExt?.estadoRecepcion).toBe('Incorporado');
      expect(estudioExt?.archivoAdjunto).toBeDefined();

      // Descarga de PDF
      const resPdf = await request(app)
        .get(`/casos/${NUMERO_CASO}/examenes/${estudioExt!.id}/informe.pdf`)
        .set('Cookie', ['rol=Gestor/a UGCO']);
      expect(resPdf.status).toBe(200);
      expect(resPdf.headers['content-type']).toBe('application/pdf');
    });

    it('5.2 Rechazo estricto de archivos que no sean PDF y control de acceso por rol (Médico tratante denegado con 403)', async () => {
      const ordenInvalidaId = repo.crearOrdenExamen({
        casoId,
        identificador: 'ORD-EXT-INV',
        tipoEstudio: 'EBUS mediastínico',
        fechaSolicitud: '2026-06-06'
      });

      // Rechazo de no PDF
      const resNoPdf = await request(app)
        .post(`/casos/${NUMERO_CASO}/examenes/${ordenInvalidaId}/adjunto`)
        .set('Cookie', ['rol=Gestor/a UGCO'])
        .set('Accept', 'application/json')
        .attach('archivo', Buffer.from('Contenido de prueba no PDF'), 'informe.docx');

      expect(resNoPdf.status).toBe(400);
      expect(resNoPdf.body.ok).toBe(false);
      expect(resNoPdf.body.error).toContain('PDF');

      // No se creó ningún estudio
      expect(repo.obtenerEstudioPorOrdenId(ordenInvalidaId)).toBeNull();

      // Denegación a Médico tratante con 403
      const resMedico = await request(app)
        .post(`/casos/${NUMERO_CASO}/examenes/${ordenInvalidaId}/adjunto`)
        .set('Cookie', ['rol=Médico tratante'])
        .attach('archivo', PDF_MINIMO_BUFFER, 'informe.pdf');

      expect(resMedico.status).toBe(403);
      expect(resMedico.text).toContain('Operación no autorizada');
    });

    it('5.3 Verificación de formulario con enctype="multipart/form-data" y vista de bandeja de excepciones en GET /excepciones', async () => {
      // Orden en estado Solicitado para que se renderice el modal de adjunto
      repo.crearOrdenExamen({
        casoId,
        identificador: 'ORD-MODAL-53',
        tipoEstudio: 'PET-CT Cervical',
        fechaSolicitud: '2026-06-01'
      });

      // Crear estudio discrepante para bandeja de excepciones
      repo.crearEstudioDiagnostico({
        casoId: null,
        ordenExamenId: null,
        identificadorInforme: 'EXC-DISC-TEST',
        runInformado: '99.111.222-3',
        tipoEstudio: 'Biopsia percutánea',
        origen: 'LIS',
        fechaInforme: '2026-06-05',
        estadoValidacion: 'Validado',
        estadoRecepcion: 'Observado por identificación',
        hallazgoCritico: false,
        fechaRegistro: '2026-06-05T10:00:00Z'
      });

      const resFicha = await request(app)
        .get(`/casos/${NUMERO_CASO}`)
        .set('Cookie', ['rol=Gestor/a UGCO']);

      expect(resFicha.status).toBe(200);
      expect(resFicha.text).toContain('enctype="multipart/form-data"');
      expect(resFicha.text).toContain('Adjuntar informe externo (PDF)');

      const resExcepciones = await request(app)
        .get('/excepciones')
        .set('Cookie', ['rol=Gestor/a UGCO']);

      expect(resExcepciones.status).toBe(200);
      expect(resExcepciones.text).toContain('Bandeja de Excepciones');
      expect(resExcepciones.text).toContain('EXC-DISC-TEST');
      expect(resExcepciones.text).toContain('Observado por identificación');
    });
  });

  describe('6. Alerta de hallazgo crítico (Grupo 6)', () => {
    it('6.1 (ESC-02) Recepción de informe con hallazgo crítico genera alerta prioritaria vinculada al estudio y al caso en la misma transacción', () => {
      const ordenCritId = repo.crearOrdenExamen({
        casoId,
        identificador: 'ORD-CRIT-001',
        tipoEstudio: 'Biopsia bronquial con inmunohistoquímica',
        fechaSolicitud: '2026-06-07'
      });

      lisSimulado.agregarInforme({
        identificadorInforme: 'LIS-BIO-MALIGNA',
        runInformado: RUN_PACIENTE,
        tipoEstudio: 'Biopsia bronquial con inmunohistoquímica',
        origen: 'LIS',
        fechaInforme: '2026-06-08',
        estadoValidacion: 'Validado',
        hallazgoCritico: true
      });

      const res = servicioExamenes.consultarEIncorporarExamenes(NUMERO_CASO);
      expect(res.hallazgosCriticos).toBe(1);

      const estudio = repo.obtenerEstudioPorOrdenId(ordenCritId);
      expect(estudio).toBeDefined();
      expect(estudio?.estadoRecepcion).toBe('Incorporado con hallazgo crítico');
      expect(estudio?.hallazgoCritico).toBe(true);

      // Alerta generada
      const alertas = repo.listarAlertasPorCasoId(casoId);
      const alertaCritica = alertas.find((a) => a.tipo === 'Hallazgo crítico');
      expect(alertaCritica).toBeDefined();
      expect(alertaCritica?.prioridad).toBe('Alta');
      expect(alertaCritica?.estado).toBe('Pendiente');
      expect(alertaCritica?.estudioOrigenId).toBe(estudio?.id);
    });

    it('6.2 Rollback transaccional: si la inserción de la alerta falla, la incorporación del estudio se revierte y no queda huérfano', () => {
      const ordenRollbackId = repo.crearOrdenExamen({
        casoId,
        identificador: 'ORD-CRIT-FAIL',
        tipoEstudio: 'Biopsia pleuroscópica',
        fechaSolicitud: '2026-06-08'
      });

      lisSimulado.agregarInforme({
        identificadorInforme: 'LIS-BIO-FAIL',
        runInformado: RUN_PACIENTE,
        tipoEstudio: 'Biopsia pleuroscópica',
        origen: 'LIS',
        fechaInforme: '2026-06-09',
        estadoValidacion: 'Validado',
        hallazgoCritico: true
      });

      // Crear trigger temporal en base de datos para abortar inserción en alerta_seguimiento
      db.prepare(`
        CREATE TRIGGER trigger_falla_alerta_test
        BEFORE INSERT ON alerta_seguimiento
        BEGIN
          SELECT RAISE(FAIL, 'Fallo transaccional simulado en creación de alerta');
        END;
      `).run();

      expect(() => {
        servicioExamenes.consultarEIncorporarExamenes(NUMERO_CASO);
      }).toThrow('Fallo transaccional simulado');

      // Eliminar trigger
      db.prepare('DROP TRIGGER trigger_falla_alerta_test').run();

      // El estudio NO debe haberse persistido (rollback completo)
      const estudioEnDb = repo.obtenerEstudioPorIdentificadorInforme('LIS-BIO-FAIL');
      expect(estudioEnDb).toBeNull();

      const ordenEnDb = repo.obtenerEstudioPorOrdenId(ordenRollbackId);
      expect(ordenEnDb).toBeNull();
    });
  });

  describe('7. Ciclo de vida de la alerta y aviso emergente (Grupo 7)', () => {
    let alertaCriticaId: number;

    beforeEach(() => {
      // Asegurar que existe una alerta crítica en estado Pendiente
      const ordenId = repo.crearOrdenExamen({
        casoId,
        identificador: 'ORD-CICLO-ALR',
        tipoEstudio: 'Biopsia mediastino',
        fechaSolicitud: '2026-06-09'
      });

      const estudioId = repo.crearEstudioDiagnostico({
        ordenExamenId: ordenId,
        casoId,
        identificadorInforme: 'LIS-CICLO-001',
        runInformado: RUN_PACIENTE,
        tipoEstudio: 'Biopsia mediastino',
        origen: 'LIS',
        fechaInforme: '2026-06-09',
        estadoValidacion: 'Validado',
        estadoRecepcion: 'Incorporado con hallazgo crítico',
        hallazgoCritico: true,
        fechaRegistro: new Date().toISOString()
      });

      alertaCriticaId = repo.crearAlerta({
        casoId,
        identificador: 'ALR-CRIT-001',
        tipo: 'Hallazgo crítico',
        prioridad: 'Alta',
        estado: 'Pendiente',
        fechaGeneracion: new Date().toISOString(),
        estudioOrigenId: estudioId
      });
    });

    it('7.1 Notificación al médico tratante (POST /alertas/:id/notificacion-medico) cambia alerta a "En gestión" y registra en bitácora', async () => {
      const resNotif = await request(app)
        .post(`/alertas/${alertaCriticaId}/notificacion-medico`)
        .set('Cookie', ['rol=Gestor/a UGCO']);

      expect(resNotif.status).toBe(302);

      const alerta = repo.obtenerAlertaPorId(alertaCriticaId);
      expect(alerta?.estado).toBe('En gestión');

      const bitacora = repo.listarEntradasPorCasoId(casoId);
      const entradaNotif = bitacora.find((b) => b.motivoContacto === 'Notificación de hallazgo crítico');
      expect(entradaNotif).toBeDefined();
      expect(entradaNotif?.interlocutor).toBe('Médico tratante');
      expect(entradaNotif?.estadoContacto).toBe('Efectivo');
    });

    it('7.2 Resolución de alerta por hito clínico (POST /alertas/:id/cumplimiento) pasa alerta a "Resuelta" y lo refleja en la ficha', async () => {
      const resResuelta = await request(app)
        .post(`/alertas/${alertaCriticaId}/cumplimiento`)
        .set('Cookie', ['rol=Gestor/a UGCO'])
        .send({
          tipoHito: 'Comité Oncológico',
          fechaOcurrencia: '2026-06-10',
          responsable: 'Dra. María Paz Silva',
          rolResponsable: 'Médico tratante'
        });

      expect(resResuelta.status).toBe(302);

      const alerta = repo.obtenerAlertaPorId(alertaCriticaId);
      expect(alerta?.estado).toBe('Resuelta');
      expect(alerta?.fechaCierre).toBeDefined();
      expect(alerta?.hitoCumplimientoId).toBeDefined();

      const ficha = servicioSeguimiento.obtenerFichaCaso(NUMERO_CASO);
      const hitoEnFicha = ficha?.hitos.find((h) => h.tipo === 'Comité Oncológico');
      expect(hitoEnFicha).toBeDefined();
      expect(hitoEnFicha?.fechaOcurrencia).toBe('2026-06-10');
    });

    it('7.3 Cierre por causa documentada (POST /alertas/:id/cierre) pasa alerta a "No aplica" y registra profesional y motivo', async () => {
      const resCierre = await request(app)
        .post(`/alertas/${alertaCriticaId}/cierre`)
        .set('Cookie', ['rol=Gestor/a UGCO'])
        .send({
          motivoCierre: 'Informe histopatológico complementario descarta neoplasia',
          fechaCierre: '2026-06-11',
          responsableCierre: 'Dr. Fernando Bravo'
        });

      expect(resCierre.status).toBe(302);

      const alerta = repo.obtenerAlertaPorId(alertaCriticaId);
      expect(alerta?.estado).toBe('No aplica');
      expect(alerta?.motivoCierre).toBe('Informe histopatológico complementario descarta neoplasia');
      expect(alerta?.responsableCierre).toBe('Dr. Fernando Bravo');
    });

    it('7.4 (D8) Pop-up emergente interno en header visible para médico y gestora con temporizador de 5 minutos y permanencia en tablero y ficha', async () => {
      // Médico tratante ve el pop-up emergente
      const resMedico = await request(app)
        .get(`/casos/${NUMERO_CASO}`)
        .set('Cookie', ['rol=Médico tratante']);

      expect(resMedico.status).toBe(200);
      expect(resMedico.text).toContain('id="popup-hallazgo-critico"');
      expect(resMedico.text).toContain('Aviso de Hallazgo Crítico Activo');
      expect(resMedico.text).toContain('Caso CASO-TEST-HU05');
      expect(resMedico.text).toContain('300000'); // 5 minutos en ms
      expect(resMedico.text).toContain('Entendido');

      // Gestora UGCO también ve el pop-up
      const resGestora = await request(app)
        .get(`/casos/${NUMERO_CASO}`)
        .set('Cookie', ['rol=Gestor/a UGCO']);
      expect(resGestora.status).toBe(200);
      expect(resGestora.text).toContain('id="popup-hallazgo-critico"');

      // Alerta permanece visible en panel general de alertas
      const resAlertas = await request(app)
        .get('/alertas')
        .set('Cookie', ['rol=Gestor/a UGCO']);
      expect(resAlertas.status).toBe(200);
      expect(resAlertas.text).toContain('Hallazgo crítico');
      expect(resAlertas.text).toContain('CASO-TEST-HU05');
    });

    it('7.5 Sin alertas críticas activas no se renderiza el aviso emergente en header', async () => {
      // Resolver la alerta activa
      repo.actualizarEstadoAlerta(alertaCriticaId, 'Resuelta');

      const resSinAlertas = await request(app)
        .get(`/casos/${NUMERO_CASO}`)
        .set('Cookie', ['rol=Médico tratante']);

      expect(resSinAlertas.status).toBe(200);
      expect(resSinAlertas.text).not.toContain('id="popup-hallazgo-critico"');
    });
  });
});
