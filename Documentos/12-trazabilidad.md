# Matriz de trazabilidad canónica — Cobertura completa (HU-01 a HU-11)

> **Proyecto:** OncoTrace · CIN324 Ingeniería de Requisitos  
> **Alcance:** Relaciona los requisitos asociados a las historias del sistema (HU-01 a HU-11) con sus criterios de aceptación, casos de uso, diagramas de comportamiento y clases del modelo de dominio.

Esta matriz constituye la **fuente de verdad canónica y vinculante** de trazabilidad del proyecto, complementando la [matriz de línea base histórica de la Entrega 1](./07-matriz-trazabilidad.md). Provee cobertura metodológica integral para el conjunto de historias (HU-01 a HU-11).

**Referencias:** [Proceso AS-IS](./01-proceso-as-is.md) · [Rediseño TO-BE](./02-rediseno-to-be.md) · [Requisitos](./03-requisitos.md) · [Historias de usuario](./04-historias-usuario.md) · [Criterios de aceptación](./07-criterios-aceptacion.md) · [Modelo de dominio](./08-modelo-dominio.md) · [Casos de uso](./09-casos-de-uso.md) · [Diagramas de secuencia](./10-diagramas-secuencia.md) · [Diagramas de estado](./11-diagramas-estado.md).

---

## Matriz de trazabilidad consolidada

La matriz tiene una fila por cada requisito funcional y no funcional ([03-requisitos.md](./03-requisitos.md)), vinculando cada historia con sus casos de uso (CU-01 a CU-16), diagramas de secuencia (DSS-01 a DSS-04), diagramas de estado (EST-01 a EST-04) y entidades del modelo de dominio.

| Requisito (Entrega 1) | Historia | Caso(s) de uso | Secuencia | Estado | Clases del dominio |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **RF-01** · Tablero y trazabilidad por etapas | HU-01 | CU-05 | DSS-03 | EST-03 | `Paciente`, `CasoOncologico`, `HitoAsistencial`, `ResolucionComite` |
| **RF-02** · Evaluación multidimensional por dominios | HU-02 | CU-10 | — | — | `EvaluacionMultidimensional`, `DominioValoracion`, `CasoOncologico` |
| **RF-03** · Bitácora de puntos de contacto | HU-03 | CU-11 | — | EST-01 | `EntradaBitacora`, `CasoOncologico`, `HitoAsistencial`, `AlertaSeguimiento` |
| **RF-04** · Alertas GES e inactividad | HU-04 | CU-06 | DSS-04 | EST-01 | `CasoOncologico`, `GarantiaGES`, `AlertaSeguimiento`, `HitoAsistencial` |
| **RF-05** · Consolidación de exámenes y alertas | HU-05 | CU-01, CU-02 | DSS-01 | EST-04 | `CasoOncologico`, `OrdenExamen`, `EstudioDiagnostico` |
| **RF-06** · Ficha de presentación a comité | HU-06 | CU-12 | — | — | `FichaPresentacionComite`, `CasoOncologico`, `EstudioDiagnostico` |
| **RF-07** · Acta digital y registro REM 7 | HU-07 | CU-13 | — | — | `ActaComite`, `FirmaElectronica`, `RegistroREM7`, `ResolucionComite` |
| **RF-08** · Derivaciones externas y reembolso de pasajes | HU-08 | CU-03, CU-04, CU-06, CU-07, CU-08, CU-09 | DSS-02 | EST-01, EST-02 | `CasoOncologico`, `ResolucionComite`, `DossierDigitalDerivacion`, `EstudioDiagnostico`, `InstructivoReembolsoPasajes`, `ContraReferenciaEpicrisis`, `AlertaSeguimiento`, `HitoAsistencial` |
| **RF-09** · Tótem de autoatención | HU-09 | CU-14 | — | — | `InteraccionCanalUsuario`, `Paciente`, `CuidadorAutorizado`, `CasoOncologico` |
| **RF-10** · Asistente virtual y triage asistencial | HU-10 | CU-15 | — | — | `InteraccionCanalUsuario`, `TicketTriagePresencial`, `Paciente` |
| **RF-11** · Intercambio de información con MINSAL | HU-11 | CU-16 | — | — | `RegistroIntercambioMINSAL`, `CasoOncologico`, `HitoAsistencial` |
| **RNF-01** · Fiabilidad y disponibilidad | HU-04, HU-05, HU-08 | CU-01 a CU-04, CU-06 a CU-09 | DSS-01, DSS-02, DSS-04 | EST-01, EST-02, EST-04 | `AlertaSeguimiento`, `EstudioDiagnostico`, `DossierDigitalDerivacion` |
| **RNF-02** · Eficiencia de desempeño | HU-01 | CU-05 | DSS-03 | EST-03 | `CasoOncologico`, `HitoAsistencial` |
| **RNF-03** · Seguridad y confidencialidad clínica | HU-07, HU-09, HU-11 (transversal al sistema) | Precondición de acceso de actores humanos | Nota en DSS-01 a DSS-04 | — | Atributos de responsable en `HitoAsistencial`, `AlertaSeguimiento`, `InstructivoReembolsoPasajes` |
| **RNF-04** · Interoperabilidad hospitalaria | HU-05, HU-11 | CU-01, CU-02 | DSS-01 | EST-04 | `EstudioDiagnostico` |
| **REQ-DER-01** · SSO institucional (derivado de RNF-03) | HU-07, HU-11 (transversal al sistema) | Autenticación de funcionarios vía SSO | Nota en DSS-01 a DSS-04 | — | — |
| **RP-01** · Control de versiones y repositorio | — | — | — | — | — |
| **RP-02** · Gestión de tareas e iteraciones | — | — | — | — | — |
| **RP-03** · Modelamiento en notación estándar | — | — | — | — | — |

