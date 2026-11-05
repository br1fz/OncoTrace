# OncoTrace

### Documento integrador · Entrega 1

**CIN324 — Ingeniería de Requisitos**  
**Hospital Dr. Gustavo Fricke (HGF) · Unidad de Gestión de Casos Oncológicos (UGCO)**

---

## 1. Equipo y responsabilidades

Distribución de responsabilidades del equipo para los entregables de la evaluación:

| Integrante | Entregables a cargo |
| :--- | :--- |
| **Bruno Fernandez** | [`01-proceso-as-is.md`](./01-proceso-as-is.md) y [`05-elicitacion.md`](./05-elicitacion.md) |
| **Benjamin Carcamo** | [`02-rediseno-to-be.md`](./02-rediseno-to-be.md) |
| **Máximo Torrijo** | [`03-requisitos.md`](./03-requisitos.md) y [`06-atributos-calidad.md`](./06-atributos-calidad.md) |
| **Ignacio Jorquera** | [`04-historias-usuario.md`](./04-historias-usuario.md) |
| **Equipo completo** | [`07-matriz-trazabilidad.md`](./07-matriz-trazabilidad.md), integración transversal y trazabilidad |

---

## 2. Visión general del proyecto

**OncoTrace** es una plataforma propuesta para apoyar la gestión clínica, navegación y trazabilidad oncológica en la UGCO y el equipo clínico del Hospital Dr. Gustavo Fricke.

La UGCO depende administrativamente de la *Subdirección de Gestión del Cuidado* y técnicamente de la *Subdirección Médica*. Su trabajo acompaña a las personas desde la sospecha o confirmación diagnóstica oncológica.

El objetivo del sistema es asegurar la **trazabilidad de la atención**, la **evaluación multidimensional**, el **acompañamiento integral** y el **seguimiento oportuno** a lo largo de las ocho etapas de la trayectoria asistencial.

### Trayectoria asistencial

| Etapa | Descripción |
| :--- | :--- |
| **1. Sospecha** | Ingreso formal desde APS, red SSVQ o Urgencias, o por hallazgo crítico en Anatomía Patológica. |
| **2. Confirmación diagnóstica** | Confirmación por especialista, emisión de IPD y constancia GES. |
| **3. Etapificación** | Estudios imagenológicos y gestión de compras de servicios externos, como PET-CT o EBUS. La presentación al Comité Oncológico Regional y su resolución terapéutica (REM 7) se registran como hito de esta etapa, previo al tratamiento. |
| **4. Tratamiento** | Ejecución de la terapia indicada: cirugía en LEIQ, quimioterapia hematológica en HGF, radioterapia o derivación a la red HCVB. |
| **5. Rehabilitación** | Derivación a equipos de apoyo, como psicosocial, nutrición, fonoaudiología y kinesiología. |
| **6. Cuidados paliativos y alivio del dolor** | Atención por el equipo de cuidados paliativos y manejo del dolor cuando corresponde. |
| **7. Seguimiento y sobrevivientes** | Controles médicos y contactabilidad a cargo del gestor y TENS, incluida la vigilancia de sobrevivientes. |
| **8. Alta y contrarreferencia** | Cierre clínico y administrativo por remisión, traslado de red o fallecimiento; contrarreferencia a APS o vigilancia de largo plazo para sobrevivientes. |

---

## 3. Usuarios y partes interesadas

### Equipo UGCO

- **Gestor/a de casos oncológicos (enfermero/a o matrón/a):** Responsable de la navegación clínica en cuatro dominios: clínico-funcional; psicosocial y socioeconómico; familiar y del cuidador; espiritual y comprensión diagnóstica. Coordina los puntos de contacto, prepara casos para comité, entrega el instructivo de pasajes y gestiona derivaciones.
- **Enfermera supervisora UGCO:** Lidera la unidad, asigna especialidades oncológicas y supervisa el cumplimiento de metas.
- **TENS UGCO:** Confecciona dossiers físicos en el proceso actual, realiza contactabilidad telefónica o presencial y apoya al Comité Oncológico. En el rediseño TO-BE, el dossier se digitaliza.
- **Administrativo/a UGCO:** Gestiona y rescata fichas clínicas, coordina horas con unidades de apoyo y digita libros oficiales.

### Equipo clínico y de apoyo

- **Médico tratante o especialista:** Evalúa la sospecha, confirma diagnósticos, emite IPD y presenta casos a comité.
- **Comité Oncológico Regional:** Instancia multidisciplinaria que define la conducta terapéutica previa al tratamiento y registra la resolución en REM 7.
- **Equipo multidisciplinario y apoyo social:** Incluye dupla psicosocial, nutricionistas, kinesiólogos, oncogeriatras, cuidados paliativos y Unidad de Servicio Social. Esta última gestiona el reembolso de pasajes de locomoción pública por derivación (Anexo 6).

### Red asistencial

