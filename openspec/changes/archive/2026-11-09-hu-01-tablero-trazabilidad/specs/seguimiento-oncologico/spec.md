# Spec Delta — Seguimiento oncológico

## Purpose

Permite a la UGCO consultar el estado de cada caso oncológico en un tablero por las ocho etapas de la trayectoria y registrar los hitos asistenciales que actualizan su etapa y su línea de tiempo.

## ADDED Requirements

### Requirement: Tablero de casos agrupado por las ocho etapas
El sistema SHALL mostrar los casos oncológicos agrupados en las ocho etapas de la trayectoria: Sospecha; Confirmación diagnóstica; Etapificación; Tratamiento; Rehabilitación; Cuidados paliativos y alivio del dolor; Seguimiento y sobrevivientes; Alta y contrarreferencia.

#### Scenario: Visualización del tablero por etapas
- **GIVEN** casos oncológicos registrados en distintas etapas de la trayectoria
- **WHEN** la gestora abre el tablero de seguimiento
- **THEN** el sistema muestra los casos agrupados en las ocho etapas
- **AND** una etapa sin casos se muestra como «Sin casos en esta etapa»

### Requirement: Tarjeta del caso en el tablero
Cada tarjeta del tablero SHALL mostrar RUN, nombre del paciente, especialidad, diagnóstico o sospecha CIE-10, etapa actual, fecha del último hito y semáforo de alertas pendientes. SHALL incluir además un marcador «Riesgo» que muestra «Sin evaluar» mientras no exista una evaluación de riesgo.

#### Scenario: Contenido de la tarjeta del caso
- **GIVEN** un caso oncológico con etapa, hitos y alertas registrados
- **WHEN** la gestora revisa su tarjeta en el tablero
- **THEN** la tarjeta muestra RUN, nombre, especialidad, diagnóstico o sospecha CIE-10, etapa actual, fecha del último hito y semáforo de alertas pendientes
- **AND** el marcador «Riesgo» aparece como «Sin evaluar»

### Requirement: Consulta del seguimiento y la línea de tiempo de un caso
El sistema SHALL presentar el seguimiento de un caso con los datos del paciente, la especialidad, el diagnóstico o sospecha CIE-10, la etapa actual, el último hito y las alertas pendientes, junto con los hitos en orden cronológico, indicando para cada uno su fecha y los días transcurridos desde el hito anterior. La etapa mostrada SHALL ser una de las ocho etapas de la trayectoria oncológica.

#### Scenario: Consulta del seguimiento de un caso
- **GIVEN** un caso oncológico con etapa asistencial e hitos registrados
- **AND** una gestora autorizada para consultar el caso
- **WHEN** la gestora consulta su seguimiento
- **THEN** obtiene el RUN y nombre del paciente, la especialidad y el diagnóstico o sospecha CIE-10
- **AND** conoce la etapa actual, el último hito registrado y las alertas pendientes
- **AND** obtiene los hitos en orden cronológico, con sus fechas y los días transcurridos entre ellos
- **AND** la etapa corresponde a una de las ocho etapas de la trayectoria oncológica

### Requirement: Cambio de etapa por inicio del tratamiento
El sistema SHALL cambiar `CasoOncologico` a la etapa Tratamiento cuando un profesional autorizado registra el inicio del tratamiento, siempre que exista una resolución de comité previa. El hito SHALL conservarse en la línea de tiempo e identificar la fecha, hora, usuario y rol del responsable. Si no existe resolución de comité previa, el sistema SHALL rechazar el registro sin cambiar la etapa.

#### Scenario: Cambio de etapa por inicio del tratamiento
- **GIVEN** un caso oncológico en etapa de etapificación
- **AND** una resolución de comité registrada como hito del caso
- **WHEN** un profesional autorizado registra el inicio del tratamiento
- **THEN** el caso queda en la etapa de tratamiento
- **AND** la línea de tiempo conserva el hito y el cambio de etapa
- **AND** el registro identifica la fecha, hora, usuario y rol del responsable

#### Scenario: Rechazo del inicio de tratamiento sin resolución de comité
- **GIVEN** un caso oncológico en etapa de etapificación sin resolución de comité registrada
- **WHEN** un profesional autorizado intenta registrar el inicio del tratamiento
- **THEN** el sistema rechaza el registro y muestra un mensaje de error
- **AND** el caso permanece en la etapa de etapificación

### Requirement: Resolución de comité sin cambio de etapa
El sistema SHALL registrar la resolución firmada del comité como hito asistencial de la línea de tiempo y SHALL mantener el caso en la etapa de Etapificación cuando no exista un evento clínico que confirme el ingreso a otra etapa. El sistema MUST NOT crear una etapa independiente denominada «Comité».

#### Scenario: Resolución de comité sin inicio del tratamiento
- **GIVEN** un caso oncológico en etapa de etapificación
- **WHEN** se registra la resolución firmada del comité sin un evento clínico que confirme el ingreso a otra etapa
- **THEN** la resolución queda incorporada como hito de la línea de tiempo
- **AND** el caso permanece en etapificación
- **AND** no se crea una etapa independiente denominada Comité
