# 📋 Clasificación de requisitos

> **Dominio:** Sistema de Gestión Clínica, Navegación y Trazabilidad Oncológica (Plataforma OncoTrace)  
> **Institución:** Hospital Dr. Gustavo Fricke (HGF) – Unidad de Gestión de Casos Oncológicos (UGCO)  
> **Marco Teórico:** Ingeniería de Requisitos (Niveles de Usuario, Sistema y Software) y Atributos de Calidad ISO/IEC 25010:2023.

## 📦 Requisitos de producto y trazabilidad

| ID Requisito | Requisito | Tipo | Nodo AS-IS | Nodo TO-BE | HU Asociada |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **RF-USR-01** | **Tablero y Trazabilidad por Etapas:** La gestora debe visualizar un tablero centralizado por las 8 etapas oncológicas y una línea de tiempo cronológica por paciente con sus hitos completados y pendientes. | Funcional | **AS-01**, **AS-04** | **TB-01** | [HU-01](./04-historias-usuario.md#hu-01) |
| **RF-USR-02** | **Evaluación Multidimensional por Dominios:** La gestora debe registrar y actualizar la evaluación por dominios (clínico-funcional, ECOG 0-4, psicoemocional, familiar/cuidador, socioeconómico y espiritual). | Funcional | **AS-05** | **TB-02** | [HU-02](./04-historias-usuario.md#hu-02) |
| **RF-USR-03** | **Bitácora de Puntos de Contacto Obligatorio:** La gestora y TENS deben registrar contactos asistenciales y verificar el cumplimiento de los 6 puntos de contacto obligatorio normados por la UGCO. | Funcional | **AS-05** | **TB-03** | [HU-03](./04-historias-usuario.md#hu-03) |
| **RF-SYS-01** | **Motor de Alertas GES e Inactividad:** El sistema debe monitorear días transcurridos y emitir alertas preventivas ante vencimiento de garantías GES (21 patologías DS N° 29 a $\le 5$ días hábiles) o inactividad $>15$ días. | Funcional | **AS-04**, **AS-05** | **TB-04** | [HU-04](./04-historias-usuario.md#hu-04) |
| **RF-SYS-02** | **Consolidación Automatizada y Alertas Críticas:** El sistema debe consolidar e indexar automáticamente los informes de patología e imagenología, notificando de inmediato al médico ante valores críticos. | Funcional | **AS-01** | **TB-05** | [HU-05](./04-historias-usuario.md#hu-05) |
| **RF-SW-01** | **Gestión Digital de Comités:** El sistema debe compilar automáticamente los antecedentes clínicos (biopsias, imágenes, estadio TNM, ECOG) y generar la Ficha Resumen de Presentación para el comité. | Funcional | **AS-02** | **TB-06** | [HU-06](./04-historias-usuario.md#hu-06) |
| **RF-SW-02** | **Acta Digital y Registro REM 0.7:** El sistema debe permitir registrar en tiempo real la resolución del comité, formalizar el acta con firma electrónica y generar automáticamente el informe estadístico REM 0.7. | Funcional | **AS-02** | **TB-07** | [HU-07](./04-historias-usuario.md#hu-07) |
| **RF-SYS-03** | **Trazabilidad de Derivaciones (Dossier TENS/UGAA):** El sistema debe gestionar la confección del dossier digital por el TENS, su despacho vía UGAA y el tracking bidireccional con el Hospital Carlos Van Buren y centros privados. | Funcional | **AS-03** | **TB-08** | [HU-08](./04-historias-usuario.md#hu-08) |
| **RNF-SYS-01** | **Disponibilidad (Fiabilidad):** El sistema global (servidores y BD) debe garantizar una disponibilidad $\ge 99.5\%$ en horario hábil para consultas operativas y seguimiento asistencial (AC-01). | No funcional | **AS-01**, **AS-03** | **TB-05** | HU-01, HU-05 |
| **RNF-SW-01** | **Tiempo de Respuesta (Eficiencia):** El tiempo de carga del tablero de trazabilidad y ficha del paciente debe ser $\le 2.0$ segundos bajo carga nominal (P95) (AC-02). | No funcional | **AS-01** | **TB-01** | HU-01 |
| **RNF-SW-02** | **Seguridad y Confidencialidad:** El sistema debe aplicar autenticación institucional robusta y cifrado AES-256 para los datos clínicos sensibles, cumpliendo con la Ley N° 20.584 (AC-03). | No funcional | **AS-01**, **AS-02** | **TB-01**, **TB-07** | HU-01 a HU-08 |
| **RNF-PROD-01**| **Interoperabilidad Hospitalaria (HL7 FHIR):** El sistema debe ser capaz de interoperar mediante estándares HL7 FHIR / RESTful APIs con los sistemas LIS (laboratorio/biopsias) y PACS (imágenes) del HGF. | No funcional | **AS-01** | **TB-05** | HU-05 |
| **RNF-PROD-02**| **Interoperabilidad Ministerial (MINSAL):** El sistema debe proveer sincronización segura vía API REST / HL7 FHIR con la Plataforma de Seguimiento Oncológico del MINSAL, eliminando el doble registro (AS-05). | No funcional | **AS-05** | **TB-11** | HU-01, HU-02 |

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

> **Nota de Alcance:** Necesidades elicitadas para mitigar el nodo crítico de interrupciones presenciales (AS-06 / Ley N° 21.258), proyectadas para las siguientes iteraciones del producto.

| ID Requisito | Requisito Tangente | Tipo | Nodo AS-IS | Nodo TO-BE | HU Asociada |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **RF-EXT-01** | **Tótem de Autoatención y Consulta de Informes:** La estación interactiva en sala de espera debe permitir al paciente consultar de forma autónoma el estado de sus biopsias e informes médicos mediante lectura de RUT. | Funcional (Extensión) | **AS-06** | **TB-09** | [HU-09](./04-historias-usuario.md#hu-09) |
| **RF-EXT-02** | **Chatbot de Orientación y Triage Presencial:** El asistente virtual debe resolver dudas frecuentes sobre trámites, derechos legales y emitir tickets priorizados de atención según complejidad para la gestora. | Funcional (Extensión) | **AS-06** | **TB-10** | [HU-10](./04-historias-usuario.md#hu-10) |
