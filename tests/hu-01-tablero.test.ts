// tests/hu-01-tablero.test.ts - Pruebas automáticas de aceptación para HU-01 (Gherkin + Dominio + HTTP)
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import Database from 'better-sqlite3';
import { crearApp } from '../src/app.js';
import { aplicarMigraciones } from '../src/db/conexion.js';
import { sembrarDatos } from '../src/db/seed.js';
import {
  ETAPAS,
  esEtapaValida,
  evaluarTransicionHito,
  type EtapaTrayectoria
} from '../src/dominio/caso-oncologico.js';
import { RepositorioOncologico } from '../src/dominio/repositorios.js';
import { ServicioSeguimiento } from '../src/servicios/seguimiento.js';

describe('HU-01 — Tablero de trazabilidad y línea de tiempo clínica por etapas', () => {
  let db: ReturnType<typeof Database>;
  let app: ReturnType<typeof crearApp>;

  beforeEach(() => {
    // Abrir base de datos SQLite en memoria aislada para cada test
    db = new Database(':memory:');
    aplicarMigraciones(db);
    app = crearApp(db);
  });

  afterEach(() => {
    db.close();
  });

  describe('1. Dominio y Reglas de Transición EST-03 (Unitario)', () => {
    it('1.1 Debe validar exactamente las 8 etapas de la trayectoria y rechazar valores inválidos', () => {
      expect(ETAPAS).toHaveLength(8);
      expect(esEtapaValida('Sospecha')).toBe(true);
      expect(esEtapaValida('Confirmación diagnóstica')).toBe(true);
      expect(esEtapaValida('Etapificación')).toBe(true);
      expect(esEtapaValida('Tratamiento')).toBe(true);
      expect(esEtapaValida('Rehabilitación')).toBe(true);
      expect(esEtapaValida('Cuidados paliativos y alivio del dolor')).toBe(true);
      expect(esEtapaValida('Seguimiento y sobrevivientes')).toBe(true);
      expect(esEtapaValida('Alta y contrarreferencia')).toBe(true);

      // Etapas que NO deben existir
      expect(esEtapaValida('Comité')).toBe(false);
      expect(esEtapaValida('EtapaInventada')).toBe(false);
    });

    it('1.2 (HU-01-ESC-03) Resolución de comité no cambia la etapa a Tratamiento ni crea etapa Comité', () => {
      const res = evaluarTransicionHito('Etapificación', 'Resolución de comité oncológico', false);
      expect(res.esValido).toBe(true);
      expect(res.nuevaEtapa).toBe('Etapificación');
      expect(res.esResolucionComite).toBe(true);
    });

    it('1.3 (HU-01-ESC-02) Inicio de tratamiento cambia a etapa Tratamiento si existe resolución previa', () => {
      const res = evaluarTransicionHito('Etapificación', 'Inicio efectivo de tratamiento', true);
      expect(res.esValido).toBe(true);
      expect(res.nuevaEtapa).toBe('Tratamiento');
      expect(res.esInicioTratamiento).toBe(true);
    });

    it('1.4 (Error) Rechazo de inicio de tratamiento sin resolución de comité previa', () => {
      const res = evaluarTransicionHito('Etapificación', 'Inicio efectivo de tratamiento', false);
      expect(res.esValido).toBe(false);
      expect(res.nuevaEtapa).toBe('Etapificación');
      expect(res.error).toContain('sin una resolución de comité previa');
    });
  });

  describe('2. Servicio de Seguimiento y Cálculo de Días en Timeline', () => {
    it('2.1 Calcula correctamente el orden cronológico y los días transcurridos entre hitos consecutivos', () => {
      const repo = new RepositorioOncologico(db);
      const servicio = new ServicioSeguimiento(db);

      const pacId = repo.crearPaciente({ run: '11.111.111-1', nombreCompleto: 'Paciente Test' });
      const casoId = repo.crearCaso({
        numeroCaso: 'CASO-TEST-01',
        pacienteId: pacId,
        especialidad: 'Oncología Médica',
        codigoDiagnosticoOSospecha: 'C50.1',
        etapaActual: 'Sospecha',
        fechaIngreso: '2026-10-01'
      });

      repo.crearHito({
        casoId,
        tipo: 'Ingreso inicial',
        fechaOcurrencia: '2026-10-01',
        fechaRegistro: '2026-10-01T09:00:00Z',
        responsable: 'Enf. Gestora',
        rolResponsable: 'Gestor/a UGCO'
      });

      repo.crearHito({
        casoId,
        tipo: 'Biopsia tomada',
        fechaOcurrencia: '2026-10-11', // 10 días después
        fechaRegistro: '2026-10-11T12:00:00Z',
        responsable: 'Dr. Cirujano',
        rolResponsable: 'Médico tratante'
      });

      const ficha = servicio.obtenerFichaCaso('CASO-TEST-01');
      expect(ficha).not.toBeNull();
      expect(ficha!.hitos).toHaveLength(2);
      expect(ficha!.hitos[0].diasDesdeAnterior).toBe(0);
      expect(ficha!.hitos[1].diasDesdeAnterior).toBe(10);
    });
  });

  describe('3. Escenarios Gherkin Completos (HTTP / Integración)', () => {
    beforeEach(() => {
      // Cargar datos de prueba de seed en la base en memoria
      const repo = new RepositorioOncologico(db);

      // Paciente 1: Etapificación con resolución de comité previa
      const p1 = repo.crearPaciente({ run: '15.432.198-7', nombreCompleto: 'María Elena González Silva' });
      const c1 = repo.crearCaso({
        numeroCaso: 'CASO-2026-003',
        pacienteId: p1,
        especialidad: 'Ginecología Oncológica',
        codigoDiagnosticoOSospecha: 'C53.9 — Neoplasia cuello uterino',
        etapaActual: 'Etapificación',
        fechaIngreso: '2026-09-18'
      });
      repo.crearHito({
        casoId: c1,
        tipo: 'Confirmación histológica',
        fechaOcurrencia: '2026-09-18',
        fechaRegistro: '2026-09-18T10:00:00Z',
        responsable: 'Enf. Patricia Soto',
        rolResponsable: 'Gestor/a UGCO'
      });
      repo.crearHito({
        casoId: c1,
        tipo: 'Resolución de comité oncológico',
        fechaOcurrencia: '2026-10-10',
        fechaRegistro: '2026-10-10T12:00:00Z',
        responsable: 'Dr. Marcelo Rivas',
        rolResponsable: 'Médico Comité'
      });
      repo.crearResolucionComite({
        casoId: c1,
        identificador: 'RES-COM-2026-089',
        conductaAcordada: 'Quimiorradioterapia concomitante curativa.',
        fechaResolucion: '2026-10-10',
        fechaFirma: '2026-10-10T12:15:00Z'
      });

      // Paciente 2: Etapificación SIN resolución de comité
      const p2 = repo.crearPaciente({ run: '20.222.333-4', nombreCompleto: 'Pedro Pablo Valenzuela' });
      repo.crearCaso({
        numeroCaso: 'CASO-SIN-RES',
        pacienteId: p2,
        especialidad: 'Dermatología',
        codigoDiagnosticoOSospecha: 'C43.9 — Melanoma',
        etapaActual: 'Etapificación',
        fechaIngreso: '2026-10-20'
      });
    });

    it('Escenario: HU-01-ESC-01 Consulta del seguimiento de un caso', async () => {
      const response = await request(app).get('/casos/CASO-2026-003');

      expect(response.status).toBe(200);
      expect(response.text).toContain('María Elena González Silva');
      expect(response.text).toContain('15.432.198-7');
      expect(response.text).toContain('Ginecología Oncológica');
      expect(response.text).toContain('C53.9');
      expect(response.text).toContain('Etapificación');
      expect(response.text).toContain('Línea de Tiempo Clínica');
      expect(response.text).toContain('Confirmación histológica');
      expect(response.text).toContain('Resolución de comité oncológico');
    });

    it('Escenario: HU-01-ESC-02 Cambio de etapa por inicio del tratamiento', async () => {
      // Registrar inicio de tratamiento en CASO-2026-003 (que sí cuenta con resolución de comité previa)
      const postRes = await request(app)
        .post('/casos/CASO-2026-003/hitos')
        .send({
          tipo: 'Inicio efectivo de tratamiento',
          fechaOcurrencia: '2026-10-15',
          responsable: 'Dr. Fernando Bravo',
          rolResponsable: 'Médico tratante'
        });

      // Debe redirigir con éxito a la ficha
      expect(postRes.status).toBe(302);
      expect(postRes.headers.location).toContain('/casos/CASO-2026-003');

      // Consultar la ficha actualizada
      const getRes = await request(app).get('/casos/CASO-2026-003');
      expect(getRes.status).toBe(200);
      expect(getRes.text).toContain('Tratamiento'); // Caso pasó a Tratamiento
      expect(getRes.text).toContain('Inicio efectivo de tratamiento');
      expect(getRes.text).toContain('Dr. Fernando Bravo');
    });

    it('Escenario: HU-01-ESC-03 Resolución de comité sin inicio del tratamiento', async () => {
      // Registrar resolución de comité en caso sin resolución
      const postRes = await request(app)
        .post('/casos/CASO-SIN-RES/hitos')
        .send({
          tipo: 'Resolución de comité oncológico',
          fechaOcurrencia: '2026-10-25',
          responsable: 'Dr. Marcelo Rivas',
          rolResponsable: 'Médico Comité',
          conductaAcordada: 'Cirugía con margen de seguridad'
        });

      expect(postRes.status).toBe(302);

      const getRes = await request(app).get('/casos/CASO-SIN-RES');
      expect(getRes.status).toBe(200);
      expect(getRes.text).toContain('Etapificación'); // Permanece en Etapificación
      expect(getRes.text).toContain('Resolución de comité oncológico');
      expect(getRes.text).toContain('Cirugía con margen de seguridad');
      // No debe existir una etapa llamada 'Comité'
      expect(getRes.text).not.toContain('Etapa actual: Comité');
    });

    it('Escenario Error: Rechazo de inicio de tratamiento sin resolución previa de comité', async () => {
      const postRes = await request(app)
        .post('/casos/CASO-SIN-RES/hitos')
        .send({
          tipo: 'Inicio efectivo de tratamiento',
          fechaOcurrencia: '2026-10-28',
          responsable: 'Dr. Fernando Bravo',
          rolResponsable: 'Médico tratante'
        });

      // Debe rechazar con HTTP 400 y mostrar mensaje explicativo
      expect(postRes.status).toBe(400);
      expect(postRes.text).toContain('sin una resolución de comité previa');

      // Verificar que el caso no cambió de etapa
      const getRes = await request(app).get('/casos/CASO-SIN-RES');
      expect(getRes.text).toContain('Etapificación');
    });

    it('Visualización del Tablero por las 8 Etapas y casos vacíos', async () => {
      const response = await request(app).get('/');

      expect(response.status).toBe(200);
      expect(response.text).toContain('Tablero de Trazabilidad Oncológica');
      for (const etapa of ETAPAS) {
        expect(response.text).toContain(etapa);
      }
      expect(response.text).toContain('Sin casos en esta etapa');
      expect(response.text).toContain('CASO-2026-003');
      expect(response.text).toContain('Sin evaluar');
    });

    it('Manejo de Caso no encontrado (404)', async () => {
      const response = await request(app).get('/casos/CASO-NO-EXISTE');
      expect(response.status).toBe(404);
      expect(response.text).toContain('404 — No encontrado');
    });

    it('Escenario: HU-01-ESC-04 Rechazo de hito con fecha de ocurrencia futura', async () => {
      const manana = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      const postRes = await request(app)
        .post('/casos/CASO-2026-003/hitos')
        .send({
          tipo: 'Contacto de seguimiento y navegación asistencial',
          fechaOcurrencia: manana,
          responsable: 'Enf. Patricia Soto',
          rolResponsable: 'Gestor/a UGCO'
        });

      expect(postRes.status).toBe(400);
      expect(postRes.text).toContain('La fecha de ocurrencia no puede ser futura');

      const getRes = await request(app).get('/casos/CASO-2026-003');
      expect(getRes.status).toBe(200);
      expect(getRes.text).not.toContain(manana);
      expect(getRes.text).toContain('Etapificación');
    });

    it('Escenario: HU-01-ESC-05 Rechazo de hito con fecha anterior al último hito registrado', async () => {
      const fechaAnterior = '2026-09-01';

      const postRes = await request(app)
        .post('/casos/CASO-2026-003/hitos')
        .send({
          tipo: 'Contacto de seguimiento y navegación asistencial',
          fechaOcurrencia: fechaAnterior,
          responsable: 'Enf. Patricia Soto',
          rolResponsable: 'Gestor/a UGCO'
        });

      expect(postRes.status).toBe(400);
      expect(postRes.text).toContain('La fecha de ocurrencia no puede ser anterior al último hito registrado');

      const getRes = await request(app).get('/casos/CASO-2026-003');
      expect(getRes.status).toBe(200);
      expect(getRes.text).not.toContain('Contacto de seguimiento y navegación asistencial');
    });
  });
});

