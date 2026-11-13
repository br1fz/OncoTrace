// tests/hu-03-bitacora.test.ts - Pruebas automáticas completas para HU-03 (Bitácora de acompañamiento, puntos normados y adendas)
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import Database from 'better-sqlite3';
import { crearApp } from '../src/app.js';
import { aplicarMigraciones } from '../src/db/conexion.js';
import {
  PUNTOS_CONTACTO_NORMADOS,
  mapearHitoAPuntoNormado,
  TEXTOS_MAPEO_HITO_PUNTO
} from '../src/dominio/alertas.js';
import { RepositorioOncologico } from '../src/dominio/repositorios.js';
import { ServicioAlertas } from '../src/servicios/alertas.js';
import { ServicioSeguimiento } from '../src/servicios/seguimiento.js';

describe('HU-03 — Bitácora digital de acompañamiento y puntos de contacto obligatorios', () => {
  let db: ReturnType<typeof Database>;
  let app: ReturnType<typeof crearApp>;
  let repo: RepositorioOncologico;
  let servicioAlertas: ServicioAlertas;
  let servicioSeguimiento: ServicioSeguimiento;

  // Variables para caso de prueba base
  let pacienteId: number;
  let casoId: number;
  const NUMERO_CASO = 'CASO-TEST-HU03';

  beforeEach(() => {
    db = new Database(':memory:');
    aplicarMigraciones(db);
    repo = new RepositorioOncologico(db);
    servicioAlertas = new ServicioAlertas(db);
    servicioSeguimiento = new ServicioSeguimiento(db);
    app = crearApp(db);

    // Crear paciente y caso base para las pruebas
    pacienteId = repo.crearPaciente({
      run: '11.222.333-4',
      nombreCompleto: 'Ana Luisa Soto Paredes'
    });

    casoId = repo.crearCaso({
      numeroCaso: NUMERO_CASO,
      pacienteId,
      especialidad: 'Mastología',
      codigoDiagnosticoOSospecha: 'C50.9 — Sospecha Cáncer de Mama',
      etapaActual: 'Sospecha',
      fechaIngreso: '2026-05-04'
    });
  });

  afterEach(() => {
    db.close();
  });

  describe('1. Dominio, Tipos y Mapeo Textual (Unitario)', () => {
    it('1.1 Debe incluir los 6 puntos normados del Journey Map y la opción No normado', () => {
      expect(PUNTOS_CONTACTO_NORMADOS).toHaveLength(7);
      expect(PUNTOS_CONTACTO_NORMADOS).toContain('P1 Ingreso/Sospecha inicial');
      expect(PUNTOS_CONTACTO_NORMADOS).toContain('P2 Post-confirmación diagnóstica con IPD');
      expect(PUNTOS_CONTACTO_NORMADOS).toContain('P3 Etapificación/Post-resolución de comité');
      expect(PUNTOS_CONTACTO_NORMADOS).toContain('P4 Alta de hospitalización o cirugía');
      expect(PUNTOS_CONTACTO_NORMADOS).toContain('P5 Fin del tratamiento activo y retorno a la vida cotidiana');
      expect(PUNTOS_CONTACTO_NORMADOS).toContain('P6 Derivación a otro establecimiento de la red');
      expect(PUNTOS_CONTACTO_NORMADOS).toContain('No normado');
    });

    it('1.2 Debe mapear hitos textuales normados a P1–P6 de forma insensible a mayúsculas y acentos', () => {
      // P1
      expect(mapearHitoAPuntoNormado('Ingreso de sospecha desde APS')).toBe('P1 Ingreso/Sospecha inicial');
      expect(mapearHitoAPuntoNormado('Recepción de Interconsulta')).toBe('P1 Ingreso/Sospecha inicial');
      expect(mapearHitoAPuntoNormado('Primera Consulta de Especialidad')).toBe('P1 Ingreso/Sospecha inicial');

      // P2
      expect(mapearHitoAPuntoNormado('Confirmación diagnóstica')).toBe('P2 Post-confirmación diagnóstica con IPD');
      expect(mapearHitoAPuntoNormado('Notificación GES y entrega de IPD')).toBe('P2 Post-confirmación diagnóstica con IPD');
      expect(mapearHitoAPuntoNormado('Informe de biopsia confirmatoria')).toBe('P2 Post-confirmación diagnóstica con IPD');

      // P3
      expect(mapearHitoAPuntoNormado('Resolución de comité oncológico')).toBe('P3 Etapificación/Post-resolución de comité');

      // P4
      expect(mapearHitoAPuntoNormado('Alta hospitalaria del paciente')).toBe('P4 Alta de hospitalización o cirugía');
      expect(mapearHitoAPuntoNormado('Intervención quirúrgica realizada')).toBe('P4 Alta de hospitalización o cirugía');

      // P5
      expect(mapearHitoAPuntoNormado('Término de quimioterapia adyuvante')).toBe('P5 Fin del tratamiento activo y retorno a la vida cotidiana');
      expect(mapearHitoAPuntoNormado('Ingreso a seguimiento y sobrevivientes')).toBe('P5 Fin del tratamiento activo y retorno a la vida cotidiana');

      // P6
      expect(mapearHitoAPuntoNormado('Despacho de derivación a radioterapia externa')).toBe('P6 Derivación a otro establecimiento de la red');

      // No normado
      expect(mapearHitoAPuntoNormado('Control rutinario de enfermería')).toBeNull();
      expect(mapearHitoAPuntoNormado('Examen de laboratorio general')).toBeNull();
    });
  });

  describe('2. Repositorio y Persistencia SQLite (Integración Repositorio)', () => {
    it('2.1 Debe persistir entradas de bitácora con los campos ampliados y listar en orden descendente', () => {
      const id1 = repo.crearEntradaBitacora({
        casoId,
        identificador: 'BIT-2026-001',
        puntoContactoNormado: 'P1 Ingreso/Sospecha inicial',
        fechaContacto: '2026-05-04T10:00:00Z',
        canalContacto: 'Telefónico',
        interlocutor: 'Paciente',
        motivoContacto: 'Contacto inicial',
        resumenInteraccion: 'Orientación inicial a la paciente.',
        responsableRegistro: 'Enf. Patricia Soto',
        estadoContacto: 'Efectivo',
        esAdenda: false,
        fechaProximoContacto: '2026-05-15',
        objetivoProximoContacto: 'Revisión de mamografía'
      });

      const id2 = repo.crearEntradaBitacora({
        casoId,
        identificador: 'BIT-2026-002',
        puntoContactoNormado: null,
        fechaContacto: '2026-05-05T12:00:00Z',
        canalContacto: 'Presencial en UGCO',
        interlocutor: 'Paciente',
        motivoContacto: 'Adenda: Corrección de fecha',
        resumenInteraccion: 'La fecha de revisión es el 16 de mayo.',
        responsableRegistro: 'Enf. Patricia Soto',
        estadoContacto: 'Efectivo',
        esAdenda: true,
        entradaOriginalId: 'BIT-2026-001'
      });

      expect(id1).toBeGreaterThan(0);
      expect(id2).toBeGreaterThan(0);

      const lista = repo.listarEntradasPorCasoId(casoId);
      expect(lista).toHaveLength(2);
      expect(lista[0].identificador).toBe('BIT-2026-002'); // Más reciente primero
      expect(lista[0].esAdenda).toBe(true);
      expect(lista[0].entradaOriginalId).toBe('BIT-2026-001');

      expect(lista[1].identificador).toBe('BIT-2026-001');
      expect(lista[1].fechaProximoContacto).toBe('2026-05-15');
      expect(lista[1].objetivoProximoContacto).toBe('Revisión de mamografía');
    });

    it('2.2 Debe obtener la última entrada de acompañamiento excluyendo adendas y entradas sin punto normado', () => {
      // 1. Entrada de acompañamiento inicial
      repo.crearEntradaBitacora({
        casoId,
        identificador: 'BIT-2026-001',
        puntoContactoNormado: 'P1 Ingreso/Sospecha inicial',
        fechaContacto: '2026-05-04T10:00:00Z',
        canalContacto: 'Telefónico',
        interlocutor: 'Paciente',
        motivoContacto: 'Contacto P1',
        resumenInteraccion: 'Interacción exitosa.',
        responsableRegistro: 'Enf. Patricia Soto',
        estadoContacto: 'Efectivo',
        esAdenda: false
      });

      // 2. Entrada de gestión HU-04 (punto_contacto_normado = null)
      repo.crearEntradaBitacora({
        casoId,
        identificador: 'BIT-2026-002',
        puntoContactoNormado: null,
        fechaContacto: '2026-05-06T11:00:00Z',
        canalContacto: 'Telefónico',
        interlocutor: 'Paciente',
        motivoContacto: 'Gestión alerta',
        resumenInteraccion: 'Llamada administrativa.',
        responsableRegistro: 'Enf. Patricia Soto',
        estadoContacto: 'No contactable',
        esAdenda: false
      });

      // 3. Adenda (es_adenda = true)
      repo.crearEntradaBitacora({
        casoId,
        identificador: 'BIT-2026-003',
        puntoContactoNormado: 'P1 Ingreso/Sospecha inicial',
        fechaContacto: '2026-05-07T09:00:00Z',
        canalContacto: 'Telefónico',
        interlocutor: 'Paciente',
        motivoContacto: 'Adenda',
        resumenInteraccion: 'Aclaración.',
        responsableRegistro: 'Enf. Patricia Soto',
        estadoContacto: 'No contactable',
        esAdenda: true,
        entradaOriginalId: 'BIT-2026-001'
      });

      const ultimaAcomp = repo.obtenerUltimaEntradaAcompanamiento(casoId);
      expect(ultimaAcomp).not.toBeNull();
      // Debe corresponder a BIT-2026-001, ignorando la entrada sin punto y la adenda
      expect(ultimaAcomp?.identificador).toBe('BIT-2026-001');
      expect(ultimaAcomp?.estadoContacto).toBe('Efectivo');
    });

    it('2.3 Debe contar la racha de intentos fallidos consecutivas sobre entradas de acompañamiento', () => {
      // 1. Entrada Efectiva
      repo.crearEntradaBitacora({
        casoId,
        identificador: 'BIT-2026-001',
        puntoContactoNormado: 'P1 Ingreso/Sospecha inicial',
        fechaContacto: '2026-05-01T10:00:00Z',
        canalContacto: 'Telefónico',
        resumenInteraccion: 'Efectivo',
        responsableRegistro: 'Gestor/a UGCO',
        estadoContacto: 'Efectivo',
        esAdenda: false
      });

      // 2. Dos entradas No contactables consecutivas
      repo.crearEntradaBitacora({
        casoId,
        identificador: 'BIT-2026-002',
        puntoContactoNormado: 'P2 Post-confirmación diagnóstica con IPD',
        fechaContacto: '2026-05-04T10:00:00Z',
        canalContacto: 'Telefónico',
        resumenInteraccion: 'Fallo 1',
        responsableRegistro: 'Gestor/a UGCO',
        estadoContacto: 'No contactable',
        esAdenda: false
      });

      repo.crearEntradaBitacora({
        casoId,
        identificador: 'BIT-2026-003',
        puntoContactoNormado: 'P2 Post-confirmación diagnóstica con IPD',
        fechaContacto: '2026-05-05T10:00:00Z',
        canalContacto: 'Telefónico',
        resumenInteraccion: 'Fallo 2',
        responsableRegistro: 'Gestor/a UGCO',
        estadoContacto: 'No contactable',
        esAdenda: false
      });

      // Entrada de gestión de alerta HU-04 entremedio (punto_contacto_normado = null)
      repo.crearEntradaBitacora({
        casoId,
        identificador: 'BIT-2026-004',
        puntoContactoNormado: null,
        fechaContacto: '2026-05-06T10:00:00Z',
        canalContacto: 'Telefónico',
        resumenInteraccion: 'Llamada administrativa',
        responsableRegistro: 'Gestor/a UGCO',
        estadoContacto: 'Efectivo', // No debe reiniciar la racha de acompañamiento
        esAdenda: false
      });

      expect(repo.contarIntentosFallidosConsecutivos(casoId)).toBe(2);
    });

    it('2.4 Debe verificar cumplimiento de un punto normado comparando por día (existeEntradaDelPunto)', () => {
      repo.crearEntradaBitacora({
        casoId,
        identificador: 'BIT-2026-001',
        puntoContactoNormado: 'P2 Post-confirmación diagnóstica con IPD',
        fechaContacto: '2026-05-04T16:30:00Z',
        canalContacto: 'Telefónico',
        resumenInteraccion: 'Cumplimiento P2',
        responsableRegistro: 'Gestor/a UGCO',
        estadoContacto: 'Efectivo',
        esAdenda: false
      });

      // Mismo día del hito -> cumple
      expect(repo.existeEntradaDelPunto(casoId, 'P2 Post-confirmación diagnóstica con IPD', '2026-05-04T08:00:00Z')).toBe(true);

      // Día anterior al hito -> no cumple
      expect(repo.existeEntradaDelPunto(casoId, 'P2 Post-confirmación diagnóstica con IPD', '2026-05-05T08:00:00Z')).toBe(false);

      // Punto distinto -> no cumple
      expect(repo.existeEntradaDelPunto(casoId, 'P3 Etapificación/Post-resolución de comité', '2026-05-04')).toBe(false);
    });
  });

  describe('3. Escenarios Gherkin de Aceptación (Casos de Uso)', () => {
    it('3.1 (HU-03-ESC-01) Registro de punto de contacto normado según Journey Map y actualización de contactabilidad', () => {
      // Registrar hito clínico P1
      repo.crearHito({
        casoId,
        tipo: 'Ingreso de sospecha desde APS',
        fechaOcurrencia: '2026-05-04',
        fechaRegistro: '2026-05-04T09:00:00Z',
        responsable: 'Enf. Patricia Soto',
        rolResponsable: 'Gestor/a UGCO'
      });

      // Gestora registra la interacción de acompañamiento para P1
      const res = servicioSeguimiento.registrarInteraccion(
        NUMERO_CASO,
        {
          puntoContactoNormado: 'P1 Ingreso/Sospecha inicial',
          fechaContacto: '2026-05-04T11:00:00',
          canalContacto: 'Telefónico',
          interlocutor: 'Paciente',
          motivoContacto: 'Acogida inicial y orientación Journey Map',
          resumenInteraccion: 'Se contacta a la paciente, se explica el proceso diagnóstico y derechos GES.',
          acuerdosEstablecidos: 'Asistirá a toma de exámenes el 08-05-2026.',
          estadoContacto: 'Efectivo'
        },
        'Enf. Patricia Soto',
        'Gestor/a UGCO'
      );

      expect(res.id).toBeGreaterThan(0);
      expect(res.identificador).toMatch(/^BIT-\d{4}-\d{3}$/);

      // Ficha del caso debe reflejar contactabilidad Contactable y punto cumplido
      const ficha = servicioSeguimiento.obtenerFichaCaso(NUMERO_CASO)!;
      expect(ficha.indicadorContactabilidad).toBe('Contactable');
      expect(ficha.entradasBitacora).toHaveLength(1);
      expect(ficha.entradasBitacora![0].puntoContactoNormado).toBe('P1 Ingreso/Sospecha inicial');
      expect(ficha.entradasBitacora![0].estadoContacto).toBe('Efectivo');
    });

    it('3.2 (HU-03-ESC-02) Alerta preventiva por punto normado pendiente tras 48h hábiles y resolución al registrar contacto', () => {
      // Hito: Confirmación diagnóstica (P2) ocurrido el Lunes 2026-05-04
      const hitoId = repo.crearHito({
        casoId,
        tipo: 'Confirmación diagnóstica con IPD',
        fechaOcurrencia: '2026-05-04',
        fechaRegistro: '2026-05-04T10:00:00Z',
        responsable: 'Dr. Fernando Bravo',
        rolResponsable: 'Médico tratante'
      });

      // Evaluación el Miércoles 2026-05-06 (exactamente 48h hábiles / 2 días hábiles transcurridos) -> NO debe alertar aún
      const evalMiercoles = servicioAlertas.evaluarAlertas('2026-05-06');
      expect(evalMiercoles.alertasPuntoPendienteGeneradas).toBe(0);

      // Evaluación el Jueves 2026-05-07 (> 48h hábiles) -> DEBE detonar alerta preventiva de Punto de contacto pendiente
      const evalJueves = servicioAlertas.evaluarAlertas('2026-05-07');
      expect(evalJueves.alertasPuntoPendienteGeneradas).toBe(1);

      const alertasCaso = repo.listarAlertasPorCasoId(casoId);
      const alertaPunto = alertasCaso.find(a => a.tipo === 'Punto de contacto pendiente');
      expect(alertaPunto).toBeDefined();
      expect(alertaPunto?.prioridad).toBe('Alta');
      expect(alertaPunto?.estado).toBe('Pendiente');
      expect(alertaPunto?.hitoOrigenId).toBe(hitoId);

      // Re-evaluar en la misma fecha no duplica la alerta (Guarda de idempotencia)
      const evalRepetida = servicioAlertas.evaluarAlertas('2026-05-07');
      expect(evalRepetida.alertasPuntoPendienteGeneradas).toBe(0);
      expect(repo.listarAlertasPorCasoId(casoId).filter(a => a.tipo === 'Punto de contacto pendiente')).toHaveLength(1);

      // Ahora la TENS registra el contacto P2 cumpliendo la obligación
      const resRegistro = servicioSeguimiento.registrarInteraccion(
        NUMERO_CASO,
        {
          puntoContactoNormado: 'P2 Post-confirmación diagnóstica con IPD',
          fechaContacto: '2026-05-07T14:00:00',
          canalContacto: 'Telefónico',
          interlocutor: 'Paciente',
          motivoContacto: 'Contacto obligatorio post-confirmación diagnóstica',
          resumenInteraccion: 'Se contacta y se brinda contención emocional.',
          estadoContacto: 'Efectivo'
        },
        'TENS Claudia Morales',
        'TENS UGCO'
      );

      // La alerta debe quedar automáticamente Resuelta vinculada a la entrada
      const alertasActualizadas = repo.listarAlertasPorCasoId(casoId);
      const alertaResuelta = alertasActualizadas.find(a => a.id === alertaPunto!.id);
      expect(alertaResuelta?.estado).toBe('Resuelta');
      expect(alertaResuelta?.entradaCumplimientoId).toBe(resRegistro.id);
      expect(alertaResuelta?.identificadorEntradaCumplimiento).toBe(resRegistro.identificador);
    });

    it('3.3 (HU-03-ESC-03) Registro de intentos fallidos y alerta de búsqueda activa con APS al 3.er fallo', () => {
      // 1.er Intento fallido
      servicioSeguimiento.registrarInteraccion(
        NUMERO_CASO,
        {
          puntoContactoNormado: 'P1 Ingreso/Sospecha inicial',
          fechaContacto: '2026-05-04T10:00:00',
          canalContacto: 'Telefónico',
          interlocutor: 'Paciente',
          motivoContacto: 'Intento 1',
          resumenInteraccion: 'Teléfono apagado.',
          estadoContacto: 'No contactable'
        },
        'Enf. Patricia Soto',
        'Gestor/a UGCO'
      );

      let ficha = servicioSeguimiento.obtenerFichaCaso(NUMERO_CASO)!;
      expect(ficha.indicadorContactabilidad).toBe('No contactable');
      expect(ficha.rachaFallosConsecutivos).toBe(1);
      expect(ficha.alertas.some(a => a.tipo === 'Búsqueda activa por no contactabilidad')).toBe(false);

      // 2.º Intento fallido
      servicioSeguimiento.registrarInteraccion(
        NUMERO_CASO,
        {
          puntoContactoNormado: 'P1 Ingreso/Sospecha inicial',
          fechaContacto: '2026-05-05T11:00:00',
          canalContacto: 'Telefónico',
          interlocutor: 'Paciente',
          motivoContacto: 'Intento 2',
          resumenInteraccion: 'Llamada no contestada.',
          estadoContacto: 'No contactable'
        },
        'TENS Claudia Morales',
        'TENS UGCO'
      );

      ficha = servicioSeguimiento.obtenerFichaCaso(NUMERO_CASO)!;
      expect(ficha.rachaFallosConsecutivos).toBe(2);
      expect(ficha.alertas.some(a => a.tipo === 'Búsqueda activa por no contactabilidad')).toBe(false);

      // 3.er Intento fallido -> Debe generar alerta de Búsqueda activa por no contactabilidad
      const reg3 = servicioSeguimiento.registrarInteraccion(
        NUMERO_CASO,
        {
          puntoContactoNormado: 'P1 Ingreso/Sospecha inicial',
          fechaContacto: '2026-05-06T15:00:00',
          canalContacto: 'Telefónico',
          interlocutor: 'Paciente',
          motivoContacto: 'Intento 3',
          resumenInteraccion: 'Número fuera de servicio. Se activa búsqueda activa.',
          estadoContacto: 'No contactable'
        },
        'Enf. Patricia Soto',
        'Gestor/a UGCO'
      );

      ficha = servicioSeguimiento.obtenerFichaCaso(NUMERO_CASO)!;
      expect(ficha.rachaFallosConsecutivos).toBe(3);
      const alertaBusqueda = ficha.alertas.find(a => a.tipo === 'Búsqueda activa por no contactabilidad');
      expect(alertaBusqueda).toBeDefined();
      expect(alertaBusqueda?.prioridad).toBe('Alta');
      expect(alertaBusqueda?.estado).toBe('Pendiente');
      expect(alertaBusqueda?.entradaOrigenId).toBe(reg3.id);

      // 4.º Intento fallido consecutivo -> No debe duplicar la alerta
      servicioSeguimiento.registrarInteraccion(
        NUMERO_CASO,
        {
          puntoContactoNormado: 'P1 Ingreso/Sospecha inicial',
          fechaContacto: '2026-05-07T09:00:00',
          canalContacto: 'Telefónico',
          interlocutor: 'Paciente',
          motivoContacto: 'Intento 4',
          resumenInteraccion: 'Insistencia sin éxito.',
          estadoContacto: 'No contactable'
        },
        'Gestor/a UGCO',
        'Gestor/a UGCO'
      );

      const alertasBusqueda = repo.listarAlertasPorCasoId(casoId).filter(a => a.tipo === 'Búsqueda activa por no contactabilidad');
      expect(alertasBusqueda).toHaveLength(1);

      // Restablecimiento del contacto: Registro posterior con Efectivo resuelve la alerta de búsqueda
      const regEfectivo = servicioSeguimiento.registrarInteraccion(
        NUMERO_CASO,
        {
          puntoContactoNormado: 'P1 Ingreso/Sospecha inicial',
          fechaContacto: '2026-05-08T10:00:00',
          canalContacto: 'Visita domiciliaria',
          interlocutor: 'Paciente',
          motivoContacto: 'Búsqueda activa efectiva en domicilio con APS',
          resumenInteraccion: 'Paciente localizado en su domicilio con apoyo de CESFAM.',
          estadoContacto: 'Efectivo'
        },
        'Gestor/a UGCO',
        'Gestor/a UGCO'
      );

      const alertasTrasEfectivo = repo.listarAlertasPorCasoId(casoId);
      const alertaResuelta = alertasTrasEfectivo.find(a => a.id === alertaBusqueda!.id);
      expect(alertaResuelta?.estado).toBe('Resuelta');
      expect(alertaResuelta?.entradaCumplimientoId).toBe(regEfectivo.id);

      // Y la contactabilidad vuelve a Contactable
      const fichaFinal = servicioSeguimiento.obtenerFichaCaso(NUMERO_CASO)!;
      expect(fichaFinal.indicadorContactabilidad).toBe('Contactable');
      expect(fichaFinal.rachaFallosConsecutivos).toBe(0);
    });

    it('3.4 (HU-03-ESC-04) Registro de corrección mediante adenda inmutable sin alterar contactabilidad ni racha', () => {
      // Entrada original
      const original = servicioSeguimiento.registrarInteraccion(
        NUMERO_CASO,
        {
          puntoContactoNormado: 'P1 Ingreso/Sospecha inicial',
          fechaContacto: '2026-05-04T10:00:00',
          canalContacto: 'Telefónico',
          interlocutor: 'Paciente',
          motivoContacto: 'Orientación',
          resumenInteraccion: 'Texto inicial con error en la fecha del examen.',
          estadoContacto: 'Efectivo'
        },
        'Enf. Patricia Soto',
        'Gestor/a UGCO'
      );

      // Registrar adenda
      const resAdenda = servicioSeguimiento.registrarAdenda(
        NUMERO_CASO,
        original.identificador,
        {
          motivoEnmienda: 'Rectificación de fecha de citación',
          resumenCorreccion: 'Se aclara que la fecha correcta de examen es 12-05-2026.',
          acuerdosEstablecidos: 'Confirmado por la paciente.'
        },
        'Enf. Patricia Soto',
        'Gestor/a UGCO'
      );

      expect(resAdenda.id).toBeGreaterThan(0);

      // El registro original se conserva intacto
      const origDB = repo.obtenerEntradaBitacoraPorIdentificador(original.identificador)!;
      expect(origDB.resumenInteraccion).toBe('Texto inicial con error en la fecha del examen.');
      expect(origDB.esAdenda).toBe(false);

      // La adenda está vinculada a la entrada original
      const adendaDB = repo.obtenerEntradaBitacoraPorIdentificador(resAdenda.identificador)!;
      expect(adendaDB.esAdenda).toBe(true);
      expect(adendaDB.entradaOriginalId).toBe(original.identificador);
      expect(adendaDB.resumenInteraccion).toBe('Se aclara que la fecha correcta de examen es 12-05-2026.');

      // La adenda no altera el indicador de contactabilidad
      const ficha = servicioSeguimiento.obtenerFichaCaso(NUMERO_CASO)!;
      expect(ficha.indicadorContactabilidad).toBe('Contactable');
    });

    it('3.5 (HU-03-ESC-05) Programación del próximo contacto asistencial y visualización en ficha', () => {
      servicioSeguimiento.registrarInteraccion(
        NUMERO_CASO,
        {
          puntoContactoNormado: 'P1 Ingreso/Sospecha inicial',
          fechaContacto: '2026-05-04T10:00:00',
          canalContacto: 'Telefónico',
          interlocutor: 'Paciente',
          motivoContacto: 'Contacto inicial',
          resumenInteraccion: 'Se agenda seguimiento de mamografía.',
          estadoContacto: 'Efectivo',
          fechaProximoContacto: '2026-05-18',
          objetivoProximoContacto: 'Verificar resultado de biopsia con patólogo'
        },
        'TENS Claudia Morales',
        'TENS UGCO'
      );

      const ficha = servicioSeguimiento.obtenerFichaCaso(NUMERO_CASO)!;
      expect(ficha.proximaAccion).toBeDefined();
      expect(ficha.proximaAccion?.fecha).toBe('2026-05-18');
      expect(ficha.proximaAccion?.objetivo).toBe('Verificar resultado de biopsia con patólogo');
    });

    it('3.6 (HU-03-ESC-06) Rechazo de registro por datos obligatorios incompletos', () => {
      // Intento sin canal ni motivo ni resumen
      expect(() => {
        servicioSeguimiento.registrarInteraccion(
          NUMERO_CASO,
          {
            puntoContactoNormado: 'P1 Ingreso/Sospecha inicial',
            fechaContacto: '2026-05-04',
            canalContacto: '',
            interlocutor: '',
            motivoContacto: '',
            resumenInteraccion: '',
            estadoContacto: 'Efectivo'
          },
          'Gestor/a UGCO',
          'Gestor/a UGCO'
        );
      }).toThrow(/Campos obligatorios incompletos/);

      // No se creó ninguna entrada
      const entradas = repo.listarEntradasPorCasoId(casoId);
      expect(entradas).toHaveLength(0);
    });
  });

  describe('4. Autorización de Rol y Pruebas HTTP (Integración Express)', () => {
    it('4.1 Gestora y TENS autorizados pueden registrar interacción vía POST /casos/:numeroCaso/bitacora', async () => {
      // TENS UGCO registra
      const resTens = await request(app)
        .post(`/casos/${NUMERO_CASO}/bitacora`)
        .set('Cookie', ['rol=TENS UGCO'])
        .send({
          puntoContactoNormado: 'P1 Ingreso/Sospecha inicial',
          fechaContacto: '2026-05-04T10:00',
          canalContacto: 'Telefónico',
          interlocutor: 'Paciente',
          motivoContacto: 'Contacto TENS',
          resumenInteraccion: 'Acompañamiento por TENS.',
          estadoContacto: 'Efectivo'
        });

      expect(resTens.status).toBe(302);
      expect(resTens.headers.location).toContain(NUMERO_CASO);

      // Gestora UGCO registra adenda
      const entradas = repo.listarEntradasPorCasoId(casoId);
      const entradaId = entradas[0].identificador;

      const resGestora = await request(app)
        .post(`/casos/${NUMERO_CASO}/bitacora/${entradaId}/adenda`)
        .set('Cookie', ['rol=Gestor/a UGCO'])
        .send({
          motivoEnmienda: 'Nota aclaratoria',
          resumenCorreccion: 'Detalle complementado por la gestora.'
        });

      expect(resGestora.status).toBe(302);
    });

    it('4.2 Médico tratante es rechazado con 403 al intentar registrar interacción o adenda', async () => {
      const resPost = await request(app)
        .post(`/casos/${NUMERO_CASO}/bitacora`)
        .set('Cookie', ['rol=Médico tratante'])
        .send({
          puntoContactoNormado: 'P1 Ingreso/Sospecha inicial',
          fechaContacto: '2026-05-04',
          canalContacto: 'Telefónico',
          interlocutor: 'Paciente',
          motivoContacto: 'Intento médico',
          resumenInteraccion: 'No debe permitirse.',
          estadoContacto: 'Efectivo'
        });

      expect(resPost.status).toBe(403);
      expect(resPost.text).toContain('Solo Gestor/a UGCO y TENS UGCO pueden registrar');

      // Intentar adenda con Médico tratante
      const resAdenda = await request(app)
        .post(`/casos/${NUMERO_CASO}/bitacora/BIT-FAKE/adenda`)
        .set('Cookie', ['rol=Médico tratante'])
        .send({
          motivoEnmienda: 'Intento adenda médica',
          resumenCorreccion: 'No debe permitirse.'
        });

      expect(resAdenda.status).toBe(403);
    });

    it('4.3 POST /rol: Seleccionar tens debe guardar la cookie en TENS UGCO', async () => {
      const res = await request(app)
        .post('/rol')
        .send({ rol: 'tens' });

      expect(res.status).toBe(302);
      const cookies = res.headers['set-cookie'];
      expect(cookies).toBeDefined();
      expect(cookies[0]).toContain('rol=TENS%20UGCO');
    });

    it('4.4 Inmutabilidad absoluta: DELETE responde con 405 Method Not Allowed', async () => {
      const res = await request(app)
        .delete(`/casos/${NUMERO_CASO}/bitacora/BIT-2026-001`)
        .set('Cookie', ['rol=Gestor/a UGCO']);

      expect(res.status).toBe(405);
      expect(res.text).toContain('las entradas de bitácora son inmutables y no admiten eliminación física');
    });
  });

  describe('5. Casos Borde y Reglas Especiales', () => {
    it('5.1 Entrada de gestión de alerta de HU-04 no debe alterar contactabilidad ni racha de fallos', () => {
      // 1 fallo previo en acompañamiento
      servicioSeguimiento.registrarInteraccion(
        NUMERO_CASO,
        {
          puntoContactoNormado: 'P1 Ingreso/Sospecha inicial',
          fechaContacto: '2026-05-04T10:00:00',
          canalContacto: 'Telefónico',
          interlocutor: 'Paciente',
          motivoContacto: 'Intento 1',
          resumenInteraccion: 'No contesta.',
          estadoContacto: 'No contactable'
        },
        'Gestora UGCO',
        'Gestor/a UGCO'
      );

      // Entrada administrativa HU-04 creada por gestión de alerta (punto_contacto_normado = null)
      repo.crearEntradaBitacora({
        casoId,
        identificador: 'BIT-ADM-001',
        puntoContactoNormado: null,
        fechaContacto: '2026-05-05T12:00:00Z',
        canalContacto: 'Telefónico',
        interlocutor: 'Familiar',
        motivoContacto: 'Gestión alerta preventiva',
        resumenInteraccion: 'Contacto administrativo con familiar.',
        responsableRegistro: 'Gestor/a UGCO',
        estadoContacto: 'Efectivo',
        esAdenda: false
      });

      const ficha = servicioSeguimiento.obtenerFichaCaso(NUMERO_CASO)!;
      // La contactabilidad debe seguir siendo 'No contactable' (derivada de la última de acompañamiento)
      expect(ficha.indicadorContactabilidad).toBe('No contactable');
      // La racha de fallos se conserva en 1
      expect(ficha.rachaFallosConsecutivos).toBe(1);
    });

    it('5.2 Registro de un punto normado resuelve únicamente la alerta del punto correspondiente y no otra', () => {
      // Caso con 2 hitos pendientes > 48h: P1 y P2
      const hitoP1 = repo.crearHito({
        casoId,
        tipo: 'Ingreso de sospecha desde APS',
        fechaOcurrencia: '2026-05-01',
        fechaRegistro: '2026-05-01T09:00:00Z',
        responsable: 'Enf. Patricia Soto',
        rolResponsable: 'Gestor/a UGCO'
      });

      const hitoP2 = repo.crearHito({
        casoId,
        tipo: 'Confirmación diagnóstica con IPD',
        fechaOcurrencia: '2026-05-01',
        fechaRegistro: '2026-05-01T10:00:00Z',
        responsable: 'Dr. Fernando Bravo',
        rolResponsable: 'Médico tratante'
      });

      // Evaluar alertas el 2026-05-06 genera 2 alertas de punto pendiente
      servicioAlertas.evaluarAlertas('2026-05-06');
      const alertasIniciales = repo.listarAlertasPorCasoId(casoId).filter(a => a.tipo === 'Punto de contacto pendiente');
      expect(alertasIniciales).toHaveLength(2);

      // Registrar interacción SOLO para P1
      servicioSeguimiento.registrarInteraccion(
        NUMERO_CASO,
        {
          puntoContactoNormado: 'P1 Ingreso/Sospecha inicial',
          fechaContacto: '2026-05-06T11:00:00',
          canalContacto: 'Telefónico',
          interlocutor: 'Paciente',
          motivoContacto: 'Contacto P1',
          resumenInteraccion: 'Cumplimiento P1.',
          estadoContacto: 'Efectivo'
        },
        'Gestora UGCO',
        'Gestor/a UGCO'
      );

      const alertasPost = repo.listarAlertasPorCasoId(casoId).filter(a => a.tipo === 'Punto de contacto pendiente');
      const alertaP1 = alertasPost.find(a => a.hitoOrigenId === hitoP1);
      const alertaP2 = alertasPost.find(a => a.hitoOrigenId === hitoP2);

      expect(alertaP1?.estado).toBe('Resuelta');
      expect(alertaP2?.estado).toBe('Pendiente'); // P2 sigue pendiente sin resolver
    });

    it('5.3 Contacto con fecha anterior a la ocurrencia del hito no cumple el punto ni resuelve la alerta', () => {
      // Hito ocurrido el 2026-05-04
      const hitoP2 = repo.crearHito({
        casoId,
        tipo: 'Confirmación diagnóstica con IPD',
        fechaOcurrencia: '2026-05-04',
        fechaRegistro: '2026-05-04T09:00:00Z',
        responsable: 'Dr. Fernando Bravo',
        rolResponsable: 'Médico tratante'
      });

      // Alerta generada
      servicioAlertas.evaluarAlertas('2026-05-07');

      // Contacto fechado el 2026-05-03 (anterior al hito)
      servicioSeguimiento.registrarInteraccion(
        NUMERO_CASO,
        {
          puntoContactoNormado: 'P2 Post-confirmación diagnóstica con IPD',
          fechaContacto: '2026-05-03T10:00:00',
          canalContacto: 'Telefónico',
          interlocutor: 'Paciente',
          motivoContacto: 'Contacto anticipado',
          resumenInteraccion: 'Conversación previa a la biopsia.',
          estadoContacto: 'Efectivo'
        },
        'Gestora UGCO',
        'Gestor/a UGCO'
      );

      const alerta = repo.listarAlertasPorCasoId(casoId).find(a => a.hitoOrigenId === hitoP2);
      expect(alerta?.estado).toBe('Pendiente'); // No se resuelve porque la fecha es anterior
    });
  });
});
