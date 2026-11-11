# Informe de validación — HU-04 · Motor de alertas preventivas de plazos GES e inactividad

**Fecha:** 2026-11-11 · **Cambio de OpenSpec validado:** `hu-04-motor-alertas-ges-inactividad` · **Estado:** artefactos actualizados, listos para regenerar la aplicación

## Resumen

| Obs. | Lo que observaste | Tipo | Artefacto principal a modificar | También revisar |
|---|---|---|---|---|
| OBS-1 | «Evaluar alertas ahora» recarga pero no confirma ni lleva al panel; hay dos botones que parecen hacer lo mismo | B (brecha de especificación) + E (control duplicado) | `07-criterios-aceptacion.md`, HU-04-ESC-01 | `04-historias-usuario.md` (CA4), `10-diagramas-secuencia.md` (DSS-04), `09-casos-de-uso.md` (CU-06), `12-trazabilidad.md` |
| OBS-2 | Solo se llega a `/alertas` por URL o por «Panel de Alertas» | E/F (uso o apariencia) | — | — |
| OBS-3 | Gestionó y la alerta no quedó visible; esperaba un mensaje de «ya está resuelta» | F (expectativa/uso) + B (falta confirmación y escenario de inactividad) | `07-criterios-aceptacion.md`, HU-04-ESC-05 | `04` (CA5), `10` (DSS-04), `12` |
| OBS-4 | Al «Cumplir» desaparece; quería un mensaje y verla resuelta al menos 14 horas | B (mensaje y escenario faltante) + A (regla nueva de visibilidad) | `07-criterios-aceptacion.md`, HU-04-ESC-06 | `04` (CA5), `10` (DSS-04), `11` (EST-01), `08` (fecha de resolución), `12` |
| OBS-5 | El cierre por causa documentada funcionó | ✔ sin observación | — | — |
| OBS-6 | La exportación CSV funcionó y quedó bien organizada | ✔ sin observación | — | — |

**Lo que sí funcionó:** la evaluación genera alertas GES e inactividad; los umbrales de 5 días hábiles y más de 15 días corridos; el rol Médico no ve las acciones de gestión; el cierre por causa documentada (ESC-07); la exportación CSV (ESC-08); la bitácora de gestión y la transición a **En gestión** mientras la alerta sigue activa.

## Detalle por observación

### OBS-1 — El botón evalúa, pero no da feedback ni abre el panel

- **Lo que dijiste:** «no sucede nada. Carga algo, pero no redirige a nada»; y que debería haber un solo botón que evalúe y lleve a `/alertas`.
- **Qué dicen hoy los artefactos:** el flujo 1 de la ficha de HU-04 define la evaluación al abrir el tablero o la ficha y con la acción explícita «Evaluar alertas ahora» (`POST /alertas/evaluar`). DSS-04 (`10-diagramas-secuencia.md`, líneas 112-115) dice que OncoTrace **notifica** a la gestora «alerta GES con caso, tipo y días restantes». HU-04-ESC-01 (`07-criterios-aceptacion.md`, líneas 68-74) pide que la gestora pueda identificar la alerta, pero no define qué debe ver al pulsar el botón ni si debe navegar al panel.
- **Diagnóstico:** **B**. La evaluación sí ocurre: en la prueba se crearon 1 alerta GES y 4 de inactividad, y `/alertas` las muestra. El POST redirige a la página donde estabas (`src/rutas/alertas.ts`), sin mensaje. Además, el tablero ya evalúa al abrirse (`src/servicios/seguimiento.ts` llama a `evaluarAlertas` en cada carga), así que al pulsar el botón normalmente no hay alertas nuevas: de ahí la sensación de que «no hace nada». **E** por la duplicación de controles «Evaluar alertas ahora» + «Panel de Alertas».
- **Qué debes modificar:** que la acción «Evaluar alertas ahora» evalúe, muestre un mensaje con el resultado («Evaluación completada: N alertas nuevas») y abra `/alertas`; y que el tablero ofrezca una sola acción, sin el botón separado «Panel de Alertas».
- **Para mantener la consistencia:** `04` CA4; `10` DSS-04 (mensaje de notificación); `09` CU-06 (flujo); `12` al final.

### OBS-2 — Acceso a `/alertas`

- **Lo que dijiste:** solo se entra por URL o por «Panel de Alertas».
- **Qué encontré:** hay tres entradas reales: el enlace **«Alertas»** del encabezado (`src/vistas/parciales/header.ejs`, línea 50), el botón **«Panel de Alertas»** del tablero (`tablero.ejs`, líneas 19-20) y **«Ver panel general →»** en la ficha del caso (`caso.ejs`, línea 212). Si el enlace del encabezado no respondió al pulsarlo, es un posible defecto de entorno (F).
- **Diagnóstico:** **E/F**: visibilidad o uso, no requisitos. Ningún artefacto especifica cuántos enlaces debe haber. La simplificación de OBS-1 resuelve la duplicación.

### OBS-3 — «Gestionar» y la alerta que no viste

