# 🚀 Proceso de negocio rediseñado — TO-BE

## 📍 Macro-proceso y proceso específico
Atención Abierta de Especialidades (CAE) → Gestión, navegación, trazabilidad y acompañamiento oncológico digital mediante la plataforma **OncoTrace** en el Hospital Dr. Gustavo Fricke (HGF).

## 🎯 Objetivo de negocio del proceso rediseñado
Optimizar el flujo integral de atención del paciente oncológico mediante la centralización de datos clínicos, la automatización de la consolidación de estudios diagnósticos, el seguimiento proactivo de plazos de garantías legales (GES / Ley del Cáncer N° 21.258) y la trazabilidad de punta a punta de derivaciones a prestadores externos, liberando tiempo asistencial a las gestoras para un acompañamiento humano y multidisciplinario oportuno.

---

## 🤝 Participantes y sus roles en el nuevo proceso

| Participante / Rol | Unidad / Institución | Responsabilidad y Objetivo en el TO-BE |
| :--- | :--- | :--- |
| **Gestor/a Oncológico/a** | Servicio de Gestión Oncológica (HGF) | Monitorea el tablero Kanban unificado, realiza la evaluación multidimensional inicial, gestiona la bitácora de acompañamiento y coordina la resolución de alertas preventivas. |
| **Médico Tratante / Especialista** | Consultorio Adosado de Especialidades (CAE) | Emite solicitudes diagnósticas en el sistema, consulta antecedentes consolidados y formaliza decisiones terapéuticas en comités. |
| **Comité Oncológico Multidisciplinario** | Equipo Colegiado de Especialistas HGF | Evalúa casos mediante fichas de presentación pre-cargadas automáticamente y suscribe actas clínicas con firma electrónica. |
| **Sistema OncoTrace (Automatizado)** | Plataforma Tecnológica Central | Interopera con LIS/PACS, indexa resultados de biopsias e imágenes, calcula plazos GES y emite alertas automáticas ante inactividad o proximidad de vencimientos. |
| **Hospital Carlos Van Buren** | Prestador Público Externo | Recibe derivaciones digitales estructuradas y reporta hitos de inicio/término de radioterapia y quimioterapia de tumores sólidos. |
| **Centros Privados en Convenio** | Prestadores Externos (PET-CT, EBUS) | Ejecutan exámenes de alta complejidad con seguimiento de órdenes de compra y carga digital de informes en OncoTrace. |
| **Paciente / Familia** | Usuario Asistencial | Recibe orientación clara, acompañamiento continuo estructurado, toma de muestras oportuna y acceso expedito a su estado de proceso. |

---

## 📊 Diagrama del Proceso TO-BE

![Proceso TO-BE](./diagramas/to-be.png)

- **Archivo fuente BPMN:** [`./diagramas/to-be.bpmn`](./diagramas/to-be.bpmn)
- **Especificación de Tareas:** El modelo distingue rigurosamente tareas de usuario (*User Task* con icono de persona), tareas automatizadas del sistema (*Service Task* con icono de engranaje) y tareas manuales asistenciales (*Manual Task* con icono de mano).

---

## 🗺️ Secuencia de Fases del Proceso Rediseñado

```text
┌───────────────────────────┐      ┌───────────────────────────┐      ┌───────────────────────────┐
│ 1. Ingreso y Estratificación│ ──► │ 2. Consolidación y Alertas│ ──► │ 3. Comité Digital y Firma │
│  - Registro en OncoTrace  │      │  - Indexación LIS/PACS    │      │  - Ficha resumen auto     │
│  - Evaluación (ECOG/Red)  │      │  - Motor de alertas GES   │      │  - Acta digital colegiada │
│  - Bitácora de contacto   │      │  - Tablero Kanban gestora │      │  - Definición terapéutica │
└───────────────────────────┘      └───────────────────────────┘      └───────────────────────────┘
                                                                                    │
                                                                                    ▼
┌───────────────────────────┐      ┌───────────────────────────┐      ┌───────────────────────────┐
│ 6. Acompañamiento Activo  │ ◄─── │ 5. Tratamiento Local HGF  │ ◄─── │ 4. Derivaciones y Tracking│
│  - Detección de deserción │      │  - Cirugía en lista espera│      │  - Trazabilidad Van Buren │
│  - Apoyo psicosocial/red  │      │  - Quimioterapia hemato   │      │  - Seguimiento compra ext │
│  - Cierre de ciclo clínico│      │  - Cuidados paliativos    │      │  - Cero puntos ciegos     │
└───────────────────────────┘      └───────────────────────────┘      └───────────────────────────┘
```

---

## ⚡ Cuadro Comparativo: Mejoras AS-IS vs. TO-BE

