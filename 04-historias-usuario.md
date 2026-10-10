# Historias de Usuario

> **Resumen Ejecutivo:** Las siguientes historias de usuario documentan los requerimientos funcionales y de soporte para el equipo multidisciplinario de la Unidad de Gestión de Casos Oncológicos (UGCO) del Hospital Dr. Gustavo Fricke (HGF) y los pacientes. Cada historia cuenta con trazabilidad formal hacia los problemas del proceso AS-IS, las actividades del modelo rediseñado TO-BE (8 etapas de la trayectoria), los requisitos del sistema y las evidencias elicitadas (EL-01, EL-02, EL-03).

| ID Historia | Título | Rol Principal | Prioridad | Problema AS-IS Mitigado | Actividad TO-BE Asociada | Requisito Funcional |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **HU-01** | Tablero de Trazabilidad por Etapas | Gestor/a Oncológico/a | Alta (Must) | **AS-01**, **AS-04** | **TB-01** | **RF-01** |
| **HU-02** | Evaluación Multidimensional por Dominios | Gestor/a Oncológico/a | Alta (Must) | **AS-05** | **TB-02** | **RF-02** |
| **HU-03** | Bitácora de Puntos de Contacto Obligatorios | Gestor/a y TENS UGCO | Alta (Must) | **AS-05**, **AS-06** | **TB-03** | **RF-03** |
| **HU-04** | Alertas Preventivas de Plazos GES (DS N° 29) | Gestor/a Oncológico/a | Alta (Must) | **AS-04**, **AS-05** | **TB-04** | **RF-04** |
| **HU-05** | Consolidación de Biopsias y Valores Críticos | Gestor/a y Médico Tratante | Alta (Must) | **AS-01** | **TB-05** | **RF-05** |
| **HU-06** | Generación Ficha Resumen de Comité | Gestor/a Oncológico/a | Alta (Must) | **AS-02** | **TB-06** | **RF-06** |
| **HU-07** | Acta Digital de Comité y Registro REM 0.7 | Médico Especialista / Comité | Alta (Must) | **AS-02** | **TB-07** | **RF-07** |
| **HU-08** | Trazabilidad de Derivaciones a la Red (HCVB) | Gestor/a, TENS y UGAA | Alta (Must) | **AS-03** | **TB-08** | **RF-08** |
| **HU-09** | Tótem de Autoatención en Sala de Espera | Paciente / Cuidador | Media (Should) | **AS-06** | **TB-09** | **RF-09** |
| **HU-10** | Chatbot Institucional y Triage Asistencial (Ley N° 21.258) | Paciente / Gestor/a | Media (Should) | **AS-06** | **TB-10** | **RF-10** |

---

## 📌 HU-01: Tablero de Trazabilidad y Timeline Clínico por Etapas
- **Como** Gestor/a de Casos Oncológicos de la UGCO,  
- **quiero** visualizar un tablero centralizado estructurado según las 8 etapas de la trayectoria oncológica y una línea de tiempo cronológica por paciente,  
- **para** conocer rápidamente el estado de su atención, monitorear plazos normados y realizar seguimiento activo sin consultar múltiples planillas ni sistemas aislados.

**Trazabilidad:**
- **Problema AS-IS mitigado:** AS-01 (Dispersión de resultados diagnósticos), AS-04 (Monitoreo manual de plazos)
- **Actividad TO-BE asociada:** TB-01 (Monitoreo de pacientes en tablero Kanban y timeline clínico)
- **Requisitos asociados:** RF-01 | RNF-02

