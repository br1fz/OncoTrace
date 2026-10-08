# 🎙️ Elicitación de Requisitos

## 🗣️ EL-01: Entrevista Semiestructurada en Profundidad
* **Participante(s):** Gestora Oncológica, Unidad de Gestión de Casos Oncológicos (UGCO) HGF.
* **Fecha y modalidad:** 15 de septiembre de 2026, presencial.
* **Evidencia:** Documento adjunto [`./evidencia/Transcripcion_Entrevista_Oncologia.txt`](./evidencia/Transcripcion_Entrevista_Oncologia.txt) en el repositorio.

### Hallazgos y Nodos Elicitados:
* 🔍 **[AS-01] Fragmentación de resultados diagnósticos:** La consulta manual a través de distintos visores aislados (Pathology, LIS, PACS) provoca demoras asistenciales de hasta 15 días en la consolidación del diagnóstico inicial.
* ⏳ **[AS-02] Sobrecarga operativa en Comités Oncológicos:** La consolidación de antecedentes clínicos en Word y el llenado manual de actas en papel físico consumen tiempo administrativo valioso del equipo, con riesgo de omisión de antecedentes.
* 👁️ **[AS-03] Pérdida de Trazabilidad Externa:** El envío de derivaciones a radioterapia o quimioterapia al Hospital Carlos Van Buren mediante dossiers físicos genera un "punto ciego" asistencial sin confirmación de agendamiento ni recepción.
* 🤝 **[AS-05] Registro no interoperable y fragmentado:** La unidad utiliza una plataforma local institucional que no interopera con la Plataforma de Seguimiento Oncológico del MINSAL, obligando al doble registro y dificultando la evaluación estandarizada de vulnerabilidad social y funcional.
* 🚪 **[AS-06] Alta demanda espontánea en ventanilla (Ley N° 21.258):** Constante afluencia de consultas directas en mesón de pacientes y cuidadores exigiendo estado de exámenes; se plantea incorporar canales de orientación y autoatención (tótem interactivo [TB-09] y chatbot de apoyo con triage [TB-10]) para descongestionar la atención presencial.

---

## 📄 EL-02: Revisión Documental y Normativa
* **Participante(s):** Equipo de Ingeniería de Requisitos (trabajo de gabinete).
* **Evidencia:** Marco regulatorio y directrices vigentes de la red asistencial pública chilena.

### Hallazgos y Nodos Elicitados:
* ⚖️ **[AS-04] Control de Tiempos de Espera GES:** Determinación de los plazos legales perentorios fijados por el régimen GES para configurar alarmas tempranas (semáforo preventivo a $\le 5$ días hábiles) ante eventuales vencimientos de garantías ([TB-04]).
* 📜 **[AS-05] Seguimiento y Apoyo Continuo:** Definición de criterios de acompañamiento integral y navegación clínica en conformidad con los mandatos de la Ley Nacional del Cáncer N° 21.258.
* 📉 **[AS-02] Homologación de Actas de Comité:** Revisión de formatos impresos y normativas de registro estadístico, ratificando la exigencia de digitalizar el proceso y registrar la resolución colegiada vinculada a la estadística nacional REM 0.7 ([TB-06], [TB-07]).

---

## 📚 EL-03: Revisión de Manuales Oficiales UGCO (Versión 2.0)
* **Participante(s):** Equipo de Ingeniería de Requisitos y contraparte técnica UGCO.
* **Evidencia:** Documentación oficial entregada por la Unidad de Gestión de Casos Oncológicos:
  - *Manual de Organización y Funcionamiento UGCO (Versión 2.0)*
  - *Manual de Procedimientos UGCO (Versión 2.0)*
  - *Manual de Gestión de Casos Oncológicos (GCO)*
  - Documento de catastro: [`./evidencia/adaptación_modelo_UGCO.md`](./evidencia/adaptación_modelo_UGCO.md)

### Hallazgos y Nodos Elicitados:
* 🏛️ **Dependencia y Estructura Organizacional:** La unidad posee una **dependencia mixta**: administrativamente de la Subdirección de Gestión del Cuidado (SDGC) y técnicamente de la Subdirección Médica (SDM). Su dotación oficial está compuesta por Enfermera Supervisora, Gestores por especialidad (Enfermeros/as o Matrones/as), Técnicos en Enfermería (TENS) y Administrativa.
* 🔄 **Trayectoria Oncológica Normada:** El flujo de atención de la persona con cáncer y su cuidador se rige por **8 etapas secuenciales obligatorias**: 1. Sospecha $\rightarrow$ 2. Confirmación Diagnóstica $\rightarrow$ 3. Etapificación $\rightarrow$ 4. Tratamiento $\rightarrow$ 5. Rehabilitación $\rightarrow$ 6. Cuidados Paliativos $\rightarrow$ 7. Seguimiento y Sobrevivientes $\rightarrow$ 8. Alta y Contrarreferencia.
* 📞 **Puntos de Contacto Obligatorio:** Se identifican 6 momentos mandatorios de intervención del gestor: al ingreso/sospecha, post-confirmación diagnóstica, post-resolución de comité, al alta de hospitalizaciones, al término del tratamiento activo y ante derivaciones externas.
* 📑 **Circuito de Derivación Formal (Dossier TENS/UGAA):** El Manual de Procedimientos aclara que el TENS confecciona el "dossier" físico con la documentación completa (interconsulta, informes, biopsias) y lo entrega a la **UGAA (Unidad de Gestión de Atención Abierta)**, quien efectúa el despacho hacia el Hospital Carlos Van Buren ([TB-08]).
* 🌐 **Aclaración del Nodo AS-05 (Interoperabilidad MINSAL):** La unidad sí cuenta con una herramienta digital de registro local, pero esta **no interopera con la Plataforma de Seguimiento Oncológico del MINSAL (Salud Digital)**, impidiendo el reporte nacional unificado y obligando a una doble digitación manual ([TB-11]).
* 📋 **Cobertura GES Ampliada:** La unidad gestiona **21 problemas de salud oncológicos y asociados** garantizados por el Régimen GES conforme al Decreto Supremo N° 29 de 2025.

---

## 🤝 Acta de Acuerdo

### Síntesis de Hallazgos Validados:

```text
┌──────────────────┐          ┌──────────────────┐          ┌──────────────────┐
│ Dispersión de    │          │ Sobrecarga en    │          │ Pérdida de       │
│ Resultados       │ ───────► │ Comités          │ ───────► │ Trazabilidad     │
│ (Múltiples LIS)  │          │ (Papel/Retrasos) │          │ (Dossier TENS)   │
└────────┬─────────┘          └──────────────────┘          └──────────────────┘
         │
         ▼
┌──────────────────┐          ┌────────────────────────────────────────────────┐
│ Demanda          │          │ Necesidad Tangente Identificada:               │
│ Espontánea       │ ───────► │ Tótem de Autoatención y Chatbot de Orientación │
│ (Ley N° 21.258)  │          │ (Triage para descongestionar a las gestoras)   │
└──────────────────┘          └────────────────────────────────────────────────┘
         │
         ▼
┌──────────────────┐          ┌────────────────────────────────────────────────┐
│ Fragmentación    │          │ Integración Ministerial Obligatoria:           │
│ MINSAL (AS-05)   │ ───────► │ Plataforma única interoperable con MINSAL      │
│ (Doble registro) │          │ (Eliminación de doble digitación local/nacional│
└──────────────────┘          └────────────────────────────────────────────────┘
```
