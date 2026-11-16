# examenes-diagnosticos Specification

## Purpose

Permite a la UGCO consultar e incorporar al caso oncológico los informes diagnósticos validados de LIS y PACS, medir la completitud diagnóstica del caso y conservar en formato PDF los informes de compras de servicio externo, con trazabilidad de las excepciones de identificación.

## Requirements

### Requirement: Incorporación de informes validados desde LIS y PACS por RUN
El sistema SHALL consultar los informes disponibles en LIS y PACS mediante los adaptadores de integración y SHALL incorporar al caso solo los informes validados en el origen cuyo RUN corresponda inequívocamente al paciente del caso. Al incorporar uno de dos exámenes solicitados, SHALL identificar ese examen como recibido y SHALL mantener el otro pendiente de recepción.

#### Scenario: HU-05-ESC-01 Incorporación de un informe validado
- **GIVEN** un caso con dos exámenes solicitados y ninguno recibido
- **AND** un informe validado disponible en LIS o PACS para uno de esos exámenes
- **AND** que el RUN del informe corresponde inequívocamente al paciente del caso
- **AND** que el informe no contiene un hallazgo crítico
- **WHEN** OncoTrace recibe el informe desde el sistema de origen
- **THEN** lo incorpora al caso correspondiente y lo identifica como recibido
- **AND** el profesional autorizado puede consultar el informe y obtener su copia en PDF
- **AND** la completitud de los exámenes solicitados queda en cincuenta por ciento
- **AND** el otro examen permanece pendiente de recepción

### Requirement: Indicador derivado de completitud diagnóstica del caso
El sistema SHALL calcular la completitud diagnóstica del caso como el cociente entre los exámenes con informe incorporado y los exámenes solicitados, expresado en porcentaje, y SHALL mostrarla en la ficha del caso y en la tarjeta del tablero. El valor SHALL NOT persistirse como atributo del caso.

#### Scenario: HU-05-CA3 Indicador de completitud en ficha y tablero
- **GIVEN** un caso con dos exámenes solicitados y uno incorporado
- **WHEN** la gestora o el médico tratante abre la ficha del caso o la tarjeta del caso en el tablero
- **THEN** ambos lugares muestran la completitud diagnóstica en cincuenta por ciento
- **AND** la ficha identifica el examen que permanece pendiente de recepción

### Requirement: Excepción de auditoría por discrepancia de identificación
El sistema SHALL conservar en una bandeja de excepciones todo informe cuyo RUN no permita asociarlo inequívocamente al paciente del caso, dejando registrada la discrepancia para auditoría. SHALL NOT incorporarlo al expediente de un paciente y SHALL mantener el examen pendiente de recepción de un informe correctamente identificado.

#### Scenario: HU-05-ESC-03 Discrepancia en la identificación del paciente
- **GIVEN** un informe cuyo identificador no permite asociarlo inequívocamente al paciente del caso
- **WHEN** OncoTrace intenta incorporar el informe
- **THEN** conserva el informe como una excepción pendiente de revisión
- **AND** deja registrada la discrepancia para su auditoría
- **AND** no lo incorpora al expediente de un paciente incorrecto
- **AND** el examen del caso permanece pendiente de recepción de un informe correctamente identificado

### Requirement: Exclusión de informes pendientes de validación en el origen
El sistema SHALL NOT presentar como validado ni como recibido un informe que siga pendiente de validación en LIS o PACS, y SHALL mantener pendiente la recepción del informe validado del examen solicitado.

#### Scenario: HU-05-ESC-04 Informe pendiente de validación
- **GIVEN** un examen solicitado para un caso oncológico
- **AND** que el informe correspondiente sigue pendiente de validación en LIS o PACS
- **WHEN** OncoTrace consulta los informes disponibles
- **THEN** no presenta ese informe como validado ni el examen como recibido
- **AND** conserva pendiente la recepción del informe validado

### Requirement: Incorporación manual de informes de compra de servicio externo
Cuando el examen corresponda a una compra de servicio externo no disponible en LIS ni en PACS, el sistema SHALL permitir a la gestora adjuntar el informe externo en formato PDF, SHALL incorporarlo al expediente consolidado del caso registrando el origen como compra de servicio externo, SHALL marcar el examen como recibido y SHALL actualizar la completitud. SHALL rechazar los archivos que no sean PDF.

#### Scenario: HU-05-ESC-05 Incorporación de un informe de compra de servicio externo
- **GIVEN** un caso oncológico con un examen solicitado a un prestador externo
- **AND** que el informe no está disponible en LIS ni en PACS
- **WHEN** la gestora adjunta el informe externo en formato PDF
- **THEN** OncoTrace lo incorpora al expediente consolidado del caso
- **AND** registra el origen del informe como compra de servicio externo
- **AND** el examen queda identificado como recibido
- **AND** la completitud de los exámenes solicitados se actualiza
- **AND** el profesional autorizado puede consultar y descargar el informe adjunto

#### Scenario: Rechazo de un adjunto que no está en formato PDF
- **GIVEN** un examen de compra de servicio externo pendiente de recepción
- **WHEN** la gestora intenta adjuntar un archivo que no está en formato PDF
- **THEN** el sistema rechaza la carga e indica que el formato admitido es PDF
- **AND** el examen permanece pendiente de recepción