**Criterios de aceptación:**
- **HU-01-CA1 — Visualización del tablero por etapas:** Dado que la gestora ingresa al módulo de seguimiento, cuando se carga el tablero, entonces el sistema debe mostrar a los pacientes agrupados según las etapas de la trayectoria oncológica: **Sospecha, Confirmación Diagnóstica, Etapificación, En Comité, Tratamiento, Rehabilitación, Seguimiento y Alta/Cierre**.
- **HU-01-CA2 — Identificación del paciente:** Cada tarjeta del tablero debe mostrar, como mínimo, RUN y nombre del paciente, especialidad asignada, diagnóstico o sospecha CIE-10, etapa actual, fecha del último hito registrado y semáforo de alertas pendientes.
- **HU-01-CA3 — Acceso a ficha:** Dado que la gestora selecciona un paciente del tablero, cuando hace clic sobre su tarjeta, entonces el sistema debe abrir su ficha integral de seguimiento oncológico.
- **HU-01-CA4 — Línea de tiempo:** Dado que la gestora accede a la ficha, cuando visualiza la sección de línea de tiempo, entonces el sistema debe mostrar los hitos asistenciales en estricto orden cronológico, indicando para cada uno la fecha, tipo de hito y días transcurridos desde el hito anterior.
- **HU-01-CA5 — Actualización del estado:** Cuando se registra un hito clínico que modifica la etapa del paciente (ej. resolución de comité o inicio de tratamiento), el sistema debe actualizar automáticamente su ubicación en el tablero.
- **HU-01-CA6 — Trazabilidad de cambios:** Cada hito y cambio de estado debe conservar su fecha y hora de registro, así como el usuario y rol profesional responsable.

---

## 📌 HU-02: Evaluación Multidimensional y Estratificación por Dominios
- **Como** Gestor/a de Casos Oncológicos de la UGCO,  
- **quiero** aplicar y registrar la pauta de valoración inicial por dominios (clínico-funcional, psicoemocional, familiar/cuidador, socioeconómico, espiritual y comprensión diagnóstica),  
- **para** identificar factores de riesgo biopsicosocial, pesquisar sobrecarga del cuidador y priorizar derivaciones oportunas al equipo multidisciplinario.

**Trazabilidad:**
- **Problema AS-IS mitigado:** AS-05 (Falta de interoperabilidad y registro no estandarizado)
- **Actividad TO-BE asociada:** TB-02 (Evaluación multidimensional estandarizada)
- **Requisito asociado:** RF-02

**Criterios de aceptación:**
- **HU-02-CA1 — Evaluación funcional:** El sistema debe permitir registrar el estado funcional seleccionando un valor normalizado ECOG / OMS válido entre **0 y 4**.
- **HU-02-CA2 — Dominio psicosocial y socioeconómico:** El formulario debe incluir campos estructurados para registrar nivel de vulnerabilidad socioeconómica, previsión de salud, situación laboral y necesidad de derivación a trabajo social o psicología.
- **HU-02-CA3 — Evaluación del cuidador principal:** El formulario debe permitir identificar formalmente al cuidador principal (nombre, parentesco, contacto) y aplicar indicadores de pesquisa de sobrecarga del cuidador.
- **HU-02-CA4 — Dominio espiritual y comprensión:** Debe permitir consignar aspectos culturales/espirituales relevantes y el nivel de comprensión diagnóstica del paciente y familia.
- **HU-02-CA5 — Guardado y versionado:** Al completar la pauta, el sistema debe registrar fecha, hora y usuario responsable, manteniendo el historial inmutable de evaluaciones previas.
- **HU-02-CA6 — Cálculo automático de riesgo:** El sistema debe calcular automáticamente un índice de riesgo asistencial global que pondere el estado clínico, la vulnerabilidad social y la fragilidad del soporte familiar.
- **HU-02-CA7 — Visualización del riesgo:** El nivel de riesgo debe reflejarse mediante un distintivo visual (Alto, Medio, Bajo) en la ficha y en la tarjeta del tablero Kanban.

---

## 📌 HU-03: Bitácora Digital de Acompañamiento y Puntos de Contacto Obligatorios
- **Como** Gestor/a o TENS de la UGCO,  
- **quiero** registrar cada interacción asistencial en una bitácora cronológica que verifique el cumplimiento de los 6 puntos de contacto obligatorio normados,  
- **para** asegurar la continuidad del cuidado, evitar deserciones y mantener un canal de comunicación unificado en el equipo de salud.

