// tests/hu-04-alertas.test.ts - Pruebas automáticas completas para HU-04 (Calendario, Repositorio, Servicio y HTTP)
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import Database from 'better-sqlite3';
import { crearApp } from '../src/app.js';
import { aplicarMigraciones } from '../src/db/conexion.js';
import {
  esFinDeSemana,
  esFeriado,
  esDiaHabil,
  diasHabilesRestantes,
  diasCorridosEntre,
  sumarDiasHabiles,
  FERIADOS_CHILE_2026
} from '../src/dominio/calendario-ges.js';
import { RepositorioOncologico } from '../src/dominio/repositorios.js';
import { ServicioAlertas } from '../src/servicios/alertas.js';
import { ServicioSeguimiento } from '../src/servicios/seguimiento.js';

describe('HU-04 — Motor de alertas preventivas de plazos GES e inactividad', () => {
  let db: ReturnType<typeof Database>;
  let app: ReturnType<typeof crearApp>;
  let repo: RepositorioOncologico;
  let servicioAlertas: ServicioAlertas;
  let servicioSeguimiento: ServicioSeguimiento;

  beforeEach(() => {
    db = new Database(':memory:');
    aplicarMigraciones(db);
    repo = new RepositorioOncologico(db);
    servicioAlertas = new ServicioAlertas(db);
    servicioSeguimiento = new ServicioSeguimiento(db);
    app = crearApp(db);
  });

  afterEach(() => {
    db.close();
  });

  describe('1. Calendario de Días Hábiles Nacionales y Auxiliares (Unitario)', () => {
    it('1.1 Debe identificar correctamente los feriados nacionales oficiales de Chile de 2026', () => {
      expect(FERIADOS_CHILE_2026.size).toBe(16);
      expect(esFeriado('2026-01-01')).toBe(true); // Año Nuevo
      expect(esFeriado('2026-05-01')).toBe(true); // Día del Trabajo
      expect(esFeriado('2026-05-21')).toBe(true); // Glorias Navales
      expect(esFeriado('2026-09-18')).toBe(true); // Fiestas Patrias
      expect(esFeriado('2026-09-19')).toBe(true); // Glorias del Ejército
      expect(esFeriado('2026-10-12')).toBe(true); // Encuentro de Dos Mundos
      expect(esFeriado('2026-12-25')).toBe(true); // Navidad

      // Días hábiles regulares no son feriados
      expect(esFeriado('2026-09-21')).toBe(false);
      expect(esFeriado('2026-11-10')).toBe(false);
    });

    it('1.2 Debe detectar fines de semana (sábado y domingo)', () => {
      expect(esFinDeSemana('2026-11-07')).toBe(true); // Sábado
      expect(esFinDeSemana('2026-11-08')).toBe(true); // Domingo
      expect(esFinDeSemana('2026-11-06')).toBe(false); // Viernes
      expect(esFinDeSemana('2026-11-09')).toBe(false); // Lunes
    });

    it('1.3 Debe calificar como día hábil solo los días de lunes a viernes no feriados', () => {
      expect(esDiaHabil('2026-11-09')).toBe(true); // Lunes regular
      expect(esDiaHabil('2026-11-07')).toBe(false); // Sábado
      expect(esDiaHabil('2026-09-18')).toBe(false); // Viernes pero feriado
    });

    it('1.4 Debe calcular días hábiles restantes considerando fines de semana y feriados', () => {
      // De viernes 2026-11-06 a viernes 2026-11-13 (sin feriados):
      // Cuenta: Lun 9, Mar 10, Mié 11, Jue 12, Vie 13 -> 5 días hábiles
      expect(diasHabilesRestantes('2026-11-13', '2026-11-06')).toBe(5);

      // De viernes 2026-11-06 a lunes 2026-11-16:
      // Lun 9, Mar 10, Mié 11, Jue 12, Vie 13, Lun 16 -> 6 días hábiles
      expect(diasHabilesRestantes('2026-11-16', '2026-11-06')).toBe(6);

      // Con feriado en medio: Miércoles 2026-05-20 a viernes 2026-05-22
      // Jueves 21 de mayo es feriado -> solo cuenta viernes 22 -> 1 día hábil
      expect(diasHabilesRestantes('2026-05-22', '2026-05-20')).toBe(1);

      // Misma fecha límite que referencia -> 0
      expect(diasHabilesRestantes('2026-11-06', '2026-11-06')).toBe(0);

      // Fecha límite vencida en el pasado -> valor negativo
      expect(diasHabilesRestantes('2026-11-05', '2026-11-06')).toBe(-1);
    });

    it('1.5 Debe calcular días corridos (calendario) entre dos fechas', () => {
      expect(diasCorridosEntre('2026-10-01', '2026-10-17')).toBe(16);
      expect(diasCorridosEntre('2026-10-01', '2026-10-16')).toBe(15);
      expect(diasCorridosEntre('2026-10-01', '2026-10-01')).toBe(0);
    });

    it('1.6 Debe sumar días hábiles saltando fines de semana y feriados', () => {
      // Viernes 2026-11-06 + 5 días hábiles -> Viernes 2026-11-13
      expect(sumarDiasHabiles('2026-11-06', 5)).toBe('2026-11-13');
      // Viernes 2026-11-06 + 6 días hábiles -> Lunes 2026-11-16
      expect(sumarDiasHabiles('2026-11-06', 6)).toBe('2026-11-16');
    });
  });

  describe('2. Repositorio y Persistencia SQLite (Integración)', () => {
    it('2.1 Debe persistir y consultar garantías GES y entradas de bitácora', () => {
      const pacId = repo.crearPaciente({ run: '11.111.111-1', nombreCompleto: 'Paciente Repo Test' });
      const casoId = repo.crearCaso({
        numeroCaso: 'CASO-REPO-001',
        pacienteId: pacId,
        especialidad: 'Gastroenterología',
        codigoDiagnosticoOSospecha: 'C18 — Ca Colon',
        etapaActual: 'Confirmación diagnóstica',
        fechaIngreso: '2026-10-01'
      });

      // Crear garantía
      const garantiaId = repo.crearGarantia({
        casoId,
        identificador: 'GES-REPO-001',
        tipoGarantia: 'Confirmación diagnóstica',
        fechaInicio: '2026-10-01',
        fechaLimite: '2026-10-25',
        estadoCumplimiento: 'Pendiente'
      });
      expect(garantiaId).toBeGreaterThan(0);

      const garantia = repo.obtenerGarantiaPorId(garantiaId);
      expect(garantia).not.toBeNull();
      expect(garantia?.identificador).toBe('GES-REPO-001');
      expect(garantia?.estadoCumplimiento).toBe('Pendiente');

      // Crear entrada de bitácora con punto de contacto nulo
      const bitacoraId = repo.crearEntradaBitacora({
        casoId,
        identificador: 'BIT-REPO-001',
        puntoContactoNormado: null,
        fechaContacto: '2026-10-10T10:00:00Z',
        canalContacto: 'Telefónico',
        interlocutor: 'Paciente',
        motivoContacto: 'Seguimiento de informe de biopsia',
        resumenInteraccion: 'Se contacta a laboratorio central para agilizar entrega',
        responsableRegistro: 'Enf. Patricia Soto',
        estadoContacto: 'Efectivo',
        esAdenda: false
      });
      expect(bitacoraId).toBeGreaterThan(0);

      const entradas = repo.listarEntradasPorCasoId(casoId);
      expect(entradas).toHaveLength(1);
      expect(entradas[0].identificador).toBe('BIT-REPO-001');
      expect(entradas[0].puntoContactoNormado).toBeNull();
    });

    it('2.2 Debe calcular la fecha del último registro asistencial considerando ingreso, hitos y evaluaciones', () => {
      const pacId = repo.crearPaciente({ run: '22.222.222-2', nombreCompleto: 'Paciente Fechas Test' });
      const casoId = repo.crearCaso({
        numeroCaso: 'CASO-FECHAS-001',
        pacienteId: pacId,
        especialidad: 'Urología',
        codigoDiagnosticoOSospecha: 'C61 — Próstata',
        etapaActual: 'Sospecha',
        fechaIngreso: '2026-10-01'
      });

      // Solo ingreso
      expect(repo.obtenerFechaUltimoRegistroAsistencial(casoId)).toBe('2026-10-01');

      // Con hito asistencial posterior
      repo.crearHito({
        casoId,
        tipo: 'Toma de biopsia prostática',
        fechaOcurrencia: '2026-10-10',
        fechaRegistro: '2026-10-10T12:00:00Z',
        responsable: 'Dr. Silva',
        rolResponsable: 'Médico tratante'
      });
      expect(repo.obtenerFechaUltimoRegistroAsistencial(casoId)).toBe('2026-10-10');

      // Con evaluación multidimensional aún más reciente
      repo.crearEvaluacion(
        {
          casoId,
          identificador: 'EVAL-FECHAS-001',
          fechaEvaluacion: '2026-10-18T10:00:00Z',
          puntajeClinicoFuncional: 1,
          puntajePsicoemocional: 0,
          nivelVulnerabilidad: 'Bajo',
          profesionalEvaluador: 'Enf. Patricia Soto'
        },
        []
      );
      expect(repo.obtenerFechaUltimoRegistroAsistencial(casoId)).toBe('2026-10-18');
    });

    it('2.3 Guardas de existencia: detecta alertas activas en Pendiente o En gestión e ignora cerradas', () => {
      const pacId = repo.crearPaciente({ run: '33.333.333-3', nombreCompleto: 'Paciente Guardas Test' });
      const casoId = repo.crearCaso({
        numeroCaso: 'CASO-GUARDAS-001',
        pacienteId: pacId,
        especialidad: 'Mastología',
        codigoDiagnosticoOSospecha: 'C50 — Mama',
        etapaActual: 'Sospecha',
        fechaIngreso: '2026-10-01'
      });

      const garantiaId = repo.crearGarantia({
        casoId,
        identificador: 'GES-GUARDAS-001',
        tipoGarantia: 'Confirmación diagnóstica',
        fechaInicio: '2026-10-01',
        fechaLimite: '2026-10-20',
        estadoCumplimiento: 'Pendiente'
      });

      expect(repo.tieneAlertaActivaGarantia(garantiaId)).toBe(false);

      const alertaId = repo.crearAlerta({
        casoId,
        identificador: 'ALR-TEST-001',
        tipo: 'Vencimiento de plazo GES',
        prioridad: 'Alta',
        estado: 'Pendiente',
        fechaGeneracion: '2026-10-15T08:00:00Z',
        garantiaId
      });

      expect(repo.tieneAlertaActivaGarantia(garantiaId)).toBe(true);

      // Pasa a En gestión -> sigue activa
      repo.actualizarEstadoAlerta(alertaId, 'En gestión');
      expect(repo.tieneAlertaActivaGarantia(garantiaId)).toBe(true);

      // Pasa a Resuelta -> ya no es activa
      repo.actualizarEstadoAlerta(alertaId, 'Resuelta');
      expect(repo.tieneAlertaActivaGarantia(garantiaId)).toBe(false);
    });
  });

  describe('3. Escenarios Gherkin de Aceptación (Integración con ServicioAlertas)', () => {
    let casoId1: number;
    let garantiaId1: number;

    beforeEach(() => {
      const pacId = repo.crearPaciente({ run: '44.444.444-4', nombreCompleto: 'Ana Valdés' });
      casoId1 = repo.crearCaso({
        numeroCaso: 'CASO-ESC-001',
        pacienteId: pacId,
        especialidad: 'Ginecología Oncológica',
        codigoDiagnosticoOSospecha: 'C53 — Cuello Uterino',
        etapaActual: 'Etapificación',
        fechaIngreso: '2026-10-01'
      });

      // Garantía que vencerá el viernes 2026-11-13
      garantiaId1 = repo.crearGarantia({
        casoId: casoId1,
        identificador: 'GES-ESC-001',
        tipoGarantia: 'Etapificación y resolución',
        fechaInicio: '2026-10-01',
        fechaLimite: '2026-11-13',
        estadoCumplimiento: 'Pendiente'
      });
    });

    it('3.1 (HU-04-ESC-01) Garantía pendiente a cinco días hábiles del vencimiento genera alerta preventiva y no duplica', () => {
      // Fecha de referencia: Viernes 2026-11-06 (quedan 5 días hábiles hasta 2026-11-13)
      const fechaRef = '2026-11-06';

      const res1 = servicioAlertas.evaluarAlertas(fechaRef);
      expect(res1.alertasGesGeneradas).toBe(1);

      const vigentes = servicioAlertas.listarAlertasVigentes(fechaRef);
      const alertaGes = vigentes.find(a => a.garantiaId === garantiaId1);
      expect(alertaGes).toBeDefined();
      expect(alertaGes?.tipo).toBe('Vencimiento de plazo GES');
      expect(alertaGes?.prioridad).toBe('Alta');
      expect(alertaGes?.estado).toBe('Pendiente');
      expect(alertaGes?.numeroCaso).toBe('CASO-ESC-001');
      expect(alertaGes?.tipoGarantia).toBe('Etapificación y resolución');
      expect(alertaGes?.diasRestantes).toBe(5);

      // Repetir la evaluación sin cambios no debe duplicar (guarda CA7)
      const res2 = servicioAlertas.evaluarAlertas(fechaRef);
      expect(res2.alertasGesGeneradas).toBe(0);

      const vigentesRepetidas = servicioAlertas.listarAlertasVigentes(fechaRef);
      const alertasDelCaso = vigentesRepetidas.filter(a => a.garantiaId === garantiaId1);
      expect(alertasDelCaso).toHaveLength(1);
    });

    it('3.2 (HU-04-ESC-02) Garantía fuera del umbral preventivo (6 días hábiles) no genera alerta', () => {
      // Garantía con fecha límite el lunes 2026-11-16
      const garantia6Dias = repo.crearGarantia({
        casoId: casoId1,
        identificador: 'GES-ESC-002',
        tipoGarantia: 'Confirmación diagnóstica holgura',
        fechaInicio: '2026-10-01',
        fechaLimite: '2026-11-16',
        estadoCumplimiento: 'Pendiente'
      });

      // Fecha de referencia: Viernes 2026-11-06 (faltan 6 días hábiles)
      const res = servicioAlertas.evaluarAlertas('2026-11-06');
      const vigentes = servicioAlertas.listarAlertasVigentes('2026-11-06');
      const alertaHolgura = vigentes.find(a => a.garantiaId === garantia6Dias);
      expect(alertaHolgura).toBeUndefined();
    });

    it('3.3 (HU-04-ESC-03) Inactividad superior a quince días corridos (16 días) genera alerta de riesgo de inactividad', () => {
      // Caso con último registro el 2026-10-01. Fecha ref: 2026-10-17 -> 16 días corridos (> 15)
      const res = servicioAlertas.evaluarAlertas('2026-10-17');
      expect(res.alertasInactividadGeneradas).toBeGreaterThanOrEqual(1);

      const vigentes = servicioAlertas.listarAlertasVigentes('2026-10-17');
      const alertaInactividad = vigentes.find(a => a.casoId === casoId1 && a.tipo === 'Riesgo de Inactividad/Abandono');
      expect(alertaInactividad).toBeDefined();
      expect(alertaInactividad?.prioridad).toBe('Alta');
      expect(alertaInactividad?.estado).toBe('Pendiente');
      expect(alertaInactividad?.diasInactividad).toBe(16);
    });

    it('3.4 (HU-04-ESC-04) Inactividad que aún no supera el umbral (15 días exactos) no genera alerta', () => {
      // Caso con último registro el 2026-10-01. Fecha ref: 2026-10-16 -> 15 días corridos (umbral es > 15)
      servicioAlertas.evaluarAlertas('2026-10-16');

      const vigentes = servicioAlertas.listarAlertasVigentes('2026-10-16');
      const alertaInactividad = vigentes.find(a => a.casoId === casoId1 && a.tipo === 'Riesgo de Inactividad/Abandono');
      expect(alertaInactividad).toBeUndefined();
    });

    it('3.5 Evaluación repetida de inactividad conserva una sola alerta activa', () => {
      servicioAlertas.evaluarAlertas('2026-10-18');
      servicioAlertas.evaluarAlertas('2026-10-18');

      const vigentes = servicioAlertas.listarAlertasVigentes('2026-10-18');
      const alertasInactividad = vigentes.filter(a => a.casoId === casoId1 && a.tipo === 'Riesgo de Inactividad/Abandono');
      expect(alertasInactividad).toHaveLength(1);
    });

    it('3.6 (HU-04-ESC-05) Registro de gestión en bitácora pasa la alerta a En gestión sin cumplir la garantía', () => {
      servicioAlertas.evaluarAlertas('2026-11-06');
      const vigentes = servicioAlertas.listarAlertasVigentes('2026-11-06');
      const alerta = vigentes.find(a => a.garantiaId === garantiaId1)!;

      servicioAlertas.registrarGestion(alerta.id!, {
        resumenInteraccion: 'Llamada a paciente: se coordina fecha de comité',
        canalContacto: 'Telefónico',
        interlocutor: 'Paciente directo'
      }, 'Gestor/a UGCO');

      const alertaActualizada = repo.obtenerAlertaPorId(alerta.id!)!;
      expect(alertaActualizada.estado).toBe('En gestión');

      // La garantía sigue pendiente (no se considera cumplimiento)
      const garantia = repo.obtenerGarantiaPorId(garantiaId1)!;
      expect(garantia.estadoCumplimiento).toBe('Pendiente');

      // Se guardó la acción en la bitácora
      const entradas = repo.listarEntradasPorCasoId(casoId1);
      expect(entradas).toHaveLength(1);
      expect(entradas[0].resumenInteraccion).toContain('Llamada a paciente');
    });

    it('3.7 (HU-04-ESC-06) Registro de hito de cumplimiento vincula la alerta, pasa a Resuelta y marca garantía Cumplida', () => {
      servicioAlertas.evaluarAlertas('2026-11-06');
      const vigentes = servicioAlertas.listarAlertasVigentes('2026-11-06');
      const alerta = vigentes.find(a => a.garantiaId === garantiaId1)!;

      servicioAlertas.registrarCumplimiento(alerta.id!, {
        tipoHito: 'Resolución de comité y etapificación completada',
        fechaOcurrencia: '2026-11-08',
        responsable: 'Dra. Carmen Gloria Loyola',
        rolResponsable: 'Gestor/a UGCO'
      }, 'Gestor/a UGCO');

      const alertaActualizada = repo.obtenerAlertaPorId(alerta.id!)!;
      expect(alertaActualizada.estado).toBe('Resuelta');
      expect(alertaActualizada.hitoCumplimientoId).toBeGreaterThan(0);

      const garantia = repo.obtenerGarantiaPorId(garantiaId1)!;
      expect(garantia.estadoCumplimiento).toBe('Cumplida');

      // HU-04-ESC-06: Permanece visible como Resuelta dentro de las 14 horas
      const vigentesDentro14h = servicioAlertas.listarAlertasVigentes();
      const alertaResuelta = vigentesDentro14h.find(a => a.id === alerta.id);
      expect(alertaResuelta?.estado).toBe('Resuelta');

      // Transcurridas 14 horas, ya no figura en el panel de alertas vigentes
      const quinceHorasDespues = new Date(Date.now() + 15 * 60 * 60 * 1000).toISOString();
      const vigentesDespues = servicioAlertas.listarAlertasVigentes(quinceHorasDespues);
      expect(vigentesDespues.some(a => a.id === alerta.id)).toBe(false);
    });

    it('3.8 (HU-04-ESC-07) Cierre por causa documentada cambia la alerta y garantía a No aplica', () => {
      servicioAlertas.evaluarAlertas('2026-11-06');
      const vigentes = servicioAlertas.listarAlertasVigentes('2026-11-06');
      const alerta = vigentes.find(a => a.garantiaId === garantiaId1)!;

      servicioAlertas.cerrarAlerta(alerta.id!, {
        motivoCierre: 'Rechazo voluntario del paciente formalizado por escrito',
        fechaCierre: '2026-11-09',
        responsableCierre: 'Enf. Patricia Soto (Gestora UGCO)'
      }, 'Gestor/a UGCO');

      const alertaCerrada = repo.obtenerAlertaPorId(alerta.id!)!;
      expect(alertaCerrada.estado).toBe('No aplica');
      expect(alertaCerrada.motivoCierre).toContain('Rechazo voluntario');
      expect(alertaCerrada.fechaCierre).toBe('2026-11-09');
      expect(alertaCerrada.responsableCierre).toContain('Patricia Soto');

      const garantia = repo.obtenerGarantiaPorId(garantiaId1)!;
      expect(garantia.estadoCumplimiento).toBe('No aplica');
    });

    it('3.9 Rechazo del cierre sin motivo, fecha o responsable', () => {
      servicioAlertas.evaluarAlertas('2026-11-06');
      const vigentes = servicioAlertas.listarAlertasVigentes('2026-11-06');
      const alerta = vigentes.find(a => a.garantiaId === garantiaId1)!;

      // Falta motivo
      expect(() => {
        servicioAlertas.cerrarAlerta(alerta.id!, {
          motivoCierre: '',
          fechaCierre: '2026-11-09',
          responsableCierre: 'Enf. Patricia Soto'
        }, 'Gestor/a UGCO');
      }).toThrow();

      // La alerta conserva su estado anterior
      const noCambio = repo.obtenerAlertaPorId(alerta.id!)!;
      expect(noCambio.estado).toBe('Pendiente');
    });

    it('3.10 (HU-04-ESC-08) Exportación CSV incluye alertas vigentes y excluye Resueltas y No aplica', () => {
      servicioAlertas.evaluarAlertas('2026-11-06');
      const vigentes = servicioAlertas.listarAlertasVigentes('2026-11-06');
      const alerta = vigentes[0];

      // Gestionamos una para tener Pendiente y En gestión
      servicioAlertas.registrarGestion(alerta.id!, {
        resumenInteraccion: 'Prueba de gestión con punto y coma; y comillas "dobles"'
      }, 'Gestor/a UGCO');

      // Creamos una segunda alerta y la cerramos como No aplica
      const alertaId2 = repo.crearAlerta({
        casoId: casoId1,
        identificador: 'ALR-CERRADA',
        tipo: 'Vencimiento de plazo GES',
        prioridad: 'Alta',
        estado: 'Pendiente',
        fechaGeneracion: '2026-11-01T08:00:00Z'
      });
      repo.actualizarEstadoAlerta(alertaId2, 'Resuelta');

      const csv = servicioAlertas.exportarCsv('2026-11-06', 'Gestor/a UGCO');

      // BOM UTF-8
      expect(csv.startsWith('\uFEFF')).toBe(true);

      // Encabezados
      expect(csv).toContain('Caso;Paciente;Tipo de alerta;Tipo de garantía;Días restantes;Estado;Prioridad;Fecha de generación');

      // Contiene alerta En gestión
      expect(csv).toContain('CASO-ESC-001');
      expect(csv).toContain('En gestión');

      // No contiene la alerta Resuelta
      expect(csv).not.toContain('ALR-CERRADA');
      expect(csv).not.toContain('Resuelta');
    });

    it('3.11 La evaluación es atómica y transaccional: si ocurre un fallo, revierte y no deja alertas parciales', () => {
      const conteoInicial = (db.prepare('SELECT COUNT(*) as count FROM alerta_seguimiento').get() as any).count;

      // Simulamos un fallo en la fase de inactividad luego de procesar la garantía GES
      const originalCheck = (servicioAlertas as any).repo.tieneAlertaActivaInactividad;
      (servicioAlertas as any).repo.tieneAlertaActivaInactividad = () => {
        throw new Error('Fallo transaccional inducido');
      };

      try {
        expect(() => {
          servicioAlertas.evaluarAlertas('2026-11-06');
        }).toThrow('Fallo transaccional inducido');

        // El conteo de alertas debe ser exactamente igual al inicial (rollback total)
        const conteoFinal = (db.prepare('SELECT COUNT(*) as count FROM alerta_seguimiento').get() as any).count;
        expect(conteoFinal).toBe(conteoInicial);
      } finally {
        (servicioAlertas as any).repo.tieneAlertaActivaInactividad = originalCheck;
      }
    });
  });

  describe('4. Rutas HTTP y Autorización de Roles (Supertest)', () => {
    let casoTestId: number;
    let garantiaTestId: number;

    beforeEach(() => {
      const pacId = repo.crearPaciente({ run: '55.555.555-5', nombreCompleto: 'Test HTTP Paciente' });
      casoTestId = repo.crearCaso({
        numeroCaso: 'CASO-HTTP-001',
        pacienteId: pacId,
        especialidad: 'Mastología',
        codigoDiagnosticoOSospecha: 'C50 — Ca Mama',
        etapaActual: 'Sospecha',
        fechaIngreso: '2026-10-01'
      });

      garantiaTestId = repo.crearGarantia({
        casoId: casoTestId,
        identificador: 'GES-HTTP-001',
        tipoGarantia: 'Confirmación diagnóstica',
        fechaInicio: '2026-10-01',
        fechaLimite: '2026-11-13',
        estadoCumplimiento: 'Pendiente'
      });
    });

    it('4.1 GET /alertas carga el panel general accesible para ambos roles', async () => {
      // Gestor/a UGCO
      const resGestora = await request(app)
        .get('/alertas?fechaReferencia=2026-11-06')
        .set('Cookie', ['rol=Gestor/a UGCO']);
      expect(resGestora.status).toBe(200);
      expect(resGestora.text).toContain('Panel General de Alertas de Seguimiento');
      expect(resGestora.text).toContain('Evaluar alertas ahora');

      // Médico tratante (solo lectura)
      const resMedico = await request(app)
        .get('/alertas?fechaReferencia=2026-11-06')
        .set('Cookie', ['rol=Médico tratante']);
      expect(resMedico.status).toBe(200);
      expect(resMedico.text).toContain('Modo solo lectura');
      expect(resMedico.text).not.toContain('id="btn-evaluar-alertas"');
    });

    it('4.2 POST /alertas/evaluar: Gestora autorizada evalúa, Médico recibe 403', async () => {
      // Gestor/a UGCO evalúa
      const resOk = await request(app)
        .post('/alertas/evaluar')
        .set('Cookie', ['rol=Gestor/a UGCO'])
        .set('Accept', 'application/json')
        .send({ fechaReferencia: '2026-11-06' });
      expect(resOk.status).toBe(200);
      expect(resOk.body.ok).toBe(true);
      expect(resOk.body.resultado.alertasGesGeneradas).toBe(1);

      // Médico tratante es rechazado con 403
      const resDenegado = await request(app)
        .post('/alertas/evaluar')
        .set('Cookie', ['rol=Médico tratante'])
        .send({ fechaReferencia: '2026-11-06' });
      expect(resDenegado.status).toBe(403);
      expect(resDenegado.text).toContain('Operación no autorizada');
    });

    it('4.3 POST /alertas/:id/gestion: Gestora registra gestión, Médico recibe 403', async () => {
      servicioAlertas.evaluarAlertas('2026-11-06');
      const alerta = servicioAlertas.listarAlertasVigentes('2026-11-06')[0];

      // Médico tratante intenta gestionar -> 403
      const resMed = await request(app)
        .post(`/alertas/${alerta.id}/gestion`)
        .set('Cookie', ['rol=Médico tratante'])
        .send({ resumenInteraccion: 'Intento médico' });
      expect(resMed.status).toBe(403);

      // Gestora gestiona con éxito -> 302 redirect
      const resGest = await request(app)
        .post(`/alertas/${alerta.id}/gestion`)
        .set('Cookie', ['rol=Gestor/a UGCO'])
        .send({ resumenInteraccion: 'Gestión efectiva realizada' });
      expect(resGest.status).toBe(302);

      const alertaActualizada = repo.obtenerAlertaPorId(alerta.id!)!;
      expect(alertaActualizada.estado).toBe('En gestión');
    });

    it('4.4 POST /alertas/:id/cumplimiento: Acredita hito de cumplimiento y actualiza garantía', async () => {
      servicioAlertas.evaluarAlertas('2026-11-06');
      const alerta = servicioAlertas.listarAlertasVigentes('2026-11-06').find(a => a.garantiaId === garantiaTestId)!;

      const resCumplir = await request(app)
        .post(`/alertas/${alerta.id}/cumplimiento`)
        .set('Cookie', ['rol=Gestor/a UGCO'])
        .send({
          tipoHito: 'Biopsia core entregada a UGCO',
          fechaOcurrencia: '2026-11-10',
          responsable: 'Dra. María Paz'
        });
      expect(resCumplir.status).toBe(302);

      const alertaResuelta = repo.obtenerAlertaPorId(alerta.id!)!;
      expect(alertaResuelta.estado).toBe('Resuelta');
      expect(alertaResuelta.hitoCumplimientoId).toBeGreaterThan(0);

      const garantia = repo.obtenerGarantiaPorId(garantiaTestId)!;
      expect(garantia.estadoCumplimiento).toBe('Cumplida');
    });

    it('4.5 POST /alertas/:id/cierre: Cierra alerta por causa documentada', async () => {
      servicioAlertas.evaluarAlertas('2026-11-06');
      const alerta = servicioAlertas.listarAlertasVigentes('2026-11-06').find(a => a.garantiaId === garantiaTestId)!;

      const resCierre = await request(app)
        .post(`/alertas/${alerta.id}/cierre`)
        .set('Cookie', ['rol=Gestor/a UGCO'])
        .send({
          motivoCierre: 'Rechazo voluntario del paciente formalizado por escrito',
          fechaCierre: '2026-11-10',
          responsableCierre: 'Enf. Patricia Soto'
        });
      expect(resCierre.status).toBe(302);

      const alertaCerrada = repo.obtenerAlertaPorId(alerta.id!)!;
      expect(alertaCerrada.estado).toBe('No aplica');
      expect(alertaCerrada.motivoCierre).toContain('Rechazo voluntario');

      const garantia = repo.obtenerGarantiaPorId(garantiaTestId)!;
      expect(garantia.estadoCumplimiento).toBe('No aplica');
    });

    it('4.6 GET /alertas/exportar.csv: Descarga CSV con Content-Disposition para Gestora y 403 para Médico', async () => {
      servicioAlertas.evaluarAlertas('2026-11-06');

      // Médico -> 403
      const resMed = await request(app)
        .get('/alertas/exportar.csv')
        .set('Cookie', ['rol=Médico tratante']);
      expect(resMed.status).toBe(403);

      // Gestora -> 200 attachment
      const resOk = await request(app)
        .get('/alertas/exportar.csv?fechaReferencia=2026-11-06')
        .set('Cookie', ['rol=Gestor/a UGCO']);
      expect(resOk.status).toBe(200);
      expect(resOk.headers['content-type']).toContain('text/csv');
      expect(resOk.headers['content-disposition']).toContain('attachment; filename="alertas-vigentes-2026-11-06.csv"');
      expect(resOk.text).toContain('Caso;Paciente;Tipo de alerta;');
      expect(resOk.text).toContain('CASO-HTTP-001');
    });

    it('4.7 Tablero Kanban y Ficha del Caso integran alertas e indicadores visuales', async () => {
      // Al abrir el tablero, se evalúa y muestra la alerta en la tarjeta
      const resTablero = await request(app)
        .get('/?fechaReferencia=2026-11-06')
        .set('Cookie', ['rol=Gestor/a UGCO']);
      expect(resTablero.status).toBe(200);
      expect(resTablero.text).toContain('CASO-HTTP-001');
      expect(resTablero.text).toContain('Vencimiento de plazo GES');
      expect(resTablero.text).toContain('5 días hábiles');

      // Al abrir la ficha del caso, se muestran los datos de la alerta
      const resFicha = await request(app)
        .get('/casos/CASO-HTTP-001?fechaReferencia=2026-11-06')
        .set('Cookie', ['rol=Gestor/a UGCO']);
      expect(resFicha.status).toBe(200);
      expect(resFicha.text).toContain('Confirmación diagnóstica');
      expect(resFicha.text).toContain('5 días hábiles');
      expect(resFicha.text).toContain('modal-caso-gestion-');
    });

    it('4.8 (HU-04-ESC-09) Evaluación explícita desde el panel informa N alertas nuevas y permanece en el panel', async () => {
      const resEval = await request(app)
        .post('/alertas/evaluar')
        .set('Cookie', ['rol=Gestor/a UGCO'])
        .send({ fechaReferencia: '2026-11-06' });

      expect(resEval.status).toBe(302);
      expect(resEval.headers.location).toContain('/alertas?mensaje=Evaluaci%C3%B3n%20completada%3A');

      const resPanel = await request(app)
        .get(resEval.headers.location)
        .set('Cookie', ['rol=Gestor/a UGCO']);
      expect(resPanel.status).toBe(200);
      expect(resPanel.text).toContain('Evaluación completada:');
      expect(resPanel.text).toContain('Panel General de Alertas');
    });

    it('4.9 (HU-04-ESC-06) Alerta Resuelta permanece visible en panel durante 14 horas y luego se oculta', async () => {
      servicioAlertas.evaluarAlertas('2026-11-06');
      const alerta = servicioAlertas.listarAlertasVigentes('2026-11-06').find(a => a.garantiaId === garantiaTestId)!;

      const ahoraSimulado = '2026-11-06T10:00:00Z';
      const hitoId = repo.crearHito({
        casoId: alerta.casoId,
        tipo: 'Hito resolutivo test',
        fechaOcurrencia: '2026-11-06',
        fechaRegistro: ahoraSimulado,
        responsable: 'Enf. Patricia',
        rolResponsable: 'Gestor/a UGCO'
      });
      repo.resolverAlertaConHito(alerta.id!, hitoId, alerta.garantiaId, ahoraSimulado);

      // Consulta a las 5 horas después (<= 14h): debe seguir visible en el panel
      const cincoHorasDespues = '2026-11-06T15:00:00Z';
      const alertasDentro14h = servicioAlertas.listarAlertasVigentes(cincoHorasDespues);
      const alertaVisible = alertasDentro14h.find(a => a.id === alerta.id);
      expect(alertaVisible).toBeDefined();
      expect(alertaVisible?.estado).toBe('Resuelta');

      // Consulta a las 15 horas después (> 14h): ya NO debe listarse en el panel
      const quinceHorasDespues = '2026-11-07T01:01:00Z';
      const alertasFuera14h = servicioAlertas.listarAlertasVigentes(quinceHorasDespues);
      const alertaOculta = alertasFuera14h.find(a => a.id === alerta.id);
      expect(alertaOculta).toBeUndefined();

      // Sigue consultable en la ficha del caso
      const casoAlertas = repo.listarAlertasPorCasoId(alerta.casoId);
      expect(casoAlertas.find(a => a.id === alerta.id)?.estado).toBe('Resuelta');
    });
  });
});
