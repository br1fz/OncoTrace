# Design — Consistencia temporal e inmutabilidad de hitos (Ajuste HU-01)

## Contexto técnico y arquitectura

OncoTrace opera con SQLite (`data/app.db`) utilizando `better-sqlite3@13` con transacciones atómicas. El registro de hitos asistenciales se gestiona a través de `ServicioSeguimiento.registrarHito()`, el cual valida las reglas del dominio antes de persistir en la tabla `hito_asistencial` y evaluar transiciones en `caso_oncologico`.

## Decisiones de diseño

### 1. Validación de fechas en `ServicioSeguimiento`
Las fechas en la base de datos se almacenan en formato ISO estándar `YYYY-MM-DD`.
Al registrar un hito:
1. Se obtiene la fecha actual en formato local/ISO (`hoy = new Date().toISOString().split('T')[0]`).
2. **Guarda 1 (Fecha no futura):** Si `dto.fechaOcurrencia > hoy`, la operación aborta retornando `{ ok: false, error: 'La fecha de ocurrencia no puede ser futura' }`.
3. **Guarda 2 (No regresión cronológica):** Se consultan los hitos existentes del caso ordenados por fecha. Si existen hitos y `dto.fechaOcurrencia < ultimoHito.fechaOcurrencia`, la operación aborta retornando `{ ok: false, error: 'La fecha de ocurrencia no puede ser anterior al último hito registrado' }`.

### 2. Atributo `max` en el formulario HTML
En `src/vistas/hito-nuevo.ejs`, el campo `<input type="date" id="fechaOcurrencia" name="fechaOcurrencia">` se parametriza con `max="<%= fechaHoy %>"`, donde `fechaHoy` se provee desde la ruta `GET /casos/:numeroCaso/hitos/nuevo` para restringir el selector de fechas en navegadores compatibles.

### 3. Pruebas automatizadas en Vitest
Se agregan dos pruebas específicas en `tests/hu-01-tablero.test.ts` usando `supertest`:
- `POST /casos/:numeroCaso/hitos` con fecha del día siguiente responde 400 y contiene `"La fecha de ocurrencia no puede ser futura"`.
- `POST /casos/:numeroCaso/hitos` con fecha anterior a un hito ya registrado responde 400 y contiene `"La fecha de ocurrencia no puede ser anterior al último hito registrado"`.

## Integraciones externas
No aplica.
