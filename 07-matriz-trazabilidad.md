# 🧭 Matriz Maestra de Trazabilidad End-to-End

> **Proyecto:** OncoTrace – Plataforma de Trazabilidad, Gestión, Evaluación y Acompañamiento Oncológico  
> **Institución:** Hospital Dr. Gustavo Fricke (HGF) – Servicio de Gestión Oncológica  
> **Asignatura:** CIN324 – Ingeniería de Requisitos | Entrega 1  
> **Alcance:** Trazabilidad bidireccional desde los nodos críticos del proceso actual (AS-IS), pasando por la elicitación, el rediseño (TO-BE), los requisitos funcionales y no funcionales, las historias de usuario (HU), los criterios de aceptación (CA) y los atributos de calidad (ISO 25010).

---

## 🗺️ Mapa Conceptual de Nomenclatura e Instancias

```text
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│   Nodos AS-IS   │ ────► │   Elicitación   │ ────► │   Nodos TO-BE   │
│   (AS-01 a 06)  │       │   (EL-01 / 02)  │       │   (TB-01 a 10)  │
└─────────────────┘       └─────────────────┘       └─────────────────┘
                                                             │
                                                             ▼
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│ Criterios Acep. │ ◄──── │  Historias Usu. │ ◄──── │   Requisitos    │
│  (HU-xx-CAy)    │       │   (HU-01 a 10)  │       │ (RF / RNF / REQ)│
└─────────────────┘       └─────────────────┘       └─────────────────┘
```

| Prefijo | Definición de la Instancia | Descripción |
| :--- | :--- | :--- |
| **AS-xx** | **Nodo Crítico AS-IS** | Falla, cuello de botella o problema operativo en el proceso actual de atención oncológica. |
| **EL-xx** | **Técnica de Elicitación** | Fuente metodológica donde se levantó y validó la necesidad (Entrevista, Normativa). |
| **TB-xx** | **Nodo de Solución TO-BE** | Componente o actividad rediseñada en la plataforma OncoTrace para resolver la brecha. |
| **RF-xx** | **Requisito Funcional** | Capacidad o servicio que debe ofrecer el software (a nivel usuario, sistema o software). |
| **RNF-xx**| **Requisito No Funcional**| Restricción de calidad técnica, seguridad, desempeño o interoperabilidad (ISO 25010). |
| **REQ-xx**| **Requisito Proyecto/Deriv.**| Restricción metodológica de ingeniería o integración derivada arquitectónicamente. |
| **HU-xx** | **Historia de Usuario** | Unidad de valor ágil para un rol específico del equipo clínico o paciente. |
| **HU-xx-CAy** | **Criterio de Aceptación** | Regla de verificación objetiva y comprobable que condiciona el cumplimiento de la HU. |
| **AC-xx** | **Escenario de Calidad** | Escenario formal de arquitectura (SEI) para medir un atributo de calidad ISO 25010. |

---

## 📊 Tabla General de Trazabilidad Extremo a Extremo

