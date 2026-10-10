# 🚀 OncoTrace – Plataforma de Trazabilidad, Gestión, Evaluación y Acompañamiento Oncológico

**CIN324 – Ingeniería de Requisitos | Entrega 1**  
*Hospital Dr. Gustavo Fricke (HGF) – Unidad de Gestión de Casos Oncológicos (UGCO)*

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
| **Bruno Fernandez** | [`01-proceso-as-is.md`](./01-proceso-as-is.md) y [`05-elicitacion.md`](./05-elicitacion.md)|
| **Benjamin Carcamo** | [`02-rediseno-to-be.md`](./02-rediseno-to-be.md) |
| **Máximo Torrijo** | [`03-requisitos.md`](./03-requisitos.md) y [`06-atributos-calidad.md`](./06-atributos-calidad.md)
| **Ignacio Jorquera** | [`04-historias-usuario.md`](./04-historias-usuario.md)  |
| **Equipo Completo** | [`07-matriz-trazabilidad.md`](./07-matriz-trazabilidad.md) (Integración Transversal y Trazabilidad) |

---

## 🎯 Visión General del Proyecto

**OncoTrace** es una solución tecnológica diseñada específicamente para la **Unidad de Gestión de Casos Oncológicos (UGCO)** y el equipo clínico asistencial del **Hospital Dr. Gustavo Fricke (HGF)**. 

La UGCO cuenta con una dependencia mixta (administrativamente de la *Subdirección de Gestión del Cuidado* y técnicamente de la *Subdirección Médica*), liderando la navegación de las personas con sospecha o confirmación diagnóstica oncológica.

Su objetivo central es garantizar la **trazabilidad continua de punta a punta**, la **evaluación multidimensional** (clínico-terapéutica, psicosocial, informativa y espiritual), el **acompañamiento integral** y la **gestión oportuna** de los pacientes a lo largo de las 8 etapas de su trayectoria asistencial:
1. **Sospecha:** Ingreso formal desde APS, red SSVQ, Urgencias o por hallazgo crítico en Anatomía Patológica.
2. **Confirmación Diagnóstica:** Confirmación por especialista, emisión de IPD y constancia GES.
3. **Etapificación:** Ejecución de estudios imagenológicos y gestión de compra de servicios externos (PET-CT, EBUS).
4. **En Comité:** Evaluación colegiada por el Comité Oncológico Regional y emisión de resolución terapéutica (REM 0.7).
5. **Tratamiento:** Ejecución de la terapia prescrita (cirugía en LEIQ, quimioterapia hematológica en HGF, radioterapia o derivación a red HCVB).
6. **Rehabilitación:** Derivación oportuna a equipo multidisciplinario (psicosocial, nutrición, fonoaudiología, kinesiología).
7. **Seguimiento:** Controles médicos periódicos de vigilancia, sobrevivientes y contactabilidad activa por Gestor y TENS.
8. **Alta y Contrarreferencia:** Cierre clínico y administrativo por remisión completa, traslado de red, fallecimiento o contrarreferencia a APS.

---

## 👥 Perfil de Usuarios y Stakeholders

- **Usuario Principal:** 
  - **Gestor/a de Casos Oncológicos UGCO (Enfermero/a o Matrón/a):** Profesional responsable de la navegación clínica integral en las 4 dimensiones, ejecución de puntos de contacto obligatorio, preparación de comités y gestión de derivaciones.
- **Equipo Operativo UGCO:**
  - **Enfermera Supervisora UGCO:** Liderazgo estratégico, asignación de especialidades oncológicas y supervisión del cumplimiento de metas.
  - **Técnico en Enfermería (TENS UGCO):** Confección de dossier físico de derivación, contactabilidad activa telefónica/presencial y soporte al Comité Oncológico.
  - **Administrativo/a UGCO:** Gestión y rescate de fichas clínicas, coordinación de horas con unidades de apoyo y digitación de libros oficiales.
