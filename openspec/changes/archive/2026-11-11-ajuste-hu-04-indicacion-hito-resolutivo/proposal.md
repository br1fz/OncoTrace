# Proposal — Indicación de hito o contacto resolutivo en ficha del caso (Ajuste HU-04)

## Why

Durante la validación de la historia HU-04 en el sistema (vuelta 2, informe `VAL-HU-04-2.md`), se identificó la observación `OBS-1` (brecha de especificación menor): en la ficha clínica individual del paciente (`/casos/:numeroCaso`), la tarjeta de una alerta en estado `Resuelta` muestra el distintivo de estado y el hito resolutivo se lista en la línea de tiempo cronológica, pero la tarjeta de alerta no indicaba explícitamente cuál hito o contacto la resolvió.

Para asegurar la trazabilidad clínica completa entre alertas e intervenciones asistenciales, los artefactos de especificación (`Documentos/07-criterios-aceptacion.md` en `HU-04-ESC-06`, `04-historias-usuario.md` en `HU-04-CA5`, `10-diagramas-secuencia.md` en `DSS-04` y `12-trazabilidad.md`) fueron actualizados estableciendo que la ficha del caso debe indicar explícitamente el hito o contacto que resolvió la alerta, junto con su tipo y fecha.

## What Changes

- En `RepositorioOncologico.listarAlertasPorCasoId()` (`src/dominio/repositorios.ts`):
  - Incorporar un `LEFT JOIN hito_asistencial h ON h.id = a.hito_cumplimiento_id` para obtener el tipo (`h.tipo as tipoHitoCumplimiento`) y la fecha (`h.fecha_ocurrencia as fechaHitoCumplimiento`) del hito que resolvió la alerta.
- En la vista de la ficha del caso (`src/vistas/caso.ejs`):
  - En la tarjeta de alerta de seguimiento, cuando el estado sea `Resuelta`, mostrar una indicación visible con el tipo y fecha del hito o contacto resolutivo: `Resolución: <tipoHito> (<fechaOcurrencia>)`.
- En las pruebas automatizadas (`tests/hu-04-alertas.test.ts`):
  - Agregar una prueba de integración HTTP que verifique que al resolver una alerta (GES o inactividad) y consultar la ficha del caso (`GET /casos/:numeroCaso`), la tarjeta de la alerta muestre explícitamente el tipo y la fecha del hito resolutivo.

## Capabilities

### Modified Capabilities
- `alertas-seguimiento`: El escenario `HU-04-ESC-06` incorpora la indicación observable en la ficha del caso del hito o contacto que resolvió la alerta, con su tipo y fecha.

## Impact

- **Historia:** HU-04 (ajuste post-validación). **Actividad TO-BE:** TB-04. **Caso de uso:** CU-06. **Requisito:** RF-04.
- **Archivos de código afectados:** `src/dominio/repositorios.ts`, `src/vistas/caso.ejs`, `tests/hu-04-alertas.test.ts`.
- **Artefactos ya actualizados:** `07-criterios-aceptacion.md` (ESC-06), `04-historias-usuario.md` (CA5), `10-diagramas-secuencia.md` y `diagramas/diagramas-secuencia.puml` (DSS-04), `diagramas/DSS-04-HU-04.png`, `12-trazabilidad.md` y `.cin324/historias/HU-04.md`.
