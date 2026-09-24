# 📋 Clasificación de requisitos

> **Dominio:** Sistema de Gestión Clínica y Trazabilidad de Atenciones (Plataforma OncoTrace)  
> **Marco Teórico:** Ingeniería de Requisitos (Niveles de Usuario, Sistema y Software) y Atributos de Calidad ISO/IEC 25010:2023.

## 📦 Requisitos de producto y trazabilidad

| ID Requisito | Requisito | Tipo | Nodo AS-IS | Nodo TO-BE | HU Asociada |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **RF-USR-01** | **Tablero y Trazabilidad:** La gestora debe visualizar un tablero centralizado y una línea de tiempo cronológica por paciente con sus hitos completados y pendientes. | Funcional | **AS-01**, **AS-04** | **TB-01** | [HU-01](./04-historias-usuario.md#hu-01) |
| **RF-USR-02** | **Evaluación Multidimensional:** La gestora debe poder registrar y actualizar la evaluación clínica, estado funcional (ECOG), factores de vulnerabilidad social y red de apoyo. | Funcional | **AS-05** | **TB-02** | [HU-02](./04-historias-usuario.md#hu-02) |
| **RF-USR-03** | **Bitácora de Acompañamiento:** La gestora debe registrar contactos asistenciales (llamadas, entrevistas, incidencias) en el historial cronológico del paciente. | Funcional | **AS-05** | **TB-03** | [HU-03](./04-historias-usuario.md#hu-03) |
| **RF-SYS-01** | **Motor de Alertas GES:** El sistema debe monitorear días transcurridos y emitir alertas preventivas ante vencimiento de garantías GES o inactividad prolongada (>15 días). | Funcional | **AS-04**, **AS-05** | **TB-04** | [HU-04](./04-historias-usuario.md#hu-04) |
| **RF-SYS-02** | **Consolidación Automatizada:** El sistema debe consolidar e indexar automáticamente los informes validados de anatomía patológica e imagenología. | Funcional | **AS-01** | **TB-05** | [HU-05](./04-historias-usuario.md#hu-05) |
| **RF-SW-01** | **Gestión de Comités:** El sistema debe compilar automáticamente los antecedentes clínicos y generar la Ficha Resumen de Presentación para el comité. | Funcional | **AS-02** | **TB-06** | [HU-06](./04-historias-usuario.md#hu-06) |
| **RF-SW-02** | **Acta Digital:** El sistema debe permitir registrar en tiempo real la discusión multidisciplinaria y formalizar el acta oficial con firma electrónica. | Funcional | **AS-02** | **TB-07** | [HU-07](./04-historias-usuario.md#hu-07) |
| **RF-SYS-03** | **Trazabilidad de Derivaciones:** El sistema debe registrar y hacer seguimiento a las interconsultas enviadas al Hospital Carlos Van Buren y prestadores privados. | Funcional | **AS-03** | **TB-08** | [HU-08](./04-historias-usuario.md#hu-08) |
| **RNF-SYS-01** | **Disponibilidad (Fiabilidad):** El sistema global (servidores y BD) debe garantizar una disponibilidad ≥ 99.5% en horario hábil para consultas operativas (AC-01). | No funcional | **AS-01**, **AS-03** | **TB-05** | HU-01, HU-05 |
| **RNF-SW-01** | **Tiempo de Respuesta (Eficiencia):** El tiempo de carga del tablero de trazabilidad y ficha del paciente debe ser ≤ 2.0 segundos bajo carga nominal (P95) (AC-02). | No funcional | **AS-01** | **TB-01** | HU-01 |
| **RNF-SW-02** | **Seguridad y Confidencialidad:** El sistema debe aplicar autenticación robusta institucional y cifrado AES-256 para los datos clínicos sensibles (AC-03). | No funcional | **AS-01**, **AS-02** | **TB-01**, **TB-07** | HU-01 a HU-08 |
| **RNF-PROD-01**| **Interoperabilidad (Compatibilidad):** El sistema debe ser capaz de interoperar mediante estándares HL7 FHIR / RESTful APIs con los sistemas LIS y PACS. | No funcional | **AS-01** | **TB-05** | HU-05 |

## 🏗️ Requisitos de proyecto

| ID Requisito | Requisito | Propósito y Justificación |
| :--- | :--- | :--- |
| **REQ-PROY-01** | **Herramienta de Construcción:** El equipo de ingeniería debe utilizar obligatoriamente *Antigravity CLI* para la inicialización y administración del flujo de trabajo del proyecto. | Estandarización de artefactos y entornos de desarrollo del equipo. |
| **REQ-PROY-02** | **Gestión de Ciclo de Vida:** El desarrollo se gestionará mediante iteraciones ágiles utilizando un tablero Kanban alojado centralizadamente en GitHub Projects. | Trazabilidad continua del avance de tareas e historias de usuario por sprint. |

## 🔗 Requisito derivado

- **Requisito origen:** **RNF-SW-02** (Seguridad y Confidencialidad clínica).
- **Requisito derivado:** **REQ-DER-01** (Integración obligatoria Single Sign-On con Directorio Activo institucional HGF).
- **Trazabilidad:** Responde a los nodos **AS-01**, **AS-02**, **TB-01** y **TB-07**, asegurando autenticación federada en todas las historias de usuario clínicas (**HU-01** a **HU-08**).
- **Justificación:** Cumplimiento de la Ley N° 20.584 sin dispersar identidades ni almacenar contraseñas localmente.

---

## 🔮 Requisitos Tangentes y Visión Futura (Roadmap)

> **Nota de Alcance:** Necesidades elicitadas para mitigar el nodo crítico de interrupciones presenciales, proyectadas para las siguientes iteraciones del producto.

| ID Requisito | Requisito Tangente | Tipo | Nodo AS-IS | Nodo TO-BE | HU Asociada |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **RF-EXT-01** | **Tótem de Autoatención y Consulta de Informes:** La estación interactiva en sala de espera debe permitir al paciente consultar de forma autónoma el estado de sus biopsias e informes médicos mediante lectura de RUT. | Funcional (Extensión) | **AS-06** | **TB-09** | [HU-09](./04-historias-usuario.md#hu-09) |
| **RF-EXT-02** | **Chatbot de Orientación y Triage Presencial:** El asistente virtual debe resolver dudas frecuentes sobre trámites, derechos legales y emitir tickets priorizados de atención según complejidad. | Funcional (Extensión) | **AS-06** | **TB-10** | [HU-10](./04-historias-usuario.md#hu-10) |


