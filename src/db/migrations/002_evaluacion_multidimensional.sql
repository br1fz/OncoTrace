-- 002_evaluacion_multidimensional.sql - Esquema derivado de MD-01.D y MD-01.A (HU-02)

CREATE TABLE IF NOT EXISTS cuidador_autorizado (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  paciente_id INTEGER NOT NULL REFERENCES paciente(id) ON DELETE RESTRICT,
  run_cuidador TEXT NOT NULL,
  nombre_completo TEXT NOT NULL,
  parentesco TEXT NOT NULL,
  telefono_contacto TEXT NOT NULL,
  autorizacion_vigente INTEGER NOT NULL DEFAULT 1,
  fecha_registro_autorizacion TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS evaluacion_multidimensional (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  caso_id INTEGER NOT NULL REFERENCES caso_oncologico(id) ON DELETE RESTRICT,
  identificador TEXT NOT NULL UNIQUE,
  fecha_evaluacion TEXT NOT NULL,
  puntaje_clinico_funcional INTEGER NOT NULL,
  puntaje_psicoemocional INTEGER NOT NULL,
  escala_zarit_cuidador INTEGER,
  nivel_vulnerabilidad TEXT NOT NULL,
  profesional_evaluador TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS dominio_valoracion (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  evaluacion_id INTEGER NOT NULL REFERENCES evaluacion_multidimensional(id) ON DELETE RESTRICT,
  tipo_dominio TEXT NOT NULL,
  descripcion_hallazgo TEXT NOT NULL,
  requiere_derivacion INTEGER NOT NULL DEFAULT 0,
  especialidad_derivada TEXT,
  prevision_salud TEXT,
  situacion_laboral TEXT
);