- **Actores Clínicos y Resolutivos:**
  - **Médico Tratante / Especialista:** Evaluación de sospecha, confirmación diagnóstica, emisión de IPD y presentación formal en comités.
  - **Comité Oncológico Regional:** Instancia multidisciplinaria colegiada que dicta la conducta terapéutica obligatoria previa al tratamiento (REM 0.7).
  - **Equipo Multidisciplinario:** Dupla psicosocial (asistente social y psicólogo), nutricionistas, kinesiólogos, oncogeriatras y cuidados paliativos.
- **Unidades de Coordinación y Red Asistencial:**
  - **Atención Primaria de Salud (APS) y Red SSVQ:** Origen de interconsultas y destino de la contrarreferencia al alta.
  - **UGDA (Unidad de Gestión de la Demanda Asistencial):** Auditoría de interconsultas y administración de la Lista de Espera Quirúrgica (LEIQ / SIGTE).
  - **UGAA (Unidad de Gestión de Atención Abierta):** Unidad encargada de la tramitación y despacho formal del dossier hacia la red externa.
  - **Unidad GES y Registros:** Monitoreo y fiscalización de los plazos de garantías explícitas (Decreto Supremo N° 29).
  - **Unidades de Apoyo Diagnóstico:** Laboratorio Clínico, Anatomía Patológica, Imagenología y Procedimientos Médicos.
  - **Red Externa de Referencia:** Hospital Carlos Van Buren (radioterapia y quimioterapia para tumores sólidos) y prestadores privados (compra de servicios).
- **Sujeto de Cuidado:**
  - **Persona con Cáncer y Cuidador Principal:** Acompañamiento binomio ante riesgo de sobrecarga del cuidador.

---

## 🧩 Módulos Principales de la Plataforma

```
                               ┌──────────────────────────────────────────┐
                               │               ONCOTRACE                  │
                               │   Plataforma para Gestión Oncológica     │
                               └────────────────────┬─────────────────────┘
                                                    │
         ┌───────────────────┬──────────────────────┼──────────────────────┬───────────────────┐
         │                   │                      │                      │                   │
         ▼                   ▼                      ▼                      ▼                   ▼
┌─────────────────┐ ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐ ┌─────────────────┐
│  Trazabilidad   │ │   Evaluación    │    │ Acompañamiento  │    │     Comité      │ │  Derivaciones y │
│  Integral de    │ │ Multidimensional│    │    Activo y     │    │   Oncológico    │ │   Control GES   │
│    Pacientes    │ │ (4 Dimensiones) │    │  Contactabilidad│    │  Inteligente    │ │ (Van Buren/UGAA)│
└─────────────────┘ └─────────────────┘    └─────────────────┘    └─────────────────┘ └─────────────────┘
```

1. **Tablero de Trazabilidad y Timeline Clínico:** Visualización en tiempo real del estado de cada caso, hitos diagnósticos completados, rescate de exámenes y alertas de tiempos de espera.
2. **Evaluación Multidimensional y Estratificación:** Pauta estructurada por dominios (clínico-funcional, psicoemocional, familiar/cuidador, socioeconómico, espiritual y comprensión diagnóstica).
3. **Módulo de Acompañamiento y Contactabilidad Continua:** Coordinación sincronizada entre Gestor y TENS, control de inasistencias, acogida presencial regulada y bitácora de puntos de contacto obligatorio.
4. **Gestión Digital de Comités Oncológicos:** Consolidación de antecedentes clínicos, eliminación de actas en papel físico y estructuración digital del registro de asistencia y resoluciones (REM 0.7).
5. **Control de Plazos GES y Trazabilidad de Derivaciones:** Alertas preventivas para evitar vencimiento de garantías y seguimiento con confirmación de entrega de dossiers físicos derivados vía UGAA hacia el Hospital Carlos Van Buren o prestadores privados.

---

## 🗺️ Modelo de Procesos de Negocio BPMN 2.0

El proceso de negocio se encuentra formalmente modelado en BPMN 2.0 estandarizado y libre de errores de sintaxis o nodos huérfanos:

- **Proceso AS-IS:** [`./diagramas/as-is.bpmn`](./diagramas/as-is.bpmn)
- **Proceso TO-BE:** [`./diagramas/to-be.bpmn`](./diagramas/to-be.bpmn)

### 📐 Arquitectura Topológica del Modelo AS-IS (`as-is.bpmn`)

