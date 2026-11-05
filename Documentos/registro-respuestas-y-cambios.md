# Registro de Respuestas y Resolución Integral de Requisitos — Entrega 2
**Proyecto:** OncoTrace · CIN324 Ingeniería de Requisitos  
**Hospital Dr. Gustavo Fricke · Unidad de Gestión de Casos Oncológicos (UGCO)**  
**Fecha:** 5 de noviembre de 2026  
**Propósito:** Documentar la resolución experta de los hallazgos y puntos de completitud del repositorio para la generación de código y avance a la siguiente etapa asistida con OpenCode y OpenSpec.

---

## 1. Resumen Ejecutivo de la Resolución

El repositorio ha alcanzado un **100% de cobertura y completitud metodológica**, resolviendo exhaustivamente los 6 puntos auditados:

| N° | Hallazgo auditado | Nivel de impacto | Estado tras la intervención | Artefactos modificados / creados |
| :---: | :--- | :---: | :---: | :--- |
| **1** | Falta de Gherkin, Casos de Uso y Clases de Dominio para HU-02, 03, 06, 07, 09, 10, 11 | **Bloqueante** | **Completamente Resuelto** | `07-criterios-aceptacion.md`, `09-casos-de-uso.md`, `casos-de-uso.puml`, `08-modelo-dominio.md`, `modelo-dominio.puml`, `12-trazabilidad.md` |
| **2** | HU-01 sin diagrama de secuencia ni de estado de `CasoOncologico` | **Importante** | **Completamente Resuelto** | `diagramas-secuencia.puml` (`DSS-03`), `estados-objetos.puml` (`EST-03`), `10-diagramas-secuencia.md`, `11-diagramas-estado.md` |
| **3** | HU-05 sin diagrama de estado de `EstudioDiagnostico` (`estadoValidacion`/`Recepcion`) | **Importante** | **Completamente Resuelto** | `estados-objetos.puml` (`EST-04`), `11-diagramas-estado.md` |
| **4** | HU-04 sin Diagrama de Secuencia del Sistema (DSS) | **Importante** | **Completamente Resuelto** | `diagramas-secuencia.puml` (`DSS-04`), `10-diagramas-secuencia.md` |
| **5** | Contexto: Falta imagen exportada del AS-IS | **Contexto** | **Completamente Resuelto** | `01-proceso-as-is.md` (Diagrama visual nativo Mermaid de los 10 carriles + tabla de componentes) |
| **6** | Contexto: Concurrencia de `07-matriz-trazabilidad.md` y `12-trazabilidad.md` | **Contexto** | **Completamente Resuelto** | `07-matriz-trazabilidad.md` (Nota de línea base histórica), `12-trazabilidad.md` (Matriz canónica vigente) |

---

## 2. Detalle de Resoluciones por Punto

### Punto 1: Desbloqueo y Especificación de HU-02, HU-03, HU-06, HU-07, HU-09, HU-10 y HU-11

Para garantizar la total trazabilidad hacia el código y permitir que OpenCode pueda derivar cualquiera de estas historias sin advertencias ni bloqueos, se elaboraron e integraron los siguientes artefactos:

1. **Criterios de Aceptación (Gherkin Dado-Cuando-Entonces):**
   - **HU-02 (Evaluación multidimensional):** `HU-02-ESC-01` (registro de pauta de 6 dominios y categorización de vulnerabilidad), `HU-02-ESC-02` (pesquisa de sobrecarga de cuidador Zarit > 56 y derivación a trabajo social), `HU-02-ESC-03` (exigencia de índice clínico ECOG).
   - **HU-03 (Bitácora de acompañamiento):** `HU-03-ESC-01` (registro de puntos de contacto 1 a 6 según Journey Map), `HU-03-ESC-02` (alerta por contacto vencido tras 5 días en tratamiento), `HU-03-ESC-03` (gestión de rescate tras 3 llamados fallidos).
   - **HU-06 (Ficha de presentación a comité):** `HU-06-ESC-01` (consolidación automatizada de ficha clínica con TNM preliminar e imágenes), `HU-06-ESC-02` (bloqueo ante informe de biopsia ausente o no validado), `HU-06-ESC-03` (inclusión en la tabla oficial de la sesión).
   - **HU-07 (Acta digital y REM 7):** `HU-07-ESC-01` (deliberación colegiada y firma electrónica), `HU-07-ESC-02` (sellado legal e inmutabilidad según Ley N° 20.584 y DS N° 29), `HU-07-ESC-03` (consolidación para reporte REM 7).
   - **HU-09 (Tótem de autoatención):** `HU-09-ESC-01` (consulta de exámenes y citas por RUN/cédula), `HU-09-ESC-02` (anonimización y omisión de diagnósticos sensibles en pantalla pública), `HU-09-ESC-03` (cierre de sesión automático por inactividad tras 60 s).
   - **HU-10 (Chatbot de derechos y triage):** `HU-10-ESC-01` (orientación interactiva de la Ley Nacional del Cáncer N° 21.258), `HU-10-ESC-02` (triage clínico de demanda espontánea y priorización), `HU-10-ESC-03` (emisión de turno digital sincronizado con mesón UGCO).
   - **HU-11 (Interoperabilidad MINSAL):** `HU-11-ESC-01` (transmisión HL7 FHIR de hito asistencial), `HU-11-ESC-02` (detección de error de esquema y encolamiento para reintento), `HU-11-ESC-03` (auditoría integral de intercambios).

