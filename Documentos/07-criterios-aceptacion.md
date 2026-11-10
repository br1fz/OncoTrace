# Criterios de aceptación (Gherkin)

Este documento especifica el comportamiento esperado de las historias de usuario de OncoTrace (HU-01 a HU-11), proporcionando criterios de aceptación formales en notación Gherkin para la derivación rigurosa de pruebas y código verificable. Los escenarios describen condiciones de aceptación; no acreditan implementación ni ejecución de pruebas.

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

  Escenario: HU-01-ESC-04 Rechazo de hito con fecha de ocurrencia futura
    Dado un caso oncológico registrado en el sistema
    Y un profesional autorizado para registrar hitos
    Cuando el profesional intenta registrar un hito asistencial con una fecha de ocurrencia posterior a la fecha actual
    Entonces el sistema rechaza el registro con el mensaje "La fecha de ocurrencia no puede ser futura"
    Y la línea de tiempo del caso no sufre modificaciones
    Y la etapa del caso permanece sin cambios

  Escenario: HU-01-ESC-05 Rechazo de hito con fecha anterior al último hito registrado
    Dado un caso oncológico con al menos un hito asistencial registrado
    Y un profesional autorizado para registrar hitos
    Cuando el profesional intenta registrar un nuevo hito con una fecha de ocurrencia anterior a la fecha del último hito registrado
    Entonces el sistema rechaza el registro con el mensaje "La fecha de ocurrencia no puede ser anterior al último hito registrado"
    Y no se generan incongruencias cronológicas en la línea de tiempo
    Y la etapa del caso permanece sin cambios
```

---

## HU-04 — Motor de alertas preventivas de plazos GES e inactividad

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

## HU-05 — Consolidación e indexación automática de biopsias y PACS con alertas críticas

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

## HU-08 — Trazabilidad de derivaciones externas y reembolso de pasajes (circuito TENS / UGAA / HCVB)

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

---

## HU-02 — Evaluación multidimensional y estratificación por dominios

**Historia de origen:** [HU-02](./04-historias-usuario.md#hu-02).

**Historia:** Como Gestor/a de Casos Oncológicos de la UGCO, quiero aplicar y registrar la pauta de valoración inicial por dominios (clínico-funcional, psicoemocional, familiar/cuidador, socioeconómico, espiritual y comprensión diagnóstica), para identificar factores de riesgo biopsicosocial, pesquisar sobrecarga del cuidador y priorizar derivaciones oportunas al equipo multidisciplinario.

**Requisito asociado:** RF-02.

```gherkin
Característica: Evaluación multidimensional y estratificación de vulnerabilidad

  Escenario: HU-02-ESC-01 Registro de evaluación inicial y cálculo de vulnerabilidad
    Dado un caso oncológico en etapa de sospecha o confirmación diagnóstica
    Y una gestora UGCO autorizada aplicando la pauta inicial de valoración
    Cuando la gestora registra los puntajes de los seis dominios (clínico-funcional ECOG, psicoemocional, cuidador Zarit, socioeconómico, espiritual y comprensión diagnóstica)
    Entonces OncoTrace almacena la evaluación vinculada al caso y paciente
    Y calcula el índice integral de vulnerabilidad clasificando el caso en Bajo, Medio o Alto
    Y genera sugerencias de derivación al equipo psicosocial si el dominio psicoemocional o socioeconómico presenta alteración crítica

  Escenario: HU-02-ESC-02 Detección de sobrecarga severa en cuidador principal
    Dado un caso oncológico con cuidador principal identificado
    Cuando la gestora registra en la pauta un puntaje de escala Zarit superior a 56 puntos
    Entonces OncoTrace emite una alerta prioritaria para la Unidad de Servicio Social
    Y exige el registro de una solicitud formal de apoyo o intervención psicosocial para el cuidador

  Escenario: HU-02-ESC-03 Exigencia de índice funcional clínico mínimo
    Dado un paciente oncológico sin registro de rendimiento funcional previo
    Cuando la gestora intenta guardar la evaluación multidimensional sin ingresar el valor ECOG (0-4)
    Entonces el sistema rechaza el registro indicando el campo clínico obligatorio
    Y mantiene el caso en su estado previo sin alterar la estratificación
