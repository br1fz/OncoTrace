# Design — Evaluación multidimensional y estratificación por dominios (HU-02)

## Context & Scope

HU-02 introduce en OncoTrace la capacidad de valorar integralmente las dimensiones biopsicosociales del paciente oncológico según la actividad TB-02 y el caso de uso CU-10.
El diseño respeta el stack definido (TypeScript, Express 4, EJS, better-sqlite3) e implementa las 6 decisiones técnicas acordadas (D1 a D6).

## Decisiones Técnicas Acordadas (D1 a D6)

1. **D1 — Algoritmo de cálculo de vulnerabilidad global:**
   Puntaje aditivo normalizado de 0 a 6 puntos:
   - **ECOG (Clínico-funcional):** 0 o 1 = 0 pts; 2 = 1 pt; 3 o 4 = 2 pts.
   - **Vulnerabilidad socioeconómica:** Baja = 0 pts; Media = 1 pt; Alta = 2 pts.
   - **Soporte de cuidador (Escala Zarit):**
     - Sin sobrecarga (Zarit $\le$ 46) = 0 pts.
     - Sobrecarga leve (Zarit 47–56) = 1 pt.
     - Sobrecarga intensa/severa (Zarit > 56) o paciente sin cuidador/red = 2 pts.
   - **Estratificación final:**
     - 0 a 2 puntos: `Bajo`
     - 3 a 4 puntos: `Medio`
     - 5 a 6 puntos: `Alto`

2. **D2 — Atributos socioeconómicos (Opción A):**
   Se encapsulan en la base de datos dentro de `dominio_valoracion` agregando las columnas `prevision_salud` y `situacion_laboral`, sin alterar `Documentos/` ni `diagramas/`.

3. **D3 — Entidad Cuidador:**
   Reutilización de la clase del dominio `CuidadorAutorizado`, persistida en la tabla `cuidador_autorizado` asociada a `Paciente` (`paciente_id`), permitiendo registrar RUN, nombre, parentesco, teléfono y vigencia.

4. **D4 — Tratamiento de Zarit > 56 y sobrecarga severa:**
   - Si `escalaZaritCuidador > 56`, el sistema crea de inmediato una `AlertaSeguimiento` con `tipo = 'Sobrecarga de cuidador'`, `prioridad = 'Alta'`, `estado = 'Pendiente'`.
   - Exige que el dominio cuidador tenga `requiereDerivacion = true` y `especialidadDerivada = 'Servicio Social'` (o la intervención de apoyo formal indicada por la gestora).

5. **D5 — Inmutabilidad y Log de Auditoría:**
   - La tabla `evaluacion_multidimensional` opera exclusivamente mediante `INSERT`. Nunca se ejecuta `UPDATE` ni `DELETE` sobre registros históricos.
   - Si se requiere una rectificación o revaluación, se ingresa una nueva evaluación con su estampa de tiempo y evaluador responsable.
   - La ficha del caso y el tablero Kanban consultan la evaluación más reciente (`ORDER BY fecha_evaluacion DESC, id DESC`), mostrando en la ficha un historial completo con fines de auditoría y trazabilidad clínica (Ley N° 20.584).

6. **D6 — Normalización de nombres de dominios:**
   Los seis dominios se modelan con el enumerado canónico:
   - `CLINICO_FUNCIONAL`
   - `PSICOEMOCIONAL`
   - `CUIDADOR`
   - `SOCIOECONOMICO`
   - `ESPIRITUAL`
   - `COMPRENSION_DIAGNOSTICA`

## Esquema de Base de Datos (Migración 002)

Archivo: `src/db/migrations/002_evaluacion_multidimensional.sql`

```sql
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
  puntaje_clinico_funcional INTEGER NOT NULL, -- ECOG (0-4)
  puntaje_psicoemocional INTEGER NOT NULL,
  escala_zarit_cuidador INTEGER,
  nivel_vulnerabilidad TEXT NOT NULL,         -- 'Bajo' | 'Medio' | 'Alto'
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
```

## Arquitectura de Software

```
src/
├── dominio/
│   ├── caso-oncologico.ts   (mantiene tipos de HU-01)
│   ├── evaluacion.ts        (tipos EvaluacionMultidimensional, DominioValoracion, CuidadorAutorizado, cálculo de vulnerabilidad)
│   └── repositorios.ts      (consultas y transacciones de persistencia para evaluaciones)
├── servicios/
│   ├── seguimiento.ts       (actualiza marcadorRiesgo con la última evaluación)
│   └── evaluacion.ts        (servicio CU-10: validación ECOG, cálculo D1, alerta D4, transacción)
├── rutas/
│   ├── seguimiento.ts       (rutas HU-01)
│   └── evaluacion.ts        (GET nueva evaluación, POST registro evaluación)
├── vistas/
│   ├── evaluacion-nueva.ejs (formulario estructurado por 6 dominios)
│   ├── caso.ejs             (sección de evaluación vigente, histórico de evaluaciones y botón '+ Nueva evaluación')
│   └── tablero.ejs          (etiquetas de riesgo con estilo según Bajo / Medio / Alto)
└── db/
    ├── migrations/002_evaluacion_multidimensional.sql
    └── seed.ts              (datos semilla con evaluaciones iniciales para casos de prueba)
```

## Pruebas de Aceptación (Vitest)

Archivo: `tests/hu-02-evaluacion.test.ts`
- Pruebas unitarias de la fórmula de estratificación y validaciones de borde (ECOG 0-4, Zarit 0-88, Zarit 56 vs 57).
- Pruebas de integración HTTP supertest para los 3 escenarios Gherkin:
  - `HU-02-ESC-01`: Registro nominal, cálculo de vulnerabilidad y sugerencias.
  - `HU-02-ESC-02`: Sobrecarga severa (Zarit > 56), emisión de alerta a Servicio Social y exigencia de solicitud formal.
  - `HU-02-ESC-03`: Rechazo de guardado ante omisión o invalidez de ECOG.
  - Inmutabilidad: múltiples evaluaciones para un caso no sobreescriben la anterior y el tablero muestra la última.
  - Control de rol: usuario con cookie `Médico tratante` no puede registrar evaluaciones (operación reservada a Gestora UGCO).
