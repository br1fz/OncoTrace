# Proposal — Consistencia temporal e inmutabilidad de hitos (Ajuste HU-01)

## Why

Durante la validación de HU-01 en el sistema (vuelta 2, informe `VAL-HU-01-2.md`), se detectó la observación `OBS-1` (brecha de especificación): el sistema permitía registrar hitos con fechas futuras o inconsistentes con la cronología del caso. Para preservar la integridad clínica y legal de la trayectoria oncológica (Ley N° 20.584, RF-01 y CA7), un hito asistencial representa un hecho clínico ya acontecido; por tanto, su fecha de ocurrencia no puede ser posterior a hoy ni anterior a la del último hito registrado en el caso.

## What Changes

- En `ServicioSeguimiento.registrarHito()`:
  - Validar que la fecha de ocurrencia sea igual o anterior a la fecha actual (`<= hoy`). Si es posterior, responder con error 400 y mensaje `"La fecha de ocurrencia no puede ser futura"`.
  - Validar que la fecha de ocurrencia sea igual o posterior a la del último hito asistencial registrado del caso (`>= ultimoHito.fechaOcurrencia`). Si es anterior, responder con error 400 y mensaje `"La fecha de ocurrencia no puede ser anterior al último hito registrado"`.
- En la interfaz web (`src/vistas/hito-nuevo.ejs`):
  - Añadir el atributo `max` dinámico (`max="YYYY-MM-DD"`) al campo de fecha de ocurrencia con la fecha de hoy, como ayuda visual en el navegador.
- En las pruebas automatizadas (`tests/hu-01-tablero.test.ts`):
  - Agregar pruebas automatizadas que verifiquen el cumplimiento estricto de `HU-01-ESC-04` (rechazo de fecha futura) y `HU-01-ESC-05` (rechazo de fecha anterior al último hito).

**Fuera de alcance:** Modificación o eliminación de hitos ya registrados (los hitos son inmutables); otras transiciones de etapa o generación de alertas preventivas (HU-04).

## Capabilities

### Modified Capabilities
- `seguimiento-oncologico`: Se amplía el requisito de registro de hitos asistenciales incorporando la regla de consistencia temporal (límites superior e inferior) y los escenarios `HU-01-ESC-04` y `HU-01-ESC-05`.

## Impact

- **Historia:** HU-01 (ajuste post-validación). **Actividad TO-BE:** TB-01. **Caso de uso:** CU-05. **Requisito:** RF-01.
- **Archivos de código afectados:** `src/servicios/seguimiento.ts`, `src/vistas/hito-nuevo.ejs`, `tests/hu-01-tablero.test.ts`.
- **Artefactos de requisitos ya actualizados:** `03-requisitos.md` (RF-01), `04-historias-usuario.md` (CA7), `07-criterios-aceptacion.md` (ESC-04 y ESC-05), `09-casos-de-uso.md` (CU-05), `10-diagramas-secuencia.md` y `diagramas-secuencia.puml` (DSS-03), `12-trazabilidad.md`.
