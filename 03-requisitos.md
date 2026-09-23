# Especificación de Requisitos – Plataforma OncoTrace

**CIN324 – Ingeniería de Requisitos | Entrega 1**  
*Hospital Dr. Gustavo Fricke (HGF) – Servicio de Gestión Oncológica*

---

## 1. Clasificación de Requisitos

Los requisitos se dividen en:
1. **Requisitos Funcionales (RF):** Funcionalidades directas que la plataforma OncoTrace proporciona a las gestoras oncológicas y equipo clínico.
2. **Requisitos No Funcionales (RNF):** Atributos de calidad de software conforme al estándar **ISO/IEC 25010** (rendimiento, seguridad, fiabilidad, interoperabilidad, usabilidad).

---

## 2. Matriz de Requisitos Funcionales (RF)

| ID | Nombre del Requisito | Descripción | Prioridad | **Actividad TO-BE Asociada** |
|----|----------------------|-------------|-----------| :--- |
| **RF-01** | Tablero de Trazabilidad y Timeline Oncológico | El sistema debe proveer una vista tipo tablero y una línea de tiempo cronológica por paciente que muestre el estado actual, hitos asistenciales completados y próximos pasos en su proceso de atención. | Alta (Must) | **User Task: TB_Task_MonitoreoTablero** |
| **RF-02** | Evaluación Multidimensional del Paciente | El sistema debe permitir al gestor oncológico registrar y actualizar la evaluación clínica, índice de estado funcional (ECOG / Karnofsky), factores de vulnerabilidad social y red de apoyo del paciente. | Alta (Must) | **User Task: TB_Task_EvaluacionMultidimensional** |
| **RF-03** | Bitácora de Acompañamiento y Seguimiento | El sistema debe permitir registrar contactos asistenciales (llamadas telefónicas, entrevistas presenciales, acuerdos, incidencias o necesidades de soporte psicosocial) asociados al historial del paciente. | Alta (Must) | **User Task: TB_Task_BitacoraAcompanamiento** |
| **RF-04** | Motor de Alertas de Plazos GES y Deserción | El sistema debe monitorear automáticamente los días transcurridos por etapa oncológica y emitir alertas visuales preventivas ante proximidad de vencimiento de garantías GES o inactividad prolongada (>15 días). | Alta (Must) | **Service Task: TB_Task_MotorAlertasGES** |
| **RF-05** | Consolidación Automatizada de Informes Diagnósticos | El sistema debe consolidar e indexar en la ficha del paciente los resultados e informes validados de anatomía patológica (biopsias) e imagenología (TAC, RNM, ecografías). | Alta (Must) | **Service Task: TB_Task_ConsolidacionAuto** |
| **RF-06** | Gestión y Preparación de Tablas de Comité | El sistema debe permitir a la gestora programar comités oncológicos por especialidad, asignar pacientes y generar automáticamente la Ficha Resumen de Presentación con los antecedentes clínicos consolidados. | Alta (Must) | **Service Task: TB_Task_GenerarFichaComite** |
| **RF-07** | Registro y Firma Digital de Actas de Comité | El sistema debe permitir registrar en tiempo real la discusión multidisciplinaria, el diagnóstico colegiado, la indicación terapéutica y formalizar el acta oficial del comité con firma electrónica. | Alta (Must) | **User Task: TB_Task_ComiteDigital** |
| **RF-08** | Trazabilidad de Derivaciones Externas | El sistema debe registrar y hacer seguimiento a las interconsultas derivadas al Hospital Carlos Van Buren (radioterapia/quimioterapia) y prestadores privados (PET-CT/EBUS), registrando fechas de recepción e inicio de terapia. | Alta (Must) | **User Task: TB_Task_TrazabilidadDerivaciones** |
| **RF-09** | Reportes Estadísticos y Gestión de Casos | El sistema debe generar reportes agregados sobre tiempos promedio de espera entre hitos, tasa de cumplimiento GES, distribución de patologías y carga de pacientes por gestora oncológica. | Media (Should) | *(Transversal al motor de reportería de la plataforma)* |
| **RF-10** | Control de Acceso Basado en Roles y Ficha Confidencial | El sistema debe restringir las acciones y visibilidad de datos sensibles según el rol del usuario (Gestora, Médico Especialista, Comité, Secretaría, Administrador) conforme a la Ley N° 20.584. | Alta (Must) | *(Restricción global a nivel de sistema)* |

---

## 3. Matriz de Requisitos No Funcionales (RNF) – ISO/IEC 25010

| ID | Requisito No Funcional | Categoría ISO/IEC 25010 | Métrica / Criterio de Aceptación |
|----|------------------------|-------------------------|----------------------------------|
| **RNF-01** | **Disponibilidad de Servicio** | Fiabilidad → Disponibilidad | Disponibilidad ≥ 99.5% en horario hábil y fines de semana para acceso a datos críticos. |
| **RNF-02** | **Tiempo de Respuesta en Consulta** | Rendimiento → Comportamiento temporal | Tiempo de carga del tablero de trazabilidad y ficha del paciente ≤ 2.0 segundos bajo carga nominal. |
| **RNF-03** | **Seguridad y Confidencialidad** | Seguridad → Confidencialidad | Autenticación robusta institucional, cifrado en tránsito (TLS 1.3) y en reposo (AES-256) para datos clínicos sensibles. |
| **RNF-04** | **Trazabilidad y Auditoría de Acceso** | Seguridad → No repudio / Auditoría | Registro inmutable en log de toda consulta, modificación, exportación o eliminación de registros clínicos (RUN, usuario, timestamp, acción). |
| **RNF-05** | **Interoperabilidad Asistencial** | Compatibilidad → Interoperabilidad | Capacidad de interoperar mediante estándares HL7 FHIR / RESTful APIs con sistemas LIS, RIS/PACS y Ficha Clínica del HGF. |
| **RNF-06** | **Usabilidad y Eficiencia de Tarea** | Usabilidad → Operabilidad | Una gestora oncológica debe poder registrar un contacto en la bitácora o asignar un paciente a comité en menos de 3 clics o 60 segundos. |
| **RNF-07** | **Escalabilidad y Capacidad** | Rendimiento → Capacidad | Soporte concurrente para al menos 100 usuarios simultáneos y gestión de un histórico de más de 50.000 fichas oncológicas sin degradación. |
| **RNF-08** | **Respaldo y Recuperación** | Fiabilidad → Recuperabilidad | Política de respaldos automáticos diarios (RPO ≤ 24 horas, RTO ≤ 2 horas) ante contingencias de infraestructura. |
