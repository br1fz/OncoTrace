# Historias de Usuario

> **Resumen:** Historias de usuario del proyecto OncoTrace. Cada historia vincula el rol beneficiario, la funcionalidad requerida y el beneficio esperado, asociada a la actividad que cambia en el modelo de procesos TO-BE y a los requisitos funcionales del sistema.

| ID Historia | Título | Rol Principal | Prioridad | Problema AS-IS | Actividad TO-BE Asociada | Requisito RF |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **HU-01** | Tablero de Trazabilidad | Gestora Oncológica | Alta (Must) | **AS-01**, **AS-04** | **TB-01** (Monitoreo centralizado y timeline) | **RF-USR-01** |
| **HU-02** | Evaluación Multidimensional | Gestora Oncológica | Alta (Must) | **AS-05** | **TB-02** (Estratificación clínica y social) | **RF-USR-02** |
| **HU-03** | Bitácora de Acompañamiento | Gestora Oncológica | Alta (Must) | **AS-05** | **TB-03** (Registro de seguimiento activo) | **RF-USR-03** |
| **HU-04** | Alertas de Plazos GES | Gestora Oncológica | Alta (Must) | **AS-04**, **AS-05** | **TB-04** (Control automático de garantías) | **RF-SYS-01** |
| **HU-05** | Consolidación de Biopsias | Sistema OncoTrace | Alta (Must) | **AS-01** | **TB-05** (Indexación de informes diagnósticos) | **RF-SYS-02** |
| **HU-06** | Generación Ficha Comité | Gestora Oncológica | Alta (Must) | **AS-02** | **TB-06** (Consolidación previa a sesión) | **RF-SW-01** |
| **HU-07** | Acta Digital de Comité | Médico / Comité | Alta (Must) | **AS-02** | **TB-07** (Resolución clínica y firma) | **RF-SW-02** |
| **HU-08** | Trazabilidad Derivaciones | Gestora Oncológica | Alta (Must) | **AS-03** | **TB-08** (Seguimiento interhospitalario) | **RF-SYS-03** |
| **HU-09** | Tótem de Autoatención | Paciente / Familiar | Media (Should) | **AS-06** | **TB-09** (Consulta desatendida de estado) | **RF-EXT-01** |
| **HU-10** | Chatbot y Triage Espontáneo | Paciente / Gestora | Media (Should) | **AS-06** | **TB-10** (Orientación y categorización) | **RF-EXT-02** |

---

## HU-01
Como Gestora Oncológica, quiero visualizar un tablero centralizado con los pacientes y una línea de tiempo cronológica de los hitos asistenciales de cada paciente, para conocer rápidamente el estado de su atención y realizar seguimiento sin consultar múltiples planillas o sistemas.

**Actividad TO-BE asociada:** TB-01 (Monitoreo de pacientes en tablero Kanban y timeline clínico)  
**Requisitos asociados:** RF-USR-01 | RNF-SW-01  
**Problema AS-IS mitigado:** AS-01 (Dispersión de resultados), AS-04 (Monitoreo manual de plazos)

**Criterios de aceptación:**
- **CA1:** Dado que la gestora ingresa al módulo de seguimiento, cuando se renderiza el tablero, entonces el sistema debe mostrar a los pacientes clasificados en sus fases asistenciales: Sospecha, En Comité y Tratamiento.
- **CA2:** Dado que se despliega una tarjeta de paciente en el tablero, entonces debe contener: identificador institucional (RUN), sospecha diagnóstica, fase actual, fecha del último hito asistencial y estado de alertas activas.
- **CA3:** Dado que la gestora hace clic sobre la tarjeta de un paciente, entonces el sistema debe abrir la vista detallada de su ficha de seguimiento en menos de 2 segundos.
- **CA4:** Dado que se accede a la ficha del paciente, cuando se consulta la línea de tiempo, entonces el sistema debe mostrar los hitos asistenciales en orden cronológico inverso indicando tipo de evento, fecha y días transcurridos.
- **CA5:** Dado que se registra un hito clínico que modifica la fase del paciente, cuando se confirma el cambio, entonces el sistema debe reubicar automáticamente la tarjeta en la columna correspondiente del tablero.
- **CA6:** Dado cualquier hito desplegado en el sistema, entonces debe registrar de forma inmutable la fecha, hora y el usuario que lo generó.

---

## HU-02
Como Gestora Oncológica, quiero registrar y actualizar la evaluación clínica, funcional y psicosocial del paciente, para identificar factores de riesgo y priorizar el acompañamiento de pacientes que requieren mayor apoyo.

**Actividad TO-BE asociada:** TB-02 (Evaluación multidimensional y estratificación de riesgo)  
**Requisito asociado:** RF-USR-02  
**Problema AS-IS mitigado:** AS-05 (Ausencia de registro estructurado de acompañamiento)