El modelo actual del Hospital Dr. Gustavo Fricke estructura su proceso principal en **10 carriles (swimlanes)** que reflejan la realidad funcional del establecimiento:

| Carril (Lane) | Participante / Unidad | Responsabilidad Modelada |
| :--- | :--- | :--- |
| **1. Atención primaria y red asistencial** | APS / Urgencia / Consultas | Generación y emisión de interconsultas de sospecha; recepción de contrarreferencias al alta. |
| **2. UGDA y lista de espera** | Unidad de Gestión de Demanda | Auditoría de interconsultas y administración de la Lista de Espera Quirúrgica (LEIQ). |
| **3. Médico Tratante / Especialista** | Especialista Clínico HGF | Evaluación de sospecha, indicación de exámenes, confirmación diagnóstica, IPD y presentación a comité. |
| **4. Gestor/a de casos UGCO** | Enfermera/o o Matrona/ón UGCO | Asignación, contacto inicial, valoración multidimensional, gestión de exámenes, comités, tratamiento y seguimiento. |
| **5. TENS UGCO** | Técnico en Enfermería | Confección de dossier físico de derivación externa y mantención de contactabilidad activa y periódica. |
| **6. Administrativo/a UGCO** | Administrativo/a UGCO | Registro de ingreso, verificación de contactos, coordinación y agendamiento de horas de exámenes. |
| **7. UGAA** | Gestión de Atención Abierta | Despacho y derivación formal de dossiers físicos hacia hospitales de referencia externa. |
| **8. Unidad GES y registros** | Unidad GES Institucional | Confección, monitoreo y auditoría de constancias GES y cumplimiento de garantías de oportunidad. |
| **9. Comité Oncológico** | Comité Multidisciplinario | Sesión colegiada de evaluación integral y emisión de actas de resolución terapéutica (REM 0.7). |
| **10. Unidades de Apoyo Diagnóstico** | Laboratorio / AP / Imágenes | Toma de muestras, procesamiento de estudios y emisión de informes clínicos y de valores críticos. |

#### Correcciones Topológicas Implementadas:
1. **Etapificación y Compra de Servicios (XOR):** Bifurcación formal mediante compuerta exclusiva tras la solicitud de exámenes. La *Rama Interna* tramita a través de unidades de apoyo del HGF con rescate y notificación de valores críticos; la *Rama Externa* gestiona compras de servicios especializados (PET-CT, EBUS, estudios moleculares) hacia centros privados. Ambas ramas convergen en compuerta exclusiva antes de la entrega de resultados al médico.
2. **Contactabilidad Simultánea en Seguimiento (AND):** Incorporación de una compuerta paralela que sincroniza las labores clínicas del *Gestor* (controles médicos, sobrevivientes) con las labores de contactabilidad y rescate del *TENS*, convergiendo antes de la evaluación de criterios de cierre de caso.
3. **Flujo Cerrado de Derivación Externa:** Secuencia estricta y trazable: `GW_DerivExterna` $\rightarrow$ `Task_TENS_Dossier` (confección de dossier) $\rightarrow$ `Task_UGAA_Derivar` (despacho) $\rightarrow$ `MessageFlow` hacia el `Pool_RedExterna` (Hospital Carlos Van Buren).

---

## ⚠️ Nodos Críticos Identificados en el Proceso Actual (AS-IS)

| ID Nodo | Nombre del Problema | Descripción Operativa | Actores Afectados |
| :--- | :--- | :--- | :--- |
| **AS-01** | **Dispersión de Resultados Diagnósticos** | Búsqueda manual dispersa en sistemas aislados (Pathology, LIS, PACS) y papel para ubicar biopsias e imágenes. Demoras de hasta 15 días. | Gestor/a, Médico Tratante, Paciente |
| **AS-02** | **Gestión Manual de Comités Oncológicos** | Preparación manual en Word de fichas clínicas y registro de resoluciones en actas en papel físico. | Comité Oncológico, Gestor/a, Médico |
| **AS-03** | **Pérdida de Trazabilidad en Derivaciones** | Envío de dossiers físicos a través de UGAA hacia el Hospital Carlos Van Buren sin confirmación digital de recepción ni agendamiento. | TENS, Gestor/a, UGAA, Paciente |
| **AS-04** | **Monitoreo Manual de Plazos GES** | Cálculo y seguimiento de garantías mediante planillas Excel locales, con riesgo legal de incumplimiento. | Gestor/a, Supervisora, Unidad GES |
| **AS-05** | **Registro Fragmentado y Falta de Bitácora Estandarizada** | Carencia de un registro unificado para documentar contactos asistenciales, evaluar la vulnerabilidad sociofamiliar y registrar el índice funcional (ECOG). | Gestor/a Oncológico/a, TENS, Paciente y Familia |
| **AS-06** | **Interrupción Crítica por Demanda Espontánea** | Afluencia no programada de usuarios presenciales en la oficina de gestión exigiendo estados de atención (Ley N° 21.258). | Gestor/a, Paciente y Cuidador |

