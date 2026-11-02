# OncoTrace

### Gestión, navegación y trazabilidad oncológica

**CIN324 · Ingeniería de Requisitos · Entrega 1**  
**Hospital Dr. Gustavo Fricke (HGF) · Unidad de Gestión de Casos Oncológicos (UGCO)**

---

OncoTrace es una propuesta académica de plataforma para apoyar la gestión de casos oncológicos en la UGCO del HGF. El proyecto reúne el seguimiento de pacientes, la evaluación multidimensional, la coordinación de comités, el control de plazos GES y la trazabilidad de derivaciones.

La UGCO depende administrativamente de la *Subdirección de Gestión del Cuidado* y técnicamente de la *Subdirección Médica*.

## Trayectoria asistencial

El proceso contempla ocho etapas:

1. Sospecha.
2. Confirmación diagnóstica.
3. Etapificación.
4. Tratamiento.
5. Rehabilitación.
6. Cuidados paliativos y alivio del dolor.
7. Seguimiento y sobrevivientes.
8. Alta y contrarreferencia.

La presentación y resolución del Comité Oncológico se considera un hito previo al tratamiento, no una etapa independiente.

## Problemas y respuesta propuesta

| Problema actual | Respuesta propuesta | Trazabilidad |
| :--- | :--- | :--- |
| **AS-01 · Resultados diagnósticos dispersos** | Tablero con línea de tiempo y consolidación de informes LIS/PACS por RUN, con alertas ante hallazgos críticos. | TB-01, TB-05 · RF-01, RF-05 · HU-01, HU-05 |
| **AS-02 · Comités gestionados en papel** | Ficha de presentación preparada con antecedentes clínicos, acta digital con firma electrónica y reporte REM 7. | TB-06, TB-07 · RF-06, RF-07 · HU-06, HU-07 |
| **AS-03 · Derivaciones sin seguimiento** | Dossier digital, seguimiento de la derivación externa y apoyo para entregar el instructivo de reembolso de pasajes (Anexo 6). | TB-08 · RF-08 · HU-08 |
| **AS-04 · Plazos GES en planillas** | Alertas preventivas cuando falten cinco días hábiles o menos para el vencimiento y aviso de casos sin movimiento por más de 15 días. | TB-01, TB-04 · RF-01, RF-04 · HU-01, HU-04 |
| **AS-05 · Registro fragmentado y sin interoperabilidad con MINSAL** | Evaluación multidimensional, bitácora de acompañamiento, control de contactos y una integración con MINSAL sujeta a acuerdo y habilitación institucional. | TB-02, TB-03, TB-04, TB-11 · RF-02, RF-03, RF-04, RF-11 · HU-02, HU-03, HU-04, HU-11 |
| **AS-06 · Consultas espontáneas en el mesón** | Tótem de autoatención y asistente de orientación y triage, con registro de los contactos y resguardo de la información. | TB-03, TB-09, TB-10 · RF-03, RF-09, RF-10 · HU-03, HU-09, HU-10 |

Los dominios de evaluación considerados son clínico-funcional (ECOG 0–4), psicosocial y socioeconómico, familiar y del cuidador, y espiritual y de comprensión diagnóstica.

## Acceso y orientación

- **Tótem:** La consulta usa un método de verificación de identidad autorizado por el hospital. Leer la cédula o ingresar el RUN no basta por sí solo; el cuidador debe tener una autorización registrada y vigente.

- **Asistente virtual:** Orienta sobre trámites y servicios, pero no realiza diagnósticos ni reemplaza una evaluación clínica. Ante una posible urgencia, indica acudir a la Unidad de Emergencia Adultos. Si no puede clasificar una solicitud, ofrece contacto con personal de la UGCO.

## Integración y resguardo de información

| Ámbito | Criterio definido |
| :--- | :--- |
| **LIS y PACS** | La comunicación se plantea mediante HL7 FHIR o API REST, según las interfaces disponibles en el hospital. |
| **Plataforma de Seguimiento Oncológico del MINSAL** | El intercambio de datos queda sujeto al acuerdo entre HGF y MINSAL sobre los datos autorizados, el mecanismo y la periodicidad. La integración se activa una vez habilitada. |
| **Seguridad y privacidad** | Se consideran control de acceso por roles (RBAC), registro de auditoría y resguardo de la información clínica. |

