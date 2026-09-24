# 🎙️ Elicitación de requisitos
 
## 🗣️ EL-01: Entrevista Semiestructurada en Profundidad
- **Participante(s):** Gestora Oncológica, Servicio de Gestión Oncológica HGF.
- **Fecha y modalidad:** 15 de Septiembre de 2026, Presencial.
- **Evidencia:** Archivo [`./evidencia/Transcripcion_Entrevista_Oncologia.txt`](./evidencia/Transcripcion_Entrevista_Oncologia.txt) adjunto en el repositorio.
- **Hallazgos y Nodos Elicitados:**
  - 🔍 **[AS-01] Dispersión de resultados:** La búsqueda manual en múltiples sistemas LIS y PACS genera demoras críticas.
  - ⏳ **[AS-02] Sobrecarga en Comités:** La preparación de resúmenes en Word y actas en papel toma horas de trabajo administrativo.
  - 👁️ **[AS-03] Pérdida de Trazabilidad:** Las derivaciones a radioterapia o quimioterapia sólida al Hospital Carlos Van Buren se envían por interconsulta física, generando un punto ciego asistencial.
  - 🤝 **[AS-05] Acompañamiento informal:** Falta un registro estructurado (bitácora) para evaluar el riesgo social y el estado funcional (ECOG).
  - 🚪 **[AS-06] Interrupciones por demanda espontánea (Ley N° 21.258):** Gran afluencia de pacientes en mesón; se levanta la necesidad de soluciones de autoatención/triage (tótem táctil [TB-09] y chatbot [TB-10]).

## 📄 EL-02: Revisión Documental y Normativa
- **Participante(s):** Equipo de Ingeniería de Requisitos (Análisis de escritorio).
- **Evidencia:** ![Captura Normativa GES](./evidencia/captura-normativa-ges.png)
- **Hallazgos y Nodos Elicitados:**
  - ⚖️ **[AS-04] Monitoreo de Plazos Legales GES:** Identificación de plazos máximos normados por las Garantías Explícitas en Salud que OncoTrace debe alertar preventivamente ([TB-04]).
  - 📜 **[AS-05] Acompañamiento Continuo:** Levantamiento de requerimientos de soporte continuo bajo la Ley Nacional del Cáncer N° 21.258.
  - 📉 **[AS-02] Estandarización de Comités:** Análisis de las planillas Excel y actas físicas, confirmando la necesidad de digitalización y firma colegiada ([TB-06], [TB-07]).

 
## 🤝 Acta de acuerdo

**Síntesis de Hallazgos Validados:**
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
│ (Ley del Cáncer) │          │ (Triage para descongestionar a las gestoras)   │
└──────────────────┘          └────────────────────────────────────────────────┘
```

