# 👤 Historias de usuario

> **Resumen Ejecutivo:** Las siguientes historias documentan las funcionalidades requeridas por el equipo clínico. Cada historia está trazada explícitamente a una actividad rediseñada en el modelo TO-BE.

| ID | Título | Rol Principal | Prioridad |
|---|---|---|---|
| **HU-01** | Tablero de Trazabilidad | Gestora Oncológica | Alta (Must) |
| **HU-02** | Evaluación Multidimensional | Gestora Oncológica | Alta (Must) |
| **HU-03** | Bitácora de Acompañamiento | Gestora Oncológica | Alta (Must) |
| **HU-04** | Alertas de Plazos GES | Gestora Oncológica | Alta (Must) |
| **HU-05** | Consolidación de Biopsias | Sistema OncoTrace | Alta (Must) |
| **HU-06** | Generación Ficha Comité | Gestora Oncológica | Alta (Must) |
| **HU-07** | Acta Digital de Comité | Médico / Comité | Alta (Must) |
| **HU-08** | Trazabilidad Derivaciones | Gestora Oncológica | Alta (Must) |
| **HU-09** | Tótem de Autoatención | Paciente / Familiar | Media (Should / Extensión) |
| **HU-10** | Chatbot y Triage Espontáneo | Paciente / Gestora | Media (Should / Extensión) |

---

## 📌 HU-01
**Como** Gestora Oncológica,  
**quiero** visualizar un tablero centralizado con los pacientes y una línea de tiempo cronológica de los hitos asistenciales de cada paciente,  
**para** conocer rápidamente el estado de su atención y realizar seguimiento sin consultar múltiples planillas o sistemas.

**Actividad TO-BE asociada:** Gestora monitorea tablero Kanban y revisa resultados consolidados.

**Criterios de aceptación:**
- **CA1 — Visualización del tablero:** Dado que la gestora ingresa al módulo de seguimiento, cuando se carga el tablero, entonces el sistema debe mostrar los pacientes agrupados según su fase asistencial actual: **Sospecha, En Comité y Tratamiento**.
- **CA2 — Identificación del paciente:** Cada tarjeta del tablero debe mostrar, como mínimo, identificador del paciente, diagnóstico o sospecha diagnóstica disponible, fase actual, fecha del último hito y estado de alertas pendientes.
- **CA3 — Acceso a ficha:** Dado que la gestora selecciona un paciente del tablero, cuando hace clic sobre su tarjeta, entonces el sistema debe abrir su ficha de seguimiento.
- **CA4 — Línea de tiempo:** Dado que la gestora accede a la ficha, cuando visualiza la sección de línea de tiempo, entonces el sistema debe mostrar los hitos asistenciales en orden cronológico, indicando para cada uno la fecha, tipo de hito y días transcurridos desde el hito anterior o desde el evento de referencia correspondiente.
- **CA5 — Actualización del estado:** Cuando se registra un hito que modifica la fase asistencial del paciente, entonces el sistema debe actualizar automáticamente su ubicación en el tablero.
- **CA6 — Trazabilidad:** Cada hito mostrado debe permitir identificar su fecha de registro y, cuando corresponda, el usuario que lo registró.

---

## 📌 HU-02
**Como** Gestora Oncológica,  
**quiero** registrar y actualizar la evaluación clínica, funcional y psicosocial del paciente,  
**para** identificar factores de riesgo y priorizar el acompañamiento de pacientes que requieren mayor apoyo.

**Actividad TO-BE asociada:** Gestora realiza Evaluación Multidimensional (ECOG, Social, Red).

**Criterios de aceptación:**
- **CA1 — Evaluación funcional:** Dado que la gestora inicia una evaluación, cuando registra el estado funcional, entonces el sistema debe permitir seleccionar un valor ECOG válido entre **0 y 4**.
- **CA2 — Evaluación social:** El formulario debe permitir registrar los antecedentes socioeconómicos definidos por el modelo de atención y marcar como obligatorios aquellos campos necesarios para determinar el nivel de riesgo.
- **CA3 — Red de apoyo:** El formulario debe permitir registrar la existencia y características relevantes de la red de apoyo del paciente, incluyendo la identificación de situaciones de ausencia o insuficiencia de apoyo.
- **CA4 — Guardado y actualización:** Dado que la gestora completa una evaluación válida, cuando selecciona "Guardar", entonces el sistema debe almacenar la evaluación con fecha, hora y usuario responsable, manteniendo el historial de evaluaciones anteriores.
- **CA5 — Cálculo de riesgo:** Al guardar o actualizar la evaluación, el sistema debe calcular automáticamente el nivel de riesgo asistencial de acuerdo con las reglas configuradas.
- **CA6 — Visualización del riesgo:** El nivel de riesgo calculado debe visualizarse en la ficha del paciente y en el tablero principal mediante un indicador claramente identificable.
- **CA7 — Recalculo:** Cuando se modifica alguno de los antecedentes que participan en el cálculo de riesgo, el sistema debe actualizar el nivel de riesgo correspondiente.

