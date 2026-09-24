# 👤 Historias de usuario

> **Resumen Ejecutivo:** Las siguientes historias documentan las funcionalidades requeridas por el equipo clínico y los pacientes. Cada historia cuenta con trazabilidad formal hacia los nodos críticos del proceso AS-IS, las actividades rediseñadas del modelo TO-BE, y los requisitos funcionales del sistema.

| ID Historia | Título | Rol Principal | Prioridad | Nodo AS-IS | Nodo TO-BE | Requisito RF |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **HU-01** | Tablero de Trazabilidad | Gestora Oncológica | Alta (Must) | **AS-01**, **AS-04** | **TB-01** | **RF-USR-01** |
| **HU-02** | Evaluación Multidimensional | Gestora Oncológica | Alta (Must) | **AS-05** | **TB-02** | **RF-USR-02** |
| **HU-03** | Bitácora de Acompañamiento | Gestora Oncológica | Alta (Must) | **AS-05** | **TB-03** | **RF-USR-03** |
| **HU-04** | Alertas de Plazos GES | Gestora Oncológica | Alta (Must) | **AS-04**, **AS-05** | **TB-04** | **RF-SYS-01** |
| **HU-05** | Consolidación de Biopsias | Sistema OncoTrace | Alta (Must) | **AS-01** | **TB-05** | **RF-SYS-02** |
| **HU-06** | Generación Ficha Comité | Gestora Oncológica | Alta (Must) | **AS-02** | **TB-06** | **RF-SW-01** |
| **HU-07** | Acta Digital de Comité | Médico / Comité | Alta (Must) | **AS-02** | **TB-07** | **RF-SW-02** |
| **HU-08** | Trazabilidad Derivaciones | Gestora Oncológica | Alta (Must) | **AS-03** | **TB-08** | **RF-SYS-03** |
| **HU-09** | Tótem de Autoatención | Paciente / Familiar | Media (Should / Extensión) | **AS-06** | **TB-09** | **RF-EXT-01** |
| **HU-10** | Chatbot y Triage Espontáneo | Paciente / Gestora | Media (Should / Extensión) | **AS-06** | **TB-10** | **RF-EXT-02** |

---

## 📌 HU-01: Tablero de Trazabilidad y Timeline Clínico
- **Como** Gestora Oncológica,  
- **quiero** visualizar un tablero centralizado con los pacientes y una línea de tiempo cronológica de los hitos asistenciales de cada paciente,  
- **para** conocer rápidamente el estado de su atención y realizar seguimiento sin consultar múltiples planillas o sistemas.

**Trazabilidad:**
- **Nodo AS-IS mitigado:** **AS-01** (Dispersión de resultados), **AS-04** (Monitoreo manual de plazos)
- **Nodo TO-BE asociado:** **TB-01** (Tablero Kanban y Timeline Clínico)
- **Requisito asociado:** **RF-USR-01** | **RNF-SW-01**

**Criterios de aceptación:**
- **HU-01-CA1 — Visualización del tablero:** Dado que la gestora ingresa al módulo de seguimiento, cuando se carga el tablero, entonces el sistema debe mostrar los pacientes agrupados según su fase asistencial actual: **Sospecha, En Comité y Tratamiento**.
- **HU-01-CA2 — Identificación del paciente:** Cada tarjeta del tablero debe mostrar, como mínimo, identificador del paciente, diagnóstico o sospecha diagnóstica disponible, fase actual, fecha del último hito y estado de alertas pendientes.
- **HU-01-CA3 — Acceso a ficha:** Dado que la gestora selecciona un paciente del tablero, cuando hace clic sobre su tarjeta, entonces el sistema debe abrir su ficha de seguimiento.
- **HU-01-CA4 — Línea de tiempo:** Dado que la gestora accede a la ficha, cuando visualiza la sección de línea de tiempo, entonces el sistema debe mostrar los hitos asistenciales en orden cronológico, indicando para cada uno la fecha, tipo de hito y días transcurridos desde el hito anterior o desde el evento de referencia correspondiente.
- **HU-01-CA5 — Actualización del estado:** Cuando se registra un hito que modifica la fase asistencial del paciente, entonces el sistema debe actualizar automáticamente su ubicación en el tablero.
- **HU-01-CA6 — Trazabilidad:** Cada hito mostrado debe permitir identificar su fecha de registro y, cuando corresponda, el usuario que lo registró.

---