- **APS y red SSVQ:** Origen de interconsultas y destino de contrarreferencias al alta.
- **UGDA (Unidad de Gestión de la Demanda Asistencial):** Audita interconsultas y administra la Lista de Espera Quirúrgica (LEIQ / SIGTE).
- **UGAA (Unidad de Gestión de Atención Abierta):** Tramita y despacha dossiers hacia la red externa.
- **Unidad GES y Registros:** Monitorea y fiscaliza los plazos de garantías explícitas (Decreto Supremo N° 29).
- **Unidades de apoyo diagnóstico:** Laboratorio Clínico, Anatomía Patológica, Imagenología y Procedimientos Médicos.
- **Red externa de referencia:** Hospital Carlos Van Buren —radioterapia y quimioterapia para tumores sólidos— y prestadores privados de servicios.

### Personas atendidas

- **Persona con cáncer y cuidador principal:** Reciben acompañamiento durante la trayectoria, considerando el riesgo de sobrecarga del cuidador.

---

## 4. Módulos principales de la plataforma

| Módulo | Actividades y requisitos | Función principal |
| :--- | :--- | :--- |
| **Tablero y trazabilidad** | TB-01 · RF-01 | Muestra en tiempo real la etapa de cada caso, los hitos completados, el rescate de exámenes y las alertas por tiempos de espera. |
| **Evaluación multidimensional** | TB-02 · RF-02 | Registra cuatro dominios: clínico-funcional (ECOG 0–4); psicosocial y socioeconómico; familiar y del cuidador; espiritual y comprensión diagnóstica. Calcula el riesgo asistencial. |
| **Acompañamiento y contactos** | TB-03 · RF-03 | Coordina el seguimiento entre gestor y TENS, controla inasistencias, regula la acogida presencial y registra los seis puntos de contacto obligatorios del *Patient Journey Map*. |
| **Alertas GES e inactividad** | TB-04 · RF-04 | Avisa cuando una garantía está a cinco días hábiles o menos de vencer y detecta casos sin movimiento por más de 15 días corridos. |
| **Exámenes e interoperabilidad** | TB-05 · RF-05 | Vincula informes de LIS y PACS al RUN del paciente y genera alertas ante hallazgos de malignidad. |
| **Comités oncológicos** | TB-06 y TB-07 · RF-06 y RF-07 | Genera la ficha de presentación, registra la asistencia y la decisión, permite firmar el acta y prepara la información para REM 7. |
| **Derivaciones y reembolso** | TB-08 · RF-08 | Gestiona el dossier digital, sigue la derivación a HCVB o prestadores externos y apoya la entrega del instructivo de reembolso (Anexo 6). |
| **Autoatención y triage** | TB-09 y TB-10 · RF-09 y RF-10 | Permite consultar estados macro en el tótem con el método de identidad autorizado por el hospital. El RUN o la cédula por sí solos no bastan; el cuidador requiere autorización vigente. El asistente orienta y prioriza solicitudes sin diagnosticar, deriva posibles urgencias a la Unidad de Emergencia Adultos y ofrece contacto con la UGCO si no puede clasificar una solicitud. |

---

## 5. Procesos de negocio en BPMN 2.0

Los procesos AS-IS y TO-BE están documentados en BPMN 2.0 y se revisaron para evitar errores de sintaxis y nodos huérfanos.

- **Proceso actual:** [`diagramas/as-is.bpmn`](../diagramas/as-is.bpmn)
- **Proceso rediseñado:** [`diagramas/to-be.bpmn`](../diagramas/to-be.bpmn)

### Estructura del modelo AS-IS

El proceso actual del Hospital Dr. Gustavo Fricke se organiza en diez carriles:

| N.º | Carril | Responsabilidad modelada |
| :--- | :--- | :--- |
| **1** | Atención primaria y red asistencial | Emite interconsultas de sospecha y recibe contrarreferencias al alta. |
| **2** | UGDA y lista de espera | Audita interconsultas y administra la LEIQ. |
| **3** | Médico tratante / especialista | Evalúa sospechas, indica exámenes, confirma diagnósticos, emite IPD y presenta casos a comité. |
| **4** | Gestor/a de casos UGCO | Asigna casos, realiza el contacto inicial, valora al paciente y gestiona exámenes, comités, tratamiento y seguimiento. |
| **5** | TENS UGCO | Confecciona dossiers físicos de derivación externa y realiza contactabilidad activa. |
| **6** | Administrativo/a UGCO | Registra ingresos, verifica contactos y coordina horas de exámenes. |
| **7** | UGAA | Despacha dossiers físicos a hospitales de referencia externa. |
| **8** | Unidad GES y Registros | Confecciona y monitorea constancias GES y garantías de oportunidad. |
| **9** | Comité Oncológico | Evalúa casos y emite actas de resolución terapéutica (REM 7). |
| **10** | Unidades de apoyo diagnóstico | Toman muestras, procesan estudios y emiten informes y valores críticos. |

### Ajustes topológicos destacados

