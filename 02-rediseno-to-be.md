# Rediseño Propuesto del Proceso (TO-BE) – Plataforma OncoTrace

## 1. Visión y Objetivos del Rediseño

El rediseño del proceso oncológico en el Hospital Dr. Gustavo Fricke mediante la plataforma **OncoTrace** tiene como propósito empoderar a las **Gestoras y Gestores Oncológicos** con una herramienta digital integral de trazabilidad activa, evaluación multidimensional, comités inteligentes y acompañamiento clínico-asistencial.

```
       ┌─────────────────────────────────────────────────────────────────────────┐
       │                 OBJETIVOS ESTRATÉGICOS DEL REDISEÑO                     │
       └────────────────────────────────────┬────────────────────────────────────┘
                                            │
         ┌───────────────────┬──────────────┴────────┬───────────────────┐
         ▼                   ▼                       ▼                   ▼
┌─────────────────┐ ┌─────────────────┐     ┌─────────────────┐ ┌─────────────────┐
│  Trazabilidad   │ │   Evaluación    │     │   Acompañamiento│ │  Optimización   │
│  Integral 360°  │ │ Multidimensional│     │    Proactivo    │ │   de Comités    │
│  (Cero pérdidas │ │ (Clínica/Social │     │  (Bitácora y    │ │  (Consolidación │
│  de pacientes)  │ │ y Red de Apoyo) │     │ Alertas Riesgo) │ │  Automatizada)  │
└─────────────────┘ └─────────────────┘     └─────────────────┘ └─────────────────┘
```

---

## 2. Comparativa de Roles: AS-IS vs. TO-BE

| Rol / Actor | Situación AS-IS (Actual) | Situación TO-BE (Con OncoTrace) |
|-------------|--------------------------|---------------------------------|
| **Gestor/a Oncológico/a** | Búsqueda manual de exámenes en múltiples sistemas, registros en planillas Excel personales, seguimiento reactivo. | **Centro de control unificado:** Tablero Kanban de pacientes por hito, consolidación automática de exámenes, alertas de plazos GES y bitácora estructurada de acompañamiento. |
| **Comité Oncológico** | Discusión de casos con antecedentes en papel o fichas Word elaboradas manualmente; actas físicas digitadas a posteriori. | **Comité Digital:** Ficha estructurada generada automáticamente con biopsias e imágenes, registro de resoluciones en tiempo real con firma digital. |
| **Médico Tratante** | Desconocimiento de fechas de comités o resultados emitidos en otros servicios sin revisar ficha por ficha. | Acceso inmediato a la línea de tiempo oncológica del paciente y acuerdos del comité en la plataforma. |
| **Secretaría Oncológica** | Llamadas manuales sin registro centralizado, citaciones descoordinadas. | Agenda integrada en plataforma con registro de confirmaciones y coordinación directa con la gestora. |
| **Derivaciones Externas (Van Buren / Privados)** | Punto ciego institucional; envío de papeles sin retorno sistematizado de información. | Módulo de seguimiento de derivaciones con registro de hitos (recepción, inicio de RT/QT, recepción de PET-CT/EBUS). |

---

## 3. Pilares Funcionales del Proceso TO-BE

### Pilar 1: Tablero de Trazabilidad y Timeline Oncológico
- **Flujo visual:** Cada paciente avanza por etapas estandarizadas: *Sospecha ➔ Estudios Diagnósticos ➔ En Comité ➔ Resolución / Programación ➔ En Tratamiento (HGF / Van Buren) ➔ Seguimiento*.
- **Semáforo de plazos:** Alertas visuales basadas en días transcurridos y plazos máximos normados (Garantías Explícitas en Salud - GES).

### Pilar 2: Evaluación Multidimensional y Estratificación
- **Ficha Integral del Paciente:** Evaluación clínica (estadio, comorbilidades), funcional (ECOG / Karnofsky), psicológica y socioeconómica (distancia al hospital, red de cuidado, vulnerabilidad).
- **Priorización Inteligente:** Identificación de pacientes con alto riesgo de abandono o mayor necesidad de asistencia social y navegación.

### Pilar 3: Acompañamiento Activo y Bitácora Asistencial
- **Bitácora Cronológica:** Registro de cada intervención, llamada de seguimiento, requerimientos de apoyo (transporte, farmacia, psico-oncología) y novedades reportadas por el paciente/familia.
- **Alertas de Deserción:** Si un paciente no asiste a una cita o no registra avances en 15 días, el sistema genera una alerta prioritaria para la gestora.

### Pilar 4: Gestión Inteligente de Comités Oncológicos
- **Consolidación Automática:** OncoTrace extrae automáticamente los informes validados de anatomía patológica (biopsias) y radiología (TAC/RNM) asociados al RUN del paciente.
- **Acta de Comité Digital:** Durante la sesión, el secretario/médico registra el acuerdo clínico en OncoTrace, emitiendo el acta oficial inmediatamente disponible para el equipo.

### Pilar 5: Trazabilidad de Derivaciones Externas
- **Monitoreo Van Buren:** Registro del envío de interconsulta a radioterapia/quimioterapia, fecha de primera consulta en HCVB e inicio de tratamiento.
- **Integración de Servicios Comprados:** Registro de órdenes de PET-CT/EBUS en clínicas privadas y carga centralizada de informes digitales.

---

## 4. Matriz de Transformación de Actividades

| Actividad AS-IS | Tipo AS-IS | Actividad TO-BE Rediseñada | Tipo TO-BE | Impacto / Beneficio Obtenido |
|-----------------|------------|----------------------------|------------|------------------------------|
| Búsqueda manual de biopsias e imágenes en sistemas aislados | Manual Task | Consolidación y notificación automática de exámenes en ficha OncoTrace | Service Task | Reducción de 15 días a 0 días de latencia en detección de resultados. |
| Elaboración manual de resumen de caso para comité | Manual Task | Generación automática de Ficha de Presentación a Comité | Service Task / User Task | Ahorro del 80% del tiempo de preparación previa al comité. |
| Registro de acta de comité en papel | Manual Task | Registro digital en línea del acuerdo y conducta terapéutica | User Task | Acta disponible inmediatamente en la ficha para todo el equipo. |
| Envío de interconsulta física a HCVB sin seguimiento | Manual Task | Registro y seguimiento de hito de derivación externa en plataforma | User Task | Eliminación de puntos ciegos en radioterapia y quimioterapia externa. |
| Seguimiento reactivo y disperso del paciente | Manual Task | Gestión activa con bitácora clínica y alertas preventivas de abandono | User Task | Acompañamiento continuo y reducción del abandono de tratamiento. |
| Control manual de plazos en planillas Excel | Manual Task | Tablero semaforizado con alertas de vencimiento de garantías GES | Service Task | Cero incumplimientos de plazos por desatención o extravío de datos. |
