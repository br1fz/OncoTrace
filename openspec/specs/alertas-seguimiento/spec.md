# alertas-seguimiento Specification

## Purpose
Permite a la UGCO detectar oportunamente garantías GES próximas a vencer y casos con inactividad prolongada, gestionar las alertas resultantes con respaldo documental y exportar el reporte consolidado de alertas vigentes para la Unidad GES.

## Requirements

### Requirement: Alerta preventiva por proximidad de plazo GES

El sistema SHALL evaluar las garantías GES pendientes y generar una alerta preventiva de prioridad Alta en estado Pendiente cuando falten cinco días hábiles o menos para su fecha límite, calculados sobre el calendario nacional de feriados. SHALL NOT generar una nueva alerta si ya existe una activa para la misma garantía.

#### Scenario: HU-04-ESC-01 Garantía pendiente a cinco días hábiles del vencimiento

- **GIVEN** un caso con una garantía GES pendiente
- **AND** que faltan cinco días hábiles para su vencimiento
- **AND** que no existe una alerta activa para esa garantía
- **WHEN** OncoTrace evalúa los vencimientos y repite la evaluación sin cambios en la garantía
- **THEN** queda registrada una única alerta preventiva de prioridad alta para esa garantía
- **AND** la gestora puede identificar el caso, el tipo de garantía y los días restantes

#### Scenario: HU-04-ESC-02 Garantía fuera del umbral preventivo

- **GIVEN** un caso con una garantía GES pendiente
- **AND** que faltan seis días hábiles para su vencimiento
- **AND** que no existe una alerta activa para esa garantía
- **WHEN** OncoTrace evalúa los vencimientos
- **THEN** no genera una alerta por proximidad de vencimiento para esa garantía

### Requirement: Detección de inactividad asistencial prolongada

El sistema SHALL calcular el último registro asistencial de cada caso como el máximo entre la fecha de ingreso, la fecha del último hito asistencial y la fecha de la última evaluación multidimensional. SHALL generar una alerta de Riesgo de Inactividad/Abandono en estado Pendiente cuando hayan transcurrido más de quince días corridos sin actividad y no exista una alerta activa de ese tipo.

#### Scenario: HU-04-ESC-03 Inactividad superior a quince días corridos

- **GIVEN** un caso sin nuevos registros asistenciales, atenciones médicas ni exámenes durante dieciséis días corridos
- **WHEN** OncoTrace evalúa la inactividad del caso
- **THEN** registra una alerta de Riesgo de Inactividad/Abandono
- **AND** la gestora puede identificar el caso y el período de inactividad

#### Scenario: HU-04-ESC-04 Inactividad que aún no supera el umbral

- **GIVEN** un caso sin nuevos registros asistenciales, atenciones médicas ni exámenes durante exactamente quince días corridos
- **WHEN** OncoTrace evalúa la inactividad del caso
- **THEN** no genera una alerta por inactividad para ese caso

#### Scenario: Evaluación repetida de inactividad sin alertas redundantes

- **GIVEN** un caso con una alerta de Riesgo de Inactividad/Abandono en estado Pendiente
- **WHEN** OncoTrace vuelve a evaluar la inactividad del caso sin que existan nuevos registros
- **THEN** conserva una sola alerta activa para esa condición
- **AND** no crea una alerta adicional por el mismo período de inactividad

### Requirement: Registro de gestión sin acreditar cumplimiento

Cuando una gestora autorizada registra una acción de gestión en la bitácora sobre una alerta de seguimiento activa (por garantía GES o por inactividad), el sistema SHALL conservar la acción y cambiar la alerta a En gestión, confirmando que la alerta quedó en ese estado y sigue activa, sin marcarla como cumplimiento ni resolución.

#### Scenario: HU-04-ESC-05 Gestión registrada sin cumplimiento ni resolución

- **GIVEN** un caso con una alerta de seguimiento activa, por una garantía GES pendiente o por inactividad
- **WHEN** una gestora autorizada registra una acción de gestión en la bitácora sin que se registre el hito o contacto que resuelve la alerta
- **THEN** la alerta queda en estado En gestión
- **AND** permanece disponible para seguimiento
- **AND** la acción registrada no se considera cumplimiento de la garantía ni resolución de la alerta
- **AND** el sistema confirma que la alerta quedó En gestión y que sigue activa

### Requirement: Resolución por cumplimiento o restablecimiento del contacto

Cuando se registra el hito asistencial que cumple la garantía GES o el contacto que restablece la actividad del caso, el sistema SHALL vincularlo a la alerta, cambiar su estado a Resuelta, confirmar la acción al usuario y mantener la alerta visible en el panel general durante 14 horas desde su resolución. Transcurrido ese plazo, SHALL excluirla de las alertas vigentes.

#### Scenario: HU-04-ESC-06 Resolución por cumplimiento o restablecimiento del contacto

