# Diagrama General de Casos de Uso - Integración Externa (HU-05 y HU-08)
> **Proyecto:** OncoTrace - Hospital Dr. Gustavo Fricke (HGF)
> **Evidencia:** Diagrama de Casos de Uso UML para las Historias de Usuario seleccionadas de integración con sistemas externos.

---

## 1. Diagrama UML de Casos de Uso

```mermaid
graph TD
    %% Actores
    Gestor["Gestor/a Oncológico/a"]
    Medico["Médico Tratante"]
    TENS["TENS / Administrativo UGAA"]
    SistemaExt["Sistemas Externos (LIS / PACS / HCVB)"]

    %% Sistema OncoTrace (Frontera)
    subgraph OncoTrace [Sistema OncoTrace - UGCO HGF]
        CU05["CU-05: Consolidación e Indexación Automática<br/>de Biopsias, PACS y Alertas Críticas"]
        CU08["CU-08: Trazabilidad y Tracking<br/>de Derivaciones Externas (HCVB)"]
    end

    %% Relaciones HU-05
    SistemaExt -->|Envía informes HL7 FHIR| CU05
    Gestor -->|Visualiza completitud y exámenes| CU05
    Medico -->|Recibe alertas críticas de malignidad| CU05

    %% Relaciones HU-08
    Gestor -->|Monitorea estado en macrored| CU08
    TENS -->|Confecciona dossier digital| CU08
    CU08 -->|Sincroniza estado de derivación| SistemaExt
