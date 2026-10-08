# Proceso de Negocio Rediseñado (TO-BE)

## 📍 Macro-proceso y proceso específico
Unidad de Gestión de Casos Oncológicos (UGCO) → Gestión, navegación, trazabilidad, evaluación multidimensional y acompañamiento integral de la persona con cáncer y su cuidador mediante la plataforma **OncoTrace** en el Hospital Dr. Gustavo Fricke (HGF).

*Nota institucional: La UGCO posee una dependencia mixta, dependiendo administrativamente de la Subdirección de Gestión del Cuidado (SDGC) y técnicamente de la Subdirección Médica (SDM).*

## 🎯 Objetivo de negocio del proceso rediseñado
Optimizar y asegurar la continuidad del flujo asistencial a lo largo de las 8 etapas de la trayectoria oncológica mediante la centralización de datos clínicos, la consolidación automatizada de estudios diagnósticos (LIS/PACS), la interoperabilidad directa con la Plataforma de Seguimiento Oncológico del MINSAL, la digitalización de los comités y actas clínicas (REM 0.7), el seguimiento proactivo de plazos GES (Decreto Supremo N° 29) y la trazabilidad de punta a punta en derivaciones externas (vía TENS y UGAA hacia el Hospital Carlos Van Buren y prestadores privados), garantizando los puntos de contacto obligatorio y liberando tiempo asistencial para un acompañamiento humano, multidimensional y oportuno.

---

## 🤝 Participantes y sus roles en el nuevo proceso (TO-BE)

| Participante / Rol | Unidad / Institución | Responsabilidad y Objetivo en el TO-BE con OncoTrace |
| :--- | :--- | :--- |
| **Enfermera Supervisora UGCO** | Jefatura UGCO (SDGC / SDM) | Supervisa el tablero global de mando, asigna gestores por especialidad oncológica, balancea cargas de trabajo asistencial y audita indicadores de gestión y metas institucionales. |
| **Gestor/a de Casos Oncológicos** | Equipo Profesional UGCO (Enfermero/a o Matrón/a) | Monitorea el tablero Kanban por etapas, ejecuta la valoración multidimensional por dominios, registra la bitácora de puntos de contacto obligatorio, coordina comités y gestiona derivaciones y seguimiento. |
| **Técnico en Enfermería (TENS)** | Equipo Operativo UGCO | Confecciona y valida digitalmente el dossier de derivación externa en OncoTrace, mantiene la contactabilidad activa (telefónica/presencial) con pacientes y brinda soporte operativo al Comité Oncológico. |
| **Administrativo/a UGCO** | Equipo Administrativo UGCO | Registra ingresos formales, verifica datos de contacto del paciente y cuidador, tramita citas de exámenes con unidades de apoyo y rescata fichas clínicas digitales. |
| **Médico Tratante / Especialista** | Especialidades Médicas HGF | Emite órdenes diagnósticas digitales, confirma diagnósticos, emite el IPD electrónico, presenta formalmente casos a comité y suscribe conductas terapéuticas. |
| **Comité Oncológico Regional** | Equipo Colegiado Multidisciplinario HGF | Evalúa casos mediante fichas clínicas pre-cargadas automáticamente en OncoTrace y suscribe actas clínicas con firma digital, generando automáticamente el registro estadístico REM 0.7. |
| **Equipo Multidisciplinario** | Dupla Psicosocial, Nutrición, Kinesiología, etc. | Recibe solicitudes de interconsulta y derivación directa desde OncoTrace, registra intervenciones asistenciales y retroalimenta al gestor sobre la evolución del paciente y cuidador. |
| **UGDA y Lista de Espera** | Gestión de Demanda Asistencial | Interopera con OncoTrace para priorizar interconsultas de sospecha y sincronizar automáticamente el estado del paciente en la Lista de Espera Quirúrgica (LEIQ / SIGTE). |
| **UGAA** | Gestión de Atención Abierta | Opera como ventanilla digital de despacho de derivaciones hacia la macrored, confirmando acuses de recibo y estados de agendamiento digital con centros externos. |
| **Unidad GES y Registros** | Unidad GES Institucional | Monitorea el cumplimiento de plazos legales para las 21 patologías oncológicas GES (DS N° 29), valida constancias digitales y gestiona excepciones de segundo prestador. |
| **Unidades de Apoyo Diagnóstico** | Laboratorio, Anatomía Patológica, Imagenología | Interoperan bidireccionalmente vía HL7 FHIR / APIs para la carga inmediata de informes validados y la emisión de alertas automáticas ante valores críticos. |
| **Hospital Carlos Van Buren** | Prestador Público de Referencia (Macrored) | Recibe dossiers digitales estructurados y reporta bidireccionalmente hitos de recepción, agendamiento, inicio y término de radioterapia y quimioterapia para tumores sólidos. |
| **Centros Privados en Convenio** | Prestadores de Compra de Servicio | Ejecutan exámenes de alta complejidad (PET-CT, EBUS, marcadores moleculares) con seguimiento de órdenes de compra y carga directa de informes en OncoTrace. |
| **Persona con Cáncer y Cuidador** | Sujetos de Atención y Acompañamiento | Reciben orientación continua, información clara sobre su trayectoria, acompañamiento estructurado en 4 dimensiones y canales de consulta que reducen la incertidumbre. |
| **Sistema OncoTrace (Motor Central)** | Plataforma Tecnológica Institucional | Orquesta el flujo de trabajo, indexa resultados diagnósticos, evalúa plazos GES, genera fichas de comités, administra alertas preventivas e interopera con la plataforma MINSAL. |