| ID AS-IS | Nodo Crítico AS-IS | Fuente EL | ID TO-BE | Solución TO-BE | Requisito (RF / RNF) | Historia de Usuario | Criterios de Aceptación (CA) | Atributo Calidad / Verificación |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **AS-01** | Dispersión de Resultados Diagnósticos en múltiples LIS/PACS y papel | **EL-01** (Entrevista) | **TB-01**<br>**TB-05** | Tablero Kanban y Timeline<br>Indexación y Consolidación automática | **RF-USR-01**<br>**RF-SYS-02**<br>**RNF-PROD-01** | [HU-01](./04-historias-usuario.md#hu-01)<br>[HU-05](./04-historias-usuario.md#hu-05) | HU-01-CA1 a HU-01-CA6<br>HU-05-CA1 a HU-05-CA7 | **AC-02** (Eficiencia ≤ 1.8s)<br>**RNF-PROD-01** (HL7 FHIR API) |
| **AS-02** | Gestión Manual de Comités Oncológicos (Word/papel sin integración) | **EL-01** (Entrevista)<br>**EL-02** (Normativa) | **TB-06**<br>**TB-07** | Ficha Resumen autogenerada<br>Acta Digital con Firma Electrónica | **RF-SW-01**<br>**RF-SW-02**<br>**RNF-SW-02** | [HU-06](./04-historias-usuario.md#hu-06)<br>[HU-07](./04-historias-usuario.md#hu-07) | HU-06-CA1 a HU-06-CA7<br>HU-07-CA1 a HU-07-CA8 | **AC-03** (Auditoría 100% accesos)<br>**REQ-DER-01** (SSO HGF) |
| **AS-03** | Pérdida de Trazabilidad en Derivaciones Externas (HCVB / Privados) | **EL-01** (Entrevista) | **TB-08** | Módulo de Trazabilidad de Derivaciones con Tracking de Hitos | **RF-SYS-03**<br>**RNF-SYS-01** | [HU-08](./04-historias-usuario.md#hu-08) | HU-08-CA1 a HU-08-CA8 | **AC-01** (Fiabilidad RTO ≤ 5min)<br>Control de estados derivación |
| **AS-04** | Monitoreo Manual y Riesgo de Vencimiento de Plazos GES | **EL-02** (Normativa GES) | **TB-01**<br>**TB-04** | Visualización en Kanban<br>Motor de Alertas Preventivas GES | **RF-USR-01**<br>**RF-SYS-01** | [HU-01](./04-historias-usuario.md#hu-01)<br>[HU-04](./04-historias-usuario.md#hu-04) | HU-01-CA2, HU-01-CA4<br>HU-04-CA1 a HU-04-CA7 | Motor cron de evaluación diaria;<br>Alerta a ≤ 5 días hábiles |
| **AS-05** | Ausencia de Registro Centralizado de Acompañamiento y Estratificación | **EL-01** (Entrevista)<br>**EL-02** (Ley 21.258) | **TB-02**<br>**TB-03**<br>**TB-04** | Evaluación Multidimensional<br>Bitácora Cronológica Activa<br>Alerta Inactividad >15d | **RF-USR-02**<br>**RF-USR-03**<br>**RF-SYS-01** | [HU-02](./04-historias-usuario.md#hu-02)<br>[HU-03](./04-historias-usuario.md#hu-03)<br>[HU-04](./04-historias-usuario.md#hu-04) | HU-02-CA1 a HU-02-CA7<br>HU-03-CA1 a HU-03-CA6<br>HU-04-CA3 (Riesgo abandono) | Regla ECOG (0-4);<br>Inmutabilidad de bitácora |
| **AS-06** | Interrupción Crítica por Demanda Espontánea Presencial (Ley N° 21.258) | **EL-01** (Entrevista)<br>**EL-02** (Ley 21.258) | **TB-09**<br>**TB-10** | Tótem de Autoatención Táctil<br>Chatbot y Triage Presencial | **RF-EXT-01**<br>**RF-EXT-02** | [HU-09](./04-historias-usuario.md#hu-09)<br>[HU-10](./04-historias-usuario.md#hu-10) | HU-09-CA1 a HU-09-CA12<br>HU-10-CA1 a HU-10-CA13 | Validación RUN / Cédula;<br>Ticket categorizado |

---

## 🔍 Desglose Detallado por Instancia de Trazabilidad

### 🔹 Instancia 1: Trazabilidad del Flujo Diagnóstico y Tablero Clínico
- **Nodo AS-IS:** **AS-01** (Dispersión de resultados diagnósticos)
- **Elicitación:** **EL-01** (Entrevista a Gestora, hallazgo sobre demoras de 15 días buscando biopsias en LIS/PACS)
- **Nodos TO-BE:**
  - **TB-01:** Tablero Kanban con fases de atención y timeline de hitos asistenciales.
  - **TB-05:** Consolidación e indexación automática de informes mediante integraciones LIS/PACS.
- **Requisitos Vinculados:**
  - `RF-USR-01` (Tablero y Trazabilidad de Pacientes)
  - `RF-SYS-02` (Consolidación Automatizada de Informes)
  - `RNF-SW-01` (Tiempo de respuesta ≤ 2.0s)
  - `RNF-PROD-01` (Interoperabilidad HL7 FHIR)
- **Historias de Usuario:**
  - [HU-01](./04-historias-usuario.md#hu-01) (Tablero de Trazabilidad) ➔ Criterios `HU-01-CA1` a `HU-01-CA6`
  - [HU-05](./04-historias-usuario.md#hu-05) (Consolidación de Biopsias) ➔ Criterios `HU-05-CA1` a `HU-05-CA7`
- **Atributos de Calidad Asociados:** **AC-02** (Eficiencia de desempeño: Latencia ≤ 1.8s bajo 50 usuarios concurrentes).

---

### 🔹 Instancia 2: Trazabilidad de Evaluación Multidimensional y Acompañamiento
- **Nodo AS-IS:** **AS-05** (Ausencia de registro estructurado de acompañamiento y riesgo social)
- **Elicitación:** **EL-01** (Entrevista: registro informal) y **EL-02** (Ley N° 21.258: exigencia de acompañamiento integral)
- **Nodos TO-BE:**
  - **TB-02:** Ficha de evaluación multidimensional (ECOG 0-4, red de apoyo, vulnerabilidad) con cálculo de riesgo.
  - **TB-03:** Bitácora cronológica inmutable de intervenciones, llamadas y compromisos.
- **Requisitos Vinculados:**
  - `RF-USR-02` (Evaluación Multidimensional y Estratificación)
  - `RF-USR-03` (Bitácora de Acompañamiento Asistencial)
- **Historias de Usuario:**
  - [HU-02](./04-historias-usuario.md#hu-02) (Evaluación Multidimensional) ➔ Criterios `HU-02-CA1` a `HU-02-CA7`
  - [HU-03](./04-historias-usuario.md#hu-03) (Bitácora de Acompañamiento) ➔ Criterios `HU-03-CA1` a `HU-03-CA6`
- **Atributos de Calidad Asociados:** **AC-03** (Auditoría y control de modificaciones sin borrado físico).

---

### 🔹 Instancia 3: Trazabilidad del Monitoreo Preventivo GES y Prevención de Deserción
- **Nodo AS-IS:** **AS-04** (Monitoreo manual de plazos) y **AS-05** (Deserción de pacientes)
- **Elicitación:** **EL-02** (Revisión Normativa GES: plazos perentorios y multas legales)
- **Nodos TO-BE:**
  - **TB-04:** Motor de alertas preventivas en tiempo real (semáforo de criticidad a ≤ 5 días hábiles e inactividad > 15 días).
- **Requisitos Vinculados:**
  - `RF-SYS-01` (Motor de Alertas Preventivas GES e Inactividad)
- **Historias de Usuario:**
  - [HU-04](./04-historias-usuario.md#hu-04) (Alertas de Plazos GES e Inactividad) ➔ Criterios `HU-04-CA1` a `HU-04-CA7`
- **Atributos de Calidad Asociados:** Fiabilidad operativa del motor de reglas y no duplicidad de alertas (`HU-04-CA7`).

---

### 🔹 Instancia 4: Trazabilidad de la Gestión Colegiada de Comités Oncológicos
- **Nodo AS-IS:** **AS-02** (Preparación manual en Word y actas físicas en papel)
- **Elicitación:** **EL-01** (Entrevista: sobrecarga de preparación) y **EL-02** (Revisión de actas actuales)
- **Nodos TO-BE:**
  - **TB-06:** Autogeneración de Ficha Resumen de Presentación a partir de diagnósticos, biopsias y ECOG.
  - **TB-07:** Acta digital colegiada con registro de conducta terapéutica (TNM), firma electrónica y bloqueo post-firma.
- **Requisitos Vinculados:**
  - `RF-SW-01` (Generación de Ficha de Comité)
  - `RF-SW-02` (Acta Digital de Comité y Firma Electrónica)
  - `RNF-SW-02` (Seguridad y Confidencialidad AES-256)
  - `REQ-DER-01` (Single Sign-On Institucional con Directorio Activo HGF)
- **Historias de Usuario:**
  - [HU-06](./04-historias-usuario.md#hu-06) (Ficha de Presentación a Comité) ➔ Criterios `HU-06-CA1` a `HU-06-CA7`
  - [HU-07](./04-historias-usuario.md#hu-07) (Acta Digital de Comité) ➔ Criterios `HU-07-CA1` a `HU-07-CA8`
- **Atributos de Calidad Asociados:** **AC-03** (Seguridad y firma electrónica inmutable) y **REQ-DER-01** (Autenticación federada).

---

### 🔹 Instancia 5: Trazabilidad de Derivaciones a Prestadores Externos
- **Nodo AS-IS:** **AS-03** (Punto ciego y pérdida de trazabilidad en derivaciones físicas a Van Buren y prestadores privados)
- **Elicitación:** **EL-01** (Entrevista: interconsultas en papel sin retorno de inicio de tratamiento)
- **Nodos TO-BE:**
  - **TB-08:** Módulo de trazabilidad de derivaciones con workflow de estados (`Solicitada` ➔ `En espera` ➔ `Atendida` ➔ `Resultado` ➔ `Cerrada`).
- **Requisitos Vinculados:**
  - `RF-SYS-03` (Trazabilidad de Derivaciones a Prestadores Externos)
  - `RNF-SYS-01` (Disponibilidad ≥ 99.5%)
- **Historias de Usuario:**
  - [HU-08](./04-historias-usuario.md#hu-08) (Trazabilidad de Derivaciones) ➔ Criterios `HU-08-CA1` a `HU-08-CA8`
- **Atributos de Calidad Asociados:** **AC-01** (Fiabilidad y RTO ≤ 5min para evitar pérdida de hitos externos).

---

### 🔹 Instancia 6: Trazabilidad de Autoatención y Triage Presencial (Extensión Ley N° 21.258)
- **Nodo AS-IS:** **AS-06** (Interrupciones críticas por demanda espontánea en oficina de gestión)
- **Elicitación:** **EL-01** (Entrevista: obligación legal de atención bajo Ley N° 21.258 que colapsa el tiempo asistencial)
- **Nodos TO-BE:**
  - **TB-09:** Tótem táctil de autoatención con autenticación por RUT para consultar estado de exámenes sin ver datos sensibles.
  - **TB-10:** Chatbot interactivo de orientación de derechos y emisión de tickets de triage priorizados según criticidad.
- **Requisitos Vinculados:**
  - `RF-EXT-01` (Tótem de Autoatención y Consulta de Informes)
  - `RF-EXT-02` (Chatbot de Orientación y Triage Presencial)
- **Historias de Usuario:**
  - [HU-09](./04-historias-usuario.md#hu-09) (Tótem de Autoatención) ➔ Criterios `HU-09-CA1` a `HU-09-CA12`
  - [HU-10](./04-historias-usuario.md#hu-10) (Chatbot y Triage Espontáneo) ➔ Criterios `HU-10-CA1` a `HU-10-CA13`
- **Atributos de Calidad Asociados:** Protección de privacidad (cierre de sesión automático `HU-09-CA10`, logs de auditoría `HU-09-CA11`).

---

## 🎯 Conclusión de Consistencia del Sistema

1. **Cobertura 100% del AS-IS:** Ningún nodo crítico identificado en el proceso actual queda sin solución en el rediseño TO-BE.
2. **Derivación Formal de Requisitos:** Todos los requisitos funcionales (`RF-USR`, `RF-SYS`, `RF-SW`, `RF-EXT`) y no funcionales (`RNF`) se desprenden directamente de los objetivos de mejora.
3. **Comprobabilidad de Historias:** Cada historia de usuario cuenta con criterios de aceptación formulados bajo estructura *Dado-Cuando-Entonces* o reglas de negocio estrictas, vinculadas a métricas de calidad ISO 25010.