---

## 📌 HU-03
**Como** Gestora Oncológica,  
**quiero** registrar cada contacto, intervención o gestión asistencial en una bitácora cronológica,  
**para** mantener la trazabilidad del acompañamiento y facilitar la coordinación entre los profesionales autorizados.

**Actividad TO-BE asociada:** Gestora registra primer contacto en Bitácora de Acompañamiento.

**Criterios de aceptación:**
- **CA1 — Nuevo registro:** Dado que la gestora realiza un contacto o gestión, cuando selecciona "Nuevo Registro", entonces el sistema debe permitir registrar fecha, tipo de contacto, medio utilizado, estado o situación reportada, incidencias, acciones realizadas y compromisos.
- **CA2 — Campos obligatorios:** El sistema debe validar los campos obligatorios antes de permitir guardar el registro.
- **CA3 — Próxima acción:** Cuando una gestión requiera seguimiento, el sistema debe permitir registrar una próxima acción y su fecha objetivo.
- **CA4 — Visualización cronológica:** Dado que un usuario autorizado accede a la bitácora, entonces debe visualizar los registros ordenados desde el más reciente al más antiguo.
- **CA5 — Trazabilidad:** Cada registro debe conservar fecha y hora de creación y el usuario que realizó el registro.
- **CA6 — Integridad:** Los registros históricos no deben eliminarse físicamente por usuarios funcionales; cualquier modificación posterior debe conservar la trazabilidad correspondiente.

---

## 📌 HU-04
**Como** Gestora Oncológica,  
**quiero** recibir alertas preventivas sobre plazos GES próximos a vencer y pacientes sin actividad asistencial,  
**para** intervenir oportunamente, reducir el riesgo de discontinuidad y apoyar el cumplimiento de los plazos establecidos.

**Actividad TO-BE asociada:** Motor de alertas evalúa plazos GES y riesgo de inactividad.

**Criterios de aceptación:**
- **CA1 — Alerta por proximidad de plazo:** Dado que un paciente tiene un plazo GES próximo a vencer, cuando el tiempo restante sea igual o inferior a **5 días hábiles**, entonces el sistema debe generar una alerta visible para la gestora.
- **CA2 — Cálculo de días hábiles:** El cálculo del plazo debe considerar la regla de días hábiles y el calendario correspondiente configurado en el sistema.
- **CA3 — Riesgo de inactividad:** Dado que un paciente no registra actividad asistencial durante más de **15 días**, cuando el motor de alertas ejecute su proceso de evaluación, entonces debe generar una alerta de "Riesgo de Abandono".
- **CA4 — Priorización:** Las alertas deben indicar al menos paciente, tipo de alerta, fecha de generación, fecha límite o días de inactividad y nivel de prioridad.
- **CA5 — Gestión de alerta:** Cuando la gestora revisa una alerta, debe poder acceder directamente a la ficha del paciente y registrar la acción realizada.
- **CA6 — Cierre:** Una alerta debe poder pasar a estado gestionada/resuelta únicamente cuando se registre la acción o condición definida para su cierre.
- **CA7 — Evitar duplicados:** El sistema no debe generar múltiples alertas activas del mismo tipo para un mismo paciente mientras la alerta anterior continúe vigente, salvo que las reglas de negocio indiquen lo contrario.

---

## 📌 HU-05
**Como** Gestora Oncológica,  
**quiero** que los informes de patología e imagenología se incorporen automáticamente a la ficha del paciente,  
**para** disponer de los antecedentes diagnósticos en un único lugar y reducir la búsqueda manual en sistemas externos.

**Actividad TO-BE asociada:** OncoTrace consolida e indexa informes de patología e imágenes.

