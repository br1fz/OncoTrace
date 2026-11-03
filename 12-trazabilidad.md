# Matriz de trazabilidad — Entrega 2

> **Proyecto:** OncoTrace · CIN324 Ingeniería de Requisitos  
> **Alcance:** Relaciona las historias seleccionadas con sus fuentes, requisitos y artefactos de la Entrega 2.

Esta matriz complementa la [matriz de trazabilidad de la Entrega 1](./07-matriz-trazabilidad.md). Detalla las relaciones de HU-01, HU-04, HU-05 y HU-08 con los criterios de aceptación, casos de uso, conceptos del modelo de dominio y diagramas elaborados en esta entrega.

**Referencias:** [Proceso AS-IS](./01-proceso-as-is.md) · [Rediseño TO-BE](./02-rediseno-to-be.md) · [Requisitos](./03-requisitos.md) · [Historias de usuario](./04-historias-usuario.md) · [Criterios de aceptación](./07-criterios-aceptacion.md) · [Modelo de dominio](./08-modelo-dominio.md) · [Casos de uso](./09-casos-de-uso.md) · [Diagramas de secuencia](./10-diagramas-secuencia.md) · [Diagramas de estado](./11-diagramas-estado.md).

---

## Matriz de trazabilidad consolidada

| Requisito (Entrega 1) | Historia | Caso de uso | Secuencia | Estado | Clases del dominio |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **RF-01 · RNF-02** | HU-01 | CU-05 | — | — | `Paciente`, `CasoOncologico`, `HitoAsistencial`, `ResolucionComite` |
| **RF-04 · RNF-01** | HU-04 | CU-06 | — | EST-01 | `CasoOncologico`, `GarantiaGES`, `AlertaSeguimiento`, `HitoAsistencial` |
| **RF-05 · RNF-01 · RNF-04** | HU-05 | CU-01, CU-02 | DSS-01 | — | `CasoOncologico`, `OrdenExamen`, `EstudioDiagnostico` |
| **RF-08 · RNF-01** | HU-08 | CU-03, CU-04, CU-06, CU-07, CU-08, CU-09 | DSS-02 | EST-01, EST-02 | `CasoOncologico`, `ResolucionComite`, `DossierDigitalDerivacion`, `EstudioDiagnostico`, `InstructivoReembolsoPasajes`, `ContraReferenciaEpicrisis`, `AlertaSeguimiento`, `HitoAsistencial` |

---

## Trazabilidad de origen

| Historia | Fuentes | Problemas AS-IS | Actividad TO-BE | Requisitos asociados |
| :--- | :--- | :--- | :--- | :--- |
| **HU-01** Seguimiento del caso | EL-01, EL-02 y EL-03 | AS-01 y AS-04 | TB-01 | RF-01 · RNF-02 |
| **HU-04** Alertas de seguimiento | EL-01, EL-02 y EL-03 | AS-04 y AS-05 | TB-04 | RF-04 · RNF-01 |
| **HU-05** Informes diagnósticos | EL-01 y EL-03 | AS-01 | TB-05 | RF-05 · RNF-01 · RNF-04 |
| **HU-08** Derivación y retorno | EL-01 y EL-03 | AS-03 | TB-08 | RF-08 · RNF-01 |

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

---

## Relación con el modelo de dominio

| Historia | Conceptos del Modelo de Dominio (`08-modelo-dominio.md`) |
| :--- | :--- |
| **HU-01** | `Paciente`, `CasoOncologico`, `HitoAsistencial`, `ResolucionComite` |
| **HU-04** | `CasoOncologico`, `GarantiaGES`, `AlertaSeguimiento`, `HitoAsistencial` |
| **HU-05** | `CasoOncologico`, `OrdenExamen`, `EstudioDiagnostico` |
| **HU-08** | `CasoOncologico`, `ResolucionComite`, `DossierDigitalDerivacion`, `EstudioDiagnostico`, `InstructivoReembolsoPasajes`, `ContraReferenciaEpicrisis`, `AlertaSeguimiento`, `HitoAsistencial` |

---

## Relación con los diagramas de comportamiento

| Historia | Casos de uso en DCU-01 | Diagramas de secuencia de sistema | Diagramas de estado (Clase de dominio) |
| :--- | :--- | :--- | :--- |
| **HU-01** | CU-05 | — | — |
| **HU-04** | CU-06 | — | EST-01 · Ciclo de vida de `AlertaSeguimiento` |
| **HU-05** | CU-01, CU-02 | DSS-01 · Incorporar y consultar informes diagnósticos | — |
| **HU-08** | CU-03, CU-04, CU-06, CU-07, CU-08, CU-09 | DSS-02 · Gestionar derivación externa y retorno | EST-01 · Ciclo de vida de `AlertaSeguimiento`<br>EST-02 · Ciclo de vida de `DossierDigitalDerivacion` |

---

## Observaciones y justificación de celdas vacías («—»)

1. **Diagramas de Secuencia (HU-01 y HU-04):** No se elaboraron diagramas DSS para HU-01 ni HU-04 debido a que la pauta exige un mínimo de 2 diagramas enfocados prioritariamente en historias con integración a sistemas externos (LIS/PACS en HU-05 y Sistema HCVB en HU-08).
2. **Diagramas de Estado (HU-01 y HU-05):** No se diseñaron diagramas de estado para estas historias ya que las clases del dominio involucradas (`OrdenExamen`, `EstudioDiagnostico`) no presentan un ciclo de vida complejo en el alcance del sistema de seguimiento, centrándose la dinámica de estados en la clase `AlertaSeguimiento` (EST-01) y `DossierDigitalDerivacion` (EST-02).
3. **Consistencia Transversal:** Los nombres de las clases, eventos, actores y casos de uso en esta matriz guardan coincidencia de 1 a 1 con los documentos `07-criterios-aceptacion.md`, `08-modelo-dominio.md`, `09-casos-de-uso.md`, `10-diagramas-secuencia.md` y `11-diagramas-estado.md`.