```

---

## HU-03 — Bitácora digital de acompañamiento y puntos de contacto obligatorios

**Historia de origen:** [HU-03](./04-historias-usuario.md#hu-03).

**Historia:** Como Gestor/a o TENS de la UGCO, quiero registrar cada interacción asistencial en una bitácora cronológica que verifique el cumplimiento de los 6 puntos de contacto obligatorio normados según la curva de vulnerabilidad del Journey Map, para asegurar la continuidad del cuidado, evitar deserciones y mantener un canal de comunicación unificado en el equipo de salud.

**Requisito asociado:** RF-03.

```gherkin
Característica: Bitácora digital de acompañamiento y puntos de contacto

  Escenario: HU-03-ESC-01 Registro de punto de contacto normado según Journey Map
    Dado un caso oncológico asignado a una gestora o TENS de la UGCO
    Y que el paciente alcanza uno de los seis hitos obligatorios del Journey Map (P1: Ingreso/Sospecha inicial, P2: Post-confirmación diagnóstica con IPD, P3: Etapificación/Post-resolución de comité, P4: Al alta de hospitalización o cirugía, P5: Al finalizar tratamiento activo y retorno a vida cotidiana, P6: Ante toda derivación a otro establecimiento de la red)
    Cuando la gestora o TENS registra la interacción con fecha, tipo de contacto, interlocutor (paciente o cuidador), motivo, resumen de interacción y acuerdos
    Entonces OncoTrace marca el punto de contacto correspondiente como cumplido
    Y añade el evento a la bitácora cronológica del caso con identificación del funcionario responsable en orden descendente
    Y actualiza el indicador de contactabilidad del paciente sin permitir la eliminación física del registro

  Escenario: HU-03-ESC-02 Alerta preventiva por punto de contacto obligatorio pendiente
    Dado un caso oncológico que alcanzó un hito asistencial normado hace más de 48 horas hábiles
    Y que el punto de contacto obligatorio correspondiente no ha sido registrado en la bitácora
    Cuando el motor de monitoreo de OncoTrace evalúa la trayectoria del paciente
    Entonces genera una alerta preventiva de contacto pendiente dirigida a la gestora asignada
    Y destaca la advertencia en el tablero para evitar el desenganche y la deserción asistencial

  Escenario: HU-03-ESC-03 Registro de intento fallido y protocolo de búsqueda activa
    Dado un paciente programado para contacto de acompañamiento que no responde tras la llamada de la UGCO
    Cuando el funcionario registra el resultado No contactable indicando interlocutor y motivo en la bitácora
    Entonces OncoTrace contabiliza el intento fallido
    Y si se alcanzan tres intentos fallidos consecutivos, genera una alerta para activar el protocolo de búsqueda activa y coordinación con APS

  Escenario: HU-03-ESC-04 Registro de corrección mediante adenda inmutable
    Dado un registro previo en la bitácora de acompañamiento que requiere aclaración o rectificación
    Cuando el profesional responsable ingresa una corrección asistencial
    Entonces el sistema conserva intacto el registro original
    Y genera una nota de adenda vinculada con fecha, hora, usuario y motivo de la enmienda
```

---

## HU-06 — Generación automática de ficha de presentación a comité oncológico

**Historia de origen:** [HU-06](./04-historias-usuario.md#hu-06).

**Historia:** Como Gestor/a Oncológico/a de la UGCO, quiero generar automáticamente la Ficha Resumen de Presentación con los antecedentes clínicos completos del paciente, para suprimir la transcripción manual en documentos Word externos y agilizar la preparación de la tabla del Comité Oncológico Regional.

**Requisito asociado:** RF-06.

```gherkin
Característica: Generación automatizada de ficha de presentación a comité

  Escenario: HU-06-ESC-01 Generación automática de la ficha resumen
    Dado un caso oncológico con confirmación diagnóstica, informe de biopsia validado y etapificación preliminar
    Cuando la gestora oncológica solicita generar la Ficha de Presentación a Comité
    Entonces OncoTrace consolida antecedentes demográficos, diagnóstico CIE-10, biopsia validada, TNM preliminar e imágenes indexadas
    Y asigna a la ficha un folio digital único correlativo
    Y habilita el campo de propuesta terapéutica para el médico tratante

  Escenario: HU-06-ESC-02 Bloqueo de generación ante biopsia no validada
    Dado un caso oncológico cuya orden de biopsia continúa en estado pendiente o sin validación en LIS
    Cuando la gestora solicita generar la Ficha de Presentación a Comité
    Entonces el sistema bloquea la emisión del documento oficial
    Y emite un mensaje notificando que se requiere informe histopatológico validado o justificación médica excepcional de urgencia

  Escenario: HU-06-ESC-03 Inclusión en la tabla de sesión del Comité Regional
    Dada una Ficha Resumen validada por el médico tratante
    Cuando la gestora programa el caso para la próxima sesión del Comité Oncológico Regional
    Entonces OncoTrace añade el caso a la tabla oficial de la sesión
    Y deja el expediente digital disponible para la revisión previa del equipo médico participante