**Trazabilidad:**
- **Problema AS-IS mitigado:** AS-05 (Registro fragmentado), AS-06 (Interrupciones y demanda desordenada)
- **Actividad TO-BE asociada:** TB-03 (Bitácora digital de acompañamiento)
- **Requisito asociado:** RF-03

**Criterios de aceptación:**
- **HU-03-CA1 — Registro de contacto:** El sistema debe permitir ingresar fecha, tipo de contacto (presencial, telefónico, visita en sala), interlocutor (paciente o cuidador), profesional actuante (Gestor/a o TENS), motivo, resumen de la interacción y acuerdos.
- **HU-03-CA2 — Verificación de puntos de contacto obligatorio:** La bitácora debe permitir etiquetar formalmente si el contacto corresponde a uno de los **6 puntos de contacto obligatorio** normados por la UGCO:
  1. *Ingreso / Sospecha inicial.*
  2. *Post-confirmación diagnóstica.*
  3. *Post-resolución de Comité Oncológico.*
  4. *Al alta de hospitalizaciones o intervenciones.*
  5. *Al finalizar el tratamiento activo.*
  6. *Ante derivaciones a prestadores externos.*
- **HU-03-CA3 — Alerta de contacto pendiente:** Si un paciente alcanza el hito clínico correspondiente y transcurren más de 48 horas hábiles sin registro del punto de contacto obligatorio, el sistema debe emitir un recordatorio a la gestora.
- **HU-03-CA4 — Programación de próxima acción:** El sistema debe permitir agendar la fecha y objetivo del siguiente contacto o seguimiento de exámenes.
- **HU-03-CA5 — Visualización cronológica:** Los registros deben desplegarse en orden cronológico descendente (más reciente al más antiguo).
- **HU-03-CA6 — Integridad inmutable:** Ningún registro de bitácora podrá ser eliminado directamente; cualquier corrección requerirá una nota de adenda con trazabilidad de usuario, fecha y hora.

---

## 📌 HU-04: Motor de Alertas Preventivas de Plazos GES (21 Patologías) e Inactividad
- **Como** Gestor/a Oncológico/a de la UGCO,  
- **quiero** recibir alertas preventivas automatizadas sobre plazos de garantías GES próximos a vencer y casos con inactividad prolongada,  
- **para** intervenir proactivamente, evitar vencimientos de plazos legales (Decreto Supremo N° 29 / Ley GES) y prevenir el abandono de tratamientos.

**Trazabilidad:**
- **Problema AS-IS mitigado:** AS-04 (Monitoreo manual de plazos GES), AS-05 (Riesgo de deserción asistencial)
- **Actividad TO-BE asociada:** TB-04 (Motor de alertas preventivas GES e inactividad)
- **Requisitos asociados:** RF-04 | RNF-01

**Criterios de aceptación:**
- **HU-04-CA1 — Alerta preventiva por proximidad de plazo:** Cuando falten $\le 5$ días hábiles para el vencimiento de una garantía de oportunidad GES en cualquiera de las 21 patologías oncológicas, el sistema debe generar una alerta de criticidad alta (rojo/amarillo).
- **HU-04-CA2 — Regla de días hábiles:** El cálculo debe realizarse considerando automáticamente el calendario nacional de días hábiles y feriados.
- **HU-04-CA3 — Alerta de riesgo de inactividad:** Si un caso permanece sin registros asistenciales, atenciones médicas ni exámenes durante más de **15 días corridos**, el motor debe clasificarlo en alerta por *"Riesgo de Inactividad/Abandono"*.
- **HU-04-CA4 — Notificación en tablero:** Las alertas deben desplegarse tanto en el panel general de la gestora como en la tarjeta del paciente, con indicación de días restantes y tipo de garantía.
- **HU-04-CA5 — Resolución de alerta:** Una alerta solo podrá ser cerrada cuando el sistema detecte el hito de cumplimiento (ej. atención efectuada o IPD emitido) o el gestor registre la gestión realizada en la bitácora.
- **HU-04-CA6 — Exportación para Unidad GES:** El sistema debe permitir exportar el reporte consolidado de alertas vigentes para su revisión semanal con la Unidad GES institucional.
- **HU-04-CA7 — No duplicidad:** El proceso programado no debe generar alertas redundantes mientras la condición original siga activa y pendiente de resolución.

