// src/dominio/repositorios.ts - Consultas y persistencia para las entidades de MD-01.A
import type { Database } from 'better-sqlite3';
import type {
  Paciente,
  CasoOncologico,
  HitoAsistencial,
  ResolucionComite,
  AlertaSeguimiento,
  CasoResumenTablero,
  EtapaTrayectoria
} from './caso-oncologico.js';
import type {
  CuidadorAutorizado,
  EvaluacionMultidimensional,
  DominioValoracion,
  TipoDominio
} from './evaluacion.js';
import type {
  GarantiaGES,
  EntradaBitacora,
  AlertaConDetalle
} from './alertas.js';
import { diasHabilesRestantes, diasCorridosEntre } from './calendario-ges.js';

export class RepositorioOncologico {
  constructor(private db: Database) {}

  // --- Pacientes ---
  obtenerPacientePorRun(run: string): Paciente | null {
    const row = this.db.prepare('SELECT id, run, nombre_completo as nombreCompleto FROM paciente WHERE run = ?').get(run) as Paciente | undefined;
    return row || null;
  }

  obtenerPacientePorId(id: number): Paciente | null {
    const row = this.db.prepare('SELECT id, run, nombre_completo as nombreCompleto FROM paciente WHERE id = ?').get(id) as Paciente | undefined;
    return row || null;
  }

  crearPaciente(paciente: Paciente): number {
    const stmt = this.db.prepare('INSERT INTO paciente (run, nombre_completo) VALUES (?, ?)');
    const res = stmt.run(paciente.run, paciente.nombreCompleto);
    return Number(res.lastInsertRowid);
  }

  // --- Casos Oncológicos ---
  obtenerCasoPorNumero(numeroCaso: string): (CasoOncologico & { paciente: Paciente }) | null {
    const stmt = this.db.prepare(`
      SELECT 
        c.id, c.numero_caso as numeroCaso, c.paciente_id as pacienteId,
        c.especialidad, c.codigo_diagnostico_o_sospecha as codigoDiagnosticoOSospecha,
        c.etapa_actual as etapaActual, c.fecha_ingreso as fechaIngreso,
        p.run as pacienteRun, p.nombre_completo as pacienteNombre
      FROM caso_oncologico c
      JOIN paciente p ON p.id = c.paciente_id
      WHERE c.numero_caso = ?
    `);
    const row = stmt.get(numeroCaso) as any;
    if (!row) return null;

    return {
      id: row.id,
      numeroCaso: row.numeroCaso,
      pacienteId: row.pacienteId,
      especialidad: row.especialidad,
      codigoDiagnosticoOSospecha: row.codigoDiagnosticoOSospecha,
      etapaActual: row.etapaActual as EtapaTrayectoria,
      fechaIngreso: row.fechaIngreso,
      paciente: {
        id: row.pacienteId,
        run: row.pacienteRun,
        nombreCompleto: row.pacienteNombre
      }
    };
  }

  crearCaso(caso: CasoOncologico): number {
    const stmt = this.db.prepare(`
      INSERT INTO caso_oncologico (
        numero_caso, paciente_id, especialidad, codigo_diagnostico_o_sospecha, etapa_actual, fecha_ingreso
      ) VALUES (?, ?, ?, ?, ?, ?)
    `);
    const res = stmt.run(
      caso.numeroCaso,
      caso.pacienteId,
      caso.especialidad,
      caso.codigoDiagnosticoOSospecha,
      caso.etapaActual,
      caso.fechaIngreso
    );
    return Number(res.lastInsertRowid);
  }

  actualizarEtapaCaso(casoId: number, nuevaEtapa: EtapaTrayectoria): void {
    const stmt = this.db.prepare('UPDATE caso_oncologico SET etapa_actual = ? WHERE id = ?');
    stmt.run(nuevaEtapa, casoId);
  }

