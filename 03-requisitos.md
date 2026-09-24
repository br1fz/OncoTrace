# Clasificación de Requisitos

> **Sistema:** OncoTrace – Plataforma de Gestión y Trazabilidad Oncológica  
> **Institución:** Hospital Dr. Gustavo Fricke (HGF)  
> **Marco Metodológico:** Clasificación de Requisitos de Producto (Funcionales y No Funcionales) y Requisitos de Proyecto.

---

## Requisitos de producto

| ID | Requisito | Tipo (funcional/no funcional) | Actividad TO-BE asociada |
| :--- | :--- | :--- | :--- |
| **RF-USR-01** | La gestora oncológica debe poder visualizar un tablero centralizado y una línea de tiempo cronológica por paciente con sus hitos asistenciales completados y pendientes. | Funcional | **TB-01** (Monitoreo de pacientes en tablero Kanban y timeline clínico) |
| **RF-USR-02** | La gestora oncológica debe poder registrar y actualizar la evaluación clínica, estado funcional (ECOG 0-4), factores de vulnerabilidad social y red de apoyo. | Funcional | **TB-02** (Evaluación multidimensional estandarizada y estratificación de riesgo) |
| **RF-USR-03** | La gestora oncológica debe poder registrar contactos asistenciales (llamadas, entrevistas presenciales, incidencias) en la bitácora activa del paciente. | Funcional | **TB-03** (Registro en bitácora cronológica inmutable de intervenciones) |
| **RF-SYS-01** | El sistema debe monitorear diariamente los plazos transcurridos y emitir alertas preventivas automáticas ante riesgo de vencimiento GES (≤ 5 días) o inactividad asistencial (> 15 días). | Funcional | **TB-04** (Control automático de plazos legales GES y monitoreo de deserción) |
| **RF-SYS-02** | El sistema debe consolidar e indexar automáticamente los informes validados de anatomía patológica (biopsias) e imagenología asociados al RUN del paciente. | Funcional | **TB-05** (Indexación y consolidación de informes LIS y reportes PACS) |
| **RF-SW-01** | El sistema debe compilar automáticamente los antecedentes clínicos disponibles y generar la Ficha Resumen de Presentación para el comité oncológico. | Funcional | **TB-06** (Generación automatizada de ficha clínica de presentación a comité) |
| **RF-SW-02** | El sistema debe permitir registrar en tiempo real la discusión médica del comité oncológico y formalizar el acta oficial mediante firma electrónica. | Funcional | **TB-07** (Formalización de acta clínica digital con firma médica colegiada) |
| **RF-SYS-03** | El sistema debe registrar y realizar seguimiento al flujo de derivaciones interhospitalarias enviadas al Hospital Carlos Van Buren y prestadores privados en convenio. | Funcional | **TB-08** (Seguimiento digital de derivaciones externas y contrarreferencia) |
| **RF-EXT-01** | La interfaz del tótem en sala de espera debe permitir al paciente consultar de forma autónoma el estado de sus trámites y exámenes mediante autenticación por RUN. | Funcional | **TB-09** (Autoatención presencial en sala de espera y consulta de trámites) |
| **RF-EXT-02** | El asistente virtual interactivo debe responder consultas frecuentes sobre derechos de la Ley N° 21.258 y emitir tickets de triage priorizados según necesidad. | Funcional | **TB-10** (Orientación interactiva de derechos, canales asistenciales y triage) |
| **RNF-SYS-01** | El sistema debe garantizar una disponibilidad operativa mensual ≥ 99.5% durante el horario asistencial hábil del hospital (AC-01 Fiabilidad). | No funcional | **TB-05**, **TB-08** (Consolidación de exámenes y seguimiento de derivaciones) |
| **RNF-SW-01** | El tiempo total de carga y renderizado del tablero de trazabilidad debe ser ≤ 2.0 segundos bajo concurrencia nominal de 50 usuarios (AC-02 Eficiencia). | No funcional | **TB-01** (Monitoreo de pacientes en tablero Kanban y timeline clínico) |
| **RNF-SW-02** | El sistema debe aplicar control de acceso basado en roles (RBAC) y cifrado de datos clínicos en reposo y tránsito (AC-03 Seguridad Ley N° 20.584). | No funcional | **TB-01**, **TB-07** (Tablero clínico y formalización de acta digital) |
| **RNF-PROD-01**| El sistema debe interoperar mediante interfaces RESTful y estándares HL7 FHIR para el intercambio seguro de reportes diagnósticos con sistemas externos. | No funcional | **TB-05** (Indexación y consolidación de informes LIS y PACS) |

---

## Requisitos de proyecto

| ID | Requisito | Propósito y Justificación |
| :--- | :--- | :--- |
| **RY-01** | El equipo de ingeniería debe utilizar herramientas estandarizadas de línea de comandos y entornos reproducibles para la inicialización y administración del proyecto. | Garantizar uniformidad técnica en los artefactos y evitar discrepancias entre entornos de desarrollo del equipo. |
| **RY-02** | La gestión del proyecto debe administrarse mediante iteraciones ágiles utilizando GitHub Projects asociado al repositorio oficial del equipo. | Asegurar visibilidad del progreso, asignación transparente de responsabilidades y trazabilidad por sprint. |

---

## Requisito derivado

**Requisito origen:** **RNF-SW-02** (Seguridad y Confidencialidad: El sistema debe aplicar autenticación robusta institucional y control de accesos clínicos bajo la Ley N° 20.584).  
**Requisito derivado:** **REQ-DER-01** (Integración obligatoria con el servicio de Directorio Activo institucional del Hospital Dr. Gustavo Fricke mediante Single Sign-On).  
**Justificación:** Para dar estricto cumplimiento al requisito de seguridad y trazabilidad inmutable sin obligar a los médicos y gestoras a recordar credenciales independientes —lo cual fomenta malas prácticas como compartir contraseñas o anotarlas en papel—, el sistema deriva la necesidad técnica de federar la identidad de los usuarios directamente contra el servidor de autenticación centralizado del hospital. Esto asegura que el bloqueo o revocación de permisos en la red asistencial inhabilite de inmediato el acceso a las fichas oncológicas de OncoTrace.
