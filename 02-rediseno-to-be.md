# Análisis de Rediseño y Propuesta TO-BE

## Macro-proceso y Proceso Específico
Unidad de Gestión de Casos Oncológicos (UGCO) → Gestión, navegación, trazabilidad, evaluación multidimensional y acompañamiento integral de la persona con cáncer y su cuidador mediante la plataforma **OncoTrace** en el Hospital Dr. Gustavo Fricke (HGF).

*Nota Institucional: La UGCO posee dependencia mixta, dependiendo administrativamente de la Subdirección de Gestión del Cuidado (SDGC) y técnicamente de la Subdirección Médica (SDM).*

---

## Objetivo de Negocio del Proceso Rediseñado
Optimizar y asegurar la continuidad del flujo asistencial a lo largo de las 8 etapas de la trayectoria oncológica mediante la centralización de datos clínicos, la consolidación automatizada de estudios diagnósticos (LIS/PACS), la digitalización de las sesiones de comités y actas clínicas (REM 7), el monitoreo proactivo de plazos GES (Decreto Supremo N° 29) y la trazabilidad de derivaciones externas (vía TENS y UGAA hacia el Hospital Carlos Van Buren y prestadores en convenio, incorporando la gestión y entrega anticipada del instructivo de reembolso de pasajes), garantizando el cumplimiento de los puntos de contacto obligatorio normados y liberando tiempo asistencial para un acompañamiento oportuno y multidimensional.

---

## Mejoras Identificadas por Participante

| Participante | Objetivo | Problema | Mejora Deseada |
| :--- | :--- | :--- | :--- |
| **Enfermera Supervisora UGCO** | Coordinar la unidad y asegurar cumplimiento normativo institucional. | Monitoreo ciego en planillas Excel locales con alto riesgo de sumarios por vencimiento de plazos GES. | Panel de control centralizado con semáforos de criticidad y auditoría en tiempo real de garantías vigentes. |
| **Gestor/a Oncológico/a** | Realizar acompañamiento activo, seguimiento y preparación de casos. | Búsqueda manual de exámenes en sistemas aislados y saturación por consultas espontáneas de mesón. | Tablero Kanban por etapas, consolidación automática de biopsias/imágenes y módulos de autoatención. |
| **Médico Tratante / Especialista** | Definir conducta terapéutica oportuna y confirmar diagnósticos. | Sesiones de comité con antecedentes incompletos y actas en papel físico desvinculadas de la ficha. | Ficha de presentación pre-cargada con exámenes validados y acta digital con firma electrónica en sesión. |
| **TENS y Administrativo/a UGCO** | Gestionar trámites de derivación externa y contactabilidad de pacientes. | Confección manual de dossier en papel sin acuse de recibo en la red y desarticulación con beneficios de traslado social. | Compilación digital de antecedentes, tracking de derivación, entrega de instructivo de pasajes y registro estructurado de contactos. |
| **Persona con Cáncer y Cuidador** | Recibir atención continua, oportuna y respuestas certeras sobre su caso. | Incertidumbre por falta de información sobre exámenes, gastos de traslado imprevistos y esperas prolongadas en ventanilla. | Cumplimiento garantizado de puntos de contacto en momentos de vulnerabilidad, reembolso oportuno de traslados y consulta autónoma en tótem. |

---

## Iniciativas de Rediseño

### Iniciativa 1: Centralización y Visualización de la Trayectoria Asistencial (TB-01, TB-02)
- **Actividad(es) del AS-IS que afecta:** Búsqueda dispersa de información diagnóstica y registro desestructurado de la condición del paciente (Gestora Oncológica).
- **Heurística aplicada:** Centralización de información e integración de tareas.
- **Objetivo o mejora que resuelve:** Mitiga los problemas **AS-01** y **AS-05**, unificando la trayectoria clínica en un tablero Kanban alineado al *Patient Journey Map* institucional (sospecha hasta alta y sobrevivientes), con pauta de valoración multidimensional (clínico-funcional ECOG 0-4, psicosocial, cuidador y espiritual).
- **Efecto esperado (Cuadrángulo del Diablo):**
  - *Tiempo:* Reducción de horas dedicadas a la búsqueda manual de información dispersa.
  - *Calidad:* Visión integral del paciente y detección oportuna de sobrecarga del cuidador.
  - *Flexibilidad:* Adaptación fluida del seguimiento según la patología oncológica del caso.