  listarCasosResumen(fechaReferencia?: string): CasoResumenTablero[] {
    const ref = fechaReferencia ? fechaReferencia.slice(0, 10) : new Date().toISOString().slice(0, 10);
    const stmt = this.db.prepare(`
      SELECT 
        c.id, c.numero_caso as numeroCaso, c.especialidad, c.codigo_diagnostico_o_sospecha as codigoDiagnosticoOSospecha,
        c.etapa_actual as etapaActual, p.run, p.nombre_completo as nombreCompleto
      FROM caso_oncologico c
      JOIN paciente p ON p.id = c.paciente_id
      ORDER BY c.fecha_ingreso DESC, c.id DESC
    `);
    const rows = stmt.all() as any[];

    return rows.map((r) => {
      // Obtener último hito
      const ultimoHitoRow = this.db.prepare(`
        SELECT tipo, fecha_ocurrencia as fechaOcurrencia 
        FROM hito_asistencial 
        WHERE caso_id = ? 
        ORDER BY fecha_ocurrencia DESC, fecha_registro DESC 
        LIMIT 1
      `).get(r.id) as any;

      // Alertas pendientes
      const alertasRow = this.db.prepare(`
        SELECT COUNT(*) as total, MAX(CASE WHEN prioridad = 'Alta' THEN 3 WHEN prioridad = 'Media' THEN 2 ELSE 1 END) as maxPrio
        FROM alerta_seguimiento
        WHERE caso_id = ? AND estado IN ('Pendiente', 'Generada', 'En gestión', 'Vigente')
      `).get(r.id) as any;

      let alertaMaxima = undefined;
      if (alertasRow?.total > 0) {
        alertaMaxima = alertasRow.maxPrio === 3 ? 'Alta' : alertasRow.maxPrio === 2 ? 'Media' : 'Baja';
      }

      // Última evaluación multidimensional (HU-02)
      const evalRow = this.db.prepare(`
        SELECT nivel_vulnerabilidad as nivelVulnerabilidad
        FROM evaluacion_multidimensional
        WHERE caso_id = ?
        ORDER BY fecha_evaluacion DESC, id DESC
        LIMIT 1
      `).get(r.id) as any;

      const marcadorRiesgo = evalRow?.nivelVulnerabilidad || 'Sin evaluar';

      // Alerta más urgente para el tablero (HU-04 / D7)
      const alertaUrgenteRow = this.db.prepare(`
        SELECT 
          a.tipo, a.garantia_id as garantiaId, g.tipo_garantia as tipoGarantia, g.fecha_limite as fechaLimite
        FROM alerta_seguimiento a
        LEFT JOIN garantia_ges g ON g.id = a.garantia_id
        WHERE a.caso_id = ? AND a.estado IN ('Pendiente', 'En gestión')
        ORDER BY CASE WHEN a.prioridad = 'Alta' THEN 1 WHEN a.prioridad = 'Media' THEN 2 ELSE 3 END ASC, a.fecha_generacion ASC
        LIMIT 1
      `).get(r.id) as any;

      let alertaMasUrgente = undefined;
      if (alertaUrgenteRow) {
        let diasRestantes = undefined;
        let diasInactividad = undefined;
        if (alertaUrgenteRow.fechaLimite) {
          diasRestantes = diasHabilesRestantes(alertaUrgenteRow.fechaLimite, ref);
        } else if (alertaUrgenteRow.tipo === 'Riesgo de Inactividad/Abandono') {
          const ultReg = this.obtenerFechaUltimoRegistroAsistencial(r.id);
          if (ultReg) {
            diasInactividad = diasCorridosEntre(ultReg, ref);
          }
        }
        alertaMasUrgente = {
          tipo: alertaUrgenteRow.tipo,
          tipoGarantia: alertaUrgenteRow.tipoGarantia,
          diasRestantes,
          diasInactividad
        };
      }

      return {
        numeroCaso: r.numeroCaso,
        run: r.run,
        nombreCompleto: r.nombreCompleto,
        especialidad: r.especialidad,
        codigoDiagnosticoOSospecha: r.codigoDiagnosticoOSospecha,
        etapaActual: r.etapaActual as EtapaTrayectoria,
        ultimoHito: ultimoHitoRow ? { tipo: ultimoHitoRow.tipo, fechaOcurrencia: ultimoHitoRow.fechaOcurrencia } : undefined,
        alertasPendientes: alertasRow ? Number(alertasRow.total) : 0,
        alertaMaximaPrioridad: alertaMaxima,
        marcadorRiesgo,
        alertaMasUrgente
      };
    });
  }

  // --- Hitos Asistenciales ---
  listarHitosPorCasoId(casoId: number): HitoAsistencial[] {
    const stmt = this.db.prepare(`
      SELECT 
        id, caso_id as casoId, tipo, fecha_ocurrencia as fechaOcurrencia, 
        fecha_registro as fechaRegistro, responsable, rol_responsable as rolResponsable
      FROM hito_asistencial
      WHERE caso_id = ?
      ORDER BY fecha_ocurrencia ASC, fecha_registro ASC
    `);
    return stmt.all(casoId) as HitoAsistencial[];
  }

  crearHito(hito: HitoAsistencial): number {
    const stmt = this.db.prepare(`
      INSERT INTO hito_asistencial (
        caso_id, tipo, fecha_ocurrencia, fecha_registro, responsable, rol_responsable
      ) VALUES (?, ?, ?, ?, ?, ?)
    `);
    const res = stmt.run(
      hito.casoId,
      hito.tipo,
      hito.fechaOcurrencia,
      hito.fechaRegistro,
      hito.responsable,
      hito.rolResponsable
    );
    return Number(res.lastInsertRowid);
  }

