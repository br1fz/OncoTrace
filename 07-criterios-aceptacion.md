# Criterios de aceptación (Gherkin)

Este documento especifica el comportamiento esperado de las historias HU-01, HU-04, HU-05 y HU-08 de OncoTrace. Los escenarios describen condiciones de aceptación; no acreditan implementación ni ejecución de pruebas.

**Referencias:** [Historias de usuario](./04-historias-usuario.md) · [Requisitos](./03-requisitos.md) · [Proceso TO-BE](./02-rediseno-to-be.md).

Los identificadores `HU-xx-ESC-xx` permiten referenciar cada escenario en los demás artefactos de la Entrega 2. Los umbrales de alertas corresponden a las reglas documentadas en la Entrega 1.

Las operaciones realizadas por funcionarios están sujetas a los controles de acceso y auditoría de RNF-03 y REQ-DER-01. Las metas de calidad se mantienen en [06-atributos-calidad.md](./06-atributos-calidad.md).

---

## HU-01 — Tablero de trazabilidad y línea de tiempo clínica por etapas

**Historia de origen:** [HU-01](./04-historias-usuario.md#hu-01).

**Historia:** Como Gestor/a de Casos Oncológicos de la UGCO, quiero visualizar un tablero centralizado estructurado según las ocho etapas de la trayectoria oncológica y una línea de tiempo cronológica por paciente, para conocer el estado de su atención, monitorear plazos y realizar seguimiento activo.

**Requisitos asociados:** RF-01 y RNF-02.

Las ocho etapas son: sospecha; confirmación diagnóstica; etapificación; tratamiento; rehabilitación; cuidados paliativos y alivio del dolor; seguimiento y sobrevivientes; alta y contrarreferencia.

```gherkin
Característica: Seguimiento de casos oncológicos por etapas e hitos

  Escenario: HU-01-ESC-01 Consulta del seguimiento de un caso
    Dado un caso oncológico con etapa asistencial e hitos registrados
    Y una gestora autorizada para consultar el caso
    Cuando la gestora consulta su seguimiento
    Entonces obtiene el RUN y nombre del paciente, la especialidad y el diagnóstico o sospecha CIE-10
    Y conoce la etapa actual, el último hito registrado y las alertas pendientes
    Y obtiene los hitos en orden cronológico, con sus fechas y los días transcurridos entre ellos
    Y la etapa corresponde a una de las ocho etapas de la trayectoria oncológica

  Escenario: HU-01-ESC-02 Cambio de etapa por inicio del tratamiento
    Dado un caso oncológico en etapa de etapificación
    Y una resolución de comité registrada como hito del caso
    Cuando un profesional autorizado registra el inicio del tratamiento
    Entonces el caso queda en la etapa de tratamiento
    Y la línea de tiempo conserva el hito y el cambio de etapa
    Y el registro identifica la fecha, hora, usuario y rol del responsable

  Escenario: HU-01-ESC-03 Resolución de comité sin inicio del tratamiento
    Dado un caso oncológico en etapa de etapificación
    Cuando se registra la resolución firmada del comité sin un evento clínico que confirme el ingreso a otra etapa
    Entonces la resolución queda incorporada como hito de la línea de tiempo
    Y el caso permanece en etapificación
    Y no se crea una etapa independiente denominada Comité
```

---

## HU-04 — Alertas preventivas de plazos GES e inactividad

**Historia de origen:** [HU-04](./04-historias-usuario.md#hu-04).

**Historia:** Como Gestor/a Oncológico/a de la UGCO, quiero recibir alertas preventivas sobre garantías GES próximas a vencer y casos con inactividad prolongada, para gestionar oportunamente los casos y prevenir interrupciones de la atención.

**Requisitos asociados:** RF-04 y RNF-01.

El cálculo de días hábiles considera el calendario nacional y sus feriados. Los períodos de inactividad se calculan en días corridos.

```gherkin
Característica: Detección y gestión de alertas de seguimiento

  Escenario: HU-04-ESC-01 Garantía pendiente a cinco días hábiles del vencimiento
    Dado un caso con una garantía GES pendiente
    Y que faltan cinco días hábiles para su vencimiento
    Y que no existe una alerta activa para esa garantía
    Cuando OncoTrace evalúa los vencimientos y repite la evaluación sin cambios en la garantía
    Entonces queda registrada una única alerta preventiva de prioridad alta para esa garantía
    Y la gestora puede identificar el caso, el tipo de garantía y los días restantes

  Escenario: HU-04-ESC-02 Garantía fuera del umbral preventivo
    Dado un caso con una garantía GES pendiente
    Y que faltan seis días hábiles para su vencimiento
    Y que no existe una alerta activa para esa garantía
    Cuando OncoTrace evalúa los vencimientos
    Entonces no genera una alerta por proximidad de vencimiento para esa garantía

  Escenario: HU-04-ESC-03 Inactividad superior a quince días corridos
    Dado un caso sin nuevos registros asistenciales, atenciones médicas ni exámenes durante dieciséis días corridos
    Cuando OncoTrace evalúa la inactividad del caso
    Entonces registra una alerta de Riesgo de Inactividad/Abandono
    Y la gestora puede identificar el caso y el período de inactividad

  Escenario: HU-04-ESC-04 Inactividad que aún no supera el umbral
    Dado un caso sin nuevos registros asistenciales, atenciones médicas ni exámenes durante exactamente quince días corridos
    Cuando OncoTrace evalúa la inactividad del caso
    Entonces no genera una alerta por inactividad para ese caso

  Escenario: HU-04-ESC-05 Gestión registrada sin cumplimiento de la garantía
    Dado un caso con una alerta por una garantía GES pendiente
    Cuando una gestora autorizada registra una acción de gestión en la bitácora sin que se cumpla la garantía
    Entonces la alerta queda en estado En gestión
    Y permanece disponible para seguimiento
    Y la acción registrada no se considera cumplimiento de la garantía

  Escenario: HU-04-ESC-06 Resolución por cumplimiento de la garantía
    Dado un caso con una alerta por una garantía GES pendiente
    Cuando se registra el hito que acredita el cumplimiento de esa garantía
    Entonces la alerta queda en estado Resuelta
    Y se conserva la relación entre la alerta y el hito de cumplimiento

  Escenario: HU-04-ESC-07 Cierre por una causa que deja sin efecto la garantía
    Dado un caso con una alerta por una garantía GES pendiente
    Y una causa documentada que deja sin efecto esa garantía
    Cuando una gestora autorizada registra el cierre con su motivo y fecha
    Entonces la alerta queda en estado No aplica
    Y se conserva la identificación de la responsable y la causa del cierre
```

---

## HU-05 — Consolidación de informes diagnósticos y alertas críticas

**Historia de origen:** [HU-05](./04-historias-usuario.md#hu-05).

**Historia:** Como Gestor/a Oncológico/a y Médico Tratante, quiero que los informes de anatomía patológica, laboratorio e imagenología se incorporen a la ficha del paciente y alerten ante hallazgos críticos, para reducir la búsqueda manual y facilitar las decisiones clínicas.

**Requisitos asociados:** RF-05, RNF-04 y RNF-01.

La integración con LIS y PACS utiliza las interfaces disponibles y autorizadas por el hospital. Los escenarios no prescriben un protocolo ni una solución de implementación.

```gherkin
Característica: Incorporación de informes al caso oncológico correspondiente

  Escenario: HU-05-ESC-01 Incorporación de un informe validado
    Dado un caso con dos exámenes solicitados y ninguno recibido
    Y un informe validado disponible en LIS o PACS para uno de esos exámenes
    Y que el RUN del informe corresponde inequívocamente al paciente del caso
    Y que el informe no contiene un hallazgo crítico
    Cuando OncoTrace recibe el informe desde el sistema de origen
    Entonces lo incorpora al caso correspondiente y lo identifica como recibido
    Y el profesional autorizado puede consultar el informe y obtener su copia en PDF
    Y la completitud de los exámenes solicitados queda en cincuenta por ciento
    Y el otro examen permanece pendiente de recepción

  Escenario: HU-05-ESC-02 Recepción de un informe con hallazgo crítico
    Dado un informe validado de Anatomía Patológica con un hallazgo de malignidad o un valor crítico informado por el sistema de origen
    Y que su RUN corresponde inequívocamente al paciente de un caso registrado
    Cuando OncoTrace incorpora el informe al caso
    Entonces genera una notificación prioritaria para el médico tratante y la gestora
    Y la notificación permite identificar el caso y el informe que la origina

  Escenario: HU-05-ESC-03 Discrepancia en la identificación del paciente
    Dado un informe cuyo identificador no permite asociarlo inequívocamente al paciente del caso
    Cuando OncoTrace intenta incorporar el informe
    Entonces conserva el informe como una excepción pendiente de revisión
    Y deja registrada la discrepancia para su auditoría
    Y no lo incorpora al expediente de un paciente incorrecto
    Y el examen del caso permanece pendiente de recepción de un informe correctamente identificado

  Escenario: HU-05-ESC-04 Informe pendiente de validación
    Dado un examen solicitado para un caso oncológico
    Y que el informe correspondiente sigue pendiente de validación en LIS o PACS
    Cuando OncoTrace consulta los informes disponibles
    Entonces no presenta ese informe como validado ni el examen como recibido
    Y conserva pendiente la recepción del informe validado
```

---

## HU-08 — Derivaciones externas y orientación sobre reembolso de pasajes

**Historia de origen:** [HU-08](./04-historias-usuario.md#hu-08).

**Historia:** Como Gestor/a, TENS o Administrativo/a de la UGAA, quiero gestionar la confección y despacho del dossier de derivación, seguir la atención en el centro de referencia y entregar anticipadamente el instructivo de reembolso de pasajes, para mantener la continuidad de la atención y orientar al paciente.

**Requisitos asociados:** RF-08 y RNF-01.

Los estados de seguimiento definidos en la historia son: Dossier Confeccionado; Despachado por UGAA; Recepcionado en HCVB; Cita Asignada; Tratamiento Iniciado; Contrarreferido con Epicrisis.

El despacho no acredita por sí solo la recepción en HCVB. Los intercambios con sistemas externos quedan sujetos a los mecanismos institucionales disponibles y autorizados.

```gherkin
Característica: Seguimiento de la derivación a la red externa

  Escenario: HU-08-ESC-01 Confección del dossier de derivación
    Dado un caso con una resolución de comité que indica derivación externa
    Y que están disponibles la interconsulta, los informes de biopsia, las imágenes, el acta firmada y la información de apoyo social
    Cuando un TENS autorizado solicita confeccionar el dossier
    Entonces OncoTrace reúne los antecedentes del caso en el dossier digital
    Y la derivación queda en estado Dossier Confeccionado
    Y el dossier queda disponible para la validación y despacho por UGAA

  Escenario: HU-08-ESC-02 Despacho con orientación anticipada sobre pasajes
    Dado un dossier completo y validado por UGAA para derivación a HCVB
    Y que el gestor o TENS ha registrado la entrega anticipada del instructivo de reembolso al paciente o cuidador
    Cuando un funcionario autorizado de UGAA formaliza el despacho con su fecha y folio
    Entonces la derivación queda en estado Despachado por UGAA
    Y el dossier incorpora el instructivo oficial del Anexo 6 y la constancia de entrega
    Y el instructivo informa los medios de locomoción pública cubiertos y excluye vehículos particulares y aplicaciones de transporte
    Y informa la necesidad de conservar boletos y certificados de asistencia sin enmiendas
    Y el despacho no se registra como recepción confirmada en HCVB

  Escenario: HU-08-ESC-03 Confirmación de recepción en HCVB
    Dado una derivación en estado Despachado por UGAA
    Cuando se registra una confirmación de recepción emitida por HCVB para esa derivación
    Entonces la derivación queda en estado Recepcionado en HCVB
    Y se conservan la confirmación y la fecha de recepción
    Y la gestora puede consultar ese antecedente en el seguimiento del caso

  Escenario: HU-08-ESC-04 Registro de una cita confirmada
    Dado una derivación recepcionada en HCVB
    Cuando se registra la fecha de atención confirmada por el centro receptor
    Entonces la derivación queda en estado Cita Asignada
    Y la fecha de atención queda vinculada a la derivación
    Y la asignación de la cita no se considera inicio del tratamiento

  Escenario: HU-08-ESC-05 Derivación sin respuesta después del plazo de seguimiento
    Dado una derivación despachada por UGAA hace once días hábiles
    Y que no se ha registrado confirmación de recepción ni fecha de atención en HCVB
    Cuando OncoTrace evalúa el seguimiento de la derivación
    Entonces genera una alerta preventiva para gestión interinstitucional
    Y la alerta identifica la derivación y el tiempo transcurrido desde el despacho
    Y la derivación permanece en estado Despachado por UGAA

  Escenario: HU-08-ESC-06 Retorno con epicrisis y contrarreferencia
    Dado una derivación en estado Tratamiento Iniciado
    Y que el centro externo ha finalizado la atención y emitido la epicrisis y contrarreferencia
    Cuando una gestora autorizada incorpora esos antecedentes y registra el retorno al HGF
    Entonces la derivación queda en estado Contrarreferido con Epicrisis
    Y la epicrisis y contrarreferencia quedan vinculadas al caso
    Y se notifica a la gestora responsable para continuar el seguimiento
    Y el retorno queda registrado como hito de la línea de tiempo
```