## 📌 HU-02: Evaluación Multidimensional y Estratificación de Riesgo
- **Como** Gestora Oncológica,  
- **quiero** registrar y actualizar la evaluación clínica, funcional y psicosocial del paciente,  
- **para** identificar factores de riesgo y priorizar el acompañamiento de pacientes que requieren mayor apoyo.

**Trazabilidad:**
- **Nodo AS-IS mitigado:** **AS-05** (Ausencia de registro centralizado de acompañamiento)
- **Nodo TO-BE asociado:** **TB-02** (Evaluación Multidimensional Estandarizada)
- **Requisito asociado:** **RF-USR-02**

**Criterios de aceptación:**
- **HU-02-CA1 — Evaluación funcional:** Dado que la gestora inicia una evaluación, cuando registra el estado funcional, entonces el sistema debe permitir seleccionar un valor ECOG válido entre **0 y 4**.
- **HU-02-CA2 — Evaluación social:** El formulario debe permitir registrar los antecedentes socioeconómicos definidos por el modelo de atención y marcar como obligatorios aquellos campos necesarios para determinar el nivel de riesgo.
- **HU-02-CA3 — Red de apoyo:** El formulario debe permitir registrar la existencia y características relevantes de la red de apoyo del paciente, incluyendo la identificación de situaciones de ausencia o insuficiencia de apoyo.
- **HU-02-CA4 — Guardado y actualización:** Dado que la gestora completa una evaluación válida, cuando selecciona "Guardar", entonces el sistema debe almacenar la evaluación con fecha, hora y usuario responsable, manteniendo el historial de evaluaciones anteriores.
- **HU-02-CA5 — Cálculo de riesgo:** Al guardar o actualizar la evaluación, el sistema debe calcular automáticamente el nivel de riesgo asistencial de acuerdo con las reglas configuradas.
- **HU-02-CA6 — Visualización del riesgo:** El nivel de riesgo calculado debe visualizarse en la ficha del paciente y en el tablero principal mediante un indicador claramente identificable.
- **HU-02-CA7 — Recalculo:** Cuando se modifica alguno de los antecedentes que participan en el cálculo de riesgo, el sistema debe actualizar el nivel de riesgo correspondiente.

---

## 📌 HU-03: Bitácora Cronológica de Acompañamiento
- **Como** Gestora Oncológica,  
- **quiero** registrar cada contacto, intervención o gestión asistencial en una bitácora cronológica,  
- **para** mantener la trazabilidad del acompañamiento y facilitar la coordinación entre los profesionales autorizados.

**Trazabilidad:**
- **Nodo AS-IS mitigado:** **AS-05** (Ausencia de registro centralizado de acompañamiento)
- **Nodo TO-BE asociado:** **TB-03** (Bitácora Cronológica de Acompañamiento)
- **Requisito asociado:** **RF-USR-03**

**Criterios de aceptación:**
- **HU-03-CA1 — Nuevo registro:** Dado que la gestora realiza un contacto o gestión, cuando selecciona "Nuevo Registro", entonces el sistema debe permitir registrar fecha, tipo de contacto, medio utilizado, estado o situación reportada, incidencias, acciones realizadas y compromisos.
- **HU-03-CA2 — Campos obligatorios:** El sistema debe validar los campos obligatorios antes de permitir guardar el registro.
- **HU-03-CA3 — Próxima acción:** Cuando una gestión requiera seguimiento, el sistema debe permitir registrar una próxima acción y su fecha objetivo.
- **HU-03-CA4 — Visualización cronológica:** Dado que un usuario autorizado accede a la bitácora, entonces debe visualizar los registros ordenados desde el más reciente al más antiguo.
- **HU-03-CA5 — Trazabilidad:** Cada registro debe conservar fecha y hora de creación y el usuario que realizó el registro.
- **HU-03-CA6 — Integridad:** Los registros históricos no deben eliminarse físicamente por usuarios funcionales; cualquier modificación posterior debe conservar la trazabilidad correspondiente.

---

## 📌 HU-04: Motor de Alertas Preventivas de Plazos GES e Inactividad
- **Como** Gestora Oncológica,  
- **quiero** recibir alertas preventivas sobre plazos GES próximos a vencer y pacientes sin actividad asistencial,  
- **para** intervenir oportunamente, reducir el riesgo de discontinuidad y apoyar el cumplimiento de los plazos establecidos.