| Dimensión de Proceso | Situación Actual (AS-IS) | Rediseño Propuesto (TO-BE con OncoTrace) |
| :--- | :--- | :--- |
| **Localización de Exámenes** | Búsqueda manual dispersa en múltiples plataformas (LIS, PACS, papel) con demoras de hasta 15 días. | **Indexación y consolidación automática** de informes en la ficha única del paciente al ser validados. |
| **Monitoreo de Plazos GES** | Seguimiento reactivo y conteo manual de días en planillas Excel con alto riesgo de multas y vencimientos. | **Motor de alertas preventivas en tiempo real** (semáforo de criticidad y detección de inactividad >15 días). |
| **Gestión de Comités** | Transcripción manual de resúmenes en Word y actas físicas en papel con riesgo de omisión de datos. | **Ficha de presentación autogenerada** y formalización de acta clínica digital con firma electrónica. |
| **Derivaciones Externas** | Envío de interconsultas físicas al Hospital Van Buren sin tracking de inicio de terapia (punto ciego). | **Módulo de trazabilidad de derivaciones** con registro de hitos, estados de interconsulta y confirmación de inicio. |
| **Acompañamiento del Paciente** | Registros informales y dispersos; dificultad para detectar deserciones por vulnerabilidad social. | **Evaluación multidimensional estandarizada** (ECOG, red familiar, vulnerabilidad) y bitácora cronológica activa. |

---

## 💡 Necesidades Tangentes y Visión de Extensión (Triage y Autoatención)

### 📌 Contexto y Hallazgo Elicitado
Durante la entrevista con la Gestora Oncológica, se identificó un **nodo crítico de interrupción operativa** que impacta fuertemente la productividad del equipo:
- **Alta afluencia de demanda presencial espontánea:** Es muy frecuente que pacientes —tanto con confirmación oncológica como aquellos sin certeza diagnóstica o casos no oncológicos— acudan directamente a la oficina de gestión oncológica exigiendo información sobre el estado de sus biopsias, resultados de escáneres o fechas de informes.
- **Tensión legal y asistencial:** Bajo los principios de acogida y acompañamiento de la **Ley Nacional del Cáncer N° 21.258** y los deberes ético-clínicos del hospital, las gestoras **no pueden ni deben rechazar la atención** de un usuario angustiado. Sin embargo, atender personalmente cada consulta de mesón interrumpe la navegación de casos críticos, retrasando la tramitación de comités y el cumplimiento de garantías GES.

### 🤖 Propuesta Conceptual TO-BE: Tótem de Autoatención y Asistente Virtual (Chatbot)

Como propuesta de diseño para resolver este nodo en fases adyacentes y complementarias del ecosistema hospitalario, se proyecta la incorporación de una estación de orientación autónoma:

```
                               ┌──────────────────────────────────────────────┐
                               │       Llegada Espontánea del Paciente        │
                               │           a Sala de Gestión Oncológica       │
                               └──────────────────────┬───────────────────────┘
                                                      │
                                                      ▼
                               ┌──────────────────────────────────────────────┐
                               │        Tótem Táctil de Autoatención          │
                               │        (Lectura de Cédula de Identidad)      │
                               └──────────────────────┬───────────────────────┘
                                                      │
                                   ┌──────────────────┴──────────────────┐
                                   ▼                                     ▼
                   ┌───────────────────────────────┐     ┌───────────────────────────────┐
                   │    Consulta Rápida Estado     │     │      Chatbot de Orientación   │
                   │    - Biopsia en proceso/lista │     │   - Preguntas frecuentes Ley  │
                   │    - Exámenes consolidados    │     │   - Guía de trámites y salas  │
                   │    - Próxima cita programada  │     │   - Triage de motivo consulta │
                   └───────────────┬───────────────┘     └───────────────┬───────────────┘
                                   │                                     │
                                   └──────────────────┬──────────────────┘
                                                      │
                                                      ▼
                                       ┌──────────────────────────────┐
                                       │   ¿Requiere Atención Humana? │
                                       └──────────────┬───────────────┘
                                                      │
                                       ┌──────────────┴──────────────┐
                                       │ SÍ                          │ NO
                                       ▼                             ▼
                        ┌─────────────────────────────┐ ┌─────────────────────────────┐
                        │ Emisión de Ticket de Triage │ │ Resolución exitosa autónoma │
                        │  (Pasa con Gestora según    │ │   (Paciente informado sin   │
                        │   prioridad clínica/social) │ │    interrumpir al equipo)   │
                        └─────────────────────────────┘ └─────────────────────────────┘
```

#### 🛠️ Características Principales del Módulo de Autoatención:
1. **Tótem con Pantalla Táctil en Sala de Espera:** Dispositivo interactivo accesible que permite al usuario autenticarse mediante lector de código de barras de su cédula de identidad o digitando su RUT.
2. **Consulta Automatizada de Estado:** Consulta segura hacia la API de OncoTrace para entregar respuestas concretas e informativas (ej. *"Su biopsia se encuentra en análisis por el patólogo; fecha estimada de entrega: 28 de Septiembre"*, o *"Sus resultados ya están completos y han sido programados para evaluación médica"*).
3. **Chatbot de Orientación y Preguntas Frecuentes:** Asistente conversacional con lenguaje empático y accesible que explica derechos de la Ley del Cáncer, ubicaciones físicas del hospital y pasos a seguir, reduciendo la ansiedad del paciente y su familia.
4. **Triage y Derivación Estructurada:** Si el caso del paciente requiere intervención profesional directa (ej. urgencia social, dolor no controlado o apoyo emocional), el sistema genera un turno prioritario categorizado, permitiendo a la gestora atenderlo de manera ordenada sin ser interrumpida de forma caótica.

> [!NOTE]
> **Alcance de la Entrega:** Aunque el núcleo de software de OncoTrace para la presente etapa se enfoca en la plataforma de gestión de los profesionales clínicos y gestores, este requerimiento queda formalmente registrado como una necesidad adyacente fundamental en la arquitectura de interacción con el paciente para las siguientes iteraciones del sistema.