**Criterios de aceptación:**
- **CA1 — Identificación del paciente:** El sistema debe utilizar el identificador institucional definido para la integración, por ejemplo RUN, para asociar correctamente los informes al paciente correspondiente.
- **CA2 — Sincronización:** El sistema debe consultar o recibir información desde los sistemas LIS/PACS según el mecanismo de integración definido.
- **CA3 — Incorporación del informe:** Cuando un informe sea recibido y validado, el sistema debe asociarlo automáticamente a la ficha del paciente, registrando al menos tipo de examen, fecha, estado y documento disponible.
- **CA4 — Notificación:** Cuando se incorpore un nuevo informe relevante, el sistema debe generar una notificación para la gestora según las reglas configuradas.
- **CA5 — Documento:** Cuando el documento esté disponible, la gestora debe poder acceder a él desde la ficha del paciente, de acuerdo con sus permisos.
- **CA6 — Exámenes solicitados:** El sistema debe comparar los estudios requeridos con los estudios recibidos y mostrar el estado de completitud de los exámenes.
- **CA7 — Errores de integración:** Si un informe no puede asociarse automáticamente a un paciente o existe un error de sincronización, el sistema debe registrar el incidente y dejarlo disponible para revisión, sin asociarlo incorrectamente.

---

## 📌 HU-06
**Como** Gestora Oncológica,  
**quiero** generar automáticamente una ficha de presentación con los antecedentes relevantes del paciente,  
**para** agilizar la preparación del comité multidisciplinario y asegurar que los participantes dispongan de información clínica organizada.

**Actividad TO-BE asociada:** OncoTrace compila antecedentes y genera Ficha de Presentación.

**Criterios de aceptación:**
- **CA1 — Elegibilidad para comité:** Dado que un paciente cuenta con los antecedentes mínimos definidos, cuando la gestora lo selecciona para comité, entonces el sistema debe permitir incorporarlo a la tabla de la sesión.
- **CA2 — Agendamiento:** Cuando la gestora selecciona la sesión o fecha correspondiente, el paciente debe quedar asociado a dicha sesión con un estado de preparación.
- **CA3 — Validación de antecedentes:** Antes de generar la ficha, el sistema debe indicar si faltan antecedentes obligatorios para la presentación.
- **CA4 — Generación automática:** Dado que el paciente está correctamente incorporado a la sesión, cuando la gestora solicita generar la ficha, entonces el sistema debe compilar automáticamente los antecedentes disponibles definidos para la presentación.
- **CA5 — Contenido:** La ficha debe incluir, según disponibilidad y reglas configuradas, diagnóstico, antecedentes de biopsia/patología, estudios de imagenología, estado ECOG y demás antecedentes requeridos por el comité.
- **CA6 — Identificación y versión:** El documento generado debe identificar al paciente, la sesión de comité, fecha de generación y versión del documento.
- **CA7 — Actualización:** Si se incorporan antecedentes relevantes antes de la sesión, la gestora debe poder regenerar la ficha para obtener una versión actualizada.

---

## 📌 HU-07
**Como** Médico del Comité Oncológico,  
**quiero** registrar el análisis y la resolución terapéutica directamente en la plataforma durante la sesión,  
**para** formalizar el acta del comité y dejar disponible la conducta acordada en la ficha del paciente.

**Actividad TO-BE asociada:** Comité evalúa caso y firma Acta Digital con conducta terapéutica.

**Criterios de aceptación:**
- **CA1 — Registro de participantes:** El sistema debe permitir registrar o seleccionar los médicos y profesionales participantes de la sesión.
- **CA2 — Registro clínico:** El sistema debe permitir registrar la estadificación TNM, antecedentes relevantes considerados y la indicación o conducta terapéutica acordada.
- **CA3 — Observaciones:** El sistema debe permitir registrar observaciones, condiciones o recomendaciones adicionales derivadas de la discusión del caso.
- **CA4 — Validación previa al cierre:** Antes de cerrar el acta, el sistema debe validar que los campos obligatorios estén completos.
- **CA5 — Firma:** Cuando el acta esté completa, un usuario con permisos correspondientes debe poder firmarla mediante el mecanismo de firma digital definido por la organización.
- **CA6 — Bloqueo posterior a firma:** Una vez firmada, el acta debe quedar cerrada y no debe permitir modificaciones ordinarias. Cualquier corrección posterior debe realizarse mediante el mecanismo formal de enmienda o versionado definido.
- **CA7 — Disponibilidad:** Una vez firmada, el acta debe quedar asociada a la ficha del paciente y disponible para los usuarios autorizados.
- **CA8 — Traspaso a seguimiento:** Al firmarse el acta, el sistema debe generar o actualizar automáticamente las tareas de seguimiento derivadas de la conducta registrada y asignarlas al responsable correspondiente.

