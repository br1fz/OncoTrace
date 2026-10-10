# 📋 Minuta de Actualización v2: Modelo TO-BE y Consistencia Documental

> **Proyecto:** OncoTrace – Plataforma de Trazabilidad, Gestión, Evaluación y Acompañamiento Oncológico  
> **Institución:** Hospital Dr. Gustavo Fricke (HGF) – Unidad de Gestión de Casos Oncológicos (UGCO)  
> **Asignatura:** CIN324 – Ingeniería de Requisitos | Entrega 1  
> **Fecha:** 10 de Octubre de 2026  
> **Estado:** Aprobado y Validado (BPMN 2.0 + Documentación Técnica Sincronizada)

---

## 🎯 1. Resumen Ejecutivo

El presente documento registra la refactorización y actualización mayor (versión 2.0) del modelo de procesos de negocio rediseñado (**TO-BE**) y su armonización con el ecosistema documental de la Entrega 1 del proyecto **OncoTrace**.

Esta iteración tuvo como objetivo principal eliminar inconsistencias entre la especificación de requisitos, las historias de usuario y el diagrama BPMN 2.0 (`diagramas/to-be.bpmn`), garantizando el cumplimiento normativo (Ley N° 21.258, Ley N° 20.584, Decreto Supremo N° 29), la compatibilidad con herramientas de modelado de la industria (**Camunda Modeler**) y una trazabilidad bidireccional estricta sin nodos huérfanos.

---

## 🔄 2. Detalle de Cambios en el Proceso BPMN 2.0 (`to-be.bpmn`)

El archivo [`diagramas/to-be.bpmn`](../diagramas/to-be.bpmn) fue refactorizado y validado estructuralmente bajo los siguientes puntos clave:

| Aspecto / Cambio | Descripción Técnica y Justificación | Impacto en el Modelo |
| :--- | :--- | :--- |
| **Eliminación de vestigio TB-11** | La tarea de sincronización ministerial fue renombrada explícitamente como `Sincronización bidireccional con Plataforma MINSAL (RNF-04 – Interoperabilidad Hospitalaria)`. Se elimina como actividad funcional de usuario y se define como requerimiento no funcional transversal. | Cumplimiento del límite normado de 10 actividades rediseñadas (**TB-01 a TB-10**). |
| **Etiquetado formal TB-01 a TB-10** | Se incorporó el prefijo del código entre corchetes en el atributo `name` de cada una de las 10 actividades funcionales clave. | Identificación inmediata de tareas en visualizadores y motores BPMN. |
| **Modelado de Demanda Espontánea (AS-06 ➔ TB-09)** | Nuevo evento de inicio `TB_Start_ConsultaPresencial` en el carril del Paciente/Cuidador, conduciendo a `[TB-09] Autoatención en Tótem de Sala de Espera` con validación de RUN/Cédula y compuerta de evaluación `TB_GW_TipoUrgencia`. | Resuelve la saturación de mesón sin vulnerar la confidencialidad de datos sensibles. |
| **Triage Asistencial y Asistente Virtual (AS-06 ➔ TB-10)** | Rama de atención: `[TB-10] Asistente Virtual OncoTrace orienta derechos Ley N° 21.258 y emite ticket de triage priorizado`, conectando directamente como tarea priorizada a la Unidad GES / Gestora. Rama informativa: finaliza en `TB_End_TicketEmitido` sin interrumpir al equipo clínico. | Descongestión del mesón asistencial y priorización de urgencias clínicas. |
| **Incorporación de Etapa 6: Rehabilitación** | Tras la finalización del tratamiento oncológico, se agregó la tarea de usuario `TB_Task_DerivarRehabilitacion` en el carril de la Gestora para derivación al equipo multidisciplinario (psicosocial, fonoaudiología, kinesiología, terapia ocupacional). | Cobertura integral de la sexta etapa asistencial reglamentaria. |
| **Incorporación de Etapa 7: Seguimiento Activo** | Se modeló la concurrencia post-rehabilitación entre controles médicos de vigilancia (`TB_Task_ControlSeguimiento`) y las tareas activas de contactabilidad del TENS (`TB_Task_TENS_Contactabilidad`), garantizando el cumplimiento de los puntos de contacto PC-5 y PC-6. | Cierre del ciclo de acompañamiento y vigilancia oncológica. |
| **Circuito de Retorno HCVB (Contrarreferencia Externa)** | La derivación externa a la macrored (Hospital Carlos Van Buren) ya no finaliza en un evento de término aislado. Se incorporó el flujo de mensaje `MF_TB_ContraRefHCVB` (`Pool_HCVB_TB` ➔ `TB_Task_RecibirContraRefExt`) con recepción de epicrisis clínica, reincorporando al paciente a la Etapa 7 (Seguimiento). | Supresión de puntos ciegos en la red asistencial de radioterapia/quimioterapia. |
| **Etapa 8: Alta y Cierre Formal** | Tarea `TB_Task_ContraRefCierre` que registra el cierre administrativo y clínico en el Tablero Kanban y consolida la contrarreferencia a APS o derivación a cuidados paliativos, culminando en `TB_End_Tratamiento`. | Formalización del fin de la trayectoria asistencial. |
| **Corrección de Duplicidad de IDs XML** | Se detectó que `TB_Task_GES_Validar` presentaba dos definiciones `<bpmn:userTask>` en el archivo. Se consolidó en una única definición con dos entradas (`TB_Flow_11` y `TB_Flow_TicketToGestor`) y una salida (`TB_Flow_12`). | **0 IDs duplicados** y **0 referencias rotas** en el XML (100% compliant con Camunda Modeler 5.x). |

