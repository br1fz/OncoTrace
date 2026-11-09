# Proposal — Tablero de trazabilidad y línea de tiempo clínica por etapas (HU-01)

## Why

Hoy la UGCO sigue cada caso oncológico en planillas locales y consulta antecedentes en múltiples sistemas, por lo que conocer la etapa de un paciente y sus plazos exige búsquedas manuales (AS-01 y AS-04). HU-01 implementa la actividad TB-01 del TO-BE: centralizar el seguimiento en un tablero por etapas y una línea de tiempo única, para que la gestora y el médico tratante vean el estado del caso y sus hitos sin depender de registros dispersos.

## What Changes

- Se crea el **tablero de seguimiento** con las 8 etapas de la trayectoria oncológica, donde cada caso aparece como tarjeta con RUN, nombre, especialidad, diagnóstico o sospecha CIE-10, etapa actual, último hito, semáforo de alertas pendientes y marcador «Riesgo».
- Se agrega la **ficha del caso** con la línea de tiempo cronológica de hitos (fecha, tipo y días transcurridos desde el hito anterior).
- Se agrega el **registro de hitos asistenciales** (tipo, fecha de ocurrencia, profesional y rol; fecha y hora de registro automáticas), con trazabilidad de usuario y rol.
- Se implementan las transiciones de `CasoOncologico` de EST-03 previstas para esta historia: `Etapificación → Tratamiento` al registrar el inicio de tratamiento con resolución de comité previa, y la resolución de comité como hito que **no** cambia la etapa ni crea una etapa «Comité».
- Se arranca la aplicación web (primer cambio del proyecto): estructura TypeScript + Express + EJS, SQLite con migraciones y datos de ejemplo de casos ficticios en distintas etapas.
- Se incluye un selector de rol de demostración (Gestor/a UGCO / Médico tratante), sin autenticación real.

**Fuera de alcance:** cálculo del índice de riesgo y niveles Alto/Medio/Bajo (HU-02); generación de alertas GES/inactividad (HU-04) — aquí solo se leen alertas existentes; alta o edición de pacientes y casos (llegarán desde el flujo de derivaciones); transiciones de etapa distintas de las indicadas; integraciones con LIS, PACS, HCVB o MINSAL; requisitos no funcionales (RNF-02, RNF-03) y autenticación real.

## Capabilities

### New Capabilities
- `seguimiento-oncologico`: consulta del tablero por las ocho etapas, ficha del caso con línea de tiempo de hitos y registro de hitos asistenciales con sus transiciones de etapa.

### Modified Capabilities

Ninguna: `openspec/specs/` está vacío y esta es la primera capacidad del proyecto.

## Impact

- **Historia:** HU-01. **Actividad TO-BE:** TB-01 — Monitoreo en tablero Kanban y timeline clínico. **Caso de uso:** CU-05 — Dar seguimiento al caso oncológico (actores: Gestor/a UGCO y Médico tratante). **Requisito:** RF-01.
- **Código nuevo:** estructura del proyecto (`src/app.ts`, `src/server.ts`, `src/db/`, `src/dominio/`, `src/servicios/`, `src/rutas/`, `src/vistas/`), migraciones SQL, datos de ejemplo, pruebas y `README.md`.
- **Datos:** tablas derivadas de `Paciente`, `CasoOncologico`, `HitoAsistencial`, `ResolucionComite` y `AlertaSeguimiento` (lectura).
- **Dependencias:** Express, EJS, `better-sqlite3`, `tsx`, TypeScript, Vitest y supertest.
- **Sistemas externos:** ninguno en esta historia; no hay integraciones que simular.
