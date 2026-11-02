# Análisis de rediseño y propuesta TO-BE

## Macroproceso y proceso específico

Unidad de Gestión de Casos Oncológicos (UGCO) → Gestión, navegación, trazabilidad, evaluación multidimensional y acompañamiento integral de la persona con cáncer y su cuidador mediante la plataforma **OncoTrace** en el Hospital Dr. Gustavo Fricke (HGF).

*Nota institucional: La UGCO tiene dependencia administrativa de la Subdirección de Gestión del Cuidado (SDGC) y dependencia técnica de la Subdirección Médica (SDM).*

---

## Objetivo de negocio del proceso rediseñado

Mejorar la continuidad del flujo asistencial a lo largo de las ocho etapas de la trayectoria oncológica mediante la centralización del seguimiento, la consolidación de estudios diagnósticos, la digitalización de comités y actas, el monitoreo de plazos GES, la trazabilidad de derivaciones externas y el intercambio de información con la Plataforma de Seguimiento Oncológico del MINSAL.

La trayectoria considera estas etapas: sospecha, confirmación diagnóstica, etapificación, tratamiento, rehabilitación, cuidados paliativos y alivio del dolor, seguimiento y sobrevivientes, y alta y contrarreferencia. El comité oncológico forma parte del proceso asistencial, pero no constituye una etapa independiente.

El proceso también contempla los puntos de contacto definidos por la UGCO, la coordinación con el Hospital Carlos Van Buren (HCVB) y otros prestadores en convenio, y la entrega anticipada del instructivo de reembolso de pasajes cuando corresponda.

---

## Mejoras identificadas por participante

| Participante | Objetivo | Problema | Mejora propuesta |
| :--- | :--- | :--- | :--- |
| **Enfermera supervisora UGCO** | Coordinar la unidad y supervisar el cumplimiento de los plazos institucionales. | Seguimiento en planillas locales, con riesgo de no detectar a tiempo garantías GES próximas a vencer. | Panel centralizado con alertas de plazos, estado de los casos y registro de las acciones realizadas. |
| **Gestor/a oncológico/a** | Realizar el acompañamiento y seguimiento de los casos. | Búsqueda manual de exámenes en sistemas separados y consultas frecuentes en el mesón. | Tablero de seguimiento por etapas, acceso centralizado a resultados disponibles y canales de autoatención. |
| **Médico tratante o especialista** | Confirmar diagnósticos y definir conductas terapéuticas. | Antecedentes incompletos para las sesiones de comité y actas en papel desvinculadas de la ficha. | Ficha de presentación con antecedentes disponibles y registro digital de la decisión del comité. |
| **TENS y administrativo/a UGCO** | Gestionar derivaciones externas y mantener la contactabilidad de los pacientes. | Preparación de dossiers en papel, falta de confirmación de recepción y orientación tardía sobre apoyos de traslado. | Dossier digital, seguimiento de la derivación, registro de contactos y entrega del instructivo de pasajes cuando corresponda. |
| **Persona con cáncer y cuidador** | Recibir atención continua y orientación sobre su proceso. | Incertidumbre sobre exámenes, gastos de traslado y tiempos de espera en ventanilla. | Registro de los contactos de acompañamiento, orientación sobre el proceso y consulta en tótem con verificación de identidad autorizada. |

---

## Iniciativas de rediseño

### Iniciativa 1: Seguimiento de la trayectoria asistencial (TB-01, TB-02)

- **Actividad del AS-IS que afecta:** Seguimiento en planillas y registro no estandarizado de las necesidades de la persona con cáncer.

- **Heurística aplicada:** Centralización de la información y estandarización del registro.

- **Objetivo o mejora propuesta:** Facilitar el seguimiento de los casos en un tablero por etapas y registrar la valoración multidimensional, incluyendo los dominios clínico-funcional, psicosocial, familiar, del cuidador y espiritual. La trayectoria debe respetar las ocho etapas definidas por la UGCO.

- **Efecto esperado (cuadrángulo del diablo):**
  - *Tiempo:* Menos búsquedas en planillas locales para conocer el estado de un caso.
  - *Calidad:* Mejor visibilidad de las necesidades de la persona y su cuidador.
  - *Flexibilidad:* Seguimiento ajustable a la etapa y las necesidades de cada caso.

### Iniciativa 2: Automatización de alertas preventivas GES (TB-04)

- **Actividad del AS-IS que afecta:** Cálculo y revisión manual de las fechas de las garantías GES.

- **Heurística aplicada:** Automatización de reglas de control y alertas preventivas.