**Trazabilidad:**
- **Nodo AS-IS mitigado:** **AS-04** (Riesgo de vencimiento GES), **AS-05** (Deserción de pacientes)
- **Nodo TO-BE asociado:** **TB-04** (Motor de Alertas Preventivas GES e Inactividad)
- **Requisito asociado:** **RF-SYS-01**

**Criterios de aceptación:**
- **HU-04-CA1 — Alerta por proximidad de plazo:** Dado que un paciente tiene un plazo GES próximo a vencer, cuando el tiempo restante sea igual o inferior a **5 días hábiles**, entonces el sistema debe generar una alerta visible para la gestora.
- **HU-04-CA2 — Cálculo de días hábiles:** El cálculo del plazo debe considerar la regla de días hábiles y el calendario correspondiente configurado en el sistema.
- **HU-04-CA3 — Riesgo de inactividad:** Dado que un paciente no registra actividad asistencial durante más de **15 días**, cuando el motor de alertas ejecute su proceso de evaluación, entonces debe generar una alerta de "Riesgo de Abandono".
- **HU-04-CA4 — Priorización:** Las alertas deben indicar al menos paciente, tipo de alerta, fecha de generación, fecha límite o días de inactividad y nivel de prioridad.
- **HU-04-CA5 — Gestión de alerta:** Cuando la gestora revisa una alerta, debe poder acceder directamente a la ficha del paciente y registrar la acción realizada.
- **HU-04-CA6 — Cierre:** Una alerta debe poder pasar a estado gestionada/resuelta únicamente cuando se registre la acción o condición definida para su cierre.
- **HU-04-CA7 — Evitar duplicados:** El sistema no debe generar múltiples alertas activas del mismo tipo para un mismo paciente mientras la alerta anterior continúe vigente, salvo que las reglas de negocio indiquen lo contrario.

---

## 📌 HU-05: Consolidación e Indexación Automática de Biopsias y PACS
- **Como** Gestora Oncológica,  
- **quiero** que los informes de patología e imagenología se incorporen automáticamente a la ficha del paciente,  
- **para** disponer de los antecedentes diagnósticos en un único lugar y reducir la búsqueda manual en sistemas externos.

**Trazabilidad:**
- **Nodo AS-IS mitigado:** **AS-01** (Dispersión de resultados diagnósticos)
- **Nodo TO-BE asociado:** **TB-05** (Indexación y Consolidación de Biopsias/PACS)
- **Requisito asociado:** **RF-SYS-02** | **RNF-PROD-01** | **RNF-SYS-01**

**Criterios de aceptación:**
- **HU-05-CA1 — Identificación del paciente:** El sistema debe utilizar el identificador institucional definido para la integración, por ejemplo RUN, para asociar correctamente los informes al paciente correspondiente.
- **HU-05-CA2 — Sincronización:** El sistema debe consultar o recibir información desde los sistemas LIS/PACS según el mecanismo de integración definido.
- **HU-05-CA3 — Incorporación del informe:** Cuando un informe sea recibido y validado, el sistema debe asociarlo automáticamente a la ficha del paciente, registrando al menos tipo de examen, fecha, estado y documento disponible.
- **HU-05-CA4 — Notificación:** Cuando se incorpore un nuevo informe relevante, el sistema debe generar una notificación para la gestora según las reglas configuradas.
- **HU-05-CA5 — Documento:** Cuando el documento esté disponible, la gestora debe poder acceder a él desde la ficha del paciente, de acuerdo con sus permisos.
- **HU-05-CA6 — Exámenes solicitados:** El sistema debe comparar los estudios requeridos con los estudios recibidos y mostrar el estado de completitud de los exámenes.
- **HU-05-CA7 — Errores de integración:** Si un informe no puede asociarse automáticamente a un paciente o existe un error de sincronización, el sistema debe registrar el incidente y dejarlo disponible para revisión, sin asociarlo incorrectamente.

---

## 📌 HU-06: Generación Automática de Ficha de Presentación a Comité
- **Como** Gestora Oncológica,  
- **quiero** generar automáticamente una ficha de presentación con los antecedentes relevantes del paciente,  
- **para** agilizar la preparación del comité multidisciplinario y asegurar que los participantes dispongan de información clínica organizada.

**Trazabilidad:**
- **Nodo AS-IS mitigado:** **AS-02** (Gestión manual de comités oncológicos)
- **Nodo TO-BE asociado:** **TB-06** (Generación Automática de Ficha de Comité)
- **Requisito asociado:** **RF-SW-01**