**Criterios de aceptación:**
- **CA1:** Dado que la gestora abre el formulario de evaluación funcional, cuando selecciona el estado funcional, entonces el sistema debe restringir la selección a la escala ECOG válida (valores enteros entre 0 y 4).
- **CA2:** Dado que se completa la evaluación social, cuando falten campos obligatorios para el cálculo de vulnerabilidad, entonces el sistema debe bloquear el guardado y señalar los campos requeridos.
- **CA3:** Dado que la gestora evalúa la red de soporte, cuando se marque "Sin red de apoyo efectiva", entonces el sistema debe ponderar este factor con la máxima severidad en la estratificación social.
- **CA4:** Dado que se envía una evaluación válida, cuando se pulsa "Guardar", entonces el sistema debe almacenar el registro asociando marca de tiempo y RUN de la gestora, preservando el histórico anterior.
- **CA5:** Dado el guardado de una evaluación, entonces el motor de reglas debe calcular automáticamente el nivel de riesgo asistencial (Bajo, Medio, Alto).
- **CA6:** Dado que se calcula el nivel de riesgo, entonces debe mostrarse como un distintivo visual priorizado tanto en la cabecera de la ficha como en la tarjeta del tablero principal.

---

## HU-03
Como Gestora Oncológica, quiero registrar cada contacto, intervención o gestión asistencial en una bitácora cronológica, para mantener la trazabilidad del acompañamiento y facilitar la coordinación entre los profesionales autorizados.

**Actividad TO-BE asociada:** TB-03 (Registro en bitácora activa de intervenciones y navegación)  
**Requisito asociado:** RF-USR-03  
**Problema AS-IS mitigado:** AS-05 (Ausencia de registro centralizado de acompañamiento)

**Criterios de aceptación:**
- **CA1:** Dado que la gestora realiza una intervención o llamada, cuando crea una entrada en la bitácora, entonces debe ingresar obligatoriamente: fecha, medio de contacto, estado asistencial, acción efectuada y compromisos adquiridos.
- **CA2:** Dado que una intervención requiere seguimiento futuro, cuando la gestora define una tarea pendiente, entonces el sistema debe exigir una fecha compromiso y programar un recordatorio en el tablero.
- **CA3:** Dado que un profesional autorizado consulta la bitácora, entonces las entradas deben listarse en orden cronológico descendente.
- **CA4:** Dado un registro guardado en la bitácora, cuando cualquier usuario intente eliminarlo o modificar el texto original, entonces el sistema debe denegar el borrado físico y permitir únicamente notas de adenda con trazabilidad de autoría.

---

## HU-04
Como Gestora Oncológica, quiero recibir alertas preventivas sobre plazos GES próximos a vencer y pacientes sin actividad asistencial, para intervenir oportunamente, reducir el riesgo de discontinuidad y apoyar el cumplimiento de los plazos establecidos.

**Actividad TO-BE asociada:** TB-04 (Control preventivo de plazos legales y monitoreo de deserción)  
**Requisito asociado:** RF-SYS-01  
**Problema AS-IS mitigado:** AS-04 (Riesgo de vencimiento de plazos GES), AS-05 (Deserción de pacientes)

**Criterios de aceptación:**
- **CA1:** Dado un paciente con garantía GES activa, cuando resten 5 o menos días hábiles para el vencimiento del plazo legal, entonces el sistema debe generar una alerta preventiva visual destacada en color amarillo/rojo.
- **CA2:** Dado el cálculo de plazos de oportunidad GES, entonces el sistema debe computar exclusivamente días hábiles descontando feriados institucionales y fines de semana.
- **CA3:** Dado un paciente oncológico activo, cuando transcurran más de 15 días corridos sin ningún registro asistencial en su bitácora o ficha, entonces el sistema debe clasificarlo automáticamente en estado "Riesgo de Abandono".
- **CA4:** Dado que la gestora visualiza una alerta activa, cuando hace clic sobre la notificación, entonces el sistema debe redirigirla directamente a la ficha del paciente para gestionar el caso.
- **CA5:** Dado que una alerta se encuentra activa, cuando la gestora registra la gestión clínica requerida, entonces la alerta debe cambiar a estado resuelta con registro de fecha y responsable.

---

## HU-05
Como Gestora Oncológica, quiero que los informes de patología e imagenología se incorporen automáticamente a la ficha del paciente, para disponer de los antecedentes diagnósticos en un único lugar y reducir la búsqueda manual en sistemas externos.

**Actividad TO-BE asociada:** TB-05 (Consolidación e indexación automática de biopsias y reportes PACS)  
**Requisitos asociados:** RF-SYS-02 | RNF-PROD-01 | RNF-SYS-01  
**Problema AS-IS mitigado:** AS-01 (Dispersión de resultados diagnósticos)

