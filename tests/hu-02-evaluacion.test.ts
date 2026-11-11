// tests/hu-02-evaluacion.test.ts - Pruebas automáticas para HU-02 (Gherkin + Dominio + HTTP)
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import Database from 'better-sqlite3';
import { crearApp } from '../src/app.js';
import { aplicarMigraciones } from '../src/db/conexion.js';
import { sembrarDatos } from '../src/db/seed.js';
import {
  esEcogValido,
  esZaritValido,
  calcularNivelVulnerabilidad,
  DOMINIOS
} from '../src/dominio/evaluacion.js';
import { RepositorioOncologico } from '../src/dominio/repositorios.js';
import { ServicioEvaluacion } from '../src/servicios/evaluacion.js';
import { ServicioSeguimiento } from '../src/servicios/seguimiento.js';

describe('HU-02 — Evaluación multidimensional y estratificación por dominios', () => {
  let db: ReturnType<typeof Database>;
  let app: ReturnType<typeof crearApp>;

  beforeEach(() => {
    // SQLite en memoria aislada para cada prueba
    db = new Database(':memory:');
    aplicarMigraciones(db);
    sembrarDatos(db.name === '' ? ':memory:' : undefined);
    // Para asegurar datos limpios en la instancia de memoria actual:
    const repo = new RepositorioOncologico(db);
    // Crear paciente y caso base para pruebas
    const pacId = repo.crearPaciente({ run: '20.111.222-3', nombreCompleto: 'Test Paciente HU02' });
    repo.crearCaso({
      numeroCaso: 'CASO-TEST-HU02',
      pacienteId: pacId,
      especialidad: 'Oncología Médica',
      codigoDiagnosticoOSospecha: 'C50 — Cáncer de Mama',
      etapaActual: 'Sospecha',
      fechaIngreso: '2026-11-01'
    });

    app = crearApp(db);
  });

  afterEach(() => {
    db.close();
  });

  describe('1. Reglas de Negocio y Dominio Clínico (Unitario)', () => {
    it('1.1 Debe validar estrictamente el índice ECOG entre 0 y 4 y rechazar valores inválidos', () => {
      expect(esEcogValido(0)).toBe(true);
      expect(esEcogValido(1)).toBe(true);
      expect(esEcogValido(2)).toBe(true);
      expect(esEcogValido(3)).toBe(true);
      expect(esEcogValido(4)).toBe(true);

      // Valores fuera de norma clínica
      expect(esEcogValido(-1)).toBe(false);
      expect(esEcogValido(5)).toBe(false);
      expect(esEcogValido(2.5)).toBe(false);
      expect(esEcogValido('2')).toBe(false);
      expect(esEcogValido(null)).toBe(false);
      expect(esEcogValido(undefined)).toBe(false);
      expect(esEcogValido(NaN)).toBe(false);
    });

    it('1.2 Debe validar la escala Zarit entre 0 y 88 puntos', () => {
      expect(esZaritValido(0)).toBe(true);
      expect(esZaritValido(46)).toBe(true);
      expect(esZaritValido(56)).toBe(true);
      expect(esZaritValido(88)).toBe(true);
      expect(esZaritValido(undefined)).toBe(true); // Opcional si no tiene cuidador
      expect(esZaritValido(null)).toBe(true);

      expect(esZaritValido(-5)).toBe(false);
      expect(esZaritValido(89)).toBe(false);
      expect(esZaritValido(100)).toBe(false);
    });

    it('1.3 Debe calcular la vulnerabilidad global según el algoritmo D1 (Bajo: 0-2, Medio: 3-4, Alto: 5-6)', () => {
      // Caso 1: ECOG 0 (0) + Socio Bajo (0) + Zarit 30 (0) = 0 pts -> Bajo
      const c1 = calcularNivelVulnerabilidad(0, 'Bajo', true, 30);
      expect(c1.puntajeTotal).toBe(0);
      expect(c1.nivelVulnerabilidad).toBe('Bajo');

      // Caso 2: ECOG 2 (1) + Socio Medio (1) + Zarit 50 (1) = 3 pts -> Medio
      const c2 = calcularNivelVulnerabilidad(2, 'Medio', true, 50);
      expect(c2.puntajeTotal).toBe(3);
      expect(c2.nivelVulnerabilidad).toBe('Medio');

      // Caso 3: ECOG 3 (2) + Socio Alto (2) + Zarit 60 (2) = 6 pts -> Alto
      const c3 = calcularNivelVulnerabilidad(3, 'Alto', true, 60);
      expect(c3.puntajeTotal).toBe(6);
      expect(c3.nivelVulnerabilidad).toBe('Alto');

      // Caso 4: Paciente sin red ni cuidador asigna 2 pts de soporte
      const c4 = calcularNivelVulnerabilidad(1, 'Bajo', false);
      // ECOG 1 (0) + Socio Bajo (0) + Sin cuidador (2) = 2 pts -> Bajo
      expect(c4.puntosCuidador).toBe(2);
      expect(c4.nivelVulnerabilidad).toBe('Bajo');

      // Caso 5: Umbral 4 pts -> Medio, 5 pts -> Alto
      const cMedio = calcularNivelVulnerabilidad(2, 'Medio', false); // 1 + 1 + 2 = 4 pts
      expect(cMedio.puntajeTotal).toBe(4);
      expect(cMedio.nivelVulnerabilidad).toBe('Medio');

      const cAlto = calcularNivelVulnerabilidad(3, 'Medio', false); // 2 + 1 + 2 = 5 pts
      expect(cAlto.puntajeTotal).toBe(5);
      expect(cAlto.nivelVulnerabilidad).toBe('Alto');
    });

    it('1.4 Debe contener los 6 dominios de valoración normados', () => {
      expect(DOMINIOS).toHaveLength(6);
      expect(DOMINIOS).toContain('CLINICO_FUNCIONAL');
      expect(DOMINIOS).toContain('PSICOEMOCIONAL');
      expect(DOMINIOS).toContain('CUIDADOR');
      expect(DOMINIOS).toContain('SOCIOECONOMICO');
      expect(DOMINIOS).toContain('ESPIRITUAL');
      expect(DOMINIOS).toContain('COMPRENSION_DIAGNOSTICA');
    });
  });

  describe('2. Escenarios Gherkin de Aceptación (Integración HTTP)', () => {
    it('2.1 (HU-02-ESC-01) Registro de evaluación inicial y cálculo de vulnerabilidad', async () => {
      // Caso en Sospecha sin evaluación previa
      const resForm = await request(app)
        .get('/casos/CASO-TEST-HU02/evaluaciones/nueva')
        .set('Cookie', ['rol=Gestor/a UGCO']);
      expect(resForm.status).toBe(200);
      expect(resForm.text).toContain('Pauta de Valoración Multidimensional');

      // Gestora registra los 6 dominios
      const resPost = await request(app)
        .post('/casos/CASO-TEST-HU02/evaluaciones')
        .set('Cookie', ['rol=Gestor/a UGCO'])
        .send({
          ecog: '1',
          descripcionFuncional: 'Autonomía conservada',
          puntajePsicoemocional: '2', // Alteración crítica
          descripcionPsicoemocional: 'Angustia severa ante sospecha',
          requiereDerivacionPsico: 'on',
          especialidadPsico: 'Psicooncología UGCO',
          tieneCuidador: 'true',
          nombreCuidador: 'Andrés Pérez',
          runCuidador: '16.789.012-3',
          parentescoCuidador: 'Hijo',
          telefonoCuidador: '+56 9 1234 5678',
          escalaZarit: '25',
          nivelSocioeconomico: 'Medio',
          previsionSalud: 'FONASA C',
          situacionLaboral: 'Empleado dependiente',
          descripcionEspiritual: 'Manifiesta profesar fe evangélica',
          descripcionComprension: 'Comprensión clara de las garantías GES'
        });

      // Redirección con éxito a la ficha del caso
      expect(resPost.status).toBe(302);
      expect(resPost.headers.location).toContain('CASO-TEST-HU02');

      // Verificar en la ficha del caso
      const resFicha = await request(app).get('/casos/CASO-TEST-HU02');
      expect(resFicha.status).toBe(200);
      // Puntos: ECOG 1 (0) + Socio Medio (1) + Zarit 25 (0) = 1 pt -> Nivel Bajo
      expect(resFicha.text).toContain('Vulnerabilidad: Bajo');
      expect(resFicha.text).toContain('Andrés Pérez');
      expect(resFicha.text).toContain('Psicooncología UGCO');

      // Verificar en el tablero Kanban
      const resTablero = await request(app).get('/');
      expect(resTablero.status).toBe(200);
      expect(resTablero.text).toContain('CASO-TEST-HU02');
      expect(resTablero.text).toContain('riesgo-bajo');
    });

    it('2.2 (HU-02-ESC-02) Detección de sobrecarga severa en cuidador principal (Zarit > 56)', async () => {
      // Gestora registra evaluación con Zarit = 65 (> 56)
      const resPost = await request(app)
        .post('/casos/CASO-TEST-HU02/evaluaciones')
        .set('Cookie', ['rol=Gestor/a UGCO'])
        .send({
          ecog: '2',
          puntajePsicoemocional: '1',
          tieneCuidador: 'true',
          nombreCuidador: 'Marta Ramírez',
          runCuidador: '12.333.444-5',
          parentescoCuidador: 'Cónyuge',
          telefonoCuidador: '+56 9 9999 8888',
          escalaZarit: '65', // Sobrecarga severa
          nivelSocioeconomico: 'Bajo',
          previsionSalud: 'FONASA B',
          situacionLaboral: 'Jubilado / Pensionado'
        });

      expect(resPost.status).toBe(302);

      // Verificar que se emitió la alerta prioritaria para la Unidad de Servicio Social
      const repo = new RepositorioOncologico(db);
      const caso = repo.obtenerCasoPorNumero('CASO-TEST-HU02')!;
      const alertas = repo.listarAlertasPorCasoId(caso.id!);

      const alertaCuidador = alertas.find(a => a.tipo === 'Sobrecarga de cuidador');
      expect(alertaCuidador).toBeDefined();
      expect(alertaCuidador?.prioridad).toBe('Alta');
      expect(alertaCuidador?.estado).toBe('Pendiente');

      // Verificar que se exigió y registró la solicitud formal de derivación para el cuidador
      const evalActual = repo.obtenerUltimaEvaluacionPorCasoId(caso.id!)!;
      const dominioCuidador = evalActual.dominios?.find(d => d.tipoDominio === 'CUIDADOR');
      expect(dominioCuidador?.requiereDerivacion).toBe(true);
      expect(dominioCuidador?.especialidadDerivada).toBe('Servicio Social');
    });

    it('2.3 (HU-02-ESC-03) Exigencia de índice funcional clínico mínimo (ECOG obligatorio)', async () => {
      // Intento de guardar sin enviar ECOG
      const resPost = await request(app)
        .post('/casos/CASO-TEST-HU02/evaluaciones')
        .set('Cookie', ['rol=Gestor/a UGCO'])
        .send({
          ecog: '', // Vacío / omitido
          puntajePsicoemocional: '1',
          tieneCuidador: 'false',
          nivelSocioeconomico: 'Bajo'
        });

      // Rechazo con HTTP 400 y mensaje explícito
      expect(resPost.status).toBe(400);
      expect(resPost.text).toContain('El valor de rendimiento funcional ECOG (0-4) es un campo clínico obligatorio.');

      // Verificar que el caso mantiene su estado previo sin estratificación
      const servicio = new ServicioSeguimiento(db);
      const ficha = servicio.obtenerFichaCaso('CASO-TEST-HU02')!;
      expect(ficha.marcadorRiesgo).toBe('Sin evaluar');
      expect(ficha.evaluacionActual).toBeUndefined();
    });
  });

  describe('3. Inmutabilidad, Autorización y Casos Borde', () => {
    it('3.1 (Inmutabilidad D5) Las revaluaciones se insertan como registros nuevos y no borran las anteriores', async () => {
      const repo = new RepositorioOncologico(db);
      const caso = repo.obtenerCasoPorNumero('CASO-TEST-HU02')!;

      // 1ª Evaluación: ECOG 0 -> Bajo
      await request(app)
        .post('/casos/CASO-TEST-HU02/evaluaciones')
        .set('Cookie', ['rol=Gestor/a UGCO'])
        .send({ ecog: '0', nivelSocioeconomico: 'Bajo', tieneCuidador: 'true', escalaZarit: '20' });

      // 2ª Evaluación (Revaluación por progresión clínica): ECOG 4 -> Alto
      await request(app)
        .post('/casos/CASO-TEST-HU02/evaluaciones')
        .set('Cookie', ['rol=Gestor/a UGCO'])
        .send({ ecog: '4', nivelSocioeconomico: 'Alto', tieneCuidador: 'false' });

      const historial = repo.listarEvaluacionesPorCasoId(caso.id!);
      expect(historial).toHaveLength(2);

      // La evaluación más reciente debe reflejar el nivel actual (Alto)
      const ultima = repo.obtenerUltimaEvaluacionPorCasoId(caso.id!)!;
      expect(ultima.nivelVulnerabilidad).toBe('Alto');
      expect(ultima.puntajeClinicoFuncional).toBe(4);

      // Y la anterior sigue existiendo inmutable en la base de datos
      expect(historial[1].puntajeClinicoFuncional).toBe(0);
      expect(historial[1].nivelVulnerabilidad).toBe('Bajo');
    });

    it('3.2 (Autorización de Rol) Médico tratante no puede registrar la evaluación multidimensional (CU-10)', async () => {
      const resPost = await request(app)
        .post('/casos/CASO-TEST-HU02/evaluaciones')
        .set('Cookie', ['rol=Médico tratante'])
        .send({
          ecog: '1',
          nivelSocioeconomico: 'Bajo'
        });

      expect(resPost.status).toBe(403);
      expect(resPost.text).toContain('Solo la Gestora UGCO puede aplicar y registrar la pauta');
    });

    it('3.3 (Límite Zarit 56 vs 57) Zarit 56 es sobrecarga leve (sin alerta); Zarit 57 es sobrecarga severa (con alerta)', async () => {
      const repo = new RepositorioOncologico(db);
      const caso = repo.obtenerCasoPorNumero('CASO-TEST-HU02')!;

      // Zarit = 56
      const calc56 = calcularNivelVulnerabilidad(0, 'Bajo', true, 56);
      expect(calc56.puntosCuidador).toBe(1); // Sobrecarga leve
      expect(calc56.sugerenciasDerivacion).toHaveLength(0);

      // Zarit = 57
      const calc57 = calcularNivelVulnerabilidad(0, 'Bajo', true, 57);
      expect(calc57.puntosCuidador).toBe(2); // Sobrecarga severa
      expect(calc57.sugerenciasDerivacion.some(s => s.includes('sobrecarga severa'))).toBe(true);
    });
  });
});