---

## Diagrama del Proceso TO-BE

![Proceso TO-BE](./diagramas/to-be.png)

- **Archivo fuente BPMN:** [`./diagramas/to-be.bpmn`](./diagramas/to-be.bpmn)
- **Especificación de Tareas:** El modelo distingue rigurosamente tareas de usuario (*User Task* con icono de persona), tareas automatizadas del sistema (*Service Task* con icono de engranaje) y tareas manuales asistenciales (*Manual Task* con icono de mano).

---

## 🗺️ Secuencia de Fases del Proceso Rediseñado (8 Etapas de la Trayectoria Oncológica)

El proceso TO-BE se organiza de forma estricta según las 8 etapas normadas en los manuales oficiales de la UGCO:

```text
┌───────────────────────────────┐     ┌───────────────────────────────┐     ┌───────────────────────────────┐
│ 1. Sospecha e Ingreso Digital │ ──► │ 2. Confirmación Diagnóstica   │ ──► │ 3. Etapificación y Exámenes   │
│  - Interconsulta auditada     │     │  - IPD digital estructurado   │     │  - Indexación LIS/PACS        │
│  - Asignación por Supervisora │     │  - Constancia GES automática  │     │  - Tracking compra PET/EBUS   │
│  - Contacto Obligatorio #1    │     │  - Contacto Obligatorio #2    │     │  - Alerta de valores críticos │
│  - Pauta por Dominios         │     │  - Comunicación al paciente   │     │  - Kanban gestora en vivo     │
└───────────────────────────────┘     └───────────────────────────────┘     └───────────────────────────────┘
                                                                                            │
                                                                                            ▼
┌───────────────────────────────┐     ┌───────────────────────────────┐     ┌───────────────────────────────┐
│ 6. Rehabilitación y Apoyo     │ ◄── │ 5. Tratamiento y Derivación   │ ◄── │ 4. Comité Oncológico Digital  │
│  - Derivación multidisciplinar│     │  - LEIQ en SIGTE sincronizado │     │  - Ficha resumen autogenerada │
│  - Dupla psicosocial/nutrición│     │  - QT Hematológica en HGF     │     │  - Acta digital REM 0.7       │
│  - Evaluación sobrecarga cuid.│     │  - Dossier digital HCVB/UGAA  │     │  - Firma electrónica avanzada │
│  - Retorno activo a la vida   │     │  - Cuidados paliativos precoz │     │  - Contacto Obligatorio #3    │
└───────────────────────────────┘     └───────────────────────────────┘     └───────────────────────────────┘
               │
               ▼
┌───────────────────────────────┐     ┌───────────────────────────────┐
│ 7. Seguimiento y Sobrevida    │ ──► │ 8. Alta y Contrarreferencia   │
│  - Controles periódicos       │     │  - Cierre clínico formal      │
│  - Contactabilidad dual TENS  │     │  - Contrarreferencia a APS    │
│  - Control de inasistencias   │     │  - Sincronización con MINSAL  │
│  - Prevención de deserciones  │     │  - Cierre de ciclo asistencial│
└───────────────────────────────┘     └───────────────────────────────┘
```

---

## 📞 Puntos de Contacto Obligatorio Normados

En conformidad con el *Manual de Procedimientos de la UGCO*, OncoTrace programa automáticamente alertas y tareas en la bitácora para garantizar los siguientes **puntos de contacto obligatorio**:

1. **Punto #1 (Al Ingreso / Sospecha):** Primer contacto telefónico o presencial para brindar orientación sobre la trayectoria oncológica, identificar al cuidador principal e informar el nombre y vías de contacto directo del gestor responsable.
2. **Punto #2 (Post-Confirmación Diagnóstica):** Contacto posterior a la comunicación diagnóstica del médico para acoger al paciente y familia, verificar la comprensión del diagnóstico, confeccionar la constancia GES y orientar sobre los pasos siguientes.
3. **Punto #3 (Post-Resolución de Comité Oncológico):** Contacto tras la definición terapéutica colegiada para explicar en lenguaje claro el plan acordado (cirugía, quimioterapia, radioterapia, paliativos), reducir la ansiedad y coordinar fechas y requisitos.
4. **Punto #4 (Al Alta de Hospitalizaciones):** Contacto tras hospitalizaciones quirúrgicas o médicas en el HGF para evaluar el estado postoperatorio, pesquisar complicaciones y coordinar citas de control.
5. **Punto #5 (Al Finalizar el Tratamiento Activo):** Contacto tras el término de cirugía, quimioterapia o radioterapia para formalizar el paso a la etapa de seguimiento, sobrevivientes o rehabilitación.
6. **Punto #6 (Ante Derivaciones Externas):** Contacto antes y después de la derivación al Hospital Carlos Van Buren o prestadores privados para asegurar que el paciente cuente con indicaciones claras y confirmar la fecha efectiva de atención en el centro derivado.

---

## ⚡ Matriz de Rediseño y Nodos de Solución: AS-IS vs. TO-BE

Cada componente del proceso rediseñado responde directamente a la mitigación de los nodos críticos del AS-IS formalizados en [`01-proceso-as-is.md`](./01-proceso-as-is.md):

| ID Nodo TO-BE | Nombre de la Solución TO-BE | Nodo AS-IS Mitigado | Situación Actual (AS-IS) | Rediseño Propuesto (TO-BE con OncoTrace) |
| :--- | :--- | :--- | :--- | :--- |
| **TB-01** | **Tablero Kanban y Timeline Clínico** | **AS-01**, **AS-04** | Búsqueda dispersa y falta de visibilidad del estado global del paciente a lo largo de su trayectoria. | Tablero unificado por fases asistenciales (Sospecha, Confirmación, Comité, Tratamiento, Seguimiento) y línea de tiempo con hitos diagnósticos y días de espera. |
| **TB-02** | **Evaluación Multidimensional Estandarizada** | **AS-05** | Evaluación funcional, psicosocial y espiritual no estructurada ni registrada en una herramienta única. | Pauta estructurada por dominios (clínico-funcional, ECOG 0-4, psicoemocional, cuidador/sobrecarga, socioeconómico, espiritual) con cálculo automático de vulnerabilidad. |
| **TB-03** | **Bitácora Digital de Acompañamiento y Contacto Obligatorio** | **AS-05**, **AS-06** | Registros informales o dispersos de llamadas y contactos asistenciales sin control de hitos. | Historial inmutable y auditable de intervenciones, programación de los 6 puntos de contacto obligatorio y registro de compromisos con paciente y cuidador. |
| **TB-04** | **Motor de Alertas Preventivas GES e Inactividad** | **AS-04**, **AS-05** | Conteo manual de plazos en planillas Excel para las 21 patologías oncológicas GES, con alto riesgo de multas y deserciones. | Motor automatizado que evalúa plazos legales del Decreto Supremo N° 29, emite alertas preventivas ante $\le 5$ días hábiles de vencimiento y detecta inactividad $> 15$ días. |
| **TB-05** | **Indexación y Consolidación de Biopsias/PACS con Alertas Críticas** | **AS-01** | Búsqueda manual dispersa en sistemas aislados (Pathology, LIS, PACS) con demoras de hasta 15 días. | Integración automática mediante HL7 FHIR / APIs para consolidar informes validados y activar alertas inmediatas al médico ante informes de valores críticos de AP. |
| **TB-06** | **Generación Automática de Ficha de Comité** | **AS-02** | Transcripción manual de antecedentes clínicos en plantillas Word para presentación a comité. | Compilación automática de diagnósticos, biopsias, imágenes, estadio, ECOG y antecedentes clínicos en ficha digital resumen lista para la sesión. |
| **TB-07** | **Acta Clínica Digital de Comité y REM 0.7** | **AS-02** | Actas registradas en papel físico con firmas manuscritas, riesgo de extravío y sin integración con la ficha. | Registro en tiempo real durante la sesión del comité, bloqueo post-firma digital, integración con la ficha clínica y exportación automática del reporte estadístico REM 0.7. |
| **TB-08** | **Módulo de Dossier Digital y Trazabilidad de Derivaciones** | **AS-03** | Confección manual de dossier físico en papel por el TENS y entrega a UGAA sin retorno de información (punto ciego asistencial). | Dossier clínico digital unificado en PDF seguro, módulo de despacho para UGAA y tracking de estados bidireccionales con el Hospital Carlos Van Buren y prestadores privados. |
| **TB-09** | **Tótem de Autoatención en Sala de Espera** | **AS-06** | Consultas presenciales espontáneas bajo Ley N° 21.258 que colapsan el mesón asistencial de los gestores. | Estación táctil interactiva en sala de espera que permite al paciente consultar de forma autónoma y segura el estado de avance de sus estudios mediante lectura de cédula/RUT. |
| **TB-10** | **Chatbot de Orientación Institucional y Triage** | **AS-06** | Interrupción continua del tiempo clínico de las gestoras para resolver dudas generales y administrativas. | Asistente conversacional para preguntas frecuentes de la Ley del Cáncer y emisión de tickets de triage priorizados según complejidad para atención ordenada con la gestora. |
| **TB-11** | **Módulo de Interoperabilidad Bidireccional con MINSAL** | **AS-05** | Plataforma local institucional no interopera con la Plataforma de Seguimiento Oncológico del MINSAL, obligando al doble registro. | Interfaz de integración y sincronización de datos con el repositorio nacional de Salud Digital MINSAL, eliminando la duplicidad y asegurando trazabilidad ministerial. |

