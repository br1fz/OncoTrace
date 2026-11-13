-- 004_bitacora_puntos_normados.sql - Bitácora de acompañamiento, puntos normados y adendas inmutables (HU-03 / RF-03)

-- 1. Ampliar entrada_bitacora para programación de próximo contacto y adendas inmutables
ALTER TABLE entrada_bitacora ADD COLUMN fecha_proximo_contacto TEXT;
ALTER TABLE entrada_bitacora ADD COLUMN objetivo_proximo_contacto TEXT;
ALTER TABLE entrada_bitacora ADD COLUMN entrada_original_id TEXT;

-- 2. Ampliar alerta_seguimiento para vincular origen y cumplimiento de puntos normados y búsqueda activa
ALTER TABLE alerta_seguimiento ADD COLUMN hito_origen_id INTEGER REFERENCES hito_asistencial(id);
ALTER TABLE alerta_seguimiento ADD COLUMN entrada_origen_id INTEGER REFERENCES entrada_bitacora(id);
ALTER TABLE alerta_seguimiento ADD COLUMN entrada_cumplimiento_id INTEGER REFERENCES entrada_bitacora(id);

-- 3. Índices para optimizar consultas de bitácora y alertas
CREATE INDEX IF NOT EXISTS idx_bitacora_caso_fecha ON entrada_bitacora(caso_id, fecha_contacto DESC);
CREATE INDEX IF NOT EXISTS idx_bitacora_original ON entrada_bitacora(entrada_original_id);
CREATE INDEX IF NOT EXISTS idx_alerta_hito_origen ON alerta_seguimiento(hito_origen_id);
CREATE INDEX IF NOT EXISTS idx_alerta_entrada_origen ON alerta_seguimiento(entrada_origen_id);
CREATE INDEX IF NOT EXISTS idx_alerta_entrada_cumplimiento ON alerta_seguimiento(entrada_cumplimiento_id);