### Iniciativa 2: Automatización de Reglas de Negocio y Alertas Preventivas GES (TB-04)
- **Actividad(es) del AS-IS que afecta:** Cálculo y control manual de fechas de garantías de oportunidad GES en planillas de cálculo (Gestora y Supervisora).
- **Heurística aplicada:** Automatización de reglas de control y ejecución preventiva.
- **Objetivo o mejora que resuelve:** Resuelve el nodo crítico **AS-04**, programando un motor de cálculo que alerta ante $\le 5$ días hábiles del vencimiento legal y pesquisa inactividad asistencial $> 15$ días.
- **Efecto esperado (Cuadrángulo del Diablo):**
  - *Tiempo:* Detección anticipada de casos en riesgo sin intervención humana manual.
  - *Costo:* Prevención de multas y sanciones legales de la Superintendencia de Salud.
  - *Calidad:* 100% de trazabilidad de los plazos normados por el Decreto Supremo N° 29.

### Iniciativa 3: Interoperabilidad Diagnóstica y Consolidación de Exámenes (TB-05)
- **Actividad(es) del AS-IS que afecta:** Recolección manual y física de biopsias y estudios radiológicos (Gestora y Médico Tratante).
- **Heurística aplicada:** Integración tecnológica de interfaces (HL7 FHIR / APIs).
- **Objetivo o mejora que resuelve:** Resuelve el nodo crítico **AS-01**, vinculando automáticamente los informes emitidos por el LIS (patología) y PACS (imágenes) al RUN del paciente, con alertas ante hallazgos de malignidad.
- **Efecto esperado (Cuadrángulo del Diablo):**
  - *Tiempo:* Reducción del ciclo de consolidación diagnóstica de 15 días a disponibilidad inmediata.
  - *Calidad:* Eliminación del riesgo de traspapelo de biopsias o pérdidas de exámenes críticos.

### Iniciativa 4: Digitalización de Comités Oncológicos y Validación Electrónica (TB-06, TB-07)
- **Actividad(es) del AS-IS que afecta:** Redacción manual de fichas en Word y suscripción de actas en papel físico (Comité Oncológico y Gestora).
- **Heurística aplicada:** Eliminación de soportes intermediarios y firma digital vinculante.
- **Objetivo o mejora que resuelve:** Elimina el cuello de botella **AS-02**, autogenerando la ficha con datos clínicos consolidados y permitiendo la firma electrónica del acta y generación automática del reporte REM 7.
- **Efecto esperado (Cuadrángulo del Diablo):**
  - *Tiempo:* Disminución del tiempo de preparación de tablas médicas y redigitación posterior.
  - *Calidad:* Actas inmutables, trazables y cargadas inmediatamente en el expediente del paciente.
  - *Costo:* Ahorro en insumos físicos y eliminación de almacenamiento en papel.

### Iniciativa 5: Gestión de Red, Derivaciones Digitales y Reembolso de Pasajes (TB-08)
- **Actividad(es) del AS-IS que afecta:** Confección de dossier físico y entrega manual a UGAA para envío ciego a la red, omitiendo la orientación anticipada de reembolso de pasajes (TENS, UGAA y Gestor).
- **Heurística aplicada:** Integración interorganizacional, trazabilidad de extremo a extremo y soporte asistencial-social proactivo.
- **Objetivo o mejora que resuelve:** Elimina el nodo crítico **AS-03**, permitiendo monitorear el estado de recepción, cita y tratamiento en el Hospital Carlos Van Buren o prestadores en convenio, incorporando en el flujo la entrega anticipada obligatoria del instructivo de **Reembolso de Pasajes por Derivación (Anexo 6)** de la Unidad de Servicio Social del HGF.
- **Efecto esperado (Cuadrángulo del Diablo):**
  - *Tiempo:* Reducción de los tiempos de confirmación y agendamiento interinstitucional.
  - *Calidad:* Supresión de "puntos ciegos" en radioterapia/quimioterapia externa y garantía del acceso efectivo a la restitución de gastos de traslado en locomoción pública.
  - *Costo:* Protección económica directa al paciente y su familia, reduciendo el riesgo de abandono de tratamiento por barreras financieras.

