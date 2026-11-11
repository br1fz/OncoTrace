-- 003_alertas_ges.sql - Esquema de Garantías GES, Bitácora mínima y ampliación de Alertas (HU-04 / RF-04)

CREATE TABLE IF NOT EXISTS garantia_ges (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  caso_id INTEGER NOT NULL REFERENCES caso_oncologico(id) ON DELETE RESTRICT,
  identificador TEXT NOT NULL UNIQUE,
  tipo_garantia TEXT NOT NULL,
  fecha_inicio TEXT NOT NULL,
  fecha_limite TEXT NOT NULL,
  estado_cumplimiento TEXT NOT NULL -- 'Pendiente' | 'Cumplida' | 'No aplica'
);

ALTER TABLE alerta_seguimiento ADD COLUMN identificador TEXT;
ALTER TABLE alerta_seguimiento ADD COLUMN garantia_id INTEGER REFERENCES garantia_ges(id);
ALTER TABLE alerta_seguimiento ADD COLUMN hito_cumplimiento_id INTEGER REFERENCES hito_asistencial(id);
ALTER TABLE alerta_seguimiento ADD COLUMN motivo_cierre TEXT;
ALTER TABLE alerta_seguimiento ADD COLUMN fecha_cierre TEXT;
ALTER TABLE alerta_seguimiento ADD COLUMN responsable_cierre TEXT;

UPDATE alerta_seguimiento SET identificador = 'ALR-' || id WHERE identificador IS NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_alerta_identificador ON alerta_seguimiento(identificador);
CREATE INDEX IF NOT EXISTS idx_alerta_garantia ON alerta_seguimiento(garantia_id);
CREATE INDEX IF NOT EXISTS idx_alerta_caso_estado ON alerta_seguimiento(caso_id, estado);

CREATE TABLE IF NOT EXISTS entrada_bitacora (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  caso_id INTEGER NOT NULL REFERENCES caso_oncologico(id) ON DELETE RESTRICT,
  identificador TEXT NOT NULL UNIQUE,
  punto_contacto_normado TEXT,
  fecha_contacto TEXT NOT NULL,
  canal_contacto TEXT NOT NULL,
  interlocutor TEXT,
  motivo_contacto TEXT,
  resumen_interaccion TEXT NOT NULL,
  acuerdos_establecidos TEXT,
  responsable_registro TEXT NOT NULL,
  estado_contacto TEXT NOT NULL,
  es_adenda INTEGER NOT NULL DEFAULT 0
);