```

---

## HU-07 — Acta digital de comité, firma electrónica y REM 7

**Historia de origen:** [HU-07](./04-historias-usuario.md#hu-07).

**Historia:** Como Médico Integrante del Comité Oncológico Regional, quiero registrar la conducta terapéutica acordada y suscribir el acta con firma electrónica durante la sesión colegiada, para eliminar las actas en papel físico, garantizar la validez legal de la resolución y generar automáticamente el informe estadístico REM 7 exigido por el MINSAL.

**Requisitos asociados:** RF-07, RNF-03 y REQ-DER-01.

```gherkin
Característica: Acta digital de comité, firma electrónica y REM 7

  Escenario: HU-07-ESC-01 Deliberación colegiada y suscripción con firma electrónica
    Dada una sesión del Comité Oncológico Regional con quórum médico normado y un caso en tabla
    Cuando los médicos integrantes registran la conducta acordada y suscriben con su firma electrónica
    Entonces OncoTrace formaliza el Acta Digital de Comité
    Y estampa la firma electrónica de los participantes con fecha, hora, rol y código de validación
    Y registra la resolución como hito formal en la línea de tiempo del caso oncológico

  Escenario: HU-07-ESC-02 Sellado e inmutabilidad del acta tras la firma
    Dada un Acta Digital debidamente suscrita por los médicos del comité
    Cuando un usuario intenta editar o anular el texto de la resolución
    Entonces el sistema bloquea cualquier alteración garantizando la inmutabilidad legal (Ley N° 20.584 y DS N° 29)
    Y exige una nueva presentación a comité si se requiere modificar la conducta consensuada

  Escenario: HU-07-ESC-03 Consolidación automática para reporte ministerial REM 7
    Dadas las actas de comités oncológicos cerradas durante el mes calendario
    Cuando un usuario autorizado solicita el consolidado de producción del comité
    Entonces OncoTrace totaliza los casos por localización anatómica, histología, etapa clínica y conducta acordada
    Y genera el informe consolidado correspondiente a la serie REM 7 del MINSAL sin requerir doble digitación manual
```

---

## HU-09 — Tótem de autoatención en sala de espera

**Historia de origen:** [HU-09](./04-historias-usuario.md#hu-09).

**Historia:** Como Paciente o Cuidador Principal en la sala de espera de la UGCO, quiero consultar el estado de avance de mis exámenes e hitos asistenciales desde una pantalla táctil, para obtener información certera y oportuna de forma autónoma sin necesidad de interrumpir la labor clínica del mesón gestor.

**Requisitos asociados:** RF-09 y RNF-03.

```gherkin
Característica: Tótem de autoatención en sala de espera

  Escenario: HU-09-ESC-01 Consulta de estado de exámenes por paciente con verificación autorizada
    Dado un paciente en la sala de espera de la UGCO ante el tótem de autoatención
    Cuando completa el método de verificación de identidad autorizado por el hospital mediante escaneo de cédula de identidad y factor de autenticación secundario válido
    Entonces la interfaz despliega los estados macro de sus estudios en lenguaje claro: En proceso en laboratorio, Informe listo para revisión médica, Caso agendado en comité o Próxima cita médica programada
    Y el sistema no permite el acceso mediante el ingreso exclusivo del RUN ni con el escaneo simple de la cédula sin validación secundaria

  Escenario: HU-09-ESC-02 Consulta de trámites por cuidador con autorización vigente
    Dado un cuidador principal con autorización registrada y vigente para un paciente
    Cuando completa la verificación de identidad autorizada en el tótem de autoatención
    Entonces el sistema reconoce el vínculo vigente y presenta los estados macro de los trámites del paciente

  Escenario: HU-09-ESC-03 Bloqueo de consulta a cuidador sin autorización vigente
    Dado un usuario que se presenta en el tótem como cuidador de un paciente
    Cuando intenta consultar y el sistema detecta que no posee autorización registrada o que se encuentra expirada
    Entonces el tótem bloquea la visualización de la información asistencial
    Y despliega un mensaje orientando a acudir al mesón de la UGCO para tramitar la autorización formal

  Escenario: HU-09-ESC-04 Resguardo de confidencialidad y anonimización de diagnósticos
    Dado un paciente o cuidador autorizado consultando en el tótem táctil de la sala de espera
    Cuando el sistema presenta el avance de estudios de anatomía patológica o imagenología
    Entonces omite diagnósticos histopatológicos específicos, descripciones de biopsia y contenidos clínicos sensibles en la pantalla pública
    Y orienta a consultar directamente con el médico tratante o gestora UGCO para la entrega del informe clínico

  Escenario: HU-09-ESC-05 Cierre de sesión por inactividad de 30 segundos o botón Salir
    Dada una sesión activa de consulta en la pantalla del tótem de autoatención
    Cuando transcurren treinta segundos continuos sin interacción táctil o el usuario presiona el botón Salir
    Entonces el sistema cierra inmediatamente la sesión, borra cualquier dato del paciente de la pantalla
    Y retorna a la interfaz inicial de bienvenida para proteger la privacidad frente a terceros
