# Clasificación de Requisitos

> **Dominio:** Sistema de Gestión Clínica, Navegación y Trazabilidad Oncológica (Plataforma OncoTrace)  
> **Institución:** Hospital Dr. Gustavo Fricke (HGF) – Unidad de Gestión de Casos Oncológicos (UGCO)  
> **Estándar:** Clasificación formal de ingeniería de requisitos y norma ISO/IEC 25010.

---

## Requisitos de Producto

| ID | Requisito | Tipo (funcional / no funcional) | Actividad TO-BE Asociada |
| :--- | :--- | :--- | :--- |
| **RF-01** | **Tablero y Trazabilidad por Etapas:** Visualización centralizada de pacientes según las 8 etapas oncológicas y línea de tiempo cronológica de hitos asistenciales. | Funcional | TB-01: Monitoreo en Tablero Kanban y Timeline Clínico |
| **RF-02** | **Evaluación Multidimensional por Dominios:** Registro estructurado de la valoración integral (clínico-funcional ECOG 0-4, psicoemocional, cuidador y espiritual) con cálculo automático de riesgo. | Funcional | TB-02: Evaluación Multidimensional Estandarizada |
| **RF-03** | **Bitácora de Puntos de Contacto Obligatorio:** Registro cronológico e inmutable de intervenciones, programando el cumplimiento de los 6 contactos normados por la UGCO. | Funcional | TB-03: Bitácora Digital de Acompañamiento |
| **RF-04** | **Motor de Alertas GES e Inactividad:** Notificación preventiva automática ante plazos próximos a expirar ($\le 5$ días hábiles, DS N° 29) y detección de casos sin movimiento $> 15$ días corridos. | Funcional | TB-04: Motor de Alertas Preventivas GES e Inactividad |
| **RF-05** | **Consolidación Automática de Exámenes y Alertas:** Indexación por RUN de informes de biopsias (LIS) y radiología (PACS), con alerta médica prioritaria ante hallazgos de malignidad. | Funcional | TB-05: Consolidación Automática de Exámenes y Alertas Críticas |
| **RF-06** | **Generación Digital de Ficha de Comité:** Compilación automática de antecedentes clínicos, imágenes y biopsias en una ficha resumen estandarizada para presentación médica. | Funcional | TB-06: Generación Automatizada de Ficha de Comité |
| **RF-07** | **Acta Digital de Comité y Registro REM 0.7:** Registro en tiempo real de la conducta terapéutica acordada, firma electrónica del acta y generación automática de la estadística REM 0.7 para MINSAL. | Funcional | TB-07: Acta Digital de Comité y Registro REM 0.7 |
| **RF-08** | **Trazabilidad de Derivaciones Externas:** Confección de dossier digital unificado por TENS, despacho formal por UGAA y seguimiento del estado de atención en el Hospital Carlos Van Buren. | Funcional | TB-08: Módulo de Dossier Digital y Trazabilidad de Derivaciones |
| **RF-09** | **Tótem de Autoatención en Sala de Espera:** Consulta autónoma de estado de trámites y exámenes mediante lectura de cédula de identidad, resguardando datos sensibles. | Funcional | TB-09: Autoatención Presencial en Tótem de Sala de Espera |
| **RF-10** | **Asistente Virtual y Triage Asistencial:** Orientación automatizada de derechos (Ley N° 21.258) y emisión de turnos clasificados por prioridad para atención presencial con la gestora. | Funcional | TB-10: Orientación Interactiva y Triage Asistencial |
| **RNF-01** | **Fiabilidad y Disponibilidad:** Disponibilidad operativa del sistema $\ge 99.5\%$ en horario asistencial, con tiempo de recuperación (RTO) $\le 5$ minutos ante caídas. | No funcional (Fiabilidad) | TB-04, TB-05 |
| **RNF-02** | **Eficiencia de Desempeño:** Tiempo de respuesta y carga completa del tablero con más de 1.000 pacientes activos $\le 2.0$ segundos bajo concurrencia normal. | No funcional (Eficiencia) | TB-01 |
| **RNF-03** | **Seguridad y Confidencialidad Clínica:** Control de acceso estricto basado en roles (RBAC) y bitácora de auditoría inmutable de accesos según las Leyes N° 20.584 y N° 21.258. | No funcional (Seguridad) | TB-01, TB-07 |
| **RNF-04** | **Interoperabilidad Hospitalaria:** Comunicación mediante estándares de la industria (HL7 FHIR / API REST) con visores y bases de datos LIS y PACS institucionales. | No funcional (Compatibilidad) | TB-05 |

---

## Requisitos de Proyecto

| ID | Requisito | Propósito y Justificación |
| :--- | :--- | :--- |
| **RP-01** | **Control de Versiones y Repositorio:** Toda la documentación y especificación técnica debe gestionarse en GitHub bajo ramas de trabajo y Conventional Commits. | Asegurar trazabilidad de cambios, auditoría de código y trabajo sincronizado del equipo. |
| **RP-02** | **Gestión de Tareas e Iteraciones:** Planificación del avance mediante tablero ágil en GitHub Projects, vinculando entregables e incidentes a cada hito evaluativo. | Visibilidad del ciclo de vida y control de compromisos del proyecto. |
| **RP-03** | **Modelamiento en Notación Estándar:** Todos los diagramas de proceso deben construirse en BPMN 2.0 formal, distinguiendo tareas de usuario, de servicio y manuales. | Cumplimiento de la especificación técnica del curso y estándares de la industria. |

---

## Requisito Derivado

* **Requisito origen:** **RNF-03** (Seguridad y Confidencialidad Clínica: el sistema debe restringir el acceso a expedientes oncológicos y asegurar la trazabilidad de usuarios según la Ley N° 20.584).
* **Requisito derivado:** **REQ-DER-01** (Autenticación federada obligatoria mediante Single Sign-On integrado al Directorio Activo institucional del Hospital Dr. Gustavo Fricke).
* **Justificación:** Para garantizar el cumplimiento legal de confidencialidad médica (RNF-03) sin obligar a los funcionarios a manejar múltiples claves ni permitir cuentas locales compartidas, se deriva la necesidad técnica de centralizar la validación de identidad en el Directorio Activo del hospital. De este modo, la revocación de permisos ante desvinculaciones o traslados de personal se aplica de forma inmediata en toda la plataforma.
