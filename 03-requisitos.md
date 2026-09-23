# 📋 Clasificación de requisitos
 
## 📦 Requisitos de producto
| ID | Requisito | Tipo (funcional/no funcional) | Actividad TO-BE asociada |
|----|-----------|--------------------------------|----------------------------|
| 🔹 RF-01 | Proveer tablero visual y línea de tiempo con hitos y próximos pasos por paciente. | Funcional | Gestora monitorea tablero Kanban y revisa resultados consolidados |
| 🔹 RF-02 | Registrar evaluación multidimensional (clínica, ECOG, vulnerabilidad social). | Funcional | Gestora realiza Evaluación Multidimensional (ECOG, Social, Red) |
| 🔹 RF-03 | Registrar contactos asistenciales y necesidades en bitácora cronológica. | Funcional | Gestora registra primer contacto en Bitácora de Acompañamiento |
| 🔹 RF-04 | Monitorear plazos y emitir alertas preventivas por vencimiento GES o inactividad. | Funcional | Motor de alertas evalúa plazos GES y riesgo de inactividad |
| 🔹 RF-05 | Consolidar e indexar informes validados de anatomía patológica e imagenología. | Funcional | OncoTrace consolida e indexa informes de patología e imágenes |
| 🔹 RF-06 | Programar comités, asignar pacientes y generar Ficha Resumen de Presentación. | Funcional | OncoTrace compila antecedentes y genera Ficha de Presentación |
| 🔹 RF-07 | Registrar discusión clínica y formalizar acta oficial del comité con firma electrónica. | Funcional | Comité evalúa caso y firma Acta Digital con conducta terapéutica |
| 🔹 RF-08 | Registrar y hacer seguimiento de derivaciones a Hospital Van Buren y clínicas privadas. | Funcional | Gestora realiza seguimiento activo de derivación en OncoTrace |
| 🔸 RNF-01 | Disponibilidad ≥ 99.5% en horario hábil para acceso a datos críticos (Fiabilidad). | No funcional | OncoTrace consolida e indexa informes de patología e imágenes |
| 🔸 RNF-02 | Tiempo de carga del tablero ≤ 2.0 segundos bajo carga nominal (Rendimiento). | No funcional | Gestora monitorea tablero Kanban y revisa resultados consolidados |
| 🔸 RNF-03 | Autenticación robusta y cifrado AES-256 para datos clínicos (Seguridad). | No funcional | Gestora registra paciente en OncoTrace y activa trazabilidad |
| 🔸 RNF-04 | Interoperar mediante HL7 FHIR / APIs con sistemas LIS y PACS (Compatibilidad). | No funcional | OncoTrace consolida e indexa informes de patología e imágenes |
 
## 🏗️ Requisitos de proyecto
| ID | Requisito |
|----|-----------|
| 🛠️ RY-01 | El desarrollo se gestionará mediante iteraciones quincenales usando un tablero Kanban en GitHub Projects. |
| 🛠️ RY-02 | El equipo utilizará obligatoriamente Antigravity CLI para la gestión e inicialización del entorno de trabajo. |
 
## 🔗 Requisito derivado
**Requisito origen:** 🔸 RNF-03 (Autenticación robusta y cifrado AES-256 para datos clínicos sensibles).
**Requisito derivado:** 🔄 RD-01 (El sistema debe integrarse obligatoriamente mediante Single Sign-On (SSO) con el Directorio Activo institucional del Hospital Dr. Gustavo Fricke).
**Justificación:** Para garantizar la seguridad y autenticación robusta exigida en el requisito origen y cumplir la Ley N° 20.584, el software no debe gestionar credenciales de forma aislada, derivando en la obligación técnica de consumir el servicio de identidades centralizado del hospital.
