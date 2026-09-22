# OncoTrace – Plataforma de Trazabilidad, Gestión, Evaluación y Acompañamiento Oncológico

**CIN324 – Ingeniería de Requisitos | Entrega 1**  
*Hospital Dr. Gustavo Fricke (HGF) – Servicio de Gestión Oncológica*

---

## 🎯 Visión General

**OncoTrace** es una solución tecnológica diseñada específicamente para las **Gestoras y Gestores Oncológicos** y el equipo clínico multidisciplinario del Hospital Dr. Gustavo Fricke. Su objetivo central es garantizar la **trazabilidad continua de punta a punta**, la **evaluación multidimensional**, el **acompañamiento integral** y la **gestión oportuna** de los pacientes oncológicos a lo largo de todas las etapas de su proceso asistencial: desde la sospecha diagnóstica, confirmación e ingreso a comités, hasta el tratamiento, derivaciones interhospitalarias y seguimiento post-tratamiento.

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

## 📁 Estructura del Repositorio

```
OncoTrace/
├── 📄 README.md                        # Visión general y descripción del proyecto
├── 📄 IngReq-Entrega 1.md              # Documento maestro integrador de la Entrega 1
├── 📄 01-proceso-as-is.md              # Caracterización del proceso actual (AS-IS)
├── 📄 02-rediseno-to-be.md             # Rediseño propuesto y mejoras de proceso (TO-BE)
├── 📄 03-requisitos.md                 # Matriz de requisitos funcionales y no funcionales
├── 📄 04-historias-usuario.md          # 10 Historias de Usuario con Criterios de Aceptación
├── 📄 05-elicitacion.md                # Registro de técnicas y evidencias de elicitación
├── 📄 06-atributos-calidad.md          # Atributos de calidad y escenarios arquitectónicos
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