**Criterios de aceptación:**
- **HU-06-CA1 — Elegibilidad para comité:** Dado que un paciente cuenta con los antecedentes mínimos definidos, cuando la gestora lo selecciona para comité, entonces el sistema debe permitir incorporarlo a la tabla de la sesión.
- **HU-06-CA2 — Agendamiento:** Cuando la gestora selecciona la sesión o fecha correspondiente, el paciente debe quedar asociado a dicha sesión con un estado de preparación.
- **HU-06-CA3 — Validación de antecedentes:** Antes de generar la ficha, el sistema debe indicar si faltan antecedentes obligatorios para la presentación.
- **HU-06-CA4 — Generación automática:** Dado que el paciente está correctamente incorporado a la sesión, cuando la gestora solicita generar la ficha, entonces el sistema debe compilar automáticamente los antecedentes disponibles definidos para la presentación.
- **HU-06-CA5 — Contenido:** La ficha debe incluir, según disponibilidad y reglas configuradas, diagnóstico, antecedentes de biopsia/patología, estudios de imagenología, estado ECOG y demás antecedentes requeridos por el comité.
- **HU-06-CA6 — Identificación y versión:** El documento generado debe identificar al paciente, la sesión de comité, fecha de generación y versión del documento.
- **HU-06-CA7 — Actualización:** Si se incorporan antecedentes relevantes antes de la sesión, la gestora debe poder regenerar la ficha para obtener una versión actualizada.

---

## 📌 HU-07: Formalización de Acta Digital de Comité y Firma Electrónica
- **Como** Médico del Comité Oncológico,  
- **quiero** registrar el análisis y la resolución terapéutica directamente en la plataforma durante la sesión,  
- **para** formalizar el acta del comité y dejar disponible la conducta acordada en la ficha del paciente.

**Trazabilidad:**
- **Nodo AS-IS mitigado:** **AS-02** (Gestión manual de comités oncológicos)
- **Nodo TO-BE asociado:** **TB-07** (Acta Clínica Digital con Firma Electrónica)
- **Requisito asociado:** **RF-SW-02** | **RNF-SW-02** | **REQ-DER-01**

**Criterios de aceptación:**
- **HU-07-CA1 — Registro de participantes:** El sistema debe permitir registrar o seleccionar los médicos y profesionales participantes de la sesión.
- **HU-07-CA2 — Registro clínico:** El sistema debe permitir registrar la estadificación TNM, antecedentes relevantes considerados y la indicación o conducta terapéutica acordada.
- **HU-07-CA3 — Observaciones:** El sistema debe permitir registrar observaciones, condiciones o recomendaciones adicionales derivadas de la discusión del caso.
- **HU-07-CA4 — Validación previa al cierre:** Antes de cerrar el acta, el sistema debe validar que los campos obligatorios estén completos.
- **HU-07-CA5 — Firma:** Cuando el acta esté completa, un usuario con permisos correspondientes debe poder firmarla mediante el mecanismo de firma digital definido por la organización.
- **HU-07-CA6 — Bloqueo posterior a firma:** Una vez firmada, el acta debe quedar cerrada y no debe permitir modificaciones ordinarias. Cualquier corrección posterior debe realizarse mediante el mecanismo formal de enmienda o versionado definido.
- **HU-07-CA7 — Disponibilidad:** Una vez firmada, el acta debe quedar asociada a la ficha del paciente y disponible para los usuarios autorizados.
- **HU-07-CA8 — Traspaso a seguimiento:** Al firmarse el acta, el sistema debe generar o actualizar automáticamente las tareas de seguimiento derivadas de la conducta registrada y asignarlas al responsable correspondiente.

---

## 📌 HU-08: Trazabilidad y Tracking de Derivaciones Externas
- **Como** Gestora Oncológica,  
- **quiero** registrar y realizar seguimiento de las derivaciones realizadas a hospitales y prestadores externos,  
- **para** mantener la trazabilidad del paciente hasta obtener el resultado o cierre de la derivación.

**Trazabilidad:**
- **Nodo AS-IS mitigado:** **AS-03** (Pérdida de trazabilidad en derivaciones externas)
- **Nodo TO-BE asociado:** **TB-08** (Módulo de Trazabilidad de Derivaciones Externas)
- **Requisito asociado:** **RF-SYS-03**

