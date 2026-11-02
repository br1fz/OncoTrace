# Clasificación de requisitos

> **Dominio:** Sistema de Gestión Clínica, Navegación y Trazabilidad Oncológica (OncoTrace)  
> **Institución:** Hospital Dr. Gustavo Fricke (HGF) · Unidad de Gestión de Casos Oncológicos (UGCO)  
> **Referencia de calidad:** ISO/IEC 25010

---

## Requisitos de producto

### Requisitos funcionales

| ID | Requisito | Actividad TO-BE asociada |
| :--- | :--- | :--- |
| **RF-01** | **Tablero y trazabilidad por etapas.** El sistema debe mostrar a los pacientes según las ocho etapas oncológicas, desde la sospecha hasta el alta y el seguimiento de sobrevivientes. También debe presentar una línea de tiempo cronológica de los hitos asistenciales. | TB-01: Monitoreo en tablero Kanban y timeline clínico |
| **RF-02** | **Evaluación multidimensional por dominios.** El sistema debe registrar la valoración clínico-funcional (ECOG 0–4 para pacientes en seguimiento), psicosocial y socioeconómica, familiar y del cuidador, y espiritual y de comprensión diagnóstica. También debe calcular el riesgo asistencial. | TB-02: Evaluación multidimensional estandarizada |
| **RF-03** | **Bitácora de puntos de contacto.** El sistema debe mantener un registro cronológico e inmutable de las intervenciones y programar los seis contactos normados por la UGCO según la curva de vulnerabilidad. | TB-03: Bitácora digital de acompañamiento |
| **RF-04** | **Alertas GES e inactividad.** El sistema debe alertar cuando falten cinco días hábiles o menos para el vencimiento de un plazo, según el DS N° 29. También debe detectar casos sin movimiento por más de 15 días corridos. | TB-04: Motor de alertas preventivas GES e inactividad |
| **RF-05** | **Consolidación de exámenes y alertas.** El sistema debe indexar por RUN los informes de biopsias del LIS y los informes radiológicos del PACS. Ante hallazgos de malignidad, debe generar una alerta médica prioritaria. | TB-05: Consolidación automática de exámenes y alertas críticas |
| **RF-06** | **Ficha de presentación a comité.** El sistema debe reunir antecedentes clínicos, imágenes y biopsias en una ficha resumen estandarizada para la presentación médica. | TB-06: Generación automatizada de ficha de comité |
| **RF-07** | **Acta digital y registro REM 7.** El sistema debe registrar la conducta terapéutica acordada, permitir la firma electrónica del acta y generar la estadística REM 7 para MINSAL. | TB-07: Acta digital de comité y registro REM 7 |
| **RF-08** | **Derivaciones externas y reembolso de pasajes.** El sistema debe gestionar el dossier digital confeccionado por TENS, registrar su despacho por UGAA y permitir el seguimiento de la atención en el Hospital Carlos Van Buren. También debe apoyar, junto a Servicio Social, la entrega del instructivo de reembolso de pasajes (Anexo 6). | TB-08: Dossier digital, trazabilidad de derivaciones y reembolso |
| **RF-09** | **Tótem de autoatención.** El sistema debe permitir consultar el estado de trámites y exámenes mediante un método de verificación de identidad autorizado por el hospital. Leer la cédula o ingresar el RUN no basta por sí solo. Si consulta un cuidador, su autorización debe estar registrada y vigente. El tótem debe resguardar los datos sensibles. | TB-09: Autoatención presencial en tótem de sala de espera |
| **RF-10** | **Asistente virtual y triage asistencial.** El sistema debe orientar sobre los derechos establecidos en la Ley N° 21.258, los trámites, la ubicación de servicios y la preparación para estudios. Si se solicita atención presencial, debe clasificar la prioridad con criterios revisados por la UGCO, emitir un ticket con categoría y tiempo estimado de espera e incorporar la solicitud a la cola de atención. No debe emitir diagnósticos ni reemplazar una evaluación clínica. Ante una posible urgencia, debe indicar acudir de inmediato a la Unidad de Emergencia Adultos. Si no puede clasificar la solicitud, debe ofrecer contacto con personal de la UGCO. | TB-10: Orientación interactiva y triage asistencial |