### Iniciativa 6: Autoatención y Triage Asistencial Descentralizado (TB-09, TB-10)
- **Actividad(es) del AS-IS que afecta:** Atención presencial de demanda espontánea en el mesón de la UGCO (Gestora Oncológica).
- **Heurística aplicada:** Autoservicio (Self-service) y clasificación por priorización de demanda.
- **Objetivo o mejora que resuelve:** Mitiga el nodo crítico **AS-06**, entregando al paciente un canal de consulta de estado por tótem y un asistente de orientación con emisión de turnos clasificados por criticidad.
- **Efecto esperado (Cuadrángulo del Diablo):**
  - *Tiempo:* Respuesta inmediata a dudas frecuentes sin interrumpir al personal clínico.
  - *Calidad:* Atención presencial focalizada en pacientes con necesidades de alta complejidad.

---

## Diagrama del Proceso TO-BE

![Proceso TO-BE](./diagramas/to-be.png)

*Archivo fuente del modelo:* [`./diagramas/to-be.bpmn`](./diagramas/to-be.bpmn)

> **Nota de especificación BPMN:** El modelo distingue formalmente entre:
> - **Tarea de Usuario (User Task):** Intervención humana soportada por OncoTrace (ej. aplicar evaluación multidimensional o ingresar a comité).
> - **Tarea de Servicio (Service Task):** Proceso ejecutado automáticamente por el software (ej. motor cron de alertas GES o indexación HL7 de biopsias).
> - **Tarea Manual (Manual Task):** Actividad física sin interacción directa con el sistema (ej. toma de muestra biológica o atención médica presencial).

---

## Actividades que Cambian del AS-IS al TO-BE

| Actividad en el AS-IS | Actividad en el TO-BE | Qué Cambia |
| :--- | :--- | :--- |
| **Búsqueda dispersa de exámenes y seguimiento en planillas Excel** | **TB-01: Monitoreo en Tablero Kanban y Timeline Clínico** | Se pasa de consultar múltiples sistemas a un tablero centralizado por etapas con línea de tiempo cronológica por paciente (incluyendo alta y sobrevivientes). |
| **Evaluación clínica y psicosocial no estandarizada** | **TB-02: Evaluación Multidimensional Estandarizada** | Se reemplaza el registro libre por una pauta por dominios (clínico-funcional ECOG, psicosocial, cuidador y espiritual) con cálculo automático de riesgo. |
| **Registro fragmentado de contactos telefónicos y presenciales** | **TB-03: Bitácora Digital de Acompañamiento** | Registro unificado e inmutable de contactos asistenciales, programando el cumplimiento de los 6 puntos de contacto obligatorio normados según la curva de vulnerabilidad del Journey Map. |
| **Cálculo manual de fechas y plazos de garantías GES** | **TB-04: Motor de Alertas Preventivas GES e Inactividad** | Automatización del cálculo en días hábiles (DS N° 29), con alertas visuales a $\le 5$ días del vencimiento y detección de inactividad $> 15$ días. |
| **Revisión manual de informes de patología y radiología** | **TB-05: Consolidación Automática de Exámenes y Alertas Críticas** | Indexación automática por RUN desde LIS/PACS vía HL7 FHIR, previsualización centralizada y alerta médica ante hallazgos de malignidad. |
| **Elaboración manual de fichas de presentación en Word** | **TB-06: Generación Automatizada de Ficha de Comité** | Extracción automática de antecedentes clínicos consolidados hacia un formato estándar en PDF, validando prerrequisitos antes de sesionar. |
| **Registro de actas en papel físico y firmas manuscritas** | **TB-07: Acta Digital de Comité y Registro REM 7** | Confección digital durante la sesión, firma electrónica vinculante, bloqueo contra modificaciones y generación automática de la estadística REM 7. |
| **Confección de dossier en papel, envío sin confirmación y omisión de pasajes** | **TB-08: Módulo de Dossier Digital, Trazabilidad de Derivaciones y Reembolso** | Compilación de expediente digital unificado, emisión/entrega del instructivo de reembolso de pasajes (Anexo 6), workflow de derivación a centros de la red (HCVB) y alertas si no hay respuesta en 10 días hábiles. |
| **Atención desordenada en mesón por consultas de estado de exámenes** | **TB-09: Autoatención Presencial en Tótem de Sala de Espera** | Consulta autónoma de avances mediante lectura de cédula de identidad, protegiendo datos sensibles según la Ley N° 20.584. |
| **Interrupciones continuas al equipo por dudas administrativas** | **TB-10: Orientación Interactiva y Triage Asistencial** | Asistente virtual institucional para consultas de la Ley N° 21.258 y emisión de turnos clasificados por prioridad clínica o administrativa. |
