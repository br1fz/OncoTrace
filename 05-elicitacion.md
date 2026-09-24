# 🎙️ Elicitación de Requisitos

## 🗣️ EL-01: Entrevista Semiestructurada en Profundidad
* **Participante(s):** Gestora Oncológica, Servicio de Gestión Oncológica HGF.
* **Fecha y modalidad:** 15 de septiembre de 2026, presencial.
* **Evidencia:** Documento adjunto [`./evidencia/Transcripcion_Entrevista_Oncologia.txt`](./evidencia/Transcripcion_Entrevista_Oncologia.txt) en el repositorio.

### Hallazgos y Nodos Elicitados:
* 🔍 **[AS-01] Fragmentación de resultados:** La consulta manual a través de distintos sistemas LIS y visores PACS provoca demoras asistenciales importantes.
* ⏳ **[AS-02] Sobrecarga operativa en Comités:** La consolidación de antecedentes clínicos en Word y el llenado manual de actas en papel consumen tiempo administrativo valioso del equipo.
* 👁️ **[AS-03] Pérdida de Trazabilidad Externa:** El envío de derivaciones a radioterapia o quimioterapia al Hospital Carlos Van Buren mediante interconsultas en papel genera una brecha crítica en el seguimiento del paciente.
* 🤝 **[AS-05] Registro no estandarizado de acompañamiento:** Se constata la ausencia de una bitácora centralizada para documentar el seguimiento, evaluar el estado funcional (ECOG) y ponderar la vulnerabilidad social.
* 🚪 **[AS-06] Alta demanda espontánea en ventanilla (Ley N° 21.258):** Constante afluencia de consultas directas en mesón; se plantea incorporar canales de orientación y autoatención (tótem interactivo [TB-09] y chatbot de apoyo [TB-10]) para descongestionar la atención presencial.

---

## 📄 EL-02: Revisión Documental y Normativa
* **Participante(s):** Equipo de Ingeniería de Requisitos (trabajo de gabinete).
* **Evidencia:** Marco regulatorio de Garantías Explícitas en Salud (GES) y protocolos clínicos locales HGF.

### Hallazgos y Nodos Elicitados:
* ⚖️ **[AS-04] Control de Tiempos de Espera GES:** Determinación de los plazos legales fijados por el régimen GES para configurar alarmas tempranas ante eventuales vencimientos de garantías ([TB-04]).
* 📜 **[AS-05] Seguimiento y Apoyo Continuo:** Definición de criterios de acompañamiento integral y navegación clínica en conformidad con la Ley Nacional del Cáncer N° 21.258.
* 📉 **[AS-02] Homologación de Actas de Comité:** Revisión de las plantillas Excel y formatos impresos actuales, ratificando la urgencia de digitalizar el proceso y registrar la resolución colegiada ([TB-06], [TB-07]).

---

## 🤝 Acta de Acuerdo

### Síntesis de Hallazgos Validados:

```text
┌──────────────────┐          ┌──────────────────┐          ┌──────────────────┐
│ Dispersión de    │          │ Sobrecarga en    │          │ Pérdida de       │
│ Resultados       │ ───────► │ Comités          │ ───────► │ Trazabilidad     │
│ (Múltiples LIS)  │          │ (Papel/Retrasos) │          │ (Van Buren/Priv) │
└────────┬─────────┘          └──────────────────┘          └──────────────────┘
         │
         ▼
┌──────────────────┐          ┌────────────────────────────────────────────────┐
│ Demanda          │          │ Necesidad Tangente Identificada:               │
│ Espontánea       │ ───────► │ Tótem de Autoatención y Chatbot de Orientación │
│ (Ley del Cáncer) │ ───────► │ (Triage para descongestionar a las gestoras)   │
└──────────────────┘          └────────────────────────────────────────────────┘