  // --- Resoluciones de Comité ---
  listarResolucionesPorCasoId(casoId: number): ResolucionComite[] {
    const stmt = this.db.prepare(`
      SELECT 
        id, caso_id as casoId, identificador, conducta_acordada as conductaAcordada,
        fecha_resolucion as fechaResolucion, fecha_firma as fechaFirma
      FROM resolucion_comite
      WHERE caso_id = ?
      ORDER BY fecha_resolucion DESC
    `);
    return stmt.all(casoId) as ResolucionComite[];
  }

  tieneResolucionComite(casoId: number): boolean {
    const row = this.db.prepare('SELECT 1 FROM resolucion_comite WHERE caso_id = ? LIMIT 1').get(casoId);
    return !!row;
  }

  crearResolucionComite(resolucion: ResolucionComite): number {
    const stmt = this.db.prepare(`
      INSERT INTO resolucion_comite (
        caso_id, identificador, conducta_acordada, fecha_resolucion, fecha_firma
      ) VALUES (?, ?, ?, ?, ?)
    `);
    const res = stmt.run(
      resolucion.casoId,
      resolucion.identificador,
      resolucion.conductaAcordada,
      resolucion.fechaResolucion,
      resolucion.fechaFirma
    );
    return Number(res.lastInsertRowid);
  }

  // --- Alertas de Seguimiento (HU-04 / HU-03) ---
  listarAlertasPorCasoId(casoId: number): (AlertaSeguimiento & {
    tipoGarantia?: string;
    fechaLimiteGarantia?: string;
    tipoHitoCumplimiento?: string;
    fechaHitoCumplimiento?: string;
    identificadorEntradaCumplimiento?: string;
    fechaEntradaCumplimiento?: string;
    tipoHitoOrigen?: string;
  })[] {
    const stmt = this.db.prepare(`
      SELECT 
        a.id, a.caso_id as casoId, a.identificador, a.tipo, a.prioridad, a.estado,
        a.fecha_generacion as fechaGeneracion, a.garantia_id as garantiaId,
        a.hito_cumplimiento_id as hitoCumplimientoId, a.motivo_cierre as motivoCierre,
        a.fecha_cierre as fechaCierre, a.responsable_cierre as responsableCierre,
        a.hito_origen_id as hitoOrigenId, a.entrada_origen_id as entradaOrigenId,
        a.entrada_cumplimiento_id as entradaCumplimientoId,
        g.tipo_garantia as tipoGarantia, g.fecha_limite as fechaLimiteGarantia,
        h.tipo as tipoHitoCumplimiento, h.fecha_ocurrencia as fechaHitoCumplimiento,
        ho.tipo as tipoHitoOrigen,
        eb.identificador as identificadorEntradaCumplimiento, eb.fecha_contacto as fechaEntradaCumplimiento
      FROM alerta_seguimiento a
      LEFT JOIN garantia_ges g ON g.id = a.garantia_id
      LEFT JOIN hito_asistencial h ON h.id = a.hito_cumplimiento_id
      LEFT JOIN hito_asistencial ho ON ho.id = a.hito_origen_id
      LEFT JOIN entrada_bitacora eb ON eb.id = a.entrada_cumplimiento_id
      WHERE a.caso_id = ?
      ORDER BY a.fecha_generacion DESC, a.id DESC
    `);
    return stmt.all(casoId) as any[];
  }

