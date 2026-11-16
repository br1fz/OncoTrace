# Spec Delta - Alertas de seguimiento

## ADDED Requirements

### Requirement: Alerta de seguimiento por hallazgo crítico histopatológico
Al incorporar un informe validado de Anatomía Patológica con hallazgo de malignidad o valor crítico y RUN inequívoco, el sistema SHALL generar una alerta de seguimiento de tipo «Hallazgo crítico», con prioridad Alta y estado Pendiente, vinculada al caso y al estudio de origen (`estudioOrigenId`). La alerta SHALL permitir identificar el caso y el informe que la origina.

#### Scenario: HU-05-ESC-02 Recepción de un informe con hallazgo crítico
- **GIVEN** un informe validado de Anatomía Patológica con un hallazgo de malignidad o un valor crítico informado por el sistema de origen
- **AND** que su RUN corresponde inequívocamente al paciente de un caso registrado
- **WHEN** OncoTrace incorpora el informe al caso
- **THEN** genera una alerta de seguimiento de tipo «Hallazgo crítico» para el médico tratante y la gestora
- **AND** la alerta permite identificar el caso y el informe que la origina

### Requirement: Aviso emergente interno de hallazgos críticos activos
El sistema SHALL mostrar un aviso emergente dentro de OncoTrace al ingresar a la aplicación cuando el rol tenga alertas de tipo «Hallazgo crítico» activas, identificando el caso y el informe que las originan. El aviso SHALL retirarse automáticamente a los cinco minutos o cuando el usuario lo cierre, y SHALL NOT depender de notificaciones externas ni del permiso de notificaciones del navegador. La alerta SHALL permanecer visible en el panel general y en la tarjeta del caso desde su generación.

#### Scenario: Aviso emergente al ingresar con una alerta de hallazgo crítico activa
- **GIVEN** un usuario con rol Médico tratante o Gestor/a UGCO
- **AND** que existe al menos una alerta de tipo «Hallazgo crítico» en estado Pendiente o En gestión
- **WHEN** el usuario ingresa a OncoTrace
- **THEN** se muestra un aviso emergente con el caso y el informe que originan la alerta
- **AND** el aviso se muestra sin solicitar permiso de notificaciones del navegador
- **AND** el aviso se retira a los cinco minutos o cuando el usuario lo cierra
- **AND** la alerta sigue visible en el panel general y en la tarjeta del caso

### Requirement: Gestión de la alerta de hallazgo crítico
El sistema SHALL cambiar la alerta de tipo «Hallazgo crítico» a estado En gestión cuando la gestora registra la notificación al médico tratante, conservando el registro de la acción y confirmando el cambio de estado.

#### Scenario: Notificación al médico tratante registrada por la gestora
- **GIVEN** una alerta de tipo «Hallazgo crítico» en estado Pendiente
- **WHEN** la gestora registra la notificación al médico tratante
- **THEN** la alerta queda en estado En gestión
- **AND** el sistema conserva el registro de la notificación y confirma el cambio de estado

### Requirement: Resolución de la alerta de hallazgo crítico por hito clínico
El sistema SHALL cambiar la alerta de tipo «Hallazgo crítico» a estado Resuelta cuando se registra el hito clínico que documenta la conducta adoptada, conservando la relación entre la alerta y ese hito, y SHALL mostrar en la ficha del caso el hito resolutivo con su tipo y fecha.

#### Scenario: Resolución mediante el hito clínico de la conducta adoptada
- **GIVEN** una alerta de tipo «Hallazgo crítico» en estado Pendiente o En gestión
- **WHEN** se registra el hito clínico que documenta la conducta adoptada ante el hallazgo
- **THEN** la alerta queda en estado Resuelta
- **AND** se conserva la relación entre la alerta y el hito clínico que la resolvió
- **AND** la ficha del caso indica el hito resolutivo con su tipo y fecha
