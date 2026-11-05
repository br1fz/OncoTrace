# Registro de Respuestas y Cambios Técnicos — Entrega 2
**Proyecto:** OncoTrace · CIN324 Ingeniería de Requisitos  
**Hospital Dr. Gustavo Fricke · Unidad de Gestión de Casos Oncológicos (UGCO)**  
**Fecha:** 5 de noviembre de 2026  
**Propósito:** Documentar las decisiones a las dudas planteadas y el detalle de los artefactos incorporados en el repositorio bajo la **Opción B (Cobertura exhaustiva sin advertencias)**.

---

## 1. Respuestas Oficiales a las «Dudas que necesito que me resuelvas»

### Duda 1 — Alcance de generación de código
* **Pregunta:** *¿Construimos solo las 4 historias con artefactos completos (HU-01, HU-04, HU-05, HU-08) o quieres que trabajemos alguna otra y me confirmas que agregarás su Gherkin, caso de uso y clases del dominio?*
* **Respuesta Oficial:** **Se construyen exclusivamente las cuatro historias de la Entrega 2: HU-01, HU-04, HU-05 y HU-08.**
* **Justificación técnica:** Las historias HU-02, HU-03, HU-06, HU-07, HU-09, HU-10 y HU-11 pertenecen al backlog global de la Entrega 1. La pauta académica y el alcance comprometido para la Entrega 2 delimitan la especificación detallada a estas cuatro historias prioritarias.

### Duda 2 — Nomenclatura de identificadores del proceso TO-BE
* **Pregunta:** *La documentación usa TB-xx en lugar de ACT-TOBE-xx. ¿Lo tomo como nomenclatura válida del equipo?*
* **Respuesta Oficial:** **Sí, confirmado. `TB-xx` (TB-01 a TB-10) es la nomenclatura canónica y formal aprobada.**
* **Justificación técnica:** Se utiliza de forma consistente en el BPMN 2.0 (`to-be.bpmn`), la especificación de rediseño (`02-rediseno-to-be.md`), los requisitos de producto (`03-requisitos.md`) y la matriz de trazabilidad (`12-trazabilidad.md`). Se descarta `ACT-TOBE-xx`.

### Duda 3 — Versiones antiguas y fuente de verdad
* **Pregunta:** *¿Confirmas que Documentos/ y diagramas/ son la fuente de verdad y que _backup/backup_entrega_1/ se ignora?*
* **Respuesta Oficial:** **Sí, confirmado. Las carpetas `Documentos/` y `diagramas/` constituyen la única fuente de verdad vigente del proyecto.**
* **Justificación técnica:** La carpeta `_backup/` contiene respaldos históricos congelados que no deben ser considerados. En cuanto a trazabilidad, `Documentos/12-trazabilidad.md` es la referencia activa que rige la Entrega 2.

### Duda 4 — Flujos de interacción y estados ausentes
* **Pregunta:** *¿Aceptas que la validación de historia reconstruya el flujo de interacción y, si aplica, el estado faltante, sin editar tus documentos?*
* **Respuesta Oficial:** Para no operar bajo supuestos y eliminar toda observación, **se implementó la Opción B**: se modelaron e integraron directamente en los archivos `.puml` y `.md` todos los diagramas de secuencia del sistema (DSS) y de estado (EST) faltantes.

---

## 2. Detalle de los Artefactos Incorporados (Opción B)

Se han añadido y sincronizado formalmente cuatro nuevos artefactos en el repositorio:

### A. Secuencias del Sistema (incorporados en `diagramas/diagramas-secuencia.puml` y `Documentos/10-diagramas-secuencia.md`)

1. **`DSS-03 · Dar seguimiento al caso oncológico — HU-01`**:
   - **Caso de uso:** CU-05.
   - **Actores:** Gestor/a UGCO, OncoTrace y Médico tratante.
   - **Flujo cubierto:** Consulta del caso con sus 8 etapas e hitos cronológicos con días transcurridos (`HU-01-ESC-01`).
   - **Variantes `alt`:**
     - Registro del inicio efectivo de tratamiento respaldado por resolución previa de comité, actualizando a etapa `Tratamiento` y reflejando en Kanban (`HU-01-ESC-02`).
     - Registro de resolución firmada de comité sin inicio de terapia, incorporándola como hito en `Etapificación` sin crear una etapa independiente (`HU-01-ESC-03`).