- **Etapificación y compra de servicios (XOR):** El flujo se divide después de solicitar los exámenes. La rama interna gestiona estudios en unidades del HGF; la externa tramita servicios especializados —PET-CT, EBUS y estudios moleculares— con centros privados. Ambas ramas vuelven a unirse antes de entregar los resultados al médico.
- **Contactabilidad durante el seguimiento (AND):** Una compuerta paralela coordina las labores clínicas del gestor —controles médicos y seguimiento de sobrevivientes— con las tareas de contactabilidad y rescate del TENS. Las ramas se unen antes de evaluar el cierre del caso.
- **Derivación externa:** El flujo conecta `GW_DerivExterna`, la confección del dossier por TENS (`Task_TENS_Dossier`), el despacho por UGAA (`Task_UGAA_Derivar`) y el envío mediante `MessageFlow` a `Pool_RedExterna`, que incluye al Hospital Carlos Van Buren.

---

## 6. Problemas identificados en el proceso AS-IS

| ID | Problema | Descripción | Actores afectados |
| :--- | :--- | :--- | :--- |
| **AS-01** | Dispersión de resultados diagnósticos | Búsqueda manual en sistemas aislados (Pathology, LIS, PACS) y en papel. La demora puede llegar a 15 días. | Gestor/a, médico tratante y paciente |
| **AS-02** | Gestión manual de comités | Preparación de fichas en Word y registro de resoluciones en actas de papel. | Comité Oncológico, gestor/a y médico |
| **AS-03** | Pérdida de trazabilidad en derivaciones | Envío de dossiers físicos por UGAA hacia HCVB sin confirmación digital de recepción ni agendamiento. | TENS, gestor/a, UGAA y paciente |
| **AS-04** | Monitoreo manual de plazos GES | Cálculo y seguimiento de garantías en planillas Excel, con riesgo de incumplimiento. | Gestor/a, supervisora y Unidad GES |
| **AS-05** | Registro fragmentado y falta de bitácora | No existe un registro unificado de contactos, vulnerabilidad sociofamiliar e índice funcional (ECOG). | Gestor/a, TENS, paciente y familia |
| **AS-06** | Interrupciones por demanda espontánea | Llegada no programada de personas a la oficina para consultar el estado de su atención (Ley N° 21.258). | Gestor/a, paciente y cuidador |

---

## 7. Documentos de la Entrega 1

| Documento | Contenido |
| :--- | :--- |
| [**01. Proceso AS-IS**](./01-proceso-as-is.md) | Proceso actual y problemas AS-01 a AS-06. |
| [**02. Rediseño TO-BE**](./02-rediseno-to-be.md) | Proceso propuesto y actividades TB-01 a TB-10. |
| [**03. Clasificación de requisitos**](./03-requisitos.md) | Requisitos funcionales y no funcionales. |
| [**04. Historias de usuario**](./04-historias-usuario.md) | Diez historias de usuario con criterios de aceptación. |
| [**05. Elicitación**](./05-elicitacion.md) | Entrevista, revisión normativa y revisión de manuales (EL-01 a EL-03). |
| [**06. Atributos de calidad**](./06-atributos-calidad.md) | Escenarios de calidad AC-01 a AC-03. |
| [**07. Matriz de trazabilidad**](./07-matriz-trazabilidad.md) | Trazabilidad entre problemas, actividades, requisitos, historias y criterios. |

---

## 8. Estructura del repositorio

```text
OncoTrace/
├── README.md                       # Página principal del repositorio
├── IngReq-Entrega 1.md             # Documento integrador de la Entrega 1
├── 01-proceso-as-is.md             # Descripción del proceso actual
├── 02-rediseno-to-be.md            # Rediseño del proceso
├── 03-requisitos.md                # Requisitos de producto y proyecto
├── 04-historias-usuario.md         # Historias de usuario y criterios
├── 05-elicitacion.md               # Técnicas y evidencias de elicitación
├── 06-atributos-calidad.md         # Escenarios de calidad
├── 07-matriz-trazabilidad.md       # Matriz de trazabilidad
├── diagramas/
│   ├── as-is.bpmn                  # Modelo BPMN del proceso actual
│   └── to-be.bpmn                  # Modelo BPMN del proceso rediseñado
├── evidencia/                      # Manuales UGCO y minutas
└── _backup/                        # Versiones anteriores
```

---

## 9. Integración y marco normativo

| Ámbito | Referencia |
| :--- | :--- |
| **Interoperabilidad** | Integración con la Ficha Clínica Electrónica, LIS, RIS/PACS institucionales y la Plataforma Oncológica MINSAL. |
| **Seguridad y privacidad** | Control de acceso basado en roles (RBAC) y auditoría conforme a la Ley N° 20.584, sobre derechos y deberes de los pacientes. |
| **Marco regulatorio** | Garantías Explícitas en Salud (GES / Decreto Supremo N° 29) y Ley Nacional del Cáncer N° 21.258. |
