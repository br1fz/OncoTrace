-- 001_inicial.sql - Esquema inicial derivado de MD-01.A (HU-01)
CREATE TABLE IF NOT EXISTS schema_migrations (
  version TEXT PRIMARY KEY,
  applied_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS paciente (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  run TEXT NOT NULL UNIQUE,
  nombre_completo TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS caso_oncologico (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  numero_caso TEXT NOT NULL UNIQUE,
  paciente_id INTEGER NOT NULL REFERENCES paciente(id) ON DELETE RESTRICT,
  especialidad TEXT NOT NULL,
  codigo_diagnostico_o_sospecha TEXT NOT NULL,
  etapa_actual TEXT NOT NULL,
  fecha_ingreso TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS hito_asistencial (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  caso_id INTEGER NOT NULL REFERENCES caso_oncologico(id) ON DELETE RESTRICT,
  tipo TEXT NOT NULL,
  fecha_ocurrencia TEXT NOT NULL,
  fecha_registro TEXT NOT NULL,
  responsable TEXT NOT NULL,
  rol_responsable TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS resolucion_comite (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  caso_id INTEGER NOT NULL REFERENCES caso_oncologico(id) ON DELETE RESTRICT,
  identificador TEXT NOT NULL,
  conducta_acordada TEXT NOT NULL,
  fecha_resolucion TEXT NOT NULL,
  fecha_firma TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS alerta_seguimiento (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  caso_id INTEGER NOT NULL REFERENCES caso_oncologico(id) ON DELETE RESTRICT,
  tipo TEXT NOT NULL,
  prioridad TEXT NOT NULL,
  estado TEXT NOT NULL,
  fecha_generacion TEXT NOT NULL
);