- **Objetivo o mejora propuesta:** Configurar alertas cuando falten cinco días hábiles o menos para el vencimiento de una garantía y detectar casos sin movimiento por más de 15 días corridos.

- **Efecto esperado (cuadrángulo del diablo):**
  - *Tiempo:* Identificación anticipada de los casos que requieren revisión.
  - *Calidad:* Registro trazable de alertas, vencimientos y acciones realizadas.
  - *Flexibilidad:* Ajuste de las reglas ante cambios normativos o institucionales.

### Iniciativa 3: Consolidación de exámenes diagnósticos (TB-05)

- **Actividad del AS-IS que afecta:** Revisión manual de informes de patología y radiología en sistemas separados.

- **Heurística aplicada:** Integración tecnológica de fuentes de información diagnóstica.

- **Objetivo o mejora propuesta:** Consultar e indexar por RUN los informes disponibles en LIS y PACS mediante las interfaces autorizadas por el hospital. El sistema debe facilitar el acceso a los resultados y generar una alerta médica prioritaria ante hallazgos de malignidad, según las reglas que defina el equipo clínico.

- **Efecto esperado (cuadrángulo del diablo):**
  - *Tiempo:* Menos pasos para localizar los informes una vez publicados e integrados.
  - *Calidad:* Menor riesgo de extravío o falta de asociación de un informe al caso correspondiente.
  - *Flexibilidad:* Incorporación de fuentes diagnósticas según las interfaces disponibles en el hospital.

### Iniciativa 4: Digitalización de comités oncológicos (TB-06, TB-07)

- **Actividad del AS-IS que afecta:** Preparación manual de fichas en Word y registro de actas en papel.

- **Heurística aplicada:** Digitalización del registro y reducción de la redigitación.

- **Objetivo o mejora propuesta:** Reunir los antecedentes disponibles en una ficha estandarizada para el comité y registrar digitalmente la conducta acordada. La firma electrónica debe utilizar el mecanismo institucional definido y el acta debe quedar vinculada al expediente clínico con su historial de auditoría.

- **Efecto esperado (cuadrángulo del diablo):**
  - *Tiempo:* Menos preparación manual de fichas y transcripción posterior de acuerdos.
  - *Calidad:* Mejor disponibilidad y trazabilidad de las decisiones registradas.
  - *Costo:* Menor uso de papel y de espacio de almacenamiento físico.

### Iniciativa 5: Gestión de derivaciones y reembolso de pasajes (TB-08)

- **Actividad del AS-IS que afecta:** Preparación de dossiers en papel y envío de derivaciones sin confirmación de recepción.

- **Heurística aplicada:** Trazabilidad de la derivación y coordinación con los equipos involucrados.

- **Objetivo o mejora propuesta:** Permitir que TENS prepare el dossier digital, que UGAA registre el despacho y que el equipo haga seguimiento de la recepción y atención en HCVB u otros prestadores en convenio. Cuando corresponda, el flujo debe incluir la entrega anticipada del instructivo de reembolso de pasajes (Anexo 6) de la Unidad de Servicio Social del HGF, de acuerdo con sus requisitos.

- **Efecto esperado (cuadrángulo del diablo):**
  - *Tiempo:* Más visibilidad del estado de la derivación y de las respuestas pendientes.
  - *Calidad:* Menos casos sin confirmación de recepción o agendamiento.
  - *Costo:* Mejor orientación sobre el proceso de reembolso y sus requisitos, sin asegurar su aprobación.

### Iniciativa 6: Autoatención y orientación asistencial (TB-09, TB-10)

- **Actividad del AS-IS que afecta:** Consultas espontáneas en el mesón de la UGCO sobre trámites y exámenes.

- **Heurística aplicada:** Autoservicio para consultas generales y derivación de solicitudes que requieran atención del equipo.

- **Objetivo o mejora propuesta:** El tótem debe mostrar estados generales después de completar un método de verificación de identidad autorizado por el hospital. Leer la cédula o ingresar el RUN no basta por sí solo. Si consulta un cuidador, su autorización debe estar registrada y vigente. El asistente virtual puede orientar y clasificar solicitudes, pero no debe emitir diagnósticos. Ante una posible urgencia, debe indicar acudir a la Unidad de Emergencia Adultos; si no puede clasificar una solicitud, debe ofrecer contacto con personal de la UGCO.

- **Efecto esperado (cuadrángulo del diablo):**
  - *Tiempo:* Atención de consultas generales sin interrumpir continuamente al equipo.
  - *Calidad:* Resguardo de los datos consultados y derivación de solicitudes que necesitan evaluación presencial.

### Iniciativa 7: Interoperabilidad con la Plataforma de Seguimiento Oncológico del MINSAL (TB-11)