---

## 📚 3. Armonización en la Documentación del Repositorio

Para evitar discrepancias entre el diagrama de procesos y las especificaciones de ingeniería de software, se ejecutaron sincronizaciones transversales:

### A. [`01-proceso-as-is.md`](../01-proceso-as-is.md)
- Validación de los 6 nodos críticos (**AS-01 a AS-06**) y su correspondencia con los roles institucionales del Hospital Dr. Gustavo Fricke (SDGC, SDM, UGCO, TENS, UGAA, UGDA y Comité).
- Consolidación de la secuencia de 8 etapas de la trayectoria asistencial.

### B. [`02-rediseno-to-be.md`](../02-rediseno-to-be.md)
- Tabla de iniciativas y heurísticas alineada exactamente a las 10 actividades rediseñadas (**TB-01 a TB-10**).
- Incorporación del impacto en el *Cuadrángulo del Diablo* (Tiempo, Calidad, Costo, Flexibilidad) para cada iniciativa.

### C. [`03-requisitos.md`](../03-requisitos.md)
- Estandarización de 10 Requisitos Funcionales (**RF-01 a RF-10**), vinculados biunívocamente con **TB-01 a TB-10**.
- Estandarización de 4 Requisitos No Funcionales (**RNF-01 a RNF-04** bajo norma ISO/IEC 25010) y 1 Requisito Derivado (**REQ-DER-01** - Single Sign-On institucional con Directorio Activo).

### D. [`04-historias-usuario.md`](../04-historias-usuario.md)
- 10 Historias de Usuario estructuradas con formato ágil (*Como... Quiero... Para...*).
- Criterios de Aceptación comprobables (*Dado... Cuando... Entonces...* / Reglas de negocio) vinculados a los RF y RNF.

### E. [`06-atributos-calidad.md`](../06-atributos-calidad.md)
- Escenarios de arquitectura SEI actualizados para medir Seguridad (**AC-01**), Fiabilidad (**AC-02**) y Desempeño (**AC-03**).

### F. [`07-matriz-trazabilidad.md`](../07-matriz-trazabilidad.md)
- Matriz Maestra de Trazabilidad End-to-End actualizada que unifica la cadena:
  $$\text{AS-IS (01-06)} \longrightarrow \text{Elicitación (01-03)} \longrightarrow \text{TO-BE (01-10)} \longrightarrow \text{Requisitos (RF/RNF)} \longrightarrow \text{Historias (HU-01-10)} \longrightarrow \text{Criterios (CA)} \longrightarrow \text{Calidad (AC)}$$

