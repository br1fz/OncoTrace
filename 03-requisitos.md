# 📋 Clasificación de requisitos

> **Dominio:** Sistema de Gestión Clínica y Trazabilidad de Atenciones (Plataforma OncoTrace)  
> **Marco Teórico:** Ingeniería de Requisitos (Niveles de Usuario, Sistema y Software) y Atributos de Calidad ISO/IEC 25010:2023.

## 📦 Requisitos de producto

| ID | Requisito | Tipo (funcional/no funcional) | Actividad TO-BE asociada |
|----|-----------|--------------------------------|----------------------------|
| **RF-USR-01** | **Tablero y Trazabilidad:** La gestora debe visualizar un tablero centralizado y una línea de tiempo cronológica por paciente con sus hitos completados y pendientes. | Funcional | Gestora monitorea tablero Kanban y revisa resultados consolidados |
| **RF-USR-02** | **Evaluación Multidimensional:** La gestora debe poder registrar y actualizar la evaluación clínica, estado funcional (ECOG), factores de vulnerabilidad social y red de apoyo. | Funcional | Gestora realiza Evaluación Multidimensional (ECOG, Social, Red) |
| **RF-USR-03** | **Bitácora de Acompañamiento:** La gestora debe registrar contactos asistenciales (llamadas, entrevistas, incidencias) en el historial cronológico del paciente. | Funcional | Gestora registra primer contacto en Bitácora de Acompañamiento |
| **RF-SYS-01** | **Motor de Alertas GES:** El sistema debe monitorear días transcurridos y emitir alertas preventivas ante vencimiento de garantías GES o inactividad prolongada (>15 días). | Funcional | Motor de alertas evalúa plazos GES y riesgo de inactividad |
| **RF-SYS-02** | **Consolidación Automatizada:** El sistema debe consolidar e indexar automáticamente los informes validados de anatomía patológica e imagenología. | Funcional | OncoTrace consolida e indexa informes de patología e imágenes |
| **RF-SW-01** | **Gestión de Comités:** El sistema debe compilar automáticamente los antecedentes clínicos y generar la Ficha Resumen de Presentación para el comité. | Funcional | OncoTrace compila antecedentes y genera Ficha de Presentación |
| **RF-SW-02** | **Acta Digital:** El sistema debe permitir registrar en tiempo real la discusión multidisciplinaria y formalizar el acta oficial con firma electrónica. | Funcional | Comité evalúa caso y firma Acta Digital con conducta terapéutica |
| **RF-SYS-03** | **Trazabilidad de Derivaciones:** El sistema debe registrar y hacer seguimiento a las interconsultas enviadas al Hospital Carlos Van Buren y prestadores privados. | Funcional | Gestora realiza seguimiento activo de derivación en OncoTrace |
| **RNF-SYS-01** | **Disponibilidad (Fiabilidad):** El sistema global (servidores y BD) debe garantizar una disponibilidad ≥ 99.5% en horario hábil para consultas operativas. | No funcional | OncoTrace consolida e indexa informes de patología e imágenes |
| **RNF-SW-01** | **Tiempo de Respuesta (Eficiencia):** El tiempo de carga del tablero de trazabilidad y ficha del paciente debe ser ≤ 2.0 segundos bajo carga nominal (P95). | No funcional | Gestora monitorea tablero Kanban y revisa resultados consolidados |
| **RNF-SW-02** | **Seguridad y Confidencialidad:** El sistema debe aplicar autenticación robusta institucional y cifrado AES-256 para los datos clínicos sensibles. | No funcional | Gestora registra paciente en OncoTrace y activa trazabilidad |
| **RNF-PROD-01**| **Interoperabilidad (Compatibilidad):** El sistema debe ser capaz de interoperar mediante estándares HL7 FHIR / RESTful APIs con los sistemas LIS y PACS. | No funcional | OncoTrace consolida e indexa informes de patología e imágenes |
 
## 🏗️ Requisitos de proyecto

| ID | Requisito |
|----|-----------|
| **REQ-PROY-01** | **Herramienta de Construcción:** El equipo de ingeniería debe utilizar obligatoriamente *Antigravity CLI* para la inicialización y administración del flujo de trabajo del proyecto. |
| **REQ-PROY-02** | **Gestión de Ciclo de Vida:** El desarrollo se gestionará mediante iteraciones ágiles utilizando un tablero Kanban alojado centralizadamente en GitHub Projects. |
 
## 🔗 Requisito derivado

**Requisito origen:** **RNF-SW-02** (El sistema debe aplicar autenticación robusta institucional y cifrado AES-256 para los datos clínicos sensibles).  
**Requisito derivado:** **REQ-DER-01** (La plataforma debe integrarse obligatoriamente mediante *Single Sign-On* (SSO) con el Directorio Activo institucional del Hospital Dr. Gustavo Fricke).  
**Justificación:** Para garantizar la seguridad exigida en el requisito origen y cumplir con la Ley N° 20.584 de confidencialidad médica, la plataforma OncoTrace no puede gestionar ni almacenar contraseñas de forma aislada. Esto deriva en la necesidad arquitectónica de consumir directamente el servicio de identidades y credenciales centralizado del hospital.

---

## 🔮 Requisitos Tangentes y Visión Futura (Roadmap)

> **Nota de Alcance:** Necesidades expresadas durante la entrevista con la Gestora Oncológica que corresponden a extensiones del ecosistema de atención al paciente, registradas para diseño y desarrollo en fases posteriores.

| ID | Requisito Tangente | Tipo | Justificación Asistencial y Legal |
| :--- | :--- | :--- | :--- |
| **RF-EXT-01** | **Tótem de Autoatención y Consulta de Informes:** La estación interactiva en sala de espera debe permitir al paciente consultar de forma autónoma el estado de sus biopsias e informes médicos mediante lectura de RUT. | Funcional (Extensión) | Descongestionar el mesón de atención y mitigar las interrupciones operativas que sufren las gestoras debido a la alta demanda espontánea amparada bajo la Ley del Cáncer N° 21.258. |
| **RF-EXT-02** | **Chatbot de Orientación y Triage Presencial:** El asistente virtual debe resolver dudas frecuentes sobre trámites, derechos legales y emitir tickets priorizados de atención según complejidad. | Funcional (Extensión) | Estandarizar la acogida del paciente (oncológico o en sospecha) y canalizar exclusivamente hacia las gestoras aquellos casos que requieren contención humana inmediata. |

