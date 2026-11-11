# Spec Delta — Alertas de seguimiento

## Purpose

Permite a la UGCO detectar oportunamente garantías GES próximas a vencer y casos con inactividad prolongada, gestionar las alertas resultantes con respaldo documental y exportar el reporte consolidado de alertas vigentes para la Unidad GES.

## ADDED Requirements

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

Cuando una gestora autorizada registra una acción de gestión en la bitácora sobre una alerta GES pendiente, el sistema SHALL conservar la acción y cambiar la alerta a En gestión, sin marcarla como cumplimiento de la garantía.

#### Scenario: HU-04-ESC-05 Gestión registrada sin cumplimiento de la garantía

- **GIVEN** un caso con una alerta por una garantía GES pendiente
- **WHEN** una gestora autorizada registra una acción de gestión en la bitácora sin que se cumpla la garantía
- **THEN** la alerta queda en estado En gestión
- **AND** permanece disponible para seguimiento
- **AND** la acción registrada no se considera cumplimiento de la garantía

### Requirement: Resolución por cumplimiento de la garantía

Cuando se registra el hito asistencial que acredita el cumplimiento de la garantía GES asociada a una alerta Pendiente o En gestión, el sistema SHALL vincular el hito a la alerta, cambiar su estado a Resuelta y registrar la garantía como Cumplida.

#### Scenario: HU-04-ESC-06 Resolución por cumplimiento de la garantía

- **GIVEN** un caso con una alerta por una garantía GES pendiente
- **WHEN** se registra el hito que acredita el cumplimiento de esa garantía
- **THEN** la alerta queda en estado Resuelta
- **AND** se conserva la relación entre la alerta y el hito de cumplimiento

### Requirement: Cierre por causa documentada

Cuando una gestora autorizada registra un motivo, una fecha y una responsable para una causa documentada que deja sin efecto la garantía GES, el sistema SHALL cambiar la alerta a No aplica y conservar esos antecedentes de cierre.

#### Scenario: HU-04-ESC-07 Cierre por una causa que deja sin efecto la garantía

- **GIVEN** un caso con una alerta por una garantía GES pendiente
- **AND** una causa documentada que deja sin efecto esa garantía
- **WHEN** una gestora autorizada registra el cierre con su motivo y fecha
- **THEN** la alerta queda en estado No aplica
- **AND** se conserva la identificación de la responsable y la causa del cierre

#### Scenario: Rechazo del cierre sin motivo, fecha o responsable

- **GIVEN** una alerta vigente asociada a una garantía GES
- **WHEN** una gestora autorizada intenta cerrarla sin informar el motivo, la fecha o la responsable
- **THEN** el sistema rechaza el cierre y muestra un mensaje de error
- **AND** la alerta conserva su estado anterior

### Requirement: Notificación en el panel general y en la tarjeta del caso

El sistema SHALL mostrar las alertas vigentes en el panel general de la gestora y en la tarjeta del caso, indicando el tipo de alerta, la prioridad, el estado y, cuando corresponda a una garantía GES, el tipo de garantía y los días hábiles restantes.

#### Scenario: Visualización de alertas vigentes en panel y tarjeta

- **GIVEN** un caso con una alerta vigente asociada a una garantía GES
- **WHEN** la gestora abre el panel general de alertas o la tarjeta del caso en el tablero
- **THEN** el sistema muestra el tipo de alerta, la prioridad, el estado, el tipo de garantía y los días hábiles restantes
- **AND** no muestra como vigentes las alertas en estado Resuelta o No aplica

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
