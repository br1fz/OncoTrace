# bitacora-acompanamiento Specification

## Purpose
Permite registrar y consultar cronológicamente las interacciones asistenciales de navegación y acompañamiento oncológico, verificar el cumplimiento de los 6 puntos normados del Journey Map, programar próximas acciones y enmendar registros mediante adendas inmutables.

## Requirements

### Requirement: Registro de interacciones y verificación de puntos normados
El sistema SHALL permitir a los roles Gestor/a UGCO y TENS UGCO registrar interacciones asistenciales indicando fecha, canal, interlocutor, motivo, resumen, acuerdos y punto normado (P1 a P6 o No normado). Al guardar, SHALL marcar el punto normado como cumplido, añadir la entrada en orden cronológico descendente y actualizar el indicador de contactabilidad derivado del caso sin permitir la eliminación física del registro.

#### Scenario: HU-03-ESC-01 Registro de punto de contacto normado según Journey Map
- **GIVEN** un caso oncológico asignado a una gestora o TENS de la UGCO
- **AND** que el paciente alcanza uno de los seis hitos obligatorios del Journey Map (P1: Ingreso/Sospecha inicial, P2: Post-confirmación diagnóstica con IPD, P3: Etapificación/Post-resolución de comité, P4: Al alta de hospitalización o cirugía, P5: Al finalizar tratamiento activo y retorno a vida cotidiana, P6: Ante toda derivación a otro establecimiento de la red)
- **WHEN** la gestora o TENS registra la interacción con fecha, tipo de contacto, interlocutor (paciente o cuidador), motivo, resumen de interacción y acuerdos
- **THEN** OncoTrace marca el punto de contacto correspondiente como cumplido
- **AND** añade el evento a la bitácora cronológica del caso con identificación del funcionario responsable en orden descendente
- **AND** actualiza el indicador de contactabilidad del paciente sin permitir la eliminación física del registro

### Requirement: Indicador derivado de contactabilidad del caso
El sistema SHALL derivar el indicador de contactabilidad de la última entrada de acompañamiento: aquella que no es adenda y declara un punto normado. Si el estado es `Efectivo`, el caso SHALL mostrarse como Contactable; si es `No contactable`, como No contactable. Las adendas y las entradas de gestión de alertas de HU-04, que no declaran punto normado, SHALL NOT alterar el indicador.

#### Scenario: Contactabilidad derivada de la última entrada de acompañamiento
- **GIVEN** un caso con entradas de acompañamiento y una entrada de gestión de alerta de HU-04 posterior
- **WHEN** se consulta la ficha del caso
- **THEN** el indicador de contactabilidad refleja la última entrada de acompañamiento (no adenda y con punto normado)
- **AND** la entrada de gestión de alerta no altera ese indicador

### Requirement: Programación y visualización del próximo contacto asistencial
El sistema SHALL permitir registrar de forma opcional la fecha y el objetivo del próximo contacto o seguimiento de exámenes al ingresar una interacción, conservando estos antecedentes y mostrándolos visiblemente como próxima acción programada en la ficha del caso.

#### Scenario: HU-03-ESC-05 Programación del próximo contacto asistencial
- **GIVEN** un caso oncológico con una interacción registrada en la bitácora
- **WHEN** la gestora o TENS registra la fecha y el objetivo del próximo contacto o del seguimiento de exámenes
- **THEN** OncoTrace conserva la fecha y el objetivo en la entrada de la bitácora
- **AND** muestra la próxima acción programada en la ficha del caso

### Requirement: Registro de corrección mediante adenda inmutable
El sistema SHALL prohibir la edición o eliminación física de cualquier entrada de bitácora previamente registrada. Cualquier corrección o rectificación asistencial SHALL registrarse como una adenda vinculada a la entrada original mediante `entradaOriginalId`, conservando fecha, hora, usuario y motivo de la enmienda.

#### Scenario: HU-03-ESC-04 Registro de corrección mediante adenda inmutable
- **GIVEN** un registro previo en la bitácora de acompañamiento que requiere aclaración o rectificación
- **WHEN** el profesional responsable ingresa una corrección asistencial
- **THEN** el sistema conserva intacto el registro original
- **AND** genera una nota de adenda vinculada con fecha, hora, usuario y motivo de la enmienda

### Requirement: Validación de datos obligatorios en el registro de interacción
El sistema SHALL validar que toda interacción asistencial cuente con fecha, canal de contacto, interlocutor (paciente o cuidador), motivo y resumen de la interacción. Si alguno de estos campos falta, SHALL rechazar el registro indicando los campos obligatorios faltantes y no creará ninguna entrada en la bitácora.

#### Scenario: HU-03-ESC-06 Registro rechazado por datos obligatorios incompletos
- **GIVEN** un caso oncológico asignado a una gestora o TENS
- **WHEN** intenta registrar una interacción sin fecha, canal, interlocutor, motivo o resumen
- **THEN** OncoTrace rechaza el registro e indica los campos obligatorios faltantes
- **AND** no crea ninguna entrada en la bitácora

### Requirement: Control de acceso para la bitácora de acompañamiento
El sistema SHALL autorizar el registro de interacciones y adendas únicamente a usuarios con rol Gestor/a UGCO o TENS UGCO. El rol Médico tratante SHALL acceder a la bitácora del caso en modo solo lectura, rechazando cualquier intento de registro o rectificación.

#### Scenario: Rechazo de registro de interacción para rol Médico tratante
- **GIVEN** un usuario identificado con rol Médico tratante
- **WHEN** intenta registrar una interacción o adenda en la bitácora del caso
- **THEN** el sistema rechaza la solicitud con un mensaje de acceso denegado
- **AND** no altera la bitácora ni el indicador de contactabilidad del caso
