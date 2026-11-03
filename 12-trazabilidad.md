# Matriz de trazabilidad — Entrega II

> **Proyecto:** OncoTrace · CIN324 Ingeniería de Requisitos  
> **Alcance:** Relaciona las historias seleccionadas con sus fuentes, requisitos y artefactos de la Entrega 2.

Esta matriz complementa la [matriz de trazabilidad de la Entrega 1](./07-matriz-trazabilidad.md). Detalla las relaciones de HU-01, HU-04, HU-05 y HU-08 con los criterios de aceptación, casos de uso, conceptos del modelo de dominio y diagramas elaborados en esta entrega.

**Referencias:** [Proceso AS-IS](./01-proceso-as-is.md) · [Rediseño TO-BE](./02-rediseno-to-be.md) · [Requisitos](./03-requisitos.md) · [Historias de usuario](./04-historias-usuario.md) · [Criterios de aceptación](./07-criterios-aceptacion.md) · [Modelo de dominio](./08-modelo-dominio.md) · [Casos de uso](./09-casos-de-uso.md) · [Diagramas de secuencia](./10-diagramas-secuencia.md) · [Diagramas de estado](./11-diagramas-estado.md).

## Matriz de trazabilidad consolidada

| Requisito (Entrega 1) | Historia | Caso de uso | Secuencia | Estado | Clases del dominio |
|-----------------------|----------|-------------|-----------|--------|---------------------|
| RF-01 · RNF-02 | HU-01 | CU-05 | — | — | `Paciente`, `CasoOncologico`, `HitoAsistencial`, `ResolucionComite` |
| RF-04 · RNF-01 | HU-04 | CU-06 | — | EST-01 | `CasoOncologico`, `GarantiaGES`, `AlertaSeguimiento`, `HitoAsistencial` |
| RF-05 · RNF-01 · RNF-04 | HU-05 | CU-01, CU-02 | DSS-01 | — | `CasoOncologico`, `OrdenExamen`, `EstudioDiagnostico` |
| RF-08 · RNF-01 | HU-08 | CU-03, CU-04, CU-07, CU-08, CU-09 | DSS-02 | EST-01, EST-02 | `CasoOncologico`, `ResolucionComite`, `DossierDigitalDerivacion`, `EstudioDiagnostico`, `InstructivoReembolsoPasajes`, `ContraReferenciaEpicrisis`, `AlertaSeguimiento`, `HitoAsistencial` |

## Trazabilidad de origen

| Historia | Fuentes | Problemas AS-IS | Actividad TO-BE | Requisitos asociados |
| :--- | :--- | :--- | :--- | :--- |
| **HU-01** Seguimiento del caso | EL-01, EL-02 y EL-03 | AS-01 y AS-04 | TB-01 | RF-01 · RNF-02 |
| **HU-04** Alertas de seguimiento | EL-01, EL-02 y EL-03 | AS-04 y AS-05 | TB-04 | RF-04 · RNF-01 |
| **HU-05** Informes diagnósticos | EL-01 y EL-03 | AS-01 | TB-05 | RF-05 · RNF-01 · RNF-04 |
| **HU-08** Derivación y retorno | EL-01 y EL-03 | AS-03 | TB-08 | RF-08 · RNF-01 |

Las fuentes y relaciones de origen se mantienen según la [matriz de la Entrega 1](./07-matriz-trazabilidad.md). RNF-03 y REQ-DER-01 establecen controles transversales de acceso y auditoría para las operaciones de funcionarios, conforme a los criterios de aceptación y casos de uso.

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

Los escenarios describen el comportamiento esperado; su inclusión en esta matriz no demuestra que el sistema esté implementado ni que se hayan ejecutado pruebas.

## Relación con el modelo de dominio

| Historia | Conceptos de MD-01 |
| :--- | :--- |
| **HU-01** | `Paciente`, `CasoOncologico`, `HitoAsistencial`, `ResolucionComite` |
| **HU-04** | `CasoOncologico`, `GarantiaGES`, `AlertaSeguimiento`, `HitoAsistencial` |
| **HU-05** | `CasoOncologico`, `OrdenExamen`, `EstudioDiagnostico` |
| **HU-08** | `CasoOncologico`, `ResolucionComite`, `DossierDigitalDerivacion`, `EstudioDiagnostico`, `InstructivoReembolsoPasajes`, `ContraReferenciaEpicrisis`, `AlertaSeguimiento`, `HitoAsistencial` |

Estos nombres identifican conceptos del [modelo de dominio](./08-modelo-dominio.md); no representan componentes de software implementados.

## Relación con los diagramas

| Historia | Casos de uso en DCU-01 | Diagrama de secuencia | Diagramas de estado |
| :--- | :--- | :--- | :--- |
| **HU-01** | DCU-01.A | — | — |
| **HU-04** | DCU-01.A | — | EST-01 · Ciclo de vida de una alerta |
| **HU-05** | DCU-01.B | DSS-01 · Informes diagnósticos | — |
| **HU-08** | DCU-01.C | DSS-02 · Derivación externa y retorno | EST-01 · Alerta de rezago; EST-02 · Dossier de derivación |

El guion indica que no se elaboró un diagrama de ese tipo para la historia dentro del alcance modelado. Los diagramas de secuencia están descritos en [10-diagramas-secuencia.md](./10-diagramas-secuencia.md); los de estado, en [11-diagramas-estado.md](./11-diagramas-estado.md).

## Cobertura y límites

La Entrega 2 desarrolla en detalle HU-01, HU-04, HU-05 y HU-08, con veinte escenarios de aceptación vinculados a sus casos de uso y conceptos de dominio. Las secuencias corresponden a HU-05 y HU-08. Los diagramas de estado cubren las alertas relacionadas con HU-04 y HU-08 y el ciclo del dossier de HU-08.

La trazabilidad de HU-02, HU-03, HU-06, HU-07, HU-09, HU-10 y HU-11 se conserva en la matriz de la Entrega 1. Este documento no les atribuye nuevos criterios ni diagramas de la Entrega 2.

Las integraciones con LIS, PACS, HCVB y MINSAL dependen de las interfaces, acuerdos y habilitaciones institucionales descritos en los documentos de origen. Las metas de calidad son objetivos especificados, no resultados de pruebas.
