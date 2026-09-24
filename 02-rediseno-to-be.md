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

## ⚡ Matriz de Rediseño y Nodos de Solución: AS-IS vs. TO-BE

Cada componente del proceso rediseñado responde directamente a uno o más nodos críticos del AS-IS:

| ID Nodo TO-BE | Nombre de la Solución TO-BE | Nodo AS-IS Mitigado | Situación Actual (AS-IS) | Rediseño Propuesto (TO-BE con OncoTrace) |
| :--- | :--- | :--- | :--- | :--- |
| **TB-01** | **Tablero Kanban y Timeline Clínico** | **AS-01**, **AS-04** | Búsqueda dispersa y falta de visibilidad del estado global del paciente. | Tablero unificado por fases (Sospecha, Comité, Tratamiento) y línea de tiempo con hitos y días transcurridos. |
| **TB-02** | **Evaluación Multidimensional Estandarizada** | **AS-05** | Evaluación funcional y social no estandarizada ni registrada formalmente. | Registro estructurado de ECOG (0-4), factores de vulnerabilidad social y red de apoyo con cálculo automático de riesgo. |
| **TB-03** | **Bitácora Cronológica de Acompañamiento** | **AS-05** | Registros informales o dispersos de llamadas y contactos asistenciales. | Historial inmutable de intervenciones, compromisos asistenciales y programación de próximas acciones. |
| **TB-04** | **Motor de Alertas Preventivas GES e Inactividad** | **AS-04**, **AS-05** | Conteo manual de plazos en Excel con alto riesgo de multas y deserciones. | Motor automatizado que genera alertas de criticidad ante ≤ 5 días hábiles de plazo GES o > 15 días de inactividad asistencial. |
| **TB-05** | **Indexación y Consolidación de Biopsias/PACS** | **AS-01** | Búsqueda manual en LIS/PACS con demoras de hasta 15 días. | Integración e indexación automática de informes clínicos validados asociados al RUN del paciente. |
| **TB-06** | **Generación Automática de Ficha de Comité** | **AS-02** | Transcripción manual de antecedentes en documentos Word. | Compilación automática de diagnósticos, imágenes, biopsias y ECOG en ficha resumen lista para la sesión. |
| **TB-07** | **Acta Clínica Digital con Firma Electrónica** | **AS-02** | Actas físicas en papel con riesgo de pérdida y sin trazabilidad inmediata. | Formalización del acta en tiempo real durante el comité, bloqueo post-firma digital y traspaso de tareas de seguimiento. |
| **TB-08** | **Módulo de Trazabilidad de Derivaciones Externas** | **AS-03** | Interconsultas físicas al HCVB y privados sin retorno de confirmación (punto ciego). | Tracking continuo de estados (Solicitada → En espera → Atendida → Resultado), con registro de prestador y cierre de hitos. |
| **TB-09** | **Tótem de Autoatención en Sala de Espera** | **AS-06** | Consultas presenciales espontáneas que colapsan el mesón de gestoras. | Estación interactiva táctil para consulta segura del estado de avance de biopsias e informes mediante lectura de RUT. |
| **TB-10** | **Chatbot de Orientación Institucional y Triage** | **AS-06** | Interrupción continua para resolver dudas generales de la Ley N° 21.258. | Asistente virtual para preguntas frecuentes y emisión de tickets de triage priorizados según complejidad para la gestora. |


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