- **Actividad del AS-IS que afecta:** Doble digitación y falta de intercambio de información entre el registro local y la Plataforma de Seguimiento Oncológico del MINSAL.

- **Heurística aplicada:** Interoperabilidad institucional y reducción de registros duplicados.

- **Objetivo o mejora propuesta:** Definir un intercambio de datos entre OncoTrace y la plataforma del MINSAL para los antecedentes de seguimiento y reporte que autoricen las instituciones. Antes de implementarlo, HGF y MINSAL deben acordar el mecanismo de integración, los datos que se transmitirán, la periodicidad y las responsabilidades de cada sistema. OncoTrace debe registrar los envíos, las confirmaciones y los errores para permitir su revisión y reintento.

- **Efecto esperado (cuadrángulo del diablo):**
  - *Tiempo:* Menos digitación duplicada una vez habilitado y validado el intercambio.
  - *Calidad:* Mayor consistencia entre los datos locales y los reportes nacionales.
  - *Flexibilidad:* Ajuste del intercambio ante cambios en los datos o mecanismos definidos por las instituciones.

---

## Diagrama del proceso TO-BE

![Proceso TO-BE](./diagramas/to-be.png)

*Archivo fuente del modelo:* [`./diagramas/to-be.bpmn`](./diagramas/to-be.bpmn)

**Nota de especificación BPMN:** El modelo debe distinguir entre:

- **Tarea de usuario:** Intervención humana realizada con apoyo de OncoTrace, como completar una evaluación o registrar una decisión de comité.
- **Tarea de servicio:** Proceso ejecutado automáticamente, como calcular alertas, consultar una interfaz diagnóstica o registrar el resultado de un intercambio habilitado.
- **Tarea manual:** Actividad realizada sin interacción directa con el sistema, como la toma de una muestra o una atención presencial.

---

## Actividades que cambian del AS-IS al TO-BE

| Actividad en el AS-IS | Actividad en el TO-BE | Qué cambia |
| :--- | :--- | :--- |
| Seguimiento en planillas y búsqueda de antecedentes del caso | **TB-01: Monitoreo en tablero Kanban y timeline clínico** | Se centraliza la visualización de las etapas y de los hitos asistenciales registrados. |
| Evaluación clínica y psicosocial no estandarizada | **TB-02: Evaluación multidimensional estandarizada** | Se registra la valoración por dominios mediante una pauta definida para el proyecto. |
| Registro fragmentado de contactos telefónicos y presenciales | **TB-03: Bitácora digital de acompañamiento** | Se unifican los contactos y se facilita el seguimiento de los seis puntos definidos por la UGCO. |
| Cálculo manual de fechas y plazos de garantías GES | **TB-04: Motor de alertas preventivas GES e inactividad** | Se calculan los plazos en días hábiles y se generan alertas según las reglas acordadas. También se detectan casos sin movimiento por más de 15 días corridos. |
| Revisión manual de informes de patología y radiología | **TB-05: Consolidación automática de exámenes y alertas críticas** | Se consultan los informes integrados desde LIS y PACS mediante las interfaces autorizadas y se facilita su revisión. |
| Elaboración manual de fichas de presentación en Word | **TB-06: Generación automatizada de ficha de comité** | Se reúnen los antecedentes disponibles en un formato estandarizado, con validación de los datos requeridos antes de la sesión. |
| Registro de actas en papel y firmas manuscritas | **TB-07: Acta digital de comité y registro REM 7** | Se registra digitalmente la decisión, se aplica el mecanismo de firma definido por el hospital y se facilita la preparación del reporte REM 7. |
| Preparación de dossier en papel y envío sin confirmación | **TB-08: Módulo de dossier digital, trazabilidad de derivaciones y reembolso** | Se registra el despacho y el seguimiento de la derivación, junto con la entrega del instructivo de reembolso cuando corresponda. |
| Consultas de estado de exámenes en el mesón | **TB-09: Autoatención presencial en tótem de sala de espera** | Se habilita la consulta de estados generales después de verificar la identidad con el método autorizado por el hospital. |
| Consultas administrativas que interrumpen al equipo | **TB-10: Orientación interactiva y triage asistencial** | Se orientan solicitudes generales y se ofrece contacto con la UGCO cuando la solicitud no puede clasificarse. |
| Digitación local y nacional por separado | **TB-11: Interoperabilidad con la Plataforma de Seguimiento Oncológico del MINSAL** | Se plantea un intercambio de datos sujeto a la definición y autorización del mecanismo institucional. Se registran confirmaciones y errores para su seguimiento. |
