# Spec Delta — Alertas de seguimiento

## ADDED Requirements

### Requirement: Alerta preventiva por punto de contacto obligatorio pendiente
El sistema SHALL evaluar los hitos normados del caso y generar una alerta preventiva de prioridad Alta en estado Pendiente cuando la fecha de referencia, comparada por día, sea posterior a `sumarDiasHabiles(fechaHito, 2)` sin que exista una entrada de acompañamiento del punto correspondiente con fecha igual o posterior al hito. SHALL NOT generar alertas duplicadas mientras exista una alerta activa vinculada al mismo hito de origen (`hitoOrigenId`).

#### Scenario: HU-03-ESC-02 Alerta preventiva por punto de contacto obligatorio pendiente
- **GIVEN** un caso oncológico que alcanzó un hito asistencial normado hace más de 48 horas hábiles
- **AND** que el punto de contacto obligatorio correspondiente no ha sido registrado en la bitácora
- **WHEN** el motor de monitoreo de OncoTrace evalúa la trayectoria del paciente
- **THEN** genera una alerta preventiva de contacto pendiente dirigida a la gestora asignada
- **AND** destaca la advertencia en el tablero para evitar el desenganche y la deserción asistencial

### Requirement: Protocolo de búsqueda activa ante no contactabilidad reiterada
El sistema SHALL computar los intentos fallidos consecutivos con resultado No contactable en entradas que no sean adendas. Al alcanzarse el tercer intento fallido consecutivo, el sistema SHALL generar una alerta de prioridad Alta de tipo Búsqueda activa por no contactabilidad vinculada a la tercera entrada (`entradaOrigenId`). Un cuarto intento fallido consecutivo SHALL NOT duplicar la alerta existente.

#### Scenario: HU-03-ESC-03 Registro de intento fallido y protocolo de búsqueda activa
- **GIVEN** un paciente programado para contacto de acompañamiento que no responde tras la llamada de la UGCO
- **WHEN** el funcionario registra el resultado No contactable indicando interlocutor y motivo en la bitácora
- **THEN** OncoTrace contabiliza el intento fallido
- **AND** si se alcanzan tres intentos fallidos consecutivos, genera una alerta para activar el protocolo de búsqueda activa y coordinación con APS

### Requirement: Cómputo de intentos fallidos sobre entradas de acompañamiento
El sistema SHALL contar los intentos fallidos solo en entradas de acompañamiento (no adenda y con punto normado). Las entradas de gestión de alertas de HU-04 SHALL NOT contar como intento ni reiniciar la racha.

#### Scenario: Entrada de gestión de alerta que no cuenta como intento fallido
- **GIVEN** un caso con dos intentos fallidos consecutivos en entradas de acompañamiento
- **WHEN** la gestora registra la gestión de una alerta de HU-04
- **THEN** la racha se mantiene en dos intentos fallidos
- **AND** el caso conserva su indicador de contactabilidad

## MODIFIED Requirements

### Requirement: Resolución por cumplimiento o restablecimiento del contacto
Cuando se registra el hito de cumplimiento GES, la entrada de bitácora del punto normado adeudado o el contacto efectivo que reactiva el caso, el sistema SHALL vincular la entidad resolutiva (`hitoCumplimientoId` o `entradaCumplimientoId`), cambiar la alerta a Resuelta, confirmar la acción, mostrar en la ficha del caso el hito o contacto resolutivo (tipo y fecha) y mantenerla visible en el panel durante 14 horas. Luego SHALL excluirla de las alertas vigentes y dejarla consultable en la ficha.

#### Scenario: HU-04-ESC-06 Resolución por cumplimiento o restablecimiento del contacto
- **GIVEN** un caso con una alerta de seguimiento activa, por una garantía GES pendiente, por inactividad, por punto de contacto pendiente o por búsqueda activa
- **WHEN** se registra el hito que acredita el cumplimiento, la entrada de bitácora del punto adeudado o el contacto que restablece la actividad del caso
- **THEN** la alerta queda en estado Resuelta
- **AND** el sistema confirma la resolución de la alerta
- **AND** se conserva la relación entre la alerta y el hito o contacto que la resolvió (`hitoCumplimientoId` o `entradaCumplimientoId`)
- **AND** la ficha del caso indica el hito o contacto que resolvió la alerta, con su tipo y fecha
- **AND** la alerta Resuelta permanece visible en el panel general durante 14 horas desde su resolución
- **AND** transcurridas las 14 horas deja de listarse entre las alertas vigentes y queda consultable en la ficha del caso

