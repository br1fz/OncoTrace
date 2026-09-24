# 🚀 OncoTrace – Plataforma de Trazabilidad, Gestión, Evaluación y Acompañamiento Oncológico

**CIN324 – Ingeniería de Requisitos | Entrega 1**  
*Hospital Dr. Gustavo Fricke (HGF) – Servicio de Gestión Oncológica*

---

## 👥 Equipo de Trabajo

- **Bruno Fernandez**
- **Máximo Torrijo**
- **Ignacio Jorquera**
- **Benjamin Carcamo**

### 📋 Declaración de Responsabilidades por Integrante

Conforme a lo exigido en la evaluación, la distribución de responsabilidades del equipo sobre los entregables es la siguiente:

| Integrante | Entregable(s) a Cargo |
| :--- | :--- |
| **Bruno Fernandez** | [`01-proceso-as-is.md`](./01-proceso-as-is.md) y [`02-rediseno-to-be.md`](./02-rediseno-to-be.md) |
| **Benjamin Carcamo** | [`04-historias-usuario.md`](./04-historias-usuario.md) |
| **Máximo Torrijo** | [`03-requisitos.md`](./03-requisitos.md) |
| **Ignacio Jorquera** | [`05-elicitacion.md`](./05-elicitacion.md) y [`06-atributos-calidad.md`](./06-atributos-calidad.md) |
| **Equipo Completo** | [`07-matriz-trazabilidad.md`](./07-matriz-trazabilidad.md) (Integración Transversal y Trazabilidad) |

---

## 🎯 Visión General del Proyecto

**OncoTrace** es una solución tecnológica diseñada específicamente para las **Gestoras y Gestores Oncológicos** y el equipo clínico multidisciplinario del **Hospital Dr. Gustavo Fricke (HGF)**. 

Su objetivo central es garantizar la **trazabilidad continua de punta a punta**, la **evaluación multidimensional**, el **acompañamiento integral** y la **gestión oportuna** de los pacientes oncológicos a lo largo de todas las etapas de su proceso asistencial: desde la sospecha diagnóstica, confirmación e ingreso a comités, hasta el tratamiento, derivaciones interhospitalarias y seguimiento post-tratamiento.

El sistema resuelve la fragmentación de datos clínicos, la pérdida de trazabilidad en derivaciones a prestadores externos y la sobrecarga operativa manual, asegurando el cumplimiento estricto de las normativas y plazos GES.

---

## 👥 Perfil de Usuario Principal y Stakeholders

- **Usuario Principal:** Gestoras y Gestores Oncológicos (enfermeras/os gestoras encargadas del seguimiento y navegación del paciente).
- **Usuarios Secundarios:**
  - Médicos tratantes y especialistas (Cirugía Oncológica, Hematología, Oncología Médica).
  - Integrantes del Comité Oncológico Multidisciplinario.
  - Secretaría de Gestión Oncológica.
  - Jefatura del Servicio de Oncología y Dirección Médica (supervisión y reportería GES).

---

## 🧩 Módulos Principales de la Plataforma

```
                               ┌──────────────────────────────────────────┐
                               │               ONCOTRACE                  │
                               │   Plataforma para Gestores Oncológicos   │
                               └────────────────────┬─────────────────────┘
                                                    │
         ┌───────────────────┬──────────────────────┼──────────────────────┬───────────────────┐
         │                   │                      │                      │                   │
         ▼                   ▼                      ▼                      ▼                   ▼
┌─────────────────┐ ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐ ┌─────────────────┐
│  Trazabilidad   │ │   Evaluación    │    │ Acompañamiento  │    │     Comité      │ │  Derivaciones y │
│  Integral de    │ │ Multidimensional│    │    Activo y     │    │   Oncológico    │ │   Control GES   │
│    Pacientes    │ │  (Estratificación)│  │   Bitácora      │    │  Inteligente    │ │ (Van Buren/Priv)│
└─────────────────┘ └─────────────────┘    └─────────────────┘    └─────────────────┘ └─────────────────┘
```

1. **Tablero de Trazabilidad y Timeline Clínico:** Visualización en tiempo real del estado de cada paciente, hitos completados, exámenes pendientes y alertas de tiempos de espera.
2. **Evaluación Multidimensional y Estratificación:** Ficha de evaluación clínica, estado funcional (ECOG/Karnofsky), vulnerabilidad socioeconómica y red de soporte familiar para priorizar intervenciones.
3. **Módulo de Acompañamiento y Bitácora:** Registro de contactos, seguimiento telefónico/asistencial, detección temprana de riesgo de abandono y coordinación de apoyos psicosociales.
4. **Gestión de Comités Oncológicos:** Consolidación automática de antecedentes, generación de fichas de presentación, soporte durante la sesión de comité y registro estructurado de resoluciones clínicas.
5. **Monitoreo de Plazos (GES / Ley Ricarte Soto) y Derivaciones:** Alertas preventivas de vencimiento de garantías y seguimiento bidireccional de derivaciones a centros externos (Hospital Carlos Van Buren para radioterapia/quimioterapia sólida, y centros privados para PET-CT/EBUS).

