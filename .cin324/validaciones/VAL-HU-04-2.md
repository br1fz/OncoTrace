# Informe de validación — HU-04 · Motor de alertas preventivas de plazos GES e inactividad

**Fecha:** 2026-11-11 · **Cambio de OpenSpec validado:** `hu-04-motor-alertas-ges-inactividad` · **Estado:** verificado en el sistema — HU-04 cerrada (ajuste OBS-1 comprobado en la ficha)

## Resumen

| Obs. | Lo que observaste | Tipo | Artefacto principal a modificar | También revisar |
|---|---|---|---|---|
| OBS-1 | La ficha muestra la alerta Resuelta y el hito en la línea de tiempo, pero la tarjeta de alerta no indica cuál hito la resolvió; sugieres «✓ Resuelta con hito asistencial #ID» | B (brecha de especificación menor) | `07-criterios-aceptacion.md`, HU-04-ESC-06 | `04` (CA5), `10` (DSS-04), `08` (relación alerta–hito), `12` |
| OBS-2 | En el panel, las alertas Resueltas ocultan los botones, pero los `<div>` de los modales siguen en el HTML | E (detalle de implementación, sin respaldo en artefactos) | — | — |

**Lo que sí funcionó:** botón único en el tablero; evaluación explícita con banner y sin navegar; idempotencia (0 alertas nuevas); umbral GES de 5 días y exclusión a 6; alertas de inactividad con días corridos; gestión con confirmación y estado **En gestión**; resolución con confirmación y distintivo **Resuelta (≤ 14 h)**; cierre **No aplica** con motivo y responsable; CSV que excluye Resuelta y No aplica; rol Médico en solo lectura con 403 en POST; rechazo 400 del cierre incompleto.

## Detalle por observación

### OBS-1 — Vínculo explícito entre la alerta resuelta y su hito

- **Lo que dijiste:** la tarjeta muestra el badge **Resuelta** y el hito aparece en la línea de tiempo, pero la alerta no dice qué hito la resolvió; sería más explícito mostrar «✓ Resuelta con hito asistencial #ID», como ya ocurre con el motivo de cierre.
- **Qué dicen hoy los artefactos:** HU-04-ESC-06 (`07-criterios-aceptacion.md`, líneas 116-123) exige que «se conserva la relación entre la alerta y el hito o contacto que la resolvió», pero no pide que esa relación se **muestre**. La CA5 (`04`, línea 125) tampoco lo pide. El modelo sí conserva la relación (`08-modelo-dominio.md`, asociación «justifica cierre»).
- **Diagnóstico:** **B**. La relación se conserva y el sistema la usa, pero no hay un resultado observable que obligue a mostrarla. No es un defecto: el código cumple lo escrito.
- **Qué debes decidir:** si la ficha del caso debe indicar explícitamente el hito o contacto que resolvió la alerta, y cómo se identifica (tipo y fecha, o número de registro).
- **Para mantener la consistencia:**
  - `07-criterios-aceptacion.md`: agregar a ESC-06 un resultado observable sobre la ficha del caso.
  - `04-historias-usuario.md`: mención en CA5.
  - `10-diagramas-secuencia.md`: la respuesta de resolución.
  - `12-trazabilidad.md`: al final.

### OBS-2 — Modales ocultos en el DOM del panel

- **Lo que dijiste:** en `/alertas`, las alertas Resueltas ocultan los botones, pero los `<div>` de los modales siguen en el HTML; sugieres no renderizarlos cuando el estado es Resuelta.
- **Qué encontré:** es correcto. En `src/vistas/alertas.ejs`, los botones se ocultan para Resuelta (línea 157), pero los modales se renderizan dentro del bloque de rol (línea 177) sin mirar el estado. El comportamiento visible es correcto: están en `display: none`.
- **Diagnóstico:** **E**. Ningún artefacto del curso especifica el marcado HTML ni qué elementos se renderizan. Es una limpieza de implementación, no un requisito. No hay artefacto que cambiar y no se toca el código.
- **Qué hacer:** dejarlo registrado como mejora de implementación. Si se quisiera exigir, tendría que ser un requisito no funcional en `06-atributos-calidad.md`, y esos no se implementan en este ejercicio.

## Orden sugerido de edición

Solo para OBS-1:

1. `07-criterios-aceptacion.md` — HU-04-ESC-06.
2. `04-historias-usuario.md` — HU-04-CA5.
3. `10-diagramas-secuencia.md` — DSS-04.
4. `12-trazabilidad.md` — al final.

## Decisiones tomadas en esta validación

- **OBS-1:** aprobado y aplicado en ESC-06, CA5, DSS-04 (Mermaid y PlantUML, con imagen reexportada), el punto 7 de trazabilidad y la ficha HU-04.
- **OBS-2:** se descarta como cambio de artefactos (tipo E); queda como mejora de implementación para futuras entregas.

## Cómo sabrás que terminaste

- [x] El flujo de HU-04 se verificó en el sistema (9 escenarios).
- [x] No hay observaciones bloqueantes.
- [x] OBS-1 aplicado y artefactos coherentes (07, 04, 10, 12, .puml y ficha HU-04 actualizados).
- [x] OBS-2 clasificada como fuera de alcance de los artefactos.
- [x] Artefactos actualizados y coherentes; queda regenerar la aplicación y validar de nuevo.

## Siguiente paso

OBS-1 quedó aplicado. Haz commit de los artefactos (incluido este informe) y ejecuta `/cin324-generar-app`; cuando el sistema muestre en la ficha el hito o contacto con su tipo y fecha, vuelve a `/cin324-validar-sistema` para la tercera vuelta. Después podrás continuar con HU-03, que aún no está generada.