RNF-03 y REQ-DER-01 son condiciones transversales para el acceso y la auditoría de las operaciones de funcionarios. Se detallan en [03-requisitos.md](./03-requisitos.md), los [criterios de aceptación](./07-criterios-aceptacion.md) y los [casos de uso](./09-casos-de-uso.md).

### Requisitos de proyecto de la Entrega 1

Los requisitos RP-01 a RP-03 regulan el trabajo del equipo y la documentación del proyecto, no el comportamiento de OncoTrace. Por eso sus filas en la matriz quedan con «—»; su evidencia es la siguiente:

| Requisito | Evidencia o referencia | Aplicación en el proyecto |
| :--- | :--- | :--- |
| **RP-01 · Control de versiones y repositorio** | [Historial de cambios del repositorio](https://github.com/br1fz/OncoTrace/commits/main/) | Versionado de los documentos y las fuentes de los diagramas. |
| **RP-02 · Gestión de tareas e iteraciones** | [Definición del requisito en la Entrega 1](./03-requisitos.md#requisitos-de-proyecto) | Planificación y seguimiento de tareas e hitos en GitHub Projects. |
| **RP-03 · Modelamiento en notación estándar** | [Proceso AS-IS](./01-proceso-as-is.md) y [proceso TO-BE](./02-rediseno-to-be.md) | Modelamiento de los procesos de la Entrega 1 en BPMN 2.0. |

---

## Trazabilidad de origen

| Historia | Fuentes | Problemas AS-IS | Actividad TO-BE | Requisitos asociados |
| :--- | :--- | :--- | :--- | :--- |
| **HU-01** Seguimiento del caso | EL-01, EL-02 y EL-03 | AS-01 y AS-04 | TB-01 | RF-01 · RNF-02 |
| **HU-02** Evaluación multidimensional | EL-01 y EL-02 | AS-05 | TB-02 | RF-02 |
| **HU-03** Bitácora de acompañamiento | EL-01 y EL-02 | AS-05 y AS-06 | TB-03 | RF-03 |
| **HU-04** Alertas de seguimiento | EL-01, EL-02 y EL-03 | AS-04 y AS-05 | TB-04 | RF-04 · RNF-01 |
| **HU-05** Informes diagnósticos | EL-01 y EL-03 | AS-01 | TB-05 | RF-05 · RNF-01 · RNF-04 |
| **HU-06** Ficha presentación comité | EL-01 y EL-03 | AS-02 | TB-06 | RF-06 |
| **HU-07** Acta comité y REM 7 | EL-01 y EL-03 | AS-02 | TB-07 | RF-07 · RNF-03 · REQ-DER-01 |
| **HU-08** Derivación y retorno | EL-01 y EL-03 | AS-03 | TB-08 | RF-08 · RNF-01 |
| **HU-09** Tótem de autoatención | EL-01 y EL-02 | AS-06 | TB-09 | RF-09 · RNF-03 |
| **HU-10** Chatbot y triage presencial | EL-01 y EL-02 | AS-06 | TB-10 | RF-10 |
| **HU-11** Interoperabilidad MINSAL | EL-01 | AS-05 | TB-11 | RF-11 · RNF-04 |

Las fuentes y relaciones de origen se mantienen según la [matriz de trazabilidad de la Entrega 1](./07-matriz-trazabilidad.md).

---

## Relación entre escenarios y casos de uso

| Escenarios de aceptación | Casos de uso relacionados |
| :--- | :--- |
| HU-01-ESC-01 a HU-01-ESC-05 | CU-05 · Dar seguimiento al caso oncológico |
| HU-02-ESC-01 a HU-02-ESC-03 | CU-10 · Aplicar evaluación multidimensional y estratificar riesgo |
| HU-03-ESC-01 a HU-03-ESC-04 | CU-11 · Registrar interacción en bitácora de acompañamiento |
| HU-04-ESC-01 a HU-04-ESC-07 | CU-06 · Gestionar alertas de seguimiento |
| HU-05-ESC-01, HU-05-ESC-03 y HU-05-ESC-04 | CU-01 · Consolidar y consultar informes diagnósticos |
| HU-05-ESC-02 | CU-02 · Recibir avisos de hallazgos críticos |
| HU-06-ESC-01 a HU-06-ESC-03 | CU-12 · Generar ficha de presentación a comité |
| HU-07-ESC-01 a HU-07-ESC-03 | CU-13 · Registrar acta de comité, firma y consolidar REM 7 |
| HU-08-ESC-01 | CU-07 · Confeccionar dossier de derivación |
| HU-08-ESC-02 | CU-03 · Despachar derivación externa; CU-08 · Registrar entrega del instructivo de pasajes |
| HU-08-ESC-03 y HU-08-ESC-04 | CU-04 · Registrar recepción y cita en HCVB |
| HU-08-ESC-05 | CU-06 · Gestionar alertas de seguimiento |
| HU-08-ESC-06 | CU-09 · Registrar retorno con epicrisis |
| HU-09-ESC-01 a HU-09-ESC-05 | CU-14 · Consultar estado en tótem de autoatención |
| HU-10-ESC-01 a HU-10-ESC-03 | CU-15 · Orientar derechos y clasificar triage presencial |
| HU-11-ESC-01 a HU-11-ESC-03 | CU-16 · Monitorear sincronización con plataforma MINSAL |

Un escenario puede relacionarse con más de un caso de uso; por ejemplo, HU-08-ESC-02 contempla el despacho y la constancia de entrega del instructivo, y CU-15 extiende a CU-14.

---

## Relación con el modelo de dominio

| Historia | Conceptos del modelo de dominio |
| :--- | :--- |
| **HU-01** | `Paciente`, `CasoOncologico`, `HitoAsistencial`, `ResolucionComite` |
| **HU-02** | `EvaluacionMultidimensional`, `DominioValoracion`, `CasoOncologico` |
| **HU-03** | `EntradaBitacora`, `CasoOncologico`, `HitoAsistencial`, `AlertaSeguimiento` |
| **HU-04** | `CasoOncologico`, `GarantiaGES`, `AlertaSeguimiento`, `HitoAsistencial` |
| **HU-05** | `CasoOncologico`, `OrdenExamen`, `EstudioDiagnostico` |
| **HU-06** | `FichaPresentacionComite`, `CasoOncologico`, `EstudioDiagnostico` |
| **HU-07** | `ActaComite`, `FirmaElectronica`, `RegistroREM7`, `ResolucionComite` |
| **HU-08** | `CasoOncologico`, `ResolucionComite`, `DossierDigitalDerivacion`, `EstudioDiagnostico`, `InstructivoReembolsoPasajes`, `ContraReferenciaEpicrisis`, `AlertaSeguimiento`, `HitoAsistencial` |
| **HU-09** | `InteraccionCanalUsuario`, `Paciente`, `CuidadorAutorizado`, `CasoOncologico` |
| **HU-10** | `InteraccionCanalUsuario`, `TicketTriagePresencial`, `Paciente` |
| **HU-11** | `RegistroIntercambioMINSAL`, `CasoOncologico`, `HitoAsistencial` |

Los nombres corresponden a conceptos definidos en el [modelo de dominio](./08-modelo-dominio.md) y formalizados en `diagramas/modelo-dominio.puml`.

---

## Relación con los diagramas de comportamiento

| Historia | Vista en DCU-01 | Diagrama de secuencia | Diagrama(s) de estado |
| :--- | :--- | :--- | :--- |
| **HU-01** | DCU-01.A | DSS-03 · Dar seguimiento al caso oncológico | EST-03 · Ciclo de vida de `CasoOncologico` |
| **HU-02** | DCU-01.D | — | — |
| **HU-03** | DCU-01.D | — | EST-01 · Alerta de búsqueda activa |
| **HU-04** | DCU-01.A | DSS-04 · Detección y gestión de alertas preventivas GES | EST-01 · Ciclo de vida de `AlertaSeguimiento` |
| **HU-05** | DCU-01.B | DSS-01 · Informes diagnósticos LIS/PACS | EST-04 · Ciclo de vida de `EstudioDiagnostico` |
| **HU-06** | DCU-01.D | — | — |
| **HU-07** | DCU-01.D | — | — |
| **HU-08** | DCU-01.C | DSS-02 · Derivación externa y retorno HCVB | EST-01 · Alerta de rezago<br>EST-02 · Ciclo de vida de `DossierDigitalDerivacion` |
| **HU-09** | DCU-01.D | — | — |
| **HU-10** | DCU-01.D | — | — |
| **HU-11** | DCU-01.D | — | — |

Las relaciones entre historias y diagramas son de muchos a muchos: por ejemplo, EST-01 cubre alertas de HU-04 y HU-08. La matriz indica el alcance de cada artefacto sin afirmar una correspondencia exclusiva entre ellos.

---

## Observaciones y alcance

1. **Diagramas de secuencia:** OncoTrace especifica cuatro Diagramas de Secuencia del Sistema (DSS-01 a DSS-04) en [10-diagramas-secuencia.md](./10-diagramas-secuencia.md) y `diagramas/diagramas-secuencia.puml`. DSS-01 cubre HU-05 con LIS/PACS; DSS-02 cubre HU-08 con HCVB; DSS-03 formaliza la interacción y validaciones temporales de HU-01; y DSS-04 formaliza el motor de evaluación de reglas preventivas de plazos e inactividad de HU-04.

2. **Diagramas de estado:** OncoTrace formaliza cuatro diagramas de ciclo de vida (EST-01 a EST-04) en [11-diagramas-estado.md](./11-diagramas-estado.md) y `diagramas/estados-objetos.puml`. EST-01 modela `AlertaSeguimiento` (HU-03/HU-04/HU-08); EST-02 modela `DossierDigitalDerivacion` (HU-08); EST-03 modela las 8 etapas asistenciales de `CasoOncologico` (HU-01); y EST-04 modela los estados de validación y recepción de `EstudioDiagnostico` (HU-05).

3. **Cobertura integral de historias:** El repositorio cuenta con especificación formal y completa para las 11 historias de usuario (HU-01 a HU-11), con 46 escenarios de aceptación en Gherkin ([07-criterios-aceptacion.md](./07-criterios-aceptacion.md)), 16 casos de uso ([09-casos-de-uso.md](./09-casos-de-uso.md) y `casos-de-uso.puml` con vistas A a D), y 22 clases del dominio ([08-modelo-dominio.md](./08-modelo-dominio.md) y `modelo-dominio.puml` con vistas A a D).

4. **Vigencia y habilitación de generación:** Todas las historias y casos de uso CU-01 a CU-16 se encuentran plenamente vigentes y habilitados para ser derivados e implementados progresivamente por OpenCode / OpenSpec / Antigravity sin bloqueos metodológicos.

5. **Integraciones y límites:** las comunicaciones con LIS y PACS dependen de las interfaces institucionales autorizadas. La integración con HCVB y MINSAL es propuesta y condicionada a su habilitación institucional (simuladas en desarrollo mediante stubs/interfaces autorizadas). Si no está disponible una interfaz en línea con HCVB, UGAA registra la confirmación emitida por el centro receptor.

6. **Requisitos de calidad:** RNF-01, RNF-02, RNF-03 y RNF-04 se verifican con los escenarios de [06-atributos-calidad.md](./06-atributos-calidad.md). En la matriz se indican los artefactos donde aplican, y se reflejan transversalmente en los accesos SSO y auditoría.

7. **Coherencia entre artefactos:** los eventos de EST-02 asociados a interacciones corresponden a los mensajes de DSS-02. El cumplimiento del plazo de once días hábiles desde el despacho se representa como un evento temporal en EST-02 y alerta en DSS-02. Los seis estados del dossier corresponden a HU-08-CA3. Las transiciones de gestión y cierre de alertas GES en EST-01 se trazan directamente a los escenarios del HU-04-ESC-05 al HU-04-ESC-07 y DSS-04. Las ocho etapas de `CasoOncologico` en EST-03 son las definidas en RF-01, TO-BE y DSS-03. El comité se registra como hito.