---

## 📌 HU-05: Consolidación e Indexación Automática de Biopsias y PACS con Alertas Críticas
- **Como** Gestor/a Oncológico/a y Médico Tratante,  
- **quiero** que los informes de anatomía patológica, laboratorio e imagenología se indexen automáticamente en la ficha del paciente y alerten de inmediato ante hallazgos críticos,  
- **para** eliminar la búsqueda manual en múltiples plataformas y acelerar la toma de decisiones clínicas.

**Trazabilidad:**
- **Problema AS-IS mitigado:** AS-01 (Fragmentación y dispersión de resultados diagnósticos)
- **Actividad TO-BE asociada:** TB-05 (Consolidación automática y alertas críticas)
- **Requisitos asociados:** RF-05 | RNF-04 | RNF-01

**Criterios de aceptación:**
- **HU-05-CA1 — Indexación por RUN:** El sistema debe capturar informes validados desde los sistemas LIS (laboratorio/biopsias) y PACS (radiología) mediante estándares HL7 FHIR o API REST, asociándolos unívocamente al RUN del paciente.
- **HU-05-CA2 — Detección de informes críticos:** Si Anatomía Patológica emite un informe con diagnóstico positivo de malignidad o valor crítico, OncoTrace debe activar una notificación prioritaria inmediata al médico tratante y al gestor.
- **HU-05-CA3 — Indicador de completitud:** En la ficha y en el tablero se debe contrastar la lista de exámenes solicitados con los recibidos, indicando el porcentaje de completitud para presentación a comité.
- **HU-05-CA4 — Visualización integrada:** El profesional debe poder previsualizar y descargar los informes en PDF directamente desde OncoTrace sin necesidad de abrir visores externos.
- **HU-05-CA5 — Registro de compras de servicio:** Si el examen corresponde a una compra de servicio externo (ej. PET-CT, EBUS), debe permitir al gestor adjuntar el informe externo e incorporarlo al expediente consolidado.
- **HU-05-CA6 — Tolerancia a fallos:** Si un archivo presenta discrepancia en el identificador del paciente, el sistema debe almacenarlo en una bandeja de excepciones para auditoría sin asociarlo incorrectamente.

---

## 📌 HU-06: Generación Automática de Ficha de Presentación a Comité Oncológico
- **Como** Gestor/a Oncológico/a de la UGCO,  
- **quiero** generar automáticamente la Ficha Resumen de Presentación con los antecedentes clínicos completos del paciente,  
- **para** suprimir la transcripción manual en documentos Word externos y agilizar la preparación de la tabla del Comité Oncológico Regional.

**Trazabilidad:**
- **Problema AS-IS mitigado:** AS-02 (Gestión manual de comités oncológicos)
- **Actividad TO-BE asociada:** TB-06 (Generación automatizada de ficha de presentación a comité)
- **Requisito asociado:** RF-06

**Criterios de aceptación:**
- **HU-06-CA1 — Programación en tabla de comité:** La gestora debe poder ingresar al paciente a la tabla de una sesión específica del Comité Oncológico (General, Digestivo, Mama, Tórax, Hematología, Tiroides).
- **HU-06-CA2 — Compilación automática:** Al seleccionar "Generar Ficha de Comité", OncoTrace debe extraer automáticamente desde la ficha: antecedentes mórbidos, biopsias concluyentes, estudios de imágenes relevantes, estadio clínico propuesto y estado funcional ECOG.
- **HU-06-CA3 — Validación de prerrequisitos:** El sistema debe alertar si faltan estudios indispensables antes de validar la inclusión del caso en la tabla definitiva.
- **HU-06-CA4 — Formato estructurado:** La ficha autogenerada debe contar con encabezado institucional HGF, identificación del gestor y médico presentador, y campos para que el médico tratante agregue hipótesis diagnóstica y propuesta terapéutica.
- **HU-06-CA5 — Versión descargable:** El documento debe generarse en formato digital estandarizado (PDF protegido) disponible para todos los especialistas acreditados del comité.