---

## 📂 Índice Maestro de Documentos (Entrega 1)

1. [**01. Proceso AS-IS**](./01-proceso-as-is.md) – Caracterización detallada del proceso actual (nodos AS-01 a AS-06).
2. [**02. Rediseño y Proceso TO-BE**](./02-rediseno-to-be.md) – Rediseño propuesto y mejoras de proceso (nodos TB-01 a TB-10).
3. [**03. Clasificación de Requisitos**](./03-requisitos.md) – Matriz de requisitos funcionales y no funcionales.
4. [**04. Historias de Usuario**](./04-historias-usuario.md) – 10 Historias de Usuario con Criterios de Aceptación (HU-xx-CAy).
5. [**05. Elicitación**](./05-elicitacion.md) – Registro de técnicas y evidencias de elicitación (EL-01, EL-02).
6. [**06. Atributos de Calidad**](./06-atributos-calidad.md) – Atributos de calidad y escenarios arquitectónicos (AC-01 a AC-03).
7. [**07. Matriz de Trazabilidad End-to-End**](./07-matriz-trazabilidad.md) – Matriz maestra de trazabilidad end-to-end.

---

## 📁 Estructura del Repositorio

```
OncoTrace/
├── 📄 README.md                        # Vista principal del repositorio en GitHub
├── 📄 IngReq-Entrega 1.md              # Documento maestro integrador de la Entrega 1
├── 📄 01-proceso-as-is.md              # Caracterización del proceso actual (AS-IS, nodos AS-01 a AS-06)
├── 📄 02-rediseno-to-be.md             # Rediseño propuesto y mejoras de proceso (TO-BE, nodos TB-01 a TB-10)
├── 📄 03-requisitos.md                 # Matriz de requisitos funcionales y no funcionales
├── 📄 04-historias-usuario.md          # 10 Historias de Usuario con Criterios de Aceptación (HU-xx-CAy)
├── 📄 05-elicitacion.md                # Registro de técnicas y evidencias de elicitación (EL-01, EL-02)
├── 📄 06-atributos-calidad.md          # Atributos de calidad y escenarios arquitectónicos (AC-01 a AC-03)
├── 📄 07-matriz-trazabilidad.md        # Matriz maestra de trazabilidad end-to-end
├── 📁 diagramas/
│   ├── 📄 as-is.bpmn                   # Modelo BPMN 2.0 refactorizado del proceso actual (10 carriles)
│   └── 📄 to-be.bpmn                   # Modelo BPMN del proceso rediseñado (TO-BE)
├── 📁 evidencia/                       # Manuales UGCO Versión 2.0 y minutas de entrevistas
└── 📁 _backup/                         # Resguardos de versiones previas
```

---

## 🚀 Integración y Marco Normativo

- **Interoperabilidad:** Integración con sistemas institucionales del HGF (Ficha Clínica Electrónica, LIS, RIS/PACS) y puente de datos con la Plataforma Oncológica MINSAL.
- **Seguridad y Privacidad:** Control de acceso basado en roles (RBAC) y auditoría conforme a la **Ley N° 20.584** (Derechos y Deberes de los Pacientes).
- **Marco Regulatorio:** Cumplimiento de las Garantías Explícitas en Salud (**GES / Decreto Supremo N° 29**) y de la **Ley Nacional del Cáncer N° 21.258**.