---

## 📌 HU-08
**Como** Gestora Oncológica,  
**quiero** registrar y realizar seguimiento de las derivaciones realizadas a hospitales y prestadores externos,  
**para** mantener la trazabilidad del paciente hasta obtener el resultado o cierre de la derivación.

**Actividad TO-BE asociada:** Gestora realiza seguimiento activo de derivación en OncoTrace.

**Criterios de aceptación:**
- **CA1 — Registro de derivación:** Dado que el comité o equipo tratante determina una derivación, cuando la gestora registra la derivación, entonces debe poder indicar prestador de destino, tipo de prestación, fecha de solicitud, motivo, responsable y estado inicial.
- **CA2 — Derivación a prestador público:** Cuando la derivación corresponda al Hospital Carlos Van Buren (HCVB), el sistema debe identificarla como derivación externa y activar su seguimiento.
- **CA3 — Derivación privada:** Cuando la prestación sea realizada por un prestador privado, el sistema debe permitir registrar el prestador y mantener el estado de la derivación hasta la recepción del resultado o confirmación de atención.
- **CA4 — Estados de seguimiento:** La derivación debe poder avanzar por estados definidos, por ejemplo: **Solicitada → En espera → Atendida → Resultado recibido → Cerrada**, manteniendo la fecha de cada cambio.
- **CA5 — Incorporación de resultados:** Cuando se reciba un resultado o informe, la gestora debe poder asociarlo al paciente y a la derivación correspondiente.
- **CA6 — Cierre del hito:** Una vez recibido y validado el resultado requerido, el sistema debe permitir cerrar el hito de espera y registrar la fecha de cierre.
- **CA7 — Alertas de derivaciones pendientes:** El sistema debe identificar las derivaciones que superen el plazo de seguimiento configurado y generar una alerta para la gestora.
- **CA8 — Trazabilidad:** Cada derivación debe conservar su historial de estados, fechas, responsables, documentos asociados y acciones realizadas.

---

## 📌 HU-09
**Como** Paciente o Familiar autorizado en sala de espera,  
**quiero** consultar de manera segura el estado de mis biopsias, exámenes e informes mediante un tótem de autoatención,  
**para** conocer el avance de mi proceso diagnóstico sin depender de una consulta presencial con la gestora ni generar filas innecesarias.

**Actividad TO-BE asociada:** Módulo de Autoatención y Consulta de Informes (Extensión TO-BE).

**Criterios de aceptación:**
- **CA1 — Identificación segura:** Dado que el usuario utiliza el tótem, cuando selecciona la opción de consulta, entonces el sistema debe solicitar un mecanismo de identificación definido por la institución, como lectura de cédula/RUN y, cuando corresponda, un segundo factor de validación.
- **CA2 — Protección de información:** El sistema no debe mostrar información clínica sensible hasta completar correctamente el mecanismo de identificación y validación requerido.
- **CA3 — Consulta de estado:** Dado que el usuario está correctamente identificado, cuando selecciona "Consultar Estado de Exámenes", entonces el sistema debe consultar la información disponible en OncoTrace y mostrar únicamente los estudios asociados a ese paciente.
- **CA4 — Estados del examen:** El sistema debe mostrar el estado de cada estudio utilizando estados comprensibles y previamente definidos, por ejemplo: **Solicitado, En procesamiento, En análisis, Completado o Requiere revisión**.
- **CA5 — Fechas:** Cuando exista una fecha estimada de disponibilidad, el sistema debe mostrarla claramente, diferenciándola de la fecha efectiva de emisión del informe.
- **CA6 — Resultado disponible:** Cuando un informe esté disponible, el sistema debe indicar que se encuentra disponible para revisión por el canal autorizado, sin mostrar contenido clínico sensible en la pantalla pública salvo que el mecanismo de autenticación y las reglas de privacidad lo permitan expresamente.
- **CA7 — Orientación posterior:** Dado que los antecedentes requeridos están completos, cuando el paciente realiza una consulta, entonces el sistema debe informar, cuando exista la información disponible, si el caso se encuentra en preparación para comité, fue presentado a comité o tiene una próxima atención programada.
- **CA8 — Información no disponible:** Si no existen resultados disponibles, el sistema debe informar al usuario el estado actual sin revelar información interna del sistema ni generar la impresión de que existe un resultado cuando este aún no ha sido emitido.
- **CA9 — Acceso de familiar:** Cuando el usuario se identifique como familiar o representante, el sistema debe validar que cuenta con autorización vigente antes de permitir el acceso a información del paciente.
- **CA10 — Cierre automático de sesión:** Después de un período configurable de inactividad, o cuando el usuario seleccione "Finalizar consulta", el sistema debe cerrar la sesión y eliminar de pantalla la información del paciente.
- **CA11 — Registro de auditoría:** Cada consulta debe registrar, de acuerdo con las políticas de seguridad institucionales, fecha, hora, paciente consultado y mecanismo de acceso utilizado.
- **CA12 — Indisponibilidad del sistema:** Si OncoTrace o alguno de los sistemas integrados no está disponible, el tótem debe informar que la consulta temporalmente no puede realizarse y proporcionar una alternativa de orientación definida por la institución.