- **Lo que dijiste:** gestionó, ingresó datos y «desapareció»; esperaba un mensaje de «alerta gestionada» que confirmara que ya está resuelta.
- **Qué encontré en la base:** hay una entrada de bitácora para `CASO-2026-004` («Se contacta para gestionar una consulta presencial») y, 14 segundos después, un hito «Atención clínica resolutiva» que dejó la alerta de ese caso en **Resuelta**. No quedó ninguna alerta **En gestión**. La alerta no desapareció por un error al gestionar: se resolvió después con «Cumplir».
- **Qué dicen los artefactos:** ESC-05 (`07`, líneas 108-113) es clara: gestionar deja la alerta **En gestión**, «permanece disponible para seguimiento» y no acredita cumplimiento. ESC-06 es la que resuelve con un hito. Ambos escenarios hablan de «una garantía GES pendiente»: no hay escenario para gestionar o resolver una alerta de inactividad, que es la que se usó.
- **Diagnóstico:** **F** (la regla se cumplió; «Gestionar» y «Cumplir» son pasos distintos) + **B** (falta el mensaje de confirmación y falta el escenario de inactividad). No es un defecto del sistema.
- **Qué debes modificar:** mantener la regla (Gestionar = **En gestión**; Cumplir = **Resuelta**) y agregar a ESC-05 un resultado observable como «el sistema confirma que la alerta quedó En gestión y que la garantía sigue pendiente». Completar el escenario para alertas de inactividad.
- **Para mantener la consistencia:** `04` CA5, `10` DSS-04 (mensaje de respuesta), `12`; escenario de inactividad.

### OBS-4 — «Cumplir» y la visibilidad de la alerta resuelta

- **Lo que dijiste:** al cumplir desapareció; querías un mensaje de confirmación y que la alerta apareciera como **Resuelta** al menos 14 horas (durante la jornada laboral) para poder revisarla.
- **Qué encontré en la base:** las dos alertas resueltas eran de **inactividad** (`CASO-2026-004` y `CASO-2026-002`), no de una garantía GES. El sistema registró un hito «Atención clínica resolutiva» y las dejó **Resuelta**. La alerta GES (`GES-2026-002`) sigue **Pendiente** y su garantía sigue **Pendiente**: el cumplimiento de una garantía GES aún no se probó.
- **Qué dicen los artefactos:** ESC-06 (`07`, líneas 115-119) pide que la alerta quede **Resuelta** y conserve el vínculo con el hito; ESC-08 (líneas 128-133) excluye las Resueltas del CSV. El panel muestra solo **Pendiente** y **En gestión**; la ficha sí muestra la alerta Resuelta y el hito. EST-01 (`11`, líneas 30-34) permite resolver por «registro de resolución, cumplimiento o contacto», no solo por garantía GES; el Gherkin no tiene ese escenario.
- **Diagnóstico:** **B** por el mensaje de confirmación y el escenario de inactividad faltante; **A** por la regla nueva de mantener visible la alerta resuelta durante 14 horas. En la interfaz, «Cumplir» y «Garantía: Asociada» se muestran también para alertas de inactividad: conviene llamarlo **«Resolver»** en ese caso (vocabulario, S9).
- **Qué debes modificar:** (1) mensaje de confirmación al resolver; (2) regla de visibilidad de 14 horas desde la resolución, en el panel, y luego solo en la ficha; (3) escenario para resolver una alerta de inactividad; (4) el CSV sigue excluyendo las Resueltas (ESC-08).
- **Para mantener la consistencia:** `04` CA5, `10` DSS-04, `11` EST-01 (nota de visibilidad, sin estado nuevo), `08` (verificar si la fecha de resolución se toma del hito o si hace falta un atributo), `09` CU-06 (vocabulario), `12`.

### OBS-5 — Cierre por causa documentada

- Correcto: la alerta pasa a **No aplica** y conserva motivo, fecha y responsable (ESC-07 y EST-01). No hay nada que cambiar.

### OBS-6 — Exportación CSV

- Correcto: descarga el archivo, incluye caso, garantía, días y estado, y excluye Resuelta/No aplica (ESC-08). No hay nada que cambiar.

## Hallazgo de datos (no es una observación de requisitos)

En `data/app.db` hay una alerta antigua **«Vencimiento de plazo GES (Etapificación)»** (id 1, generada el 2026-10-25) **sin garantía asociada** y aún **Pendiente**. La semilla actual no la crea; parece un dato residual de una versión anterior. Contradice la regla del modelo de que «las alertas GES identifican su garantía» (`08-modelo-dominio.md`) y ensucia el panel con una alerta GES sin días restantes.

- **Qué hacer (F):** antes de la próxima validación, detener la app, borrar `data/app.db` y volver a ejecutar `npm run db:seed`. No se modifica código ni `openspec/`.

## Decisiones tomadas en esta validación