### G. [`IngReq-Entrega 1.md`](../IngReq-Entrega%201.md) y [`README.md`](../README.md)
- Corrección de la descripción del problema **AS-05** (*Registro Fragmentado y Falta de Bitácora Estandarizada*).
- Corrección de la lista de 8 etapas para incluir explícitamente la etapa de **Comité Oncológico (Etapa 4)** antes del inicio de tratamiento.

---

## 📊 4. Matriz Resumen de Consistencia del Ecosistema OncoTrace

| ID AS-IS | Problema Operativo AS-IS | Actividad TO-BE | Requisito Producto | Historia Usuario | Criterios Aceptación | Atributo Calidad / Verificación |
| :---: | :--- | :---: | :---: | :---: | :---: | :---: |
| **AS-01** | Dispersión de Diagnósticos (LIS/PACS/Papel) | **TB-01, TB-05** | `RF-01, RF-05, RNF-02, RNF-04` | **HU-01, HU-05** | HU-01-CA1..6<br>HU-05-CA1..6 | **AC-03** (Tiempo de respuesta $\le 2.0$s)<br>HL7 FHIR / API REST |
| **AS-02** | Gestión Manual de Comités (Word/Papel) | **TB-06, TB-07** | `RF-06, RF-07, RNF-03, REQ-DER-01` | **HU-06, HU-07** | HU-06-CA1..5<br>HU-07-CA1..5 | **AC-01** (Auditoría 100% de accesos)<br>SSO Directorio Activo HGF |
| **AS-03** | Pérdida de Trazabilidad en Derivaciones (HCVB) | **TB-08** | `RF-08, RNF-01` | **HU-08** | HU-08-CA1..5 | **AC-02** (Fiabilidad RTO $\le 5$ min)<br>Retorno de epicrisis al Seguimiento |
| **AS-04** | Monitoreo Manual de Plazos GES (Riesgo legal) | **TB-01, TB-04** | `RF-01, RF-04, RNF-01` | **HU-01, HU-04** | HU-01-CA2,4<br>HU-04-CA1..7 | **AC-02** (Disponibilidad $\ge 99.5\%$)<br>Alertas $\le 5$ días hábiles (DS N° 29) |
| **AS-05** | Registro Fragmentado y Falta de Bitácora | **TB-02, TB-03, TB-04** | `RF-02, RF-03, RF-04, RNF-03` | **HU-02, HU-03, HU-04** | HU-02-CA1..7<br>HU-03-CA1..6<br>HU-04-CA3 | Inmutabilidad de registros<br>Escala ECOG (0-4)<br>6 Puntos de contacto normados |
| **AS-06** | Interrupción por Demanda Espontánea (Mesón) | **TB-09, TB-10** | `RF-09, RF-10` | **HU-09, HU-10** | HU-09-CA1..4<br>HU-10-CA1..4 | Autenticación RUN / Cédula<br>Ley N° 20.584 y Ley N° 21.258<br>Triage por priorización clínica |

---

## 🗃️ 5. Historial de Commits Relacionados

1. `7e1417b`: `docs: sincronizar nomenclatura de requisitos (RF/RNF) y consolidar matriz maestra de trazabilidad`
2. `ced52b1`: `bpmn: refactorizar to-be.bpmn - agregar TB-09/10, Rehabilitacion, Seguimiento, retorno HCVB, etiquetar TB-01 a TB-10, eliminar TB-11`
3. `d4298fb`: `fix(bpmn): consolidar definicion unica de TB_Task_GES_Validar eliminando ID duplicado`
4. `3bfe0ab`: `docs: alinear 8 etapas asistenciales y definicion de AS-05 en README y documento maestro de Entrega 1`

---
*Fin del documento de actualización v2.*