---

## 📌 HU-07: Formalización de Acta Digital de Comité, Firma Electrónica y REM 0.7
- **Como** Médico Integrante del Comité Oncológico Regional,  
- **quiero** registrar la conducta terapéutica acordada y suscribir el acta con firma electrónica durante la sesión colegiada,  
- **para** eliminar las actas en papel físico, garantizar la validez legal de la resolución y generar automáticamente el informe estadístico REM 0.7 exigido por el MINSAL.

**Trazabilidad:**
- **Problema AS-IS mitigado:** AS-02 (Gestión manual de comités oncológicos)
- **Actividad TO-BE asociada:** TB-07 (Acta digital de comité y consolidación REM 0.7)
- **Requisitos asociados:** RF-07 | RNF-03 | REQ-DER-01

**Criterios de aceptación:**
- **HU-07-CA1 — Registro de asistencia:** El sistema debe registrar la asistencia de los médicos especialistas participantes vinculados mediante autenticación Single Sign-On institucional.
- **HU-07-CA2 — Resolución terapéutica estructurada:** Debe permitir seleccionar la modalidad terapéutica acordada: *Cirugía en LEIQ, Quimioterapia hematológica (HGF), Derivación a QT sólida/Radioterapia (HCVB), Cuidados Paliativos u otra modalidad combinada*, registrando la estadificación TNM final.
- **HU-07-CA3 — Firma electrónica y bloqueo:** Al finalizar la revisión del caso, el acta debe firmarse electrónicamente. Una vez firmada, el documento queda bloqueado contra modificaciones ordinarias y se adjunta a la ficha clínica institucional.
- **HU-07-CA4 — Generación automática REM 0.7:** OncoTrace debe compilar automáticamente los datos de la sesión para generar la planilla estadística oficial REM 0.7 exigida por el MINSAL, evitando la digitación posterior.
- **HU-07-CA5 — Disparo de tareas de seguimiento:** La firma del acta debe transicionar automáticamente el caso en el tablero Kanban y generar la tarea de agendamiento o derivación según la resolución adoptada.

---

## 📌 HU-08: Trazabilidad y Tracking de Derivaciones Externas (Circuito TENS / UGAA / HCVB)
- **Como** Gestor/a, TENS o Administrativo/a de la UGAA,  
- **quiero** gestionar la confección y despacho digital del dossier de derivación y monitorear el estado del paciente en los centros de referencia de la macrored,  
- **para** erradicar el "punto ciego" asistencial, confirmar la recepción en el Hospital Carlos Van Buren y resguardar la continuidad de la atención.

**Trazabilidad:**
- **Problema AS-IS mitigado:** AS-03 (Pérdida de trazabilidad en derivaciones externas)
- **Actividad TO-BE asociada:** TB-08 (Módulo de dossier digital y trazabilidad de derivaciones)
- **Requisitos asociados:** RF-08 | RNF-01

**Criterios de aceptación:**
- **HU-08-CA1 — Confección digital del dossier por TENS:** Dado que el comité resuelve una derivación externa (QT sólida o Radioterapia), cuando el TENS ingresa al módulo de derivaciones, entonces el sistema debe compilar automáticamente el expediente digital unificado con la interconsulta médica, informes de biopsia, imágenes y el acta firmada de comité.
- **HU-08-CA2 — Bandeja de despacho para UGAA:** El dossier digital debe pasar a la bandeja de trabajo de la UGAA, permitiendo al funcionario validar los antecedentes y registrar la fecha y folio formal de derivación externa.
- **HU-08-CA3 — Workflow de estados de derivación:** La derivación debe avanzar por estados visibles para el equipo: **Dossier Confeccionado $\rightarrow$ Despachado por UGAA $\rightarrow$ Recepcionado en HCVB $\rightarrow$ Cita Asignada $\rightarrow$ Tratamiento Iniciado $\rightarrow$ Contrarreferido con Epicrisis**.
- **HU-08-CA4 — Acuse de recibo y alerta de rezago:** Si transcurren más de 10 días hábiles desde el despacho de UGAA sin confirmación de recepción o fecha de atención en el HCVB, OncoTrace debe generar una alerta preventiva para gestión interinstitucional.
- **HU-08-CA5 — Retorno y contrarreferencia:** Al finalizar el tratamiento en el centro externo, el sistema debe permitir adjuntar la epicrisis y contrarreferencia, notificando a la gestora para reintegrar al paciente a la etapa de seguimiento en el HGF.

