# Elicitación de requisitos

> **Proyecto:** OncoTrace – Plataforma de Trazabilidad, Gestión, Evaluación y Acompañamiento Oncológico  
> **Institución:** Hospital Dr. Gustavo Fricke (HGF) · Unidad de Gestión de Casos Oncológicos (UGCO)  
> **Asignatura:** CIN324 – Ingeniería de Requisitos · Entrega 1

---

## EL-01 — Entrevista semiestructurada en profundidad

- **Participante:** Gestora Oncológica de la Unidad de Gestión de Casos Oncológicos (UGCO) del HGF.
- **Fecha y modalidad:** 15 de septiembre de 2026, presencial.
- **Evidencia:** [Transcripción de la entrevista](../evidencia/Transcripcion_Entrevista_Oncologia.txt).

### Hallazgos

- **AS-01 — Fragmentación de resultados diagnósticos:** La consulta manual en distintos visores, como Pathology, LIS y PACS, puede demorar hasta 15 días la consolidación del diagnóstico inicial.

- **AS-02 — Sobrecarga en comités oncológicos:** La recopilación de antecedentes en documentos Word y el llenado manual de actas en papel consumen tiempo del equipo y aumentan el riesgo de omitir información.

- **AS-03 — Pérdida de trazabilidad en derivaciones externas:** El envío de derivaciones de radioterapia o quimioterapia al Hospital Carlos Van Buren mediante dossiers físicos dificulta confirmar su recepción y el agendamiento de la atención.

- **AS-05 — Registro local sin interoperabilidad con MINSAL:** La unidad utiliza una plataforma local que no se comunica con la Plataforma de Seguimiento Oncológico del MINSAL. Esto obliga a registrar información más de una vez y dificulta la evaluación estandarizada de la vulnerabilidad social y funcional.

- **AS-06 — Alta demanda espontánea en ventanilla:** Pacientes y cuidadores consultan directamente por el estado de sus exámenes y trámites. Se plantea incorporar canales de orientación y autoatención, como un tótem interactivo (TB-09) y un asistente virtual con triage (TB-10).

---

## EL-02 — Revisión documental y normativa

- **Participante:** Equipo de Ingeniería de Requisitos, mediante trabajo de gabinete.
- **Evidencia:** Revisión del marco regulatorio y de las directrices de la red asistencial pública chilena.

### Hallazgos

- **AS-04 — Control de plazos GES:** Los plazos del régimen GES permiten definir alertas preventivas cuando falten cinco días hábiles o menos para el vencimiento de una garantía, de acuerdo con el DS N° 29.

- **AS-05 — Seguimiento y apoyo continuo:** Se identifican criterios de acompañamiento integral y navegación clínica relacionados con la Ley Nacional del Cáncer N° 21.258.

- **AS-02 — Registro de comités:** La revisión de los formatos de acta y de las exigencias estadísticas respalda la digitalización del registro de las decisiones colegiadas y su vínculo con el REM 7 (TB-06 y TB-07).

---

## EL-03 — Revisión de manuales oficiales de la UGCO

- **Participantes:** Equipo de Ingeniería de Requisitos y contraparte técnica de la UGCO.
- **Evidencia:** Documentación entregada y validada por la Unidad:

  - Manual de Organización y Funcionamiento de la UGCO (versión 2.0).
  - Manual de Procedimientos de la UGCO (versión 2.0 final, octubre de 2026).
  - Manual de Gestión de Casos Oncológicos (GCO).
  - [Catastro de cambios para la adaptación al modelo UGCO](../evidencia/adaptación_modelo_UGCO.md).
  - [Comparación entre las versiones del Manual de Procedimientos](../evidencia/diferencias_manual_procedimientos_v2_vs_final.md).

### Hallazgos

- **Estructura organizacional:** La UGCO depende administrativamente de la Subdirección de Gestión del Cuidado (SDGC) y técnicamente de la Subdirección Médica (SDM). Su equipo incluye enfermera supervisora, gestores por especialidad, TENS y personal administrativo.

- **Trayectoria oncológica formal:** El Manual de Procedimientos establece ocho etapas:

  1. Sospecha.
  2. Confirmación diagnóstica.
  3. Etapificación.
  4. Tratamiento, con presentación previa al Comité Oncológico Regional.
  5. Rehabilitación.
  6. Cuidados paliativos y alivio del dolor.
  7. Seguimiento y sobrevivientes.
  8. Alta y contrarreferencia.

- **Patient Journey Map:** El mapa de experiencia representa el recorrido en seis etapas asistenciales y destaca cuatro momentos de mayor vulnerabilidad: comunicación del diagnóstico, etapificación, alta hospitalaria y término del tratamiento con retorno a la vida cotidiana. Este mapa complementa la trayectoria formal de ocho etapas; no la reemplaza.

- **Puntos de contacto obligatorio:** El gestor debe realizar seis intervenciones: al ingreso del caso, después de la confirmación diagnóstica, después de la resolución del comité, al alta de una hospitalización, al término del tratamiento activo y ante una derivación externa.

- **AS-03 — Derivaciones y reembolso de pasajes:** El TENS prepara el dossier y la UGAA realiza el despacho formal hacia la macrored, incluido el HCVB. Para derivaciones fuera de Viña del Mar, se indica entregar anticipadamente el instructivo de reembolso de pasajes del Anexo 6. El beneficio cubre locomoción pública y requiere certificados de asistencia sin enmiendas (TB-08).

- **AS-05 — Interoperabilidad con MINSAL:** La unidad cuenta con una plataforma local de registro, pero esta no se comunica con la Plataforma de Seguimiento Oncológico del MINSAL. La doble digitación y la falta de reporte nacional se registran como una brecha de interoperabilidad. Esta necesidad se recoge en TB-11 y RF-11; el mecanismo, los datos y la periodicidad de intercambio quedan sujetos al acuerdo entre el HGF y el MINSAL.

- **AS-04 y AS-02 — GES y REM 7:** La UGCO gestiona 21 problemas de salud oncológicos y asociados cubiertos por GES, según el DS N° 29 de 2025, y reporta la estadística de los comités en el REM 7 (TB-07).

---

## Síntesis de hallazgos y vínculos

| Nodo | Hallazgo principal | Vínculo identificado |
| :--- | :--- | :--- |
| **AS-01** | Dispersión de resultados diagnósticos | TB-01 y TB-05 |
| **AS-02** | Preparación manual de comités y actas | TB-06 y TB-07 |
| **AS-03** | Falta de seguimiento de derivaciones y orientación sobre pasajes | TB-08 |
| **AS-04** | Control manual de plazos GES | TB-04 |
| **AS-05** | Registro local fragmentado y sin interoperabilidad con MINSAL | TB-02, TB-03 y TB-04 cubren la valoración, la bitácora y las alertas. La integración con MINSAL se especifica en TB-11 y RF-11. |
| **AS-06** | Alta demanda espontánea en ventanilla | TB-09 y TB-10 |