**Criterios de aceptación:**
- **CA1:** Dado que el sistema LIS o PACS emite un resultado con firma diagnóstica, cuando OncoTrace consulta o recibe la información vía HL7/FHIR, entonces debe vincular el examen al paciente utilizando su RUN como clave única.
- **CA2:** Dado que un informe es validado e indexado, entonces debe quedar disponible en la pestaña de exámenes de la ficha del paciente indicando fecha de toma, fecha de informe, prestador y enlace al documento digital.
- **CA3:** Dado que ingresa un nuevo informe de biopsia confirmatoria, entonces el sistema debe enviar una notificación inmediata a la gestora responsable del paciente.
- **CA4:** Dado que un paciente tiene estudios solicitados en curso, entonces el sistema debe mostrar un panel de completitud diagnóstica indicando exámenes pendientes versus exámenes recibidos.
- **CA5:** Dado un error de sincronización o discrepancia en los datos identificatorios del paciente, entonces el sistema debe aislar el informe en una bandeja de excepciones técnicas sin asociarlo erróneamente a ninguna ficha.

---

## HU-06
Como Gestora Oncológica, quiero generar automáticamente una ficha de presentación con los antecedentes relevantes del paciente, para agilizar la preparación del comité multidisciplinario y asegurar que los participantes dispongan de información clínica organizada.

**Actividad TO-BE asociada:** TB-06 (Generación automatizada de ficha de presentación a comité)  
**Requisito asociado:** RF-SW-01  
**Problema AS-IS mitigado:** AS-02 (Gestión manual de comités oncológicos)

**Criterios de aceptación:**
- **CA1:** Dado que la gestora programa la tabla de un comité, cuando selecciona a un paciente con antecedentes mínimos completos, entonces el sistema debe asociarlo a la sesión correspondiente.
- **CA2:** Dado que se solicita la generación de la ficha de comité, cuando el paciente carece de biopsia informada o estado funcional registrado, entonces el sistema debe advertir los antecedentes faltantes antes de permitir la emisión del documento.
- **CA3:** Dado que la gestora confirma la compilación, entonces el sistema debe consolidar automáticamente en un formato estandarizado: diagnóstico, antecedentes histológicos, imágenes relevantes y evaluación ECOG.
- **CA4:** Dado el documento de presentación generado, entonces debe incluir de forma visible: RUN del paciente, fecha de la sesión, versión del documento y estado de preparación.
- **CA5:** Dado que se reciben nuevos exámenes previo a la sesión de comité, cuando la gestora pulsa "Actualizar ficha", entonces el sistema debe regenerar el resumen con los datos más recientes conservando el historial de versiones.

---

## HU-07
Como Médico del Comité Oncológico, quiero registrar el análisis y la resolución terapéutica directamente en la plataforma durante la sesión, para formalizar el acta del comité y dejar disponible la conducta acordada en la ficha del paciente.

**Actividad TO-BE asociada:** TB-07 (Formalización de acta digital colegiada y firma electrónica)  
**Requisitos asociados:** RF-SW-02 | RNF-SW-02 | REQ-DER-01  
**Problema AS-IS mitigado:** AS-02 (Gestión manual de comités oncológicos)

**Criterios de aceptación:**
- **CA1:** Dado el desarrollo de la sesión de comité, cuando el médico secretario abre el acta, entonces debe registrar a los profesionales participantes mediante autenticación institucional (SSO).
- **CA2:** Dado el debate clínico del caso, cuando se registra la resolución, entonces el sistema debe exigir el ingreso de: estadificación TNM, intención del tratamiento (curativa/paliativa) y la conducta terapéutica consensuada.
- **CA3:** Dado que se completan los campos obligatorios del acta, cuando el médico responsable ejecuta la firma electrónica, entonces el sistema debe estampar el certificado digital y bloquear el acta contra modificaciones ordinarias.
- **CA4:** Dado que un acta ha sido firmada, cuando se requiera corregir algún dato, entonces el sistema debe exigir la emisión formal de una adenda clínica autorizada por los miembros del comité.
- **CA5:** Dado el cierre y firma del acta, entonces el sistema debe actualizar de inmediato el estado del paciente en el tablero principal y derivar las órdenes de seguimiento a la gestora asignada.

---

## HU-08
Como Gestora Oncológica, quiero registrar y realizar seguimiento de las derivaciones realizadas a hospitales y prestadores externos, para mantener la trazabilidad del paciente hasta obtener el resultado o cierre de la derivación.

**Actividad TO-BE asociada:** TB-08 (Seguimiento digital de derivaciones interhospitalarias y contrarreferencia)  
**Requisitos asociados:** RF-SYS-03 | RNF-SYS-01  
**Problema AS-IS mitigado:** AS-03 (Pérdida de trazabilidad en derivaciones externas)

