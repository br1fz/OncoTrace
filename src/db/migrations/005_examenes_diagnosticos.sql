-- 005_examenes_diagnosticos.sql - Exámenes diagnósticos, consolidación e indexación automática y alertas críticas (HU-05 / RF-05)

-- 1. Tabla de solicitudes de exámenes diagnósticos vinculadas al caso oncológico
CREATE TABLE IF NOT EXISTS orden_examen (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  caso_id INTEGER NOT NULL REFERENCES caso_oncologico(id) ON DELETE RESTRICT,
  identificador TEXT NOT NULL UNIQUE,
  tipo_estudio TEXT NOT NULL,
  fecha_solicitud TEXT NOT NULL
);

-- 2. Tabla de estudios e informes diagnósticos (validados, externos o con excepción)
CREATE TABLE IF NOT EXISTS estudio_diagnostico (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  orden_examen_id INTEGER REFERENCES orden_examen(id) ON DELETE RESTRICT,
  caso_id INTEGER REFERENCES caso_oncologico(id) ON DELETE RESTRICT,
  identificador_informe TEXT NOT NULL,
  run_informado TEXT NOT NULL,
  tipo_estudio TEXT NOT NULL,
  origen TEXT NOT NULL, -- 'LIS' | 'PACS' | 'Compra externa'
  fecha_informe TEXT NOT NULL,
  estado_validacion TEXT NOT NULL, -- 'Validado' | 'Pendiente'
  estado_recepcion TEXT NOT NULL, -- 'Solicitado' | 'Pendiente de validación' | 'Observado por identificación' | 'Incorporado' | 'Incorporado con hallazgo crítico'
  hallazgo_critico INTEGER NOT NULL DEFAULT 0,
  archivo_adjunto TEXT,
  fecha_registro TEXT NOT NULL
);

-- 3. Ampliar alerta_seguimiento para vincular origen directo con estudio diagnóstico (MD-01.B)
ALTER TABLE alerta_seguimiento ADD COLUMN estudio_origen_id INTEGER REFERENCES estudio_diagnostico(id);

-- 4. Índices para optimizar consultas de exámenes, bandeja de excepciones y trazabilidad de alertas
CREATE INDEX IF NOT EXISTS idx_orden_examen_caso ON orden_examen(caso_id);
CREATE INDEX IF NOT EXISTS idx_estudio_caso ON estudio_diagnostico(caso_id);
CREATE INDEX IF NOT EXISTS idx_estudio_orden ON estudio_diagnostico(orden_examen_id);
CREATE INDEX IF NOT EXISTS idx_estudio_estado ON estudio_diagnostico(estado_recepcion);
CREATE INDEX IF NOT EXISTS idx_alerta_estudio_origen ON alerta_seguimiento(estudio_origen_id);