  crearAlerta(alerta: AlertaSeguimiento): number {
    const identificador = alerta.identificador || `ALR-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 900 + 100)}`;
    const stmt = this.db.prepare(`
      INSERT INTO alerta_seguimiento (
        caso_id, identificador, tipo, prioridad, estado, fecha_generacion,
        garantia_id, hito_cumplimiento_id, motivo_cierre, fecha_cierre, responsable_cierre,
        hito_origen_id, entrada_origen_id, entrada_cumplimiento_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const res = stmt.run(
      alerta.casoId,
      identificador,
      alerta.tipo,
      alerta.prioridad,
      alerta.estado,
      alerta.fechaGeneracion,
      alerta.garantiaId ?? null,
      alerta.hitoCumplimientoId ?? null,
      alerta.motivoCierre ?? null,
      alerta.fechaCierre ?? null,
      alerta.responsableCierre ?? null,
      alerta.hitoOrigenId ?? null,
      alerta.entradaOrigenId ?? null,
      alerta.entradaCumplimientoId ?? null
    );
    return Number(res.lastInsertRowid);
  }

  obtenerAlertaPorId(alertaId: number): (AlertaSeguimiento & { numeroCaso: string; pacienteNombre: string; pacienteRun: string; tipoGarantia?: string; fechaLimiteGarantia?: string }) | null {
    const stmt = this.db.prepare(`
      SELECT 
        a.id, a.caso_id as casoId, a.identificador, a.tipo, a.prioridad, a.estado,
        a.fecha_generacion as fechaGeneracion, a.garantia_id as garantiaId,
        a.hito_cumplimiento_id as hitoCumplimientoId, a.motivo_cierre as motivoCierre,
        a.fecha_cierre as fechaCierre, a.responsable_cierre as responsableCierre,
        c.numero_caso as numeroCaso, p.nombre_completo as pacienteNombre, p.run as pacienteRun,
        g.tipo_garantia as tipoGarantia, g.fecha_limite as fechaLimiteGarantia
      FROM alerta_seguimiento a
      JOIN caso_oncologico c ON c.id = a.caso_id
      JOIN paciente p ON p.id = c.paciente_id
      LEFT JOIN garantia_ges g ON g.id = a.garantia_id
      WHERE a.id = ?
    `);
    const row = stmt.get(alertaId) as any;
    return row || null;
  }

  tieneAlertaActivaGarantia(garantiaId: number): boolean {
    const row = this.db.prepare(`
      SELECT 1 FROM alerta_seguimiento 
      WHERE garantia_id = ? AND estado IN ('Pendiente', 'En gestión')
      LIMIT 1
    `).get(garantiaId);
    return Boolean(row);
  }

  tieneAlertaActivaInactividad(casoId: number): boolean {
    const row = this.db.prepare(`
      SELECT 1 FROM alerta_seguimiento 
      WHERE caso_id = ? AND tipo = 'Riesgo de Inactividad/Abandono' AND estado IN ('Pendiente', 'En gestión')
      LIMIT 1
    `).get(casoId);
    return Boolean(row);
  }

  listarAlertasVigentes(fechaReferencia?: string, soloActivas = false): AlertaConDetalle[] {
    const ref = fechaReferencia ? fechaReferencia.slice(0, 10) : new Date().toISOString().slice(0, 10);
    const ahoraMs = fechaReferencia && fechaReferencia.length > 10 ? new Date(fechaReferencia).getTime() : Date.now();

    const stmt = this.db.prepare(`
      SELECT 
        a.id, a.caso_id as casoId, a.identificador, a.tipo, a.prioridad, a.estado,
        a.fecha_generacion as fechaGeneracion, a.garantia_id as garantiaId,
        a.hito_cumplimiento_id as hitoCumplimientoId, a.motivo_cierre as motivoCierre,
        a.fecha_cierre as fechaCierre, a.responsable_cierre as responsableCierre,
        c.numero_caso as numeroCaso, p.nombre_completo as pacienteNombre, p.run as pacienteRun,
        g.tipo_garantia as tipoGarantia, g.fecha_limite as fechaLimiteGarantia
      FROM alerta_seguimiento a
      JOIN caso_oncologico c ON c.id = a.caso_id
      JOIN paciente p ON p.id = c.paciente_id
      LEFT JOIN garantia_ges g ON g.id = a.garantia_id
      WHERE a.estado IN ('Pendiente', 'En gestión', 'Resuelta')
      ORDER BY 
        CASE WHEN a.prioridad = 'Alta' THEN 1 WHEN a.prioridad = 'Media' THEN 2 ELSE 3 END ASC,
        a.fecha_generacion ASC, a.id DESC
    `);
    const rows = stmt.all() as any[];

    // HU-04-ESC-06: Resuelta permanece visible en panel durante 14 horas desde resolución.
    // HU-04-ESC-08: Exportación CSV excluye Resueltas y No aplica.
    const filtradas = rows.filter((r) => {
      if (r.estado === 'Pendiente' || r.estado === 'En gestión') {
        return true;
      }
      if (soloActivas) {
        return false;
      }
      if (r.estado === 'Resuelta') {
        if (!r.fechaCierre) return false;
        const fechaCierreMs = new Date(r.fechaCierre).getTime();
        const diffHoras = (ahoraMs - fechaCierreMs) / (1000 * 60 * 60);
        return diffHoras >= 0 && diffHoras <= 14;
      }
      return false;
    });

    return filtradas.map((r) => {
      let diasRestantes = undefined;
      let diasInactividad = undefined;
      if (r.fechaLimiteGarantia) {
        diasRestantes = diasHabilesRestantes(r.fechaLimiteGarantia, ref);
      } else if (r.tipo === 'Riesgo de Inactividad/Abandono') {
        const ultReg = this.obtenerFechaUltimoRegistroAsistencial(r.casoId);
        if (ultReg) {
          diasInactividad = diasCorridosEntre(ultReg, ref);
        }
      }

      return {
        ...r,
        diasRestantes,
        diasInactividad
      };
    });
  }

  actualizarEstadoAlerta(alertaId: number, nuevoEstado: string): void {
    const stmt = this.db.prepare('UPDATE alerta_seguimiento SET estado = ? WHERE id = ?');
    stmt.run(nuevoEstado, alertaId);
  }

  resolverAlertaConHito(alertaId: number, hitoId: number, garantiaId?: number, fechaCierreIso?: string): void {
    const fecha = fechaCierreIso || new Date().toISOString();
    const tx = this.db.transaction(() => {
      this.db.prepare(`
        UPDATE alerta_seguimiento 
        SET estado = 'Resuelta', hito_cumplimiento_id = ?, fecha_cierre = ?
        WHERE id = ?
      `).run(hitoId, fecha, alertaId);

      if (garantiaId) {
        this.db.prepare(`
          UPDATE garantia_ges 
          SET estado_cumplimiento = 'Cumplida'
          WHERE id = ?
        `).run(garantiaId);
      }
    });
    tx();
  }

  resolverAlertaConEntrada(alertaId: number, entradaId: number, fechaCierreIso?: string): void {
    const fecha = fechaCierreIso || new Date().toISOString();
    this.db.prepare(`
      UPDATE alerta_seguimiento 
      SET estado = 'Resuelta', entrada_cumplimiento_id = ?, fecha_cierre = ?
      WHERE id = ?
    `).run(entradaId, fecha, alertaId);
  }

  cerrarAlertaPorCausa(alertaId: number, motivo: string, fecha: string, responsable: string, garantiaId?: number): void {
    const tx = this.db.transaction(() => {
      this.db.prepare(`
        UPDATE alerta_seguimiento 
        SET estado = 'No aplica', motivo_cierre = ?, fecha_cierre = ?, responsable_cierre = ?
        WHERE id = ?
      `).run(motivo, fecha, responsable, alertaId);

      if (garantiaId) {
        this.db.prepare(`
          UPDATE garantia_ges 
          SET estado_cumplimiento = 'No aplica'
          WHERE id = ?
        `).run(garantiaId);
      }
    });
    tx();
  }

  obtenerFechaUltimoRegistroAsistencial(casoId: number): string | null {
    const caso = this.db.prepare('SELECT fecha_ingreso as fechaIngreso FROM caso_oncologico WHERE id = ?').get(casoId) as any;
    if (!caso) return null;

    const ultimoHito = this.db.prepare('SELECT MAX(fecha_ocurrencia) as maxFecha FROM hito_asistencial WHERE caso_id = ?').get(casoId) as any;
    const ultimaEval = this.db.prepare('SELECT MAX(fecha_evaluacion) as maxFecha FROM evaluacion_multidimensional WHERE caso_id = ?').get(casoId) as any;

    let fechaMax = caso.fechaIngreso.slice(0, 10);
    if (ultimoHito?.maxFecha && ultimoHito.maxFecha.slice(0, 10) > fechaMax) {
      fechaMax = ultimoHito.maxFecha.slice(0, 10);
    }
    if (ultimaEval?.maxFecha && ultimaEval.maxFecha.slice(0, 10) > fechaMax) {
      fechaMax = ultimaEval.maxFecha.slice(0, 10);
    }
    return fechaMax;
  }

  // --- Garantías GES (HU-04) ---
  crearGarantia(g: GarantiaGES): number {
    const identificador = g.identificador || `GES-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 900 + 100)}`;
    const stmt = this.db.prepare(`
      INSERT INTO garantia_ges (
        caso_id, identificador, tipo_garantia, fecha_inicio, fecha_limite, estado_cumplimiento
      ) VALUES (?, ?, ?, ?, ?, ?)
    `);
    const res = stmt.run(
      g.casoId,
      identificador,
      g.tipoGarantia,
      g.fechaInicio,
      g.fechaLimite,
      g.estadoCumplimiento
    );
    return Number(res.lastInsertRowid);
  }

  obtenerGarantiaPorId(id: number): GarantiaGES | null {
    const row = this.db.prepare(`
      SELECT 
        id, caso_id as casoId, identificador, tipo_garantia as tipoGarantia,
        fecha_inicio as fechaInicio, fecha_limite as fechaLimite, estado_cumplimiento as estadoCumplimiento
      FROM garantia_ges
      WHERE id = ?
    `).get(id) as any;
    return row || null;
  }

  listarGarantiasPorCasoId(casoId: number): GarantiaGES[] {
    const stmt = this.db.prepare(`
      SELECT 
        id, caso_id as casoId, identificador, tipo_garantia as tipoGarantia,
        fecha_inicio as fechaInicio, fecha_limite as fechaLimite, estado_cumplimiento as estadoCumplimiento
      FROM garantia_ges
      WHERE caso_id = ?
      ORDER BY fecha_limite ASC
    `);
    return stmt.all(casoId) as GarantiaGES[];
  }

  listarGarantiasPendientes(): (GarantiaGES & { numeroCaso: string })[] {
    const stmt = this.db.prepare(`
      SELECT 
        g.id, g.caso_id as casoId, g.identificador, g.tipo_garantia as tipoGarantia,
        g.fecha_inicio as fechaInicio, g.fecha_limite as fechaLimite, g.estado_cumplimiento as estadoCumplimiento,
        c.numero_caso as numeroCaso
      FROM garantia_ges g
      JOIN caso_oncologico c ON c.id = g.caso_id
      WHERE g.estado_cumplimiento = 'Pendiente'
      ORDER BY g.fecha_limite ASC
    `);
    return stmt.all() as any[];
  }

  actualizarEstadoGarantia(garantiaId: number, nuevoEstado: string): void {
    const stmt = this.db.prepare('UPDATE garantia_ges SET estado_cumplimiento = ? WHERE id = ?');
    stmt.run(nuevoEstado, garantiaId);
  }

  // --- Entrada Bitácora y Acompañamiento (HU-04 / HU-03) ---
  crearEntradaBitacora(entrada: EntradaBitacora): number {
    const identificador = entrada.identificador || `BIT-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 900 + 100)}`;
    const stmt = this.db.prepare(`
      INSERT INTO entrada_bitacora (
        caso_id, identificador, punto_contacto_normado, fecha_contacto, canal_contacto,
        interlocutor, motivo_contacto, resumen_interaccion, acuerdos_establecidos,
        responsable_registro, estado_contacto, es_adenda,
        fecha_proximo_contacto, objetivo_proximo_contacto, entrada_original_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const res = stmt.run(
      entrada.casoId,
      identificador,
      entrada.puntoContactoNormado ?? null,
      entrada.fechaContacto,
      entrada.canalContacto,
      entrada.interlocutor ?? null,
      entrada.motivoContacto ?? null,
      entrada.resumenInteraccion,
      entrada.acuerdosEstablecidos ?? null,
      entrada.responsableRegistro,
      entrada.estadoContacto,
      entrada.esAdenda ? 1 : 0,
      entrada.fechaProximoContacto ?? null,
      entrada.objetivoProximoContacto ?? null,
      entrada.entradaOriginalId ?? null
    );
    return Number(res.lastInsertRowid);
  }

  listarEntradasPorCasoId(casoId: number): EntradaBitacora[] {
    const stmt = this.db.prepare(`
      SELECT 
        id, caso_id as casoId, identificador, punto_contacto_normado as puntoContactoNormado,
        fecha_contacto as fechaContacto, canal_contacto as canalContacto, interlocutor,
        motivo_contacto as motivoContacto, resumen_interaccion as resumenInteraccion,
        acuerdos_establecidos as acuerdosEstablecidos, responsable_registro as responsableRegistro,
        estado_contacto as estadoContacto, es_adenda as esAdenda,
        fecha_proximo_contacto as fechaProximoContacto,
        objetivo_proximo_contacto as objetivoProximoContacto,
        entrada_original_id as entradaOriginalId
      FROM entrada_bitacora
      WHERE caso_id = ?
      ORDER BY fecha_contacto DESC, id DESC
    `);
    const rows = stmt.all(casoId) as any[];
    return rows.map((r) => ({
      ...r,
      esAdenda: Boolean(r.esAdenda)
    }));
  }

  obtenerEntradaBitacoraPorIdentificador(identificador: string): EntradaBitacora | null {
    const row = this.db.prepare(`
      SELECT 
        id, caso_id as casoId, identificador, punto_contacto_normado as puntoContactoNormado,
        fecha_contacto as fechaContacto, canal_contacto as canalContacto, interlocutor,
        motivo_contacto as motivoContacto, resumen_interaccion as resumenInteraccion,
        acuerdos_establecidos as acuerdosEstablecidos, responsable_registro as responsableRegistro,
        estado_contacto as estadoContacto, es_adenda as esAdenda,
        fecha_proximo_contacto as fechaProximoContacto,
        objetivo_proximo_contacto as objetivoProximoContacto,
        entrada_original_id as entradaOriginalId
      FROM entrada_bitacora
      WHERE identificador = ?
    `).get(identificador) as any;
    if (!row) return null;
    return {
      ...row,
      esAdenda: Boolean(row.esAdenda)
    };
  }

  obtenerUltimaEntradaAcompanamiento(casoId: number): EntradaBitacora | null {
    const row = this.db.prepare(`
      SELECT 
        id, caso_id as casoId, identificador, punto_contacto_normado as puntoContactoNormado,
        fecha_contacto as fechaContacto, canal_contacto as canalContacto, interlocutor,
        motivo_contacto as motivoContacto, resumen_interaccion as resumenInteraccion,
        acuerdos_establecidos as acuerdosEstablecidos, responsable_registro as responsableRegistro,
        estado_contacto as estadoContacto, es_adenda as esAdenda,
        fecha_proximo_contacto as fechaProximoContacto,
        objetivo_proximo_contacto as objetivoProximoContacto,
        entrada_original_id as entradaOriginalId
      FROM entrada_bitacora
      WHERE caso_id = ? AND es_adenda = 0 AND punto_contacto_normado IS NOT NULL
      ORDER BY fecha_contacto DESC, id DESC
      LIMIT 1
    `).get(casoId) as any;
    if (!row) return null;
    return {
      ...row,
      esAdenda: Boolean(row.esAdenda)
    };
  }

  contarIntentosFallidosConsecutivos(casoId: number): number {
    const rows = this.db.prepare(`
      SELECT estado_contacto as estadoContacto
      FROM entrada_bitacora
      WHERE caso_id = ? AND es_adenda = 0 AND punto_contacto_normado IS NOT NULL
      ORDER BY fecha_contacto DESC, id DESC
    `).all(casoId) as { estadoContacto: string }[];

    let fallos = 0;
    for (const r of rows) {
      if (r.estadoContacto === 'No contactable') {
        fallos++;
      } else if (r.estadoContacto === 'Efectivo') {
        break;
      }
    }
    return fallos;
  }

  existeEntradaDelPunto(casoId: number, puntoNormado: string, fechaMinimaOcurrencia: string): boolean {
    const fechaMin = fechaMinimaOcurrencia.slice(0, 10);
    const row = this.db.prepare(`
      SELECT 1 FROM entrada_bitacora
      WHERE caso_id = ? 
        AND punto_contacto_normado = ? 
        AND substr(fecha_contacto, 1, 10) >= ?
        AND es_adenda = 0
      LIMIT 1
    `).get(casoId, puntoNormado, fechaMin);
    return Boolean(row);
  }

  existeAlertaActivaPorHitoOrigen(hitoId: number): boolean {
    const row = this.db.prepare(`
      SELECT 1 FROM alerta_seguimiento
      WHERE hito_origen_id = ? AND estado IN ('Pendiente', 'En gestión')
      LIMIT 1
    `).get(hitoId);
    return Boolean(row);
  }

  existeAlertaActivaPorTipo(casoId: number, tipo: string): boolean {
    const row = this.db.prepare(`
      SELECT 1 FROM alerta_seguimiento
      WHERE caso_id = ? AND tipo = ? AND estado IN ('Pendiente', 'En gestión')
      LIMIT 1
    `).get(casoId, tipo);
    return Boolean(row);
  }

  // --- Cuidadores Autorizados (HU-02 / CU-10 / D3) ---
  obtenerCuidadorPorPacienteId(pacienteId: number): CuidadorAutorizado | null {
    const row = this.db.prepare(`
      SELECT 
        id, paciente_id as pacienteId, run_cuidador as runCuidador,
        nombre_completo as nombreCompleto, parentesco, telefono_contacto as telefonoContacto,
        autorizacion_vigente as autorizacionVigente, fecha_registro_autorizacion as fechaRegistroAutorizacion
      FROM cuidador_autorizado
      WHERE paciente_id = ?
      ORDER BY id DESC
      LIMIT 1
    `).get(pacienteId) as any;
    if (!row) return null;
    return {
      ...row,
      autorizacionVigente: Boolean(row.autorizacionVigente)
    };
  }

  crearCuidador(cuidador: CuidadorAutorizado): number {
    const stmt = this.db.prepare(`
      INSERT INTO cuidador_autorizado (
        paciente_id, run_cuidador, nombre_completo, parentesco, telefono_contacto, autorizacion_vigente, fecha_registro_autorizacion
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const res = stmt.run(
      cuidador.pacienteId,
      cuidador.runCuidador,
      cuidador.nombreCompleto,
      cuidador.parentesco,
      cuidador.telefonoContacto,
      cuidador.autorizacionVigente ? 1 : 0,
      cuidador.fechaRegistroAutorizacion
    );
    return Number(res.lastInsertRowid);
  }

  // --- Evaluación Multidimensional y Dominios (HU-02 / CU-10 / D1, D2, D5, D6) ---
  crearEvaluacion(
    evaluacion: EvaluacionMultidimensional,
    dominios: DominioValoracion[],
    cuidador?: CuidadorAutorizado
  ): number {
    let evaluacionId = 0;
    const tx = this.db.transaction(() => {
      if (cuidador) {
        this.crearCuidador(cuidador);
      }

      const stmtEval = this.db.prepare(`
        INSERT INTO evaluacion_multidimensional (
          caso_id, identificador, fecha_evaluacion, puntaje_clinico_funcional,
          puntaje_psicoemocional, escala_zarit_cuidador, nivel_vulnerabilidad, profesional_evaluador
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      const resEval = stmtEval.run(
        evaluacion.casoId,
        evaluacion.identificador,
        evaluacion.fechaEvaluacion,
        evaluacion.puntajeClinicoFuncional,
        evaluacion.puntajePsicoemocional,
        evaluacion.escalaZaritCuidador ?? null,
        evaluacion.nivelVulnerabilidad,
        evaluacion.profesionalEvaluador
      );
      evaluacionId = Number(resEval.lastInsertRowid);

      const stmtDom = this.db.prepare(`
        INSERT INTO dominio_valoracion (
          evaluacion_id, tipo_dominio, descripcion_hallazgo, requiere_derivacion,
          especialidad_derivada, prevision_salud, situacion_laboral
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      for (const d of dominios) {
        stmtDom.run(
          evaluacionId,
          d.tipoDominio,
          d.descripcionHallazgo,
          d.requiereDerivacion ? 1 : 0,
          d.especialidadDerivada ?? null,
          d.previsionSalud ?? null,
          d.situacionLaboral ?? null
        );
      }
    });

    tx();
    return evaluacionId;
  }

  obtenerUltimaEvaluacionPorCasoId(casoId: number): EvaluacionMultidimensional | null {
    const row = this.db.prepare(`
      SELECT 
        id, caso_id as casoId, identificador, fecha_evaluacion as fechaEvaluacion,
        puntaje_clinico_funcional as puntajeClinicoFuncional,
        puntaje_psicoemocional as puntajePsicoemocional,
        escala_zarit_cuidador as escalaZaritCuidador,
        nivel_vulnerabilidad as nivelVulnerabilidad,
        profesional_evaluador as profesionalEvaluador
      FROM evaluacion_multidimensional
      WHERE caso_id = ?
      ORDER BY fecha_evaluacion DESC, id DESC
      LIMIT 1
    `).get(casoId) as any;
    if (!row) return null;

    const dominios = this.listarDominiosPorEvaluacionId(row.id);
    return {
      ...row,
      dominios
    };
  }

  listarEvaluacionesPorCasoId(casoId: number): EvaluacionMultidimensional[] {
    const rows = this.db.prepare(`
      SELECT 
        id, caso_id as casoId, identificador, fecha_evaluacion as fechaEvaluacion,
        puntaje_clinico_funcional as puntajeClinicoFuncional,
        puntaje_psicoemocional as puntajePsicoemocional,
        escala_zarit_cuidador as escalaZaritCuidador,
        nivel_vulnerabilidad as nivelVulnerabilidad,
        profesional_evaluador as profesionalEvaluador
      FROM evaluacion_multidimensional
      WHERE caso_id = ?
      ORDER BY fecha_evaluacion DESC, id DESC
    `).all(casoId) as any[];

    return rows.map((r) => ({
      ...r,
      dominios: this.listarDominiosPorEvaluacionId(r.id)
    }));
  }

  listarDominiosPorEvaluacionId(evaluacionId: number): DominioValoracion[] {
    const rows = this.db.prepare(`
      SELECT 
        id, evaluacion_id as evaluacionId, tipo_dominio as tipoDominio,
        descripcion_hallazgo as descripcionHallazgo, requiere_derivacion as requiereDerivacion,
        especialidad_derivada as especialidadDerivada,
        prevision_salud as previsionSalud, situacion_laboral as situacionLaboral
      FROM dominio_valoracion
      WHERE evaluacion_id = ?
      ORDER BY id ASC
    `).all(evaluacionId) as any[];

    return rows.map((r) => ({
      ...r,
      tipoDominio: r.tipoDominio as TipoDominio,
      requiereDerivacion: Boolean(r.requiereDerivacion)
    }));
  }
}