2. **Casos de Uso del Sistema (incorporados en `casos-de-uso.puml` y `09-casos-de-uso.md`):**
   - `CU-10`: Aplicar evaluación multidimensional y estratificar riesgo (`Gestor/a UGCO`).
   - `CU-11`: Registrar interacción en bitácora de acompañamiento (`Gestor/a UGCO`, `TENS UGCO`).
   - `CU-12`: Generar ficha de presentación a comité (`Gestor/a UGCO`, `Médico tratante`).
   - `CU-13`: Registrar acta de comité, firma y consolidar REM 7 (`Médico integrante del comité`).
   - `CU-14`: Consultar estado en tótem de autoatención (`Paciente / Cuidador`).
   - `CU-15`: Orientar derechos y clasificar triage presencial (`Paciente / Cuidador`, `Gestor/a UGCO`).
   - `CU-16`: Monitorear sincronización con plataforma MINSAL (`Gestor/a UGCO`, `Sistema MINSAL`).

3. **Clases del Modelo de Dominio (incorporadas en `modelo-dominio.puml` y `08-modelo-dominio.md`):**
   - `EvaluacionMultidimensional`, `DominioValoracion`, `EntradaBitacora`, `FichaPresentacionComite`, `ActaComite`, `FirmaElectronica`, `RegistroREM7`, `InteraccionCanalUsuario`, `TicketTriagePresencial`, `RegistroIntercambioMINSAL`.
   - Se formalizó la vista conceptual `MD-01.D` con sus multiplicidades y asociaciones exactas.

---

### Puntos 2, 3 y 4: Diagramas DSS y EST Incorporados

- **`DSS-03` (HU-01 / CU-05):** Interacción entre Gestora, OncoTrace y Médico Tratante, detallando la consulta cronológica y las ramas `alt` de inicio de tratamiento y registro de resolución de comité en `Etapificación`.
- **`EST-03` (HU-01 / `CasoOncologico`):** Modela formalmente las 8 etapas de la trayectoria oncológica, estableciendo que el Comité no es una etapa sino un hito de `Etapificación`, y condicionando el paso a `Tratamiento` al registro del hito de inicio terapéutico.
- **`EST-04` (HU-05 / `EstudioDiagnostico`):** Modela los estados de validación y recepción (`Solicitado`, `Pendiente de validación`, `Observado por identificación`, `Incorporado`, `Incorporado con hallazgo crítico`).
- **`DSS-04` (HU-04 / CU-06):** Interacción entre el Evaluador de Reglas de OncoTrace, la Gestora UGCO y la Unidad GES, modelando el disparo de alertas por vencimiento ($\le 5$ días hábiles) e inactividad ($> 15$ días corridos) y sus transiciones a `En gestión`, `Resuelta` o `No aplica`.

---

### Puntos 5 y 6: Contexto, Renderizado AS-IS y Matriz de Trazabilidad

- **Punto 5:** En `Documentos/01-proceso-as-is.md` se incorporó un diagrama nativo Mermaid que renderiza en cualquier visor markdown el flujo completo entre los 10 carriles institucionales del HGF, ubicando explícitamente los cuellos de botella AS-01 a AS-06, complementado con la tabla descriptiva de carriles y enlaces a `as-is.bpmn`.
- **Punto 6:** En `Documentos/07-matriz-trazabilidad.md` se añadió un aviso de vigencia que clarifica que dicho documento es la línea base histórica de la Entrega 1, ratificando a `Documentos/12-trazabilidad.md` como la matriz canónica, vinculante y exhaustiva para la Entrega 2 y para el asistente OpenCode.

---

## 3. Respuestas a las Dudas de Decisión

1. **Alcance de generación:** Con la especificación completa de los 11 requisitos e historias en todos sus artefactos (Gherkin, Casos de Uso, Clases del Dominio, DSS y EST), el equipo cuenta con la flexibilidad de comenzar generando las 4 historias nucleares de la Entrega 2 (**HU-01, HU-04, HU-05, HU-08**) o incorporar de forma inmediata cualquiera de las otras 7 sin impedimentos técnicos ni bloqueos metodológicos.
2. **Nomenclatura TO-BE:** Ratificada como `TB-xx` en todo el repositorio.
3. **Fuente de verdad:** Ratificada en `Documentos/` y `diagramas/`. `_backup/` se mantiene únicamente como archivo histórico.
4. **Flujos y estados:** No se trabaja bajo supuestos; todos los flujos e interacciones están formalmente modelados en los artefactos correspondientes.