**Criterios de aceptación:**
- **CA1:** Dado que se indica un tratamiento externo (radioterapia o quimioterapia), cuando la gestora ingresa la derivación, entonces debe registrar: centro receptor (Hospital Carlos Van Buren o prestador privado en convenio), prestación solicitada, fecha de interconsulta y médico derivador.
- **CA2:** Dado que una derivación es ingresada al sistema, entonces debe transitar por los estados: Solicitada → En espera de cupo → Atendida en destino → Resultado recibido → Cerrada.
- **CA3:** Dado que una derivación permanece en estado "En espera de cupo" por más de 10 días hábiles sin confirmación del prestador receptor, entonces el sistema debe alertar a la gestora para realizar gestión de rescate.
- **CA4:** Dado que el prestador receptor remite el informe de contrarreferencia o fecha de inicio de radioterapia/quimioterapia, cuando la gestora lo ingresa al sistema, entonces el estado debe actualizarse automáticamente a "Atendida".
- **CA5:** Dado el historial de una derivación externa, entonces debe registrar todas las fechas de cambio de estado, documentos adjuntos y el usuario responsable de cada actualización.

---

## HU-09
Como Paciente o Familiar autorizado en sala de espera, quiero consultar de manera segura el estado de mis biopsias y exámenes mediante un tótem de autoatención, para conocer el avance de mi proceso diagnóstico sin depender de una consulta presencial con la gestora ni generar filas innecesarias.

**Actividad TO-BE asociada:** TB-09 (Autoatención presencial en sala de espera y consulta de trámites)  
**Requisito asociado:** RF-EXT-01  
**Problema AS-IS mitigado:** AS-06 (Interrupciones críticas por demanda espontánea)

**Criterios de aceptación:**
- **CA1:** Dado que un usuario interactúa con el tótem de autoatención, cuando inicia la consulta, entonces el sistema debe solicitar autenticación mediante lectura física de la cédula de identidad y validación por RUN.
- **CA2:** Dado que el paciente se autentica correctamente, cuando consulta sus exámenes, entonces el tótem debe mostrar únicamente el estado del trámite (En proceso, Pendiente de informe, Disponible) sin desplegar datos clínicos sensibles ni diagnósticos explícitos en pantalla pública.
- **CA3:** Dado que un examen cuenta con informe disponible, cuando el usuario lo consulta, entonces el sistema debe indicar que el informe fue integrado a su ficha institucional para revisión de su médico o gestora.
- **CA4:** Dado que la pantalla permanece inactiva por más de 30 segundos o el usuario presiona "Finalizar", entonces el sistema debe cerrar la sesión de inmediato y limpiar cualquier dato de pantalla.
- **CA5:** Dado cualquier acceso realizado a través del tótem, entonces debe generarse un registro de auditoría con fecha, hora, RUN consultado y resultado de la autenticación.

---

## HU-10
Como Paciente o usuario no programado, oncológico o en sospecha, quiero interactuar con un asistente conversacional en la sala de espera para resolver consultas frecuentes y solicitar atención cuando sea necesario, para recibir orientación clara y oportuna sobre el proceso asistencial y canalizar adecuadamente mis necesidades.

**Actividad TO-BE asociada:** TB-10 (Orientación interactiva de derechos, canales asistenciales y triage presencial)  
**Requisito asociado:** RF-EXT-02  
**Problema AS-IS mitigado:** AS-06 (Interrupciones críticas por demanda espontánea)

**Criterios de aceptación:**
- **CA1:** Dado que un usuario interactúa con el asistente digital, cuando realiza consultas sobre horarios, ubicación de policlínicos, derechos de la Ley Nacional del Cáncer N° 21.258 o etapas del proceso GES, entonces el sistema debe entregar respuestas validadas en lenguaje claro y accesible.
- **CA2:** Dado cualquier diálogo con el usuario, el sistema bajo ninguna circunstancia debe emitir diagnósticos médicos, prescribir fármacos ni interpretar exámenes clínicos.
- **CA3:** Dado que la consulta del usuario requiere intervención asistencial humana, cuando se confirma la necesidad, entonces el sistema debe clasificar el motivo de consulta y generar un ticket digital de atención en mesón con número de turno y prioridad asignada.
- **CA4:** Dado que el usuario describe síntomas de emergencia clínica o riesgo vital durante la interacción, entonces el asistente debe interrumpir inmediatamente la conversación e instruir en pantalla la concurrencia directa al Servicio de Urgencias del hospital.
- **CA5:** Dado que se emite un ticket clasificado como prioritario, entonces el sistema debe reflejarlo de forma inmediata en el tablero de gestión de la sala de espera para atención de la gestora.