---

## 📌 HU-09: Tótem de Autoatención en Sala de Espera con Lectura de RUN (Extensión TO-BE)
- **Como** Paciente o Cuidador Principal en la sala de espera de la UGCO,  
- **quiero** consultar el estado de avance de mis exámenes e hitos asistenciales en una pantalla táctil mediante la lectura de mi cédula de identidad,  
- **para** obtener información certera y oportuna de forma autónoma sin necesidad de interrumpir la labor clínica del mesón gestor.

**Trazabilidad:**
- **Problema AS-IS mitigado:** AS-06 (Interrupciones críticas por demanda espontánea)
- **Actividad TO-BE asociada:** TB-09 (Autoatención presencial en sala de espera y consulta de trámites)
- **Requisito asociado:** RF-09

**Criterios de aceptación:**
- **HU-09-CA1 — Autenticación segura:** El paciente o cuidador acreditado debe autenticarse mediante lector de código de barras de su cédula de identidad o ingresando su RUN con dígito verificador.
- **HU-09-CA2 — Consulta de estado de exámenes:** El sistema debe consultar la API de OncoTrace y desplegar únicamente los estados macro de sus estudios en lenguaje claro: *En proceso en laboratorio, Informe listo para revisión médica, Caso agendado en comité, Próxima cita médica programada*.
- **HU-09-CA3 — Resguardo de confidencialidad:** El tótem no debe mostrar diagnósticos histopatológicos específicos ni contenidos clínicos sensibles en la pantalla pública (Ley N° 20.584); únicamente orientará sobre la etapa y estado del trámite.
- **HU-09-CA4 — Cierre automático de sesión:** La sesión debe cerrarse automáticamente tras 30 segundos de inactividad o al pulsar el botón "Salir", borrando cualquier dato de pantalla.

---

## 📌 HU-10: Chatbot de Orientación Institucional y Triage Presencial (Ley N° 21.258)
- **Como** Paciente o usuario que acude de forma espontánea a la UGCO,  
- **quiero** interactuar con un asistente conversacional que resuelva dudas frecuentes sobre mis derechos y me entregue un turno priorizado si requiero atención humana,  
- **para** recibir orientación inmediata y ser atendido por la gestora de manera ordenada según la complejidad de mi situación.

**Trazabilidad:**
- **Problema AS-IS mitigado:** AS-06 (Interrupciones críticas por demanda espontánea)
- **Actividad TO-BE asociada:** TB-10 (Orientación interactiva de derechos, canales asistenciales y triage presencial)
- **Requisito asociado:** RF-10

**Criterios de aceptación:**
- **HU-10-CA1 — Respuestas frecuentes:** El chatbot debe responder consultas comunes sobre trámites del hospital, derechos de la Ley Nacional del Cáncer N° 21.258, ubicación de servicios y preparación para estudios diagnósticos.
- **HU-10-CA2 — Triage asistencial categorizado:** Si el usuario solicita atención presencial con la gestora, el chatbot debe realizar breves preguntas para clasificar el motivo en: *Prioridad Alta (descompensación, dolor no controlado, crisis emocional), Prioridad Media (resultado crítico pendiente, interconsulta vencida) o Prioridad Administrativa (consulta general de fechas)*.
- **HU-10-CA3 — Emisión de ticket digital:** El sistema debe emitir un ticket numerado con categoría y estimación de tiempo, incorporando el requerimiento a la cola de atención del tablero de la gestora.
- **HU-10-CA4 — Alerta de urgencia:** Si el usuario reporta síntomas de emergencia vital, el sistema debe instruir inmediatamente acudir a la Unidad de Emergencia Adultos del hospital.