---

## 📌 HU-10
**Como** Paciente o usuario no programado, oncológico o en sospecha,  
**quiero** interactuar con un asistente conversacional en la sala de espera para resolver consultas frecuentes y, cuando sea necesario, solicitar atención humana,  
**para** recibir orientación clara y oportuna sobre el proceso asistencial y canalizar adecuadamente mis necesidades.

**Actividad TO-BE asociada:** Triage y Orientación Guiada al Paciente bajo Ley N° 21.258 (Extensión TO-BE).

**Criterios de aceptación:**
- **CA1 — Inicio de interacción:** Dado que el usuario inicia una conversación con el chatbot, cuando selecciona una categoría o ingresa una consulta mediante texto o voz, entonces el sistema debe interpretar la solicitud y orientar la interacción hacia la categoría correspondiente.
- **CA2 — Consultas frecuentes:** El chatbot debe responder consultas previamente definidas sobre temas administrativos, orientación dentro del establecimiento, toma de muestras, preparación para prestaciones y derechos u orientaciones generales relacionadas con el proceso oncológico.
- **CA3 — Lenguaje comprensible:** Las respuestas deben utilizar lenguaje claro, respetuoso y comprensible, evitando terminología técnica innecesaria.
- **CA4 — Límites de la orientación:** El chatbot no debe entregar diagnósticos, interpretar resultados clínicos ni indicar tratamientos. Cuando una consulta requiera evaluación profesional, debe orientar al usuario hacia atención humana.
- **CA5 — Identificación de necesidad compleja:** Dado que el usuario manifiesta una situación que requiere intervención humana, cuando el sistema identifica que la consulta excede las capacidades de autoatención, entonces debe ofrecer la opción de solicitar atención de un profesional.
- **CA6 — Triage asistencial:** Cuando corresponda realizar triage, el sistema debe recopilar únicamente la información necesaria para categorizar la solicitud según las reglas definidas por la institución.
- **CA7 — Ticket de atención:** Una vez categorizada la solicitud, el sistema debe generar un ticket único con número, categoría, prioridad, fecha y hora de emisión.
- **CA8 — Priorización:** La prioridad del ticket debe determinarse mediante reglas de negocio previamente configuradas y no exclusivamente mediante una interpretación libre del chatbot.
- **CA9 — Notificación a gestora:** Cuando se genere un ticket que requiera intervención de la gestora, el sistema debe incorporarlo al tablero de atención correspondiente y notificar al usuario responsable.
- **CA10 — Seguimiento del ticket:** El sistema debe permitir visualizar el estado del ticket, por ejemplo: **Emitido, En espera, En atención, Derivado y Cerrado**.
- **CA11 — Situaciones potencialmente urgentes:** Si durante la interacción el usuario comunica síntomas o situaciones que puedan requerir atención inmediata, el chatbot debe interrumpir el flujo de orientación rutinaria y entregar las instrucciones institucionales de atención urgente definidas para el establecimiento.
- **CA12 — Privacidad:** El chatbot debe solicitar y almacenar únicamente los datos necesarios para la orientación o generación del ticket, aplicando los controles de acceso y protección de información definidos por la institución.
- **CA13 — Trazabilidad:** El sistema debe conservar la trazabilidad de la solicitud, incluyendo fecha, hora, categoría, prioridad, ticket generado y resultado de la derivación, de acuerdo con las políticas institucionales.