**Criterios de aceptación:**
- **HU-08-CA1 — Registro de derivación:** Dado que el comité o equipo tratante determina una derivación, cuando la gestora registra la derivación, entonces debe poder indicar prestador de destino, tipo de prestación, fecha de solicitud, motivo, responsable y estado inicial.
- **HU-08-CA2 — Derivación a prestador público:** Cuando la derivación corresponda al Hospital Carlos Van Buren (HCVB), el sistema debe identificarla como derivación externa y activar su seguimiento.
- **HU-08-CA3 — Derivación privada:** Cuando la prestación sea realizada por un prestador privado, el sistema debe permitir registrar el prestador y mantener el estado de la derivación hasta la recepción del resultado o confirmación de atención.
- **HU-08-CA4 — Estados de seguimiento:** La derivación debe poder avanzar por estados definidos: **Solicitada → En espera → Atendida → Resultado recibido → Cerrada**, manteniendo la fecha de cada cambio.
- **HU-08-CA5 — Incorporación de resultados:** Cuando se reciba un resultado o informe, la gestora debe poder asociarlo al paciente y a la derivación correspondiente.
- **HU-08-CA6 — Cierre del hito:** Una vez recibido y validado el resultado requerido, el sistema debe permitir cerrar el hito de espera y registrar la fecha de cierre.
- **HU-08-CA7 — Alertas de derivaciones pendientes:** El sistema debe identificar las derivaciones que superen el plazo de seguimiento configurado y generar una alerta para la gestora.
- **HU-08-CA8 — Trazabilidad:** Cada derivación debe conservar su historial de estados, fechas, responsables, documentos asociados y acciones realizadas.

---

## 📌 HU-09: Tótem de Autoatención en Sala de Espera (Extensión TO-BE)
- **Como** Paciente o Familiar autorizado en sala de espera,  
- **quiero** consultar de manera segura el estado de mis biopsias, exámenes e informes mediante un tótem de autoatención,  
- **para** conocer el avance de mi proceso diagnóstico sin depender de una consulta presencial con la gestora ni generar filas innecesarias.

**Trazabilidad:**
- **Nodo AS-IS mitigado:** **AS-06** (Interrupciones críticas por demanda espontánea)
- **Nodo TO-BE asociado:** **TB-09** (Tótem de Autoatención en Sala de Espera)
- **Requisito asociado:** **RF-EXT-01**

**Criterios de aceptación:**
- **HU-09-CA1 — Identificación segura:** Dado que el usuario utiliza el tótem, cuando selecciona la opción de consulta, entonces el sistema debe solicitar un mecanismo de identificación definido por la institución, como lectura de cédula/RUN y, cuando corresponda, un segundo factor de validación.
- **HU-09-CA2 — Protección de información:** El sistema no debe mostrar información clínica sensible hasta completar correctamente el mecanismo de identificación y validación requerido.
- **HU-09-CA3 — Consulta de estado:** Dado que el usuario está correctamente identificado, cuando selecciona "Consultar Estado de Exámenes", entonces el sistema debe consultar la información disponible en OncoTrace y mostrar únicamente los estudios asociados a ese paciente.
- **HU-09-CA4 — Estados del examen:** El sistema debe mostrar el estado de cada estudio utilizando estados comprensibles: **Solicitado, En procesamiento, En análisis, Completado o Requiere revisión**.
- **HU-09-CA5 — Fechas:** Cuando exista una fecha estimada de disponibilidad, el sistema debe mostrarla claramente, diferenciándola de la fecha efectiva de emisión del informe.
- **HU-09-CA6 — Resultado disponible:** Cuando un informe esté disponible, el sistema debe indicar que se encuentra disponible para revisión por el canal autorizado, sin mostrar contenido clínico sensible en la pantalla pública.
- **HU-09-CA7 — Orientación posterior:** Dado que los antecedentes requeridos están completos, cuando el paciente realiza una consulta, entonces el sistema debe informar si el caso se encuentra en preparación para comité, fue presentado a comité o tiene una próxima atención programada.
- **HU-09-CA8 — Información no disponible:** Si no existen resultados disponibles, el sistema debe informar al usuario el estado actual sin revelar información interna del sistema ni generar falsas expectativas.
- **HU-09-CA9 — Acceso de familiar:** Cuando el usuario se identifique como familiar o representante, el sistema debe validar que cuenta con autorización vigente antes de permitir el acceso a información del paciente.
- **HU-09-CA10 — Cierre automático de sesión:** Después de un período configurable de inactividad, o cuando el usuario seleccione "Finalizar consulta", el sistema debe cerrar la sesión y eliminar de pantalla la información del paciente.
- **HU-09-CA11 — Registro de auditoría:** Cada consulta debe registrar, de acuerdo con las políticas de seguridad institucionales, fecha, hora, paciente consultado y mecanismo de acceso utilizado.
- **HU-09-CA12 — Indisponibilidad del sistema:** Si OncoTrace o alguno de los sistemas integrados no está disponible, el tótem debe informar que la consulta temporalmente no puede realizarse y proporcionar una alternativa de orientación presencial.

