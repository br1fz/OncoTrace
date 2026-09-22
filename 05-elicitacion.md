# Registro de Elicitación y Análisis de Necesidades – OncoTrace

**CIN324 – Ingeniería de Requisitos | Entrega 1**  
*Hospital Dr. Gustavo Fricke (HGF) – Servicio de Gestión Oncológica*

---

## 1. Técnicas de Elicitación Aplicadas

Para el levantamiento y refinamiento de los requisitos de OncoTrace se aplicaron tres técnicas complementarias:

1. **Entrevista Semiestructurada en Profundidad:**
   - **Informante Clave:** Gestora Oncológica, Servicio de Gestión Oncológica HGF.
   - **Objetivo:** Comprender la rutina operativa, la navegación del paciente, la preparación de comités, la gestión de derivaciones y las causas de pérdida de información.
2. **Análisis de Artefactos y Documentación Normativa:**
   - Revisión de normativas GES (Garantías Explícitas en Salud, Ley N° 19.966) y Ley Nacional del Cáncer N° 21.258.
   - Análisis de formatos actuales de Fichas de Comité, actas de acuerdos y planillas de control de derivaciones.
3. **Mapeo de Procesos y Detección de Cuellos de Botella:**
   - Construcción del diagrama de flujo AS-IS para identificar demoras, tareas redundantes y pérdida de trazabilidad entre prestadores.

---

## 2. Síntesis de Hallazgos y Necesidades del Usuario

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                    HALLAZGOS CLAVE DE LA ELICITACIÓN                         │
└──────────────────────────────────────┬───────────────────────────────────────┘
                                       │
         ┌─────────────────────────────┼─────────────────────────────┐
         ▼                             ▼                             ▼
┌──────────────────┐          ┌──────────────────┐          ┌──────────────────┐
│ Dispersión de    │          │ Sobrecarga en    │          │ Pérdida de       │
│ Resultados       │          │ Comités          │          │ Trazabilidad     │
│ (Búsqueda manual │          │ (Elaboración en  │          │ (Derivaciones a  │
│ en múltiples LIS)│          │ papel y retrasos)│          │ Van Buren / Priv)│
└──────────────────┘          └──────────────────┘          └──────────────────┘
```

### Hallazgo 1: Búsqueda Manual Extenuante de Exámenes
- **Evidencia:** La gestora debe consultar diariamente y de forma independiente los sistemas de Laboratorio, Anatomía Patológica e Imagenología.
- **Necesidad Elicitada:** Consolidación automática de informes en la ficha de OncoTrace con notificaciones cuando una biopsia o TAC esté disponible.

### Hallazgo 2: Falta de Evaluación y Acompañamiento Sistemático
- **Evidencia:** El acompañamiento al paciente se realiza mediante notas informales o memoria de la gestora, sin un registro estructurado del estado psicosocial, comorbilidades y dificultades de transporte.
- **Necesidad Elicitada:** Módulo de evaluación multidimensional (ECOG, riesgo social) y bitácora clínica-asistencial con alertas de inactividad.

### Hallazgo 3: Gestión Manual de Comités Oncológicos
- **Evidencia:** La preparación del resumen del paciente para el comité toma horas de digitación manual en Word, y las resoluciones se redactan en papel antes de transcribirse.
- **Necesidad Elicitada:** Generación automática de la ficha de presentación a comité y registro digital de resoluciones en tiempo real.

### Hallazgo 4: Punto Ciego en Derivaciones Externas
- **Evidencia:** Las derivaciones a radioterapia o quimioterapia al Hospital Carlos Van Buren se envían por interconsulta física, sin conocimiento del avance del tratamiento.
- **Necesidad Elicitada:** Módulo de seguimiento de derivaciones con registro de hitos de confirmación, inicio y término de tratamiento externo.

---

## 3. Matriz de Trazabilidad: Hallazgo ➔ Requisito ➔ Historia de Usuario

| Hallazgo Elicitado | Requisito Funcional Asociado | Historia de Usuario |
|--------------------|------------------------------|---------------------|
| Dispersión y demora en búsqueda de biopsias e imágenes | **RF-05** Consolidación Automatizada de Informes | **HU-05** Consolidación de Biopsias |
| Preparación manual y lenta de comités oncológicos | **RF-06** / **RF-07** Gestión y Actas de Comité | **HU-06** Ficha Comité / **HU-07** Acta Digital |
| Desconocimiento del estado y plazos de cada paciente | **RF-01** Tablero Trazabilidad / **RF-04** Alertas GES | **HU-01** Tablero Kanban / **HU-04** Alertas GES |
| Falta de registro de la situación social y acompañamiento | **RF-02** Evaluación Multidimensional / **RF-03** Bitácora | **HU-02** Evaluación / **HU-03** Bitácora |
| Desconexión con Hospital Van Buren y compras de PET-CT | **RF-08** Trazabilidad Derivaciones Externas | **HU-08** Derivaciones Externas |