---

## 💡 Necesidades Tangentes y Visión de Extensión (Triage y Autoatención)

### 📌 Contexto y Hallazgo Elicitado
Durante las entrevistas al personal y la revisión de los manuales de la UGCO, se identificó un **nodo crítico de interrupción operativa continua (AS-06)**:
- **Alta afluencia de demanda presencial espontánea:** Es recurrente que pacientes —con confirmación oncológica, en sospecha o incluso con patologías no oncológicas— acudan directamente a la oficina de la UGCO exigiendo estados de exámenes, fechas de biopsias o asignación de horas médicas bajo el amparo de la **Ley Nacional del Cáncer N° 21.258**.
- **Tensión legal y asistencial:** Bajo los principios de acogida de la Ley N° 21.258 y el deber ético-clínico del hospital, el equipo de la UGCO **no puede rechazar la atención** de usuarios angustiados. Sin embargo, atender personalmente cada consulta de mesón interrumpe el análisis de casos críticos, la preparación de comités y el monitoreo de plazos GES.

### 🤖 Propuesta Conceptual TO-BE: Tótem de Autoatención y Asistente Virtual (Chatbot)

Como propuesta de diseño para resolver este nodo en fases complementarias del ecosistema hospitalario, se proyecta la incorporación de una estación de orientación autónoma integrada a OncoTrace:

```text
                               ┌──────────────────────────────────────────────┐
                               │       Llegada Espontánea del Paciente        │
                               │          a Oficina de Gestión UGCO           │
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
                    │    Consulta Rápida de Estado  │     │      Chatbot de Orientación   │
                    │    - Biopsia en proceso/lista │     │   - Preguntas Ley N° 21.258   │
                    │    - Exámenes consolidados    │     │   - Ubicación y trámites HGF  │
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
                         │  (Pasa con Gestor/a según   │ │   (Paciente informado sin   │
                         │   prioridad clínica/social) │ │    interrumpir al equipo)   │
                         └─────────────────────────────┘ └─────────────────────────────┘
```

#### 🛠️ Características Principales del Módulo de Autoatención:
1. **Tótem con Pantalla Táctil en Sala de Espera:** Dispositivo interactivo accesible que autentica al usuario mediante lector de código de barras de su cédula de identidad o digitando su RUN.
2. **Consulta Automatizada de Estado:** Consulta segura hacia la API de OncoTrace para entregar respuestas concretas e informativas (ej. *"Su biopsia se encuentra en análisis en Anatomía Patológica; fecha estimada de informe: 28 de Octubre"*, o *"Sus resultados están completos y su caso fue ingresado a la tabla del Comité Oncológico del próximo jueves"*).
3. **Chatbot de Orientación y Preguntas Frecuentes:** Asistente conversacional con lenguaje empático y claro que explica derechos de la Ley del Cáncer, ubicaciones físicas del hospital y pasos a seguir, reduciendo la angustia e incertidumbre.
4. **Triage y Derivación Estructurada:** Si el caso del paciente requiere intervención profesional directa (ej. urgencia social, dolor descontrolado o descompensación emocional), el sistema genera un turno prioritario categorizado, permitiendo al gestor atenderlo de manera ordenada sin ser interrumpido caóticamente.

> [!NOTE]
> **Alcance de la Entrega:** Aunque el núcleo de software de OncoTrace para la presente etapa se enfoca en la plataforma de gestión de los profesionales clínicos y gestores, este requerimiento queda formalmente registrado como una necesidad adyacente fundamental en la arquitectura de interacción con el paciente para las siguientes iteraciones del sistema.