---

## 📌 HU-10: Chatbot de Orientación y Triage Presencial bajo Ley N° 21.258 (Extensión TO-BE)
- **Como** Paciente o usuario no programado, oncológico o en sospecha,  
- **quiero** interactuar con un asistente conversacional en la sala de espera para resolver consultas frecuentes y, cuando sea necesario, solicitar atención humana,  
- **para** recibir orientación clara y oportuna sobre el proceso asistencial y canalizar adecuadamente mis necesidades.

**Trazabilidad:**
- **Nodo AS-IS mitigado:** **AS-06** (Interrupciones críticas por demanda espontánea)
- **Nodo TO-BE asociado:** **TB-10** (Chatbot de Orientación Institucional y Triage)
- **Requisito asociado:** **RF-EXT-02**

**Criterios de aceptación:**
- **HU-10-CA1 — Inicio de interacción:** Dado que el usuario inicia una conversación con el chatbot, cuando selecciona una categoría o ingresa una consulta mediante texto o voz, entonces el sistema debe interpretar la solicitud y orientar la interacción hacia la categoría correspondiente.
- **HU-10-CA2 — Consultas frecuentes:** El chatbot debe responder consultas previamente definidas sobre temas administrativos, orientación dentro del establecimiento, toma de muestras, preparación para prestaciones y derechos de la Ley N° 21.258.
- **HU-10-CA3 — Lenguaje comprensible:** Las respuestas deben utilizar lenguaje claro, respetuoso y comprensible, evitando terminología técnica médica compleja.
- **HU-10-CA4 — Límites de la orientación:** El chatbot no debe entregar diagnósticos, interpretar resultados clínicos ni indicar tratamientos. Cuando una consulta requiera evaluación profesional, debe orientar al usuario hacia atención humana.
- **HU-10-CA5 — Identificación de necesidad compleja:** Dado que el usuario manifiesta una situación que requiere intervención humana, cuando el sistema identifica que la consulta excede las capacidades de autoatención, entonces debe ofrecer la opción de solicitar atención de un profesional.
- **HU-10-CA6 — Triage asistencial:** Cuando corresponda realizar triage, el sistema debe recopilar únicamente la información necesaria para categorizar la solicitud según las reglas definidas por la institución.
- **HU-10-CA7 — Ticket de atención:** Una vez categorizada la solicitud, el sistema debe generar un ticket único con número, categoría, prioridad, fecha y hora de emisión.
- **HU-10-CA8 — Priorización:** La prioridad del ticket debe determinarse mediante reglas de negocio previamente configuradas y no exclusivamente mediante una interpretación libre del chatbot.
- **HU-10-CA9 — Notificación a gestora:** Cuando se genere un ticket que requiera intervención de la gestora, el sistema debe incorporarlo al tablero de atención correspondiente y notificar al usuario responsable.
- **HU-10-CA10 — Seguimiento del ticket:** El sistema debe permitir visualizar el estado del ticket: **Emitido, En espera, En atención, Derivado y Cerrado**.
- **HU-10-CA11 — Situaciones potencialmente urgentes:** Si durante la interacción el usuario comunica síntomas o situaciones de urgencia vital, el chatbot debe interrumpir el flujo de orientación y entregar las instrucciones institucionales de derivación inmediata a Urgencias.
- **HU-10-CA12 — Privacidad:** El chatbot debe solicitar y almacenar únicamente los datos necesarios para la orientación o generación del ticket, aplicando los controles de protección de datos personales.
- **HU-10-CA13 — Trazabilidad:** El sistema debe conservar la trazabilidad de la solicitud, incluyendo fecha, hora, categoría, prioridad, ticket generado y resultado de la derivación.


