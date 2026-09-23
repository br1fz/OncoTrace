# 🎙️ Elicitación de requisitos
 
## 🗣️ Técnica 1: Entrevista Semiestructurada en Profundidad
- **Participante(s):** Gestora Oncológica, Servicio de Gestión Oncológica HGF.
- **Fecha y modalidad:** 15 de Septiembre de 2026, Presencial.
- **Evidencia:** Archivo [`./evidencia/Transcripcion_Entrevista_Oncologia.txt`](./evidencia/Transcripcion_Entrevista_Oncologia.txt) adjunto en el repositorio.
- **Hallazgos principales:**
  - 🔍 **Dispersión de resultados:** La búsqueda manual en múltiples sistemas LIS y PACS genera demoras críticas.
  - ⏳ **Sobrecarga en Comités:** La preparación de resúmenes en Word y actas en papel toma horas de trabajo administrativo.
  - 👁️ **Pérdida de Trazabilidad:** Las derivaciones a radioterapia o quimioterapia sólida al Hospital Carlos Van Buren se envían por interconsulta física, generando un punto ciego asistencial.
  - 🤝 **Acompañamiento informal:** Falta un registro estructurado (bitácora) para evaluar el riesgo social y el estado del paciente.
 
## 📄 Técnica 2: Revisión Documental y Normativa
- **Participante(s):** Equipo de Ingeniería de Requisitos (Análisis de escritorio).
- **Evidencia:** ![Captura Normativa GES](./evidencia/captura-normativa-ges.png)
- **Hallazgos principales:**
  - ⚖️ Identificación de los plazos máximos normados por las Garantías Explícitas en Salud (GES) que el sistema debe monitorear.
  - 📜 Levantamiento de los requerimientos de acompañamiento continuo estipulados en la Ley Nacional del Cáncer N° 21.258.
  - 📉 Análisis de los formatos actuales de Fichas de Comité y planillas Excel locales, confirmando la necesidad de digitalización de los acuerdos médicos.
 
## 🤝 Acta de acuerdo

**Síntesis de Hallazgos Validados:**
```text
┌──────────────────┐          ┌──────────────────┐          ┌──────────────────┐
│ Dispersión de    │          │ Sobrecarga en    │          │ Pérdida de       │
│ Resultados       │ ───────► │ Comités          │ ───────► │ Trazabilidad     │
│ (Múltiples LIS)  │          │ (Papel/Retrasos) │          │ (Van Buren/Priv) │
└──────────────────┘          └──────────────────┘          └──────────────────┘