### Requisitos no funcionales

| ID | Requisito | Actividades TO-BE asociadas |
| :--- | :--- | :--- |
| **RNF-01** | **Fiabilidad y disponibilidad.** El sistema debe mantener una disponibilidad mensual de al menos 99,5 % durante la jornada asistencial (08:00 a 18:00). El tiempo objetivo de recuperación (RTO) debe ser de cinco minutos o menos, y el punto objetivo de recuperación (RPO) debe ser cero, sin pérdida de transacciones clínicas confirmadas. | TB-04, TB-05 |
| **RNF-02** | **Eficiencia de desempeño.** Con más de 1.000 pacientes registrados con alertas activas y 50 usuarios institucionales concurrentes, el tablero debe permitir paginar y ordenar los registros, mostrar las ocho columnas asistenciales y completar la carga y visualización en 2,0 segundos o menos. El uso de CPU del servidor de aplicaciones debe ser de 70 % o menos bajo esa carga. | TB-01 |
| **RNF-03** | **Seguridad y confidencialidad clínica.** El sistema debe aplicar control de acceso basado en roles (RBAC) y mantener una bitácora inmutable. Debe registrar el 100 % de los accesos y de los intentos de consulta, modificación o exportación de información clínica. Cada registro debe incluir el RUN del usuario, su rol, fecha y hora, dirección IP y tipo de operación. Los accesos sin autorización deben rechazarse y la persistencia del registro debe completarse en 50 milisegundos o menos. El tratamiento y la confidencialidad de esos datos deben ajustarse a la Ley N° 20.584 y a la normativa de protección de datos aplicable, incluidas las disposiciones pertinentes de las Leyes N° 21.258 y N° 19.628. | TB-01 a TB-10 |
| **RNF-04** | **Interoperabilidad hospitalaria.** El sistema debe comunicarse mediante HL7 FHIR o API REST con los visores y las bases de datos LIS y PACS institucionales. | TB-05 |

---

## Requisitos de proyecto

| ID | Requisito | Propósito y justificación |
| :--- | :--- | :--- |
| **RP-01** | **Control de versiones y repositorio.** La documentación y la especificación técnica deben gestionarse en GitHub mediante ramas de trabajo y Conventional Commits. | Mantener la trazabilidad de los cambios, la auditoría del código y el trabajo sincronizado del equipo. |
| **RP-02** | **Gestión de tareas e iteraciones.** El avance debe planificarse en un tablero de GitHub Projects, vinculando entregables e incidentes con cada hito evaluativo. | Dar visibilidad al avance y facilitar el seguimiento de los compromisos del proyecto. |
| **RP-03** | **Modelamiento en notación estándar.** Los diagramas de proceso deben construirse en BPMN 2.0 y distinguir las tareas de usuario, de servicio y manuales. | Cumplir la especificación técnica del curso y los estándares de modelamiento definidos para el proyecto. |

---

## Requisito derivado

- **Requisito de origen:** RNF-03, relacionado con el control de acceso a expedientes oncológicos y la trazabilidad de los usuarios.

- **REQ-DER-01:** La autenticación de los funcionarios debe realizarse mediante Single Sign-On integrado al Directorio Activo institucional del Hospital Dr. Gustavo Fricke. La asignación y revocación de permisos debe seguir los roles institucionales y el proceso de actualización de cuentas definido para la integración.

- **Justificación:** La autenticación federada centraliza la validación de identidad y evita el uso de cuentas locales compartidas. Para que los cambios de cargo o las desvinculaciones se reflejen en los permisos de OncoTrace, la integración debe definir cómo se actualizan las cuentas y los roles.