## Actores principales

| Grupo | Participantes |
| :--- | :--- |
| **UGCO** | Gestor/a de casos, enfermera supervisora, TENS y personal administrativo. |
| **Equipo clínico y de apoyo** | Médico tratante, Comité Oncológico Regional, equipo multidisciplinario y Unidad de Servicio Social. |
| **Red asistencial** | APS, red SSVQ, UGAA, Unidad GES, unidades de apoyo diagnóstico, Hospital Carlos Van Buren y prestadores externos. |
| **Personas atendidas** | Personas con cáncer y sus cuidadores principales. |

## Diagramas y modelos

| Recurso | Archivo |
| :--- | :--- |
| Proceso actual en BPMN 2.0 | [AS-IS](./diagramas/as-is.bpmn) |
| Proceso propuesto en BPMN 2.0 | [TO-BE](./diagramas/to-be.bpmn) |
| Modelo de dominio UML | [Clases y relaciones](./diagramas/modelo-de-dominio-uml.md) |
| Casos de uso y diagramas SSD | [Modelo de integración](./diagramas/diagrama-casos-de-uso.md) |
| Diagramas SSD | [HU-05](./diagramas/ssd-hu05.png) · [HU-08](./diagramas/ssd-hu08.png) |

### Diagrama de casos de uso e integración

[![Diagrama de casos de uso e integración de OncoTrace](./diagramas/casos-de-uso-integracion.png)](./diagramas/casos-de-uso-integracion.png)

## Documentación de la Entrega 1

| Documento | Contenido |
| :--- | :--- |
| [Documento integrador](./IngReq-Entrega%201.md) | Síntesis de la Entrega 1 y enlaces a sus componentes. |
| [01 · Proceso AS-IS](./01-proceso-as-is.md) | Proceso actual y problemas identificados. |
| [02 · Rediseño TO-BE](./02-rediseno-to-be.md) | Proceso propuesto y actividades de mejora. |
| [03 · Requisitos](./03-requisitos.md) | Requisitos funcionales, no funcionales y de proyecto. |
| [04 · Historias de usuario](./04-historias-usuario.md) | Historias de usuario y criterios de aceptación. |
| [05 · Elicitación](./05-elicitacion.md) | Entrevista, normativa y manuales UGCO (EL-01 a EL-03). |
| [06 · Atributos de calidad](./06-atributos-calidad.md) | Escenarios de calidad AC-01 a AC-03. |
| [07 · Matriz de trazabilidad](./07-matriz-trazabilidad.md) | Relación entre problemas, actividades, requisitos e historias. |

Los manuales y registros de entrevista están en [`evidencia/`](./evidencia/). La guía para conducir entrevistas está en [`entrevistador-elicitacion/skill.md`](./entrevistador-elicitacion/skill.md).

## Equipo de trabajo

| Integrante | Entregables a cargo |
| :--- | :--- |
| **Bruno Fernandez** | [01 · Proceso AS-IS](./01-proceso-as-is.md) y [05 · Elicitación](./05-elicitacion.md) |
| **Benjamin Carcamo** | [02 · Rediseño TO-BE](./02-rediseno-to-be.md) |
| **Máximo Torrijo** | [03 · Requisitos](./03-requisitos.md) y [06 · Atributos de calidad](./06-atributos-calidad.md) |
| **Ignacio Jorquera** | [04 · Historias de usuario](./04-historias-usuario.md) |
| **Equipo completo** | [07 · Matriz de trazabilidad](./07-matriz-trazabilidad.md), integración transversal y trazabilidad |

## Marco normativo y de calidad

El proyecto considera como referencias la Ley N° 20.584, la Ley Nacional del Cáncer N° 21.258, la normativa de garantías GES asociada al Decreto Supremo N° 29 y la norma ISO/IEC 25010.
