# Matriz de trazabilidad — Entrega 2

> **Proyecto:** OncoTrace · CIN324 Ingeniería de Requisitos  
> **Alcance:** Relaciona los requisitos asociados a las historias seleccionadas con sus criterios de aceptación y artefactos de la Entrega 2.

Esta matriz complementa la [matriz de trazabilidad de la Entrega 1](./07-matriz-trazabilidad.md). Cubre HU-01, HU-04, HU-05 y HU-08, desarrolladas en esta entrega.

**Referencias:** [Proceso AS-IS](./01-proceso-as-is.md) · [Rediseño TO-BE](./02-rediseno-to-be.md) · [Requisitos](./03-requisitos.md) · [Historias de usuario](./04-historias-usuario.md) · [Criterios de aceptación](./07-criterios-aceptacion.md) · [Modelo de dominio](./08-modelo-dominio.md) · [Casos de uso](./09-casos-de-uso.md) · [Diagramas de secuencia](./10-diagramas-secuencia.md) · [Diagramas de estado](./11-diagramas-estado.md).

---

## Matriz de trazabilidad consolidada

La matriz tiene una fila por cada requisito de la Entrega 1 ([03-requisitos.md](./03-requisitos.md)). Los requisitos que no pertenecen a las historias desarrolladas en esta entrega quedan con «—», y el motivo se explica en las [observaciones](#observaciones-y-alcance).

| Requisito (Entrega 1) | Historia | Caso(s) de uso | Secuencia | Estado | Clases del dominio |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **RF-01** · Tablero y trazabilidad por etapas | HU-01 | CU-05 | — | — | `Paciente`, `CasoOncologico`, `HitoAsistencial`, `ResolucionComite` |
| **RF-02** · Evaluación multidimensional por dominios | HU-02 | — | — | — | — |
| **RF-03** · Bitácora de puntos de contacto | HU-03 | — | — | — | — |
| **RF-04** · Alertas GES e inactividad | HU-04 | CU-06 | — | EST-01 | `CasoOncologico`, `GarantiaGES`, `AlertaSeguimiento`, `HitoAsistencial` |
| **RF-05** · Consolidación de exámenes y alertas | HU-05 | CU-01, CU-02 | DSS-01 | — | `CasoOncologico`, `OrdenExamen`, `EstudioDiagnostico` |
| **RF-06** · Ficha de presentación a comité | HU-06 | — | — | — | — |
| **RF-07** · Acta digital y registro REM 7 | HU-07 | — | — | — | — |
| **RF-08** · Derivaciones externas y reembolso de pasajes | HU-08 | CU-03, CU-04, CU-06, CU-07, CU-08, CU-09 | DSS-02 | EST-01, EST-02 | `CasoOncologico`, `ResolucionComite`, `DossierDigitalDerivacion`, `EstudioDiagnostico`, `InstructivoReembolsoPasajes`, `ContraReferenciaEpicrisis`, `AlertaSeguimiento`, `HitoAsistencial` |
| **RF-09** · Tótem de autoatención | HU-09 | — | — | — | — |
| **RF-10** · Asistente virtual y triage asistencial | HU-10 | — | — | — | — |
| **RF-11** · Intercambio de información con MINSAL | HU-11 | — | — | — | — |
| **RNF-01** · Fiabilidad y disponibilidad | HU-04, HU-05, HU-08 | CU-01 a CU-04, CU-06 a CU-09 | DSS-01, DSS-02 | EST-01, EST-02 | `AlertaSeguimiento`, `EstudioDiagnostico`, `DossierDigitalDerivacion` |
| **RNF-02** · Eficiencia de desempeño | HU-01 | CU-05 | — | — | `CasoOncologico`, `HitoAsistencial` |
| **RNF-03** · Seguridad y confidencialidad clínica | HU-07, HU-09, HU-11 (transversal a las historias de esta entrega) | Precondición de acceso de todos los actores humanos | Nota de autorización en DSS-01 y DSS-02 | — | Atributos de responsable en `HitoAsistencial`, `AlertaSeguimiento` e `InstructivoReembolsoPasajes` |
| **RNF-04** · Interoperabilidad hospitalaria | HU-05, HU-11 | CU-01, CU-02 | DSS-01 | — | `EstudioDiagnostico` |
| **REQ-DER-01** · SSO institucional (derivado de RNF-03) | HU-07, HU-11 (transversal) | Autenticación de todos los actores humanos | Nota de autorización en DSS-01 y DSS-02 | — | — |
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
| **HU-04** Alertas de seguimiento | EL-01, EL-02 y EL-03 | AS-04 y AS-05 | TB-04 | RF-04 · RNF-01 |
| **HU-05** Informes diagnósticos | EL-01 y EL-03 | AS-01 | TB-05 | RF-05 · RNF-01 · RNF-04 |
| **HU-08** Derivación y retorno | EL-01 y EL-03 | AS-03 | TB-08 | RF-08 · RNF-01 |

Las fuentes y relaciones de origen se mantienen según la [matriz de trazabilidad de la Entrega 1](./07-matriz-trazabilidad.md).

---

## Relación entre escenarios y casos de uso

| Escenarios de aceptación | Casos de uso relacionados |
| :--- | :--- |
| HU-01-ESC-01 a HU-01-ESC-03 | CU-05 · Dar seguimiento al caso oncológico |
| HU-04-ESC-01 a HU-04-ESC-07 | CU-06 · Gestionar alertas de seguimiento |
| HU-05-ESC-01, HU-05-ESC-03 y HU-05-ESC-04 | CU-01 · Consolidar y consultar informes diagnósticos |
| HU-05-ESC-02 | CU-02 · Recibir avisos de hallazgos críticos |
| HU-08-ESC-01 | CU-07 · Confeccionar dossier de derivación |
| HU-08-ESC-02 | CU-03 · Despachar derivación externa; CU-08 · Registrar entrega del instructivo de pasajes |
| HU-08-ESC-03 y HU-08-ESC-04 | CU-04 · Registrar recepción y cita en HCVB |
| HU-08-ESC-05 | CU-06 · Gestionar alertas de seguimiento |
| HU-08-ESC-06 | CU-09 · Registrar retorno con epicrisis |

Un escenario puede relacionarse con más de un caso de uso; por ejemplo, HU-08-ESC-02 contempla el despacho y la constancia de entrega del instructivo.

---

## Relación con el modelo de dominio

| Historia | Conceptos del modelo de dominio |
| :--- | :--- |
| **HU-01** | `Paciente`, `CasoOncologico`, `HitoAsistencial`, `ResolucionComite` |
| **HU-04** | `CasoOncologico`, `GarantiaGES`, `AlertaSeguimiento`, `HitoAsistencial` |
| **HU-05** | `CasoOncologico`, `OrdenExamen`, `EstudioDiagnostico` |
| **HU-08** | `CasoOncologico`, `ResolucionComite`, `DossierDigitalDerivacion`, `EstudioDiagnostico`, `InstructivoReembolsoPasajes`, `ContraReferenciaEpicrisis`, `AlertaSeguimiento`, `HitoAsistencial` |

Los nombres corresponden a conceptos definidos en el [modelo de dominio](./08-modelo-dominio.md); no implican que sean componentes de software implementados.

---

## Relación con los diagramas de comportamiento

| Historia | Vista en DCU-01 | Diagrama de secuencia | Diagrama(s) de estado |
| :--- | :--- | :--- | :--- |
| **HU-01** | DCU-01.A | — | — |
| **HU-04** | DCU-01.A | — | EST-01 · Ciclo de vida de `AlertaSeguimiento` |
| **HU-05** | DCU-01.B | DSS-01 · Informes diagnósticos | — |
| **HU-08** | DCU-01.C | DSS-02 · Derivación externa y retorno | EST-01 · Alerta de rezago<br>EST-02 · Ciclo de vida de `DossierDigitalDerivacion` |

Las relaciones entre historias y diagramas son de muchos a muchos: por ejemplo, EST-01 cubre alertas de HU-04 y HU-08. La matriz indica el alcance de cada artefacto sin afirmar una correspondencia exclusiva entre ellos.

---

## Observaciones y alcance

1. **Diagramas de secuencia:** la pauta solicita al menos dos diagramas de historias con integración a otro sistema. DSS-01 cubre HU-05 con LIS/PACS y DSS-02 cubre HU-08 con HCVB. No se elaboraron DSS para HU-01 ni HU-04 dentro del alcance seleccionado.

2. **Diagramas de estado:** EST-01 modela el ciclo de `AlertaSeguimiento` para HU-04 y las alertas de rezago de HU-08. EST-02 modela `DossierDigitalDerivacion` para HU-08. No se elaboraron diagramas de estado para HU-01 ni HU-05; esto indica una decisión de alcance de esta entrega, no que las clases involucradas carezcan de cambios de estado.

3. **Cobertura:** la Entrega 2 desarrolla HU-01, HU-04, HU-05 y HU-08, con veinte escenarios de aceptación relacionados con sus casos de uso y conceptos del dominio. Las secuencias corresponden a HU-05 y HU-08; los estados, a las alertas de HU-04/HU-08 y al dossier de HU-08.

4. **Requisitos e historias restantes:** RF-02, RF-03, RF-06, RF-07, RF-09, RF-10 y RF-11 (historias HU-02, HU-03, HU-06, HU-07, HU-09, HU-10 y HU-11) no forman parte del alcance de la Entrega 2, por eso sus celdas quedan con «—». Conservan la trazabilidad documentada en la [matriz de la Entrega 1](./07-matriz-trazabilidad.md) y este documento no les atribuye nuevos criterios ni diagramas.

5. **Integraciones y límites:** las comunicaciones con LIS y PACS dependen de las interfaces institucionales autorizadas. La integración con HCVB es propuesta y condicionada a su habilitación; si no está disponible, UGAA puede registrar la confirmación emitida por el centro receptor. La matriz documenta requisitos y diseños, no acredita implementación ni pruebas.

6. **Requisitos de calidad:** RNF-01, RNF-02 y RNF-04 se verifican con los escenarios de [06-atributos-calidad.md](./06-atributos-calidad.md). En la matriz se indican los artefactos donde aplican, pero no se representan como estados ni casos de uso propios.

7. **Coherencia entre artefactos:** los eventos de EST-02 asociados a interacciones corresponden a los mensajes de DSS-02. El cumplimiento del plazo de once días hábiles desde el despacho se representa como un evento temporal en EST-02. Los seis estados del dossier corresponden a HU-08-CA3 de la Entrega 1. Las transiciones de gestión y cierre de alertas GES en EST-01 se trazan directamente a los escenarios del HU-04-ESC-05 al HU-04-ESC-07. Las ocho etapas de `CasoOncologico` son las definidas en RF-01 y en el proceso TO-BE. El comité se registra como hito.
