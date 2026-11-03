# Matriz de trazabilidad — Entrega 2

> **Proyecto:** OncoTrace · CIN324 Ingeniería de Requisitos  
> **Alcance:** Relaciona los requisitos asociados a las historias seleccionadas con sus criterios de aceptación y artefactos de la Entrega 2.

Esta matriz complementa la [matriz de trazabilidad de la Entrega 1](./07-matriz-trazabilidad.md). Cubre HU-01, HU-04, HU-05 y HU-08, desarrolladas en esta entrega.

**Referencias:** [Proceso AS-IS](./01-proceso-as-is.md) · [Rediseño TO-BE](./02-rediseno-to-be.md) · [Requisitos](./03-requisitos.md) · [Historias de usuario](./04-historias-usuario.md) · [Criterios de aceptación](./07-criterios-aceptacion.md) · [Modelo de dominio](./08-modelo-dominio.md) · [Casos de uso](./09-casos-de-uso.md) · [Diagramas de secuencia](./10-diagramas-secuencia.md) · [Diagramas de estado](./11-diagramas-estado.md).

---

## Matriz de trazabilidad consolidada

Cada fila muestra un vínculo entre un requisito de producto y una historia del alcance. Por eso RNF-01 aparece en más de una fila: se asocia a varias historias.

| Requisito de producto | Historia | Caso(s) de uso | Secuencia | Estado | Clases del dominio |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **RF-01** | HU-01 | CU-05 | — | — | `Paciente`, `CasoOncologico`, `HitoAsistencial`, `ResolucionComite` |
| **RNF-02** | HU-01 | CU-05 | — | — | `Paciente`, `CasoOncologico`, `HitoAsistencial`, `ResolucionComite` |
| **RF-04** | HU-04 | CU-06 | — | EST-01 | `CasoOncologico`, `GarantiaGES`, `AlertaSeguimiento`, `HitoAsistencial` |
| **RNF-01** | HU-04 | CU-06 | — | EST-01 | `CasoOncologico`, `GarantiaGES`, `AlertaSeguimiento`, `HitoAsistencial` |
| **RF-05** | HU-05 | CU-01, CU-02 | DSS-01 | — | `CasoOncologico`, `OrdenExamen`, `EstudioDiagnostico` |
| **RNF-01** | HU-05 | CU-01, CU-02 | DSS-01 | — | `CasoOncologico`, `OrdenExamen`, `EstudioDiagnostico` |
| **RNF-04** | HU-05 | CU-01, CU-02 | DSS-01 | — | `CasoOncologico`, `OrdenExamen`, `EstudioDiagnostico` |
| **RF-08** | HU-08 | CU-03, CU-04, CU-06, CU-07, CU-08, CU-09 | DSS-02 | EST-01, EST-02 | `CasoOncologico`, `ResolucionComite`, `DossierDigitalDerivacion`, `EstudioDiagnostico`, `InstructivoReembolsoPasajes`, `ContraReferenciaEpicrisis`, `AlertaSeguimiento`, `HitoAsistencial` |
| **RNF-01** | HU-08 | CU-03, CU-04, CU-06, CU-07, CU-08, CU-09 | DSS-02 | EST-01, EST-02 | `CasoOncologico`, `ResolucionComite`, `DossierDigitalDerivacion`, `EstudioDiagnostico`, `InstructivoReembolsoPasajes`, `ContraReferenciaEpicrisis`, `AlertaSeguimiento`, `HitoAsistencial` |

En `03-requisitos.md`, los requisitos **RP-01 a RP-03** corresponden a la gestión del proyecto, no a objetivos funcionales de estas historias. Por eso esta matriz relaciona los requisitos de producto RF y RNF asociados al alcance seleccionado.

**RNF-03** y **REQ-DER-01** son condiciones transversales para el acceso y la auditoría de las operaciones de funcionarios; se detallan en [03-requisitos.md](./03-requisitos.md), los [criterios de aceptación](./07-criterios-aceptacion.md) y los [casos de uso](./09-casos-de-uso.md).

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

4. **Historias restantes:** HU-02, HU-03, HU-06, HU-07, HU-09, HU-10 y HU-11 conservan la trazabilidad documentada en la matriz de la Entrega 1. Este documento no les atribuye nuevos criterios ni diagramas de la Entrega 2.

5. **Integraciones y límites:** las comunicaciones con LIS y PACS dependen de las interfaces institucionales autorizadas. La integración con HCVB es propuesta y condicionada a su habilitación; si no está disponible, UGAA puede registrar la confirmación emitida por el centro receptor. La matriz documenta requisitos y diseños, no acredita implementación ni pruebas.