---

## 📂 Índice Maestro de Documentos (Entrega 1)

1. [**01. Proceso AS-IS**](./01-proceso-as-is.md) – Caracterización del proceso actual (nodos AS-01 a AS-06).
2. [**02. Rediseño y Proceso TO-BE**](./02-rediseno-to-be.md) – Rediseño propuesto y mejoras de proceso (nodos TB-01 a TB-10).
3. [**03. Clasificación de Requisitos**](./03-requisitos.md) – Matriz de requisitos funcionales y no funcionales.
4. [**04. Historias de Usuario**](./04-historias-usuario.md) – 10 Historias de Usuario con Criterios de Aceptación (HU-xx-CAy).
5. [**05. Elicitación**](./05-elicitacion.md) – Registro de técnicas y evidencias de elicitación (EL-01, EL-02).
6. [**06. Atributos de Calidad**](./06-atributos-calidad.md) – Atributos de calidad y escenarios arquitectónicos (AC-01 a AC-03).
7. [**07. Matriz de Trazabilidad End-to-End**](./07-matriz-trazabilidad.md) – Matriz maestra de trazabilidad end-to-end.

---

## 🗺️ Accesos Directos a Modelos BPMN

Para facilitar la revisión técnica, a continuación se enlazan los archivos fuente de los modelos de proceso:

- **Proceso AS-IS:** [`./diagramas/as-is.bpmn`](./diagramas/as-is.bpmn)
- **Proceso TO-BE:** [`./diagramas/to-be.bpmn`](./diagramas/to-be.bpmn)

---

## 🎯 Resumen Ejecutivo del Rediseño

El proyecto **OncoTrace** se enfoca exclusivamente en dotar a las Gestoras y Gestores Oncológicos del Hospital Dr. Gustavo Fricke de una herramienta digital integral. 

Mediante la consolidación automática de exámenes, tableros Kanban de trazabilidad, generación automática de actas para los Comités Oncológicos y control estricto de plazos GES, la plataforma busca eliminar el punto ciego asistencial que ocurre actualmente al momento de derivar pacientes a recintos externos (como el Hospital Carlos Van Buren o clínicas privadas), reduciendo la sobrecarga administrativa y priorizando el acompañamiento efectivo del paciente.

---

## 📁 Estructura del Repositorio

```
OncoTrace/
├── 📄 README.md                        # Vista principal del repositorio en GitHub (Espejo de Entrega 1)
├── 📄 IngReq-Entrega 1.md              # Documento maestro integrador de la Entrega 1
├── 📄 01-proceso-as-is.md              # Caracterización del proceso actual (AS-IS, nodos AS-01 a AS-06)
├── 📄 02-rediseno-to-be.md             # Rediseño propuesto y mejoras de proceso (TO-BE, nodos TB-01 a TB-10)
├── 📄 03-requisitos.md                 # Matriz de requisitos funcionales y no funcionales
├── 📄 04-historias-usuario.md          # 10 Historias de Usuario con Criterios de Aceptación (HU-xx-CAy)
├── 📄 05-elicitacion.md                # Registro de técnicas y evidencias de elicitación (EL-01, EL-02)
├── 📄 06-atributos-calidad.md          # Atributos de calidad y escenarios arquitectónicos (AC-01 a AC-03)
├── 📄 07-matriz-trazabilidad.md        # Matriz maestra de trazabilidad end-to-end
├── 📁 diagramas/
│   ├── 📄 as-is.bpmn                   # Modelo BPMN del proceso actual (AS-IS)
│   └── 📄 to-be.bpmn                   # Modelo BPMN del proceso rediseñado (TO-BE)
├── 📁 evidencia/                       # Transcripciones y minutas de entrevistas
└── 📁 _backup/                         # Resguardos de versiones previas
```

---

## 🚀 Integración y Tecnologías Base

- **Interoperabilidad:** Integración con sistemas del HGF (Ficha Clínica Electrónica, Laboratorio, Radiología/PACS) e integración de reportes externos.
- **Seguridad:** Control de acceso basado en roles (RBAC), registro de auditoría clínica conforme a la Ley N° 20.584 (Derechos y Deberes de los Pacientes).
- **Estándares Clínicos:** Cumplimiento de plazos GES (Garantías Explícitas en Salud) y Ley Nacional del Cáncer N° 21.258.
