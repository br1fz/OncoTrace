# Spec Delta — Seguimiento oncológico

## ADDED Requirements

### Requirement: Consistencia temporal e inmutabilidad de hitos asistenciales
El sistema SHALL registrar los hitos asistenciales de manera inmutable y validar la consistencia temporal de sus fechas. La fecha de ocurrencia SHALL ser igual o anterior a la fecha actual y no SHALL ser anterior a la fecha del último hito registrado en el caso. Si la fecha es posterior a hoy o anterior al último hito registrado, el sistema SHALL rechazar el registro indicando el mensaje de error correspondiente.

#### Scenario: Rechazo de hito con fecha de ocurrencia futura
- **GIVEN** un caso oncológico registrado en el sistema
- **AND** un profesional autorizado para registrar hitos
- **WHEN** el profesional intenta registrar un hito asistencial con una fecha de ocurrencia posterior a la fecha actual
- **THEN** el sistema rechaza el registro con el mensaje "La fecha de ocurrencia no puede ser futura"
- **AND** la línea de tiempo del caso no sufre modificaciones
- **AND** la etapa del caso permanece sin cambios

#### Scenario: Rechazo de hito con fecha anterior al último hito registrado
- **GIVEN** un caso oncológico con al menos un hito asistencial registrado
- **AND** un profesional autorizado para registrar hitos
- **WHEN** el profesional intenta registrar un nuevo hito con una fecha de ocurrencia anterior a la fecha del último hito registrado
- **THEN** el sistema rechaza el registro con el mensaje "La fecha de ocurrencia no puede ser anterior al último hito registrado"
- **AND** no se generan incongruencias cronológicas en la línea de tiempo
- **AND** la etapa del caso permanece sin cambios