```

---

## HU-10 — Chatbot de orientación institucional y triage presencial (Ley N° 21.258)

**Historia de origen:** [HU-10](./04-historias-usuario.md#hu-10).

**Historia:** Como Paciente o usuario que acude de forma espontánea a la UGCO, quiero interactuar con un asistente conversacional que resuelva dudas frecuentes sobre mis derechos y me entregue un turno priorizado si requiero atención humana, para recibir orientación inmediata y ser atendido por la gestora de manera ordenada según la complejidad de mi situación.

**Requisito asociado:** RF-10.

```gherkin
Característica: Chatbot de orientación de derechos y triage presencial

  Escenario: HU-10-ESC-01 Consulta guiada de derechos y canales asistenciales
    Dado un usuario interactuando con el asistente conversacional institucional
    Cuando consulta sobre garantías de la Ley Nacional del Cáncer N° 21.258, plazos GES o traslados
    Entonces el chatbot responde en lenguaje accesible citando los derechos legales y conductos regulares
    Y ofrece opciones para resolver consultas frecuentes de navegación clínica

  Escenario: HU-10-ESC-02 Triage de demanda espontánea y detección de urgencia
    Dado un paciente con dolor oncológico severo o descompensación clínica interactuando con el triage
    Cuando responde las preguntas del cuestionario clínico guiado
    Entonces el sistema clasifica la situación con prioridad Alta
    Y genera un aviso urgente hacia la enfermera gestora orientando además la derivación al Servicio de Urgencia si procede

  Escenario: HU-10-ESC-03 Emisión de turno y sincronización con mesón de la UGCO
    Dado un usuario que solicita atención personalizada en el mesón de la UGCO
    Cuando completa el triage con el asistente
    Entonces el chatbot emite un ticket digital con su número de turno y prioridad
    Y transmite la solicitud a la pantalla del mesón de la gestora oncológica para gestionar la espera de forma ordenada
```

---

## HU-11 — Intercambio de información de seguimiento con MINSAL

**Historia de origen:** [HU-11](./04-historias-usuario.md#hu-11).

**Historia:** Como Gestor/a de Casos Oncológicos de la UGCO con permisos para supervisar el intercambio de información, quiero consultar el estado de los envíos de datos de seguimiento a la Plataforma de Seguimiento Oncológico del MINSAL y gestionar los errores, para reducir la doble digitación y detectar envíos pendientes o fallidos.

**Requisito asociado:** RF-11.

```gherkin
Característica: Interoperabilidad de seguimiento con la plataforma del MINSAL

  Escenario: HU-11-ESC-01 Transmisión exitosa de hito de seguimiento
    Dado un caso oncológico con un hito clínico confirmado en la línea de tiempo
    Y habilitada la integración con los servicios centrales del MINSAL
    Cuando OncoTrace ejecuta la sincronización del evento clínico
    Entonces transmite el mensaje interoperable con los datos requeridos
    Y al recibir la respuesta satisfactoria del MINSAL, marca el hito como Sincronizado
    Y almacena el identificador de transacción y fecha de confirmación ministerial

  Escenario: HU-11-ESC-02 Detección de error de transmisión y encolamiento para reintento
    Dado un envío de hito oncológico que es rechazado por indisponibilidad del MINSAL o discrepancia de esquema
    Cuando OncoTrace procesa la respuesta fallida
    Entonces registra el evento con estado Pendiente de Reintento
    Y conserva el detalle del error en la bitácora de interoperabilidad sin suspender la operación local
    Y programa el reintento automático según las políticas de conectividad definidas

  Escenario: HU-11-ESC-03 Auditoría y supervisión de intercambios institucionales
    Dado un usuario con permisos de supervisión de interoperabilidad
    Cuando accede al panel de monitoreo de intercambios MINSAL
    Entonces visualiza el consolidado de mensajes transmitidos, exitosos y pendientes
    Y puede filtrar por fecha o caso clínico para auditar la trazabilidad de los envíos
```