- **OBS-3:** se mantiene la regla actual: «Gestionar» deja la alerta **En gestión** y sigue visible; «Cumplir/Resolver» la deja **Resuelta**. Se agrega el mensaje de confirmación y el escenario para alertas de inactividad.
- **OBS-4:** la alerta **Resuelta** permanece visible en el panel durante **14 horas desde su resolución** (para revisión) y luego solo queda consultable en la ficha del caso. El CSV sigue excluyendo las Resueltas.
- **Modo de trabajo:** B (propuesta y aprobación cambio por cambio) e informe guardado en este archivo.

## Orden sugerido de edición

1. `04-historias-usuario.md` — HU-04: CA4 (evaluación y acceso al panel) y CA5 (confirmación de gestión, confirmación y visibilidad de 14 horas, alertas de inactividad).
2. `07-criterios-aceptacion.md` — ESC-01, ESC-05 y ESC-06 (resultados observables y escenarios de inactividad); revisar ESC-08.
3. `08-modelo-dominio.md` y `modelo-dominio.puml` — solo si la regla de 14 horas exige una fecha de resolución explícita.
4. `11-diagramas-estado.md` y `estados-objetos.puml` — nota de visibilidad de **Resuelta**; sin estado nuevo salvo decisión contraria.
5. `10-diagramas-secuencia.md` y `diagramas-secuencia.puml` — mensajes de confirmación, resolución de inactividad y visibilidad.
6. `09-casos-de-uso.md` — CU-06: flujo y vocabulario «Resolver» para inactividad.
7. `12-trazabilidad.md` — al final.

## Cambios aplicados (2026-11-11)

| # | Archivo | Cambio |
| :--- | :--- | :--- |
| 1 | `Documentos/04-historias-usuario.md` | CA4: el tablero solo ofrece «Panel de Alertas»; «Evaluar alertas ahora» se hace en el panel, informa N alertas nuevas y mantiene a la gestora ahí. CA5: confirmaciones de gestión y resolución, visibilidad de 14 horas y alcance a inactividad con acción «Resolver». |
| 2 | `Documentos/07-criterios-aceptacion.md` | Nuevo **HU-04-ESC-09** (evaluación explícita desde el panel). |
| 3 | `Documentos/07-criterios-aceptacion.md` | **HU-04-ESC-05** reescrito: gestión sin cumplimiento ni resolución, alcance a inactividad y confirmación de que sigue activa. |
| 4 | `Documentos/07-criterios-aceptacion.md` | **HU-04-ESC-06** reescrito: resolución por cumplimiento o contacto, confirmación, vínculo con el hito y visibilidad de 14 horas. |
| 5 | `Documentos/07-criterios-aceptacion.md` | **HU-04-ESC-07** ampliado a alertas de inactividad y a causas que dejan sin efecto el seguimiento. |
| 6 | `Documentos/10-diagramas-secuencia.md` + `diagramas/diagramas-secuencia.puml` | DSS-04: bloque `opt` de evaluación explícita, respuestas con confirmación, resolución por contacto y nota de 14 horas; enlaces y tabla de correspondencia actualizados a ESC-09. |
| 7 | `Documentos/11-diagramas-estado.md` + `diagramas/estados-objetos.puml` | EST-01: transiciones a **Resuelta** por hito o contacto, confirmación y nota de visibilidad de 14 horas; se quitó «cerrar la alerta». |
| 8 | `Documentos/09-casos-de-uso.md` + `Documentos/10-diagramas-secuencia.md` | CU-06: escenarios ESC-01 a ESC-09 y regla de consistencia con evaluación explícita, confirmaciones y 14 horas. |
| 9 | `Documentos/12-trazabilidad.md` | Fila HU-04 a ESC-09 y nota de coherencia actualizada. |
| 10 | `Documentos/08-modelo-dominio.md` | `fechaCierre` registra fecha y hora de la resolución o del cierre; la ventana de 14 horas se calcula desde ese valor. |
| 11 | `.cin324/historias/HU-04.md` | Ficha de la historia sincronizada con todo lo anterior (estados, flujo, Gherkin y decisiones I8/I9). |

**Pendiente de verificación manual:** reexportar `EST-01-AlertaSeguimiento.png` y la imagen de DSS-04 desde sus fuentes `.puml`; revisar visualmente el resultado.

## Cómo trabajamos los cambios

Se eligió **B**: cada cambio se propone con antes/después, se aprueba, modifica o descarta individualmente. No se toca código ni `openspec/`, y no se aplica ningún cambio sin aprobación explícita.

## Cómo sabrás que terminaste

- [x] Se actualizó CA4 y CA5 de HU-04.
- [x] Se actualizaron los escenarios Gherkin (evaluación, gestión, resolución, inactividad).
- [x] Se revisaron DSS-04, EST-01 y CU-06 para que digan lo mismo.
- [ ] Los diagramas editados tienen fuente e imagen exportada actualizadas.
- [x] Se revisó la consistencia final (C1-C14 y trazabilidad) y todo está ✔.

## Siguiente paso

Hacer commit de los artefactos y ejecutar `/cin324-generar-app` para generar el ajuste. Después, volver a `/cin324-validar-sistema`.