- **GIVEN** un caso con una alerta de seguimiento activa, por una garantía GES pendiente o por inactividad
- **WHEN** se registra el hito que acredita el cumplimiento de esa garantía o el contacto que restablece la actividad del caso
- **THEN** la alerta queda en estado Resuelta
- **AND** el sistema confirma la resolución de la alerta
- **AND** se conserva la relación entre la alerta y el hito o contacto que la resolvió
- **AND** la alerta Resuelta permanece visible en el panel general durante 14 horas desde su resolución
- **AND** transcurridas las 14 horas deja de listarse entre las alertas vigentes y queda consultable en la ficha del caso

### Requirement: Cierre por causa documentada

Cuando una gestora autorizada registra un motivo, una fecha y una responsable para una causa documentada que deja sin efecto la garantía GES o el seguimiento del caso, el sistema SHALL cambiar la alerta a No aplica y conservar esos antecedentes de cierre.

#### Scenario: HU-04-ESC-07 Cierre por una causa documentada que deja sin efecto la alerta

- **GIVEN** un caso con una alerta de seguimiento activa, por una garantía GES pendiente o por inactividad
- **AND** una causa documentada que deja sin efecto esa garantía o el seguimiento del caso
- **WHEN** una gestora autorizada registra el cierre con su motivo y fecha
- **THEN** la alerta queda en estado No aplica
- **AND** se conserva la identificación de la responsable y la causa del cierre

#### Scenario: Rechazo del cierre sin motivo, fecha o responsable

- **GIVEN** una alerta vigente asociada a una garantía GES o inactividad
- **WHEN** una gestora autorizada intenta cerrarla sin informar el motivo, la fecha o la responsable
- **THEN** el sistema rechaza el cierre y muestra un mensaje de error
- **AND** la alerta conserva su estado anterior

### Requirement: Notificación en el panel general y en la tarjeta del caso

El sistema SHALL mostrar las alertas vigentes en el panel general de la gestora y en la tarjeta del caso, indicando el tipo de alerta, la prioridad, el estado y, cuando corresponda a una garantía GES, el tipo de garantía y los días hábiles restantes. Las alertas en estado Resuelta permanecerán visibles en el panel general únicamente durante 14 horas desde su resolución y no se mostrarán como vigentes en la tarjeta del caso.

#### Scenario: Visualización de alertas vigentes en panel y tarjeta

- **GIVEN** un caso con una alerta vigente asociada a una garantía GES
- **WHEN** la gestora abre el panel general de alertas o la tarjeta del caso en el tablero
- **THEN** el sistema muestra el tipo de alerta, la prioridad, el estado, el tipo de garantía y los días hábiles restantes
- **AND** no muestra como vigentes las alertas en estado Resuelta (salvo en el panel general durante las 14 horas reglamentarias) o No aplica

### Requirement: Confirmación de la evaluación explícita desde el panel

El sistema SHALL permitir a la gestora autorizada solicitar la evaluación explícita de alertas desde el panel general mediante la acción «Evaluar alertas ahora», ejecutando la evaluación de vencimientos GES e inactividad, informando cuántas alertas nuevas se generaron mediante un mensaje observable y permaneciendo en el panel general de alertas.

#### Scenario: HU-04-ESC-09 Confirmación de la evaluación explícita desde el panel

- **GIVEN** que la gestora autorizada se encuentra en el panel general de alertas
- **WHEN** pulsa «Evaluar alertas ahora»
- **THEN** OncoTrace ejecuta la evaluación de vencimientos GES e inactividad
- **AND** le informa cuántas alertas nuevas se generaron
- **AND** permanece en el panel general de alertas

### Requirement: Exportación del reporte consolidado de alertas vigentes

El sistema SHALL generar un archivo CSV descargable con las alertas en estado Pendiente o En gestión, incluyendo el caso, el tipo de garantía, los días restantes y el estado, y SHALL excluir las alertas en estado Resuelta o No aplica.

#### Scenario: HU-04-ESC-08 Exportación del reporte consolidado de alertas vigentes

- **GIVEN** que existen alertas de seguimiento vigentes en estado Pendiente o En gestión
- **WHEN** una gestora autorizada solicita exportar el reporte consolidado para la Unidad GES
- **THEN** el sistema genera un archivo CSV descargable
- **AND** cada fila incluye el caso, el tipo de garantía, los días restantes (si corresponde a una garantía GES) y el estado de la alerta
- **AND** el archivo no incluye alertas en estado Resuelta ni No aplica

### Requirement: Operaciones de alertas reservadas a la gestora UGCO

El sistema SHALL permitir evaluar, gestionar, cerrar y exportar alertas únicamente al rol Gestor/a UGCO. El rol Médico tratante SHALL acceder en modo solo lectura y sus intentos de modificar alertas SHALL ser rechazados sin alterar su estado.

#### Scenario: Rechazo de operaciones de alerta para el rol Médico tratante

- **GIVEN** un usuario con rol Médico tratante
- **WHEN** intenta evaluar, gestionar, cerrar o exportar alertas
- **THEN** el sistema rechaza la operación con un mensaje de acceso denegado
- **AND** las alertas conservan su estado y sus antecedentes