2. **`DSS-04 · Detección y gestión de alertas preventivas GES e inactividad — HU-04`**:
   - **Caso de uso:** CU-06.
   - **Actores y unidades:** OncoTrace (evaluador automático), Gestor/a UGCO y Unidad GES.
   - **Flujo cubierto:** Evaluación periódica en días hábiles (GES) y días corridos (inactividad).
   - **Variantes `alt`:**
     - Alerta preventiva por vencimiento GES $\le 5$ días hábiles (`HU-04-ESC-01`, `ESC-02`).
     - Alerta preventiva por inactividad $> 15$ días corridos (`HU-04-ESC-03`, `ESC-04`).
     - Transición a `En gestión` al registrar acción en bitácora (`HU-04-ESC-05`).
     - Transición a `Resuelta` al registrar hito de cumplimiento (`HU-04-ESC-06`).
     - Transición a `No aplica` por causa clínica/administrativa documentada (`HU-04-ESC-07`).

### B. Estados de Objetos (incorporados en `diagramas/estados-objetos.puml` y `Documentos/11-diagramas-estado.md`)

3. **`EST-03 · Ciclo de vida de CasoOncologico (Etapas asistenciales)`**:
   - **Clase del dominio:** `CasoOncologico`.
   - **Historia:** HU-01.
   - **Estados:** `Sospecha`, `Confirmación diagnóstica`, `Etapificación`, `Tratamiento`, `Rehabilitación`, `Cuidados paliativos y alivio del dolor`, `Seguimiento y sobrevivientes`, `Alta y contrarreferencia`.
   - **Reglas clave:** Formaliza que el comité es un hito de `Etapificación` y que el cambio a `Tratamiento` requiere el hito de inicio de terapia.

4. **`EST-04 · Ciclo de vida de EstudioDiagnostico (Recepción y validación)`**:
   - **Clase del dominio:** `EstudioDiagnostico`.
   - **Historia:** HU-05.
   - **Estados:** `Solicitado`, `Pendiente de validación`, `Observado por identificación`, `Incorporado`, `Incorporado con hallazgo crítico`.
   - **Reglas clave:** Modela las condiciones de `estadoValidacion` y `estadoRecepcion`, aislando discrepancias de RUN para auditoría (`HU-05-ESC-03`) y emitiendo avisos prioritarios ante malignidad (`HU-05-ESC-02`).

---

## 3. Actualización de la Matriz de Trazabilidad (`Documentos/12-trazabilidad.md`)

Con la incorporación de los nuevos diagramas, la cobertura de los cuatro requisitos funcionales centrales de la Entrega 2 queda completa al 100%:

| Requisito | Historia | Caso de uso | Secuencia | Estado | Clases del dominio cubiertas |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **RF-01** (Tablero y etapas) | **HU-01** | CU-05 | **DSS-03** | **EST-03** | `Paciente`, `CasoOncologico`, `HitoAsistencial`, `ResolucionComite` |
| **RF-04** (Alertas GES e inactividad) | **HU-04** | CU-06 | **DSS-04** | **EST-01** | `CasoOncologico`, `GarantiaGES`, `AlertaSeguimiento`, `HitoAsistencial` |
| **RF-05** (Exámenes y alertas) | **HU-05** | CU-01, CU-02 | **DSS-01** | **EST-04** | `CasoOncologico`, `OrdenExamen`, `EstudioDiagnostico` |
| **RF-08** (Derivaciones y reembolso) | **HU-08** | CU-03, CU-04, CU-06, CU-07, CU-08, CU-09 | **DSS-02** | **EST-01, EST-02** | `CasoOncologico`, `ResolucionComite`, `DossierDigitalDerivacion`, `EstudioDiagnostico`, `InstructivoReembolsoPasajes`, `ContraReferenciaEpicrisis`, `AlertaSeguimiento`, `HitoAsistencial` |

---

## 4. Estado de las Observaciones de Contexto

* **Punto 5 (Imagen del AS-IS):** El proceso actual está rigurosamente modelado en notación estándar BPMN 2.0 en `diagramas/as-is.bpmn` (10 carriles que representan las unidades del HGF). Constituye la fuente canónica e integrable del negocio.
* **Punto 6 (Fuentes de trazabilidad):** Queda formalmente ratificado que `Documentos/12-trazabilidad.md` es la única matriz vigente para la Entrega 2, mientras que `07-matriz-trazabilidad.md` se conserva como histórico de la Entrega 1.
