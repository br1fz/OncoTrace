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

  listarCasosResumen(): CasoResumenTablero[] {
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
        marcadorRiesgo: 'Sin evaluar'
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

  // --- Alertas de Seguimiento ---
  listarAlertasPorCasoId(casoId: number): AlertaSeguimiento[] {
    const stmt = this.db.prepare(`
      SELECT 
        id, caso_id as casoId, tipo, prioridad, estado, fecha_generacion as fechaGeneracion
      FROM alerta_seguimiento
      WHERE caso_id = ?
      ORDER BY fecha_generacion DESC
    `);
    return stmt.all(casoId) as AlertaSeguimiento[];
  }

  crearAlerta(alerta: AlertaSeguimiento): number {
    const stmt = this.db.prepare(`
      INSERT INTO alerta_seguimiento (
        caso_id, tipo, prioridad, estado, fecha_generacion
      ) VALUES (?, ?, ?, ?, ?)
    `);
    const res = stmt.run(
      alerta.casoId,
      alerta.tipo,
      alerta.prioridad,
      alerta.estado,
      alerta.fechaGeneracion
    );
    return Number(res.lastInsertRowid);
  }
}

