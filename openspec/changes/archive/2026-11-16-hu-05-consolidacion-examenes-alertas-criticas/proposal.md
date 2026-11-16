# Proposal — Consolidación e indexación automática de biopsias y PACS con alertas críticas (HU-05)

## Why

En el proceso asistencial actual (AS-IS), la Unidad de Gestión de Casos Oncológicos (UGCO) y el equipo médico enfrentan una severa fragmentación de los resultados diagnósticos (AS-01): los informes de biopsias emitidos por Anatomía Patológica (LIS), los análisis de laboratorio y los estudios radiológicos (PACS) deben consultarse de forma manual en plataformas aisladas o buscarse físicamente en carpetas en papel. Esta dispersión genera demoras críticas en la preparación de las tablas de comités oncológicos, riesgo de extravío o traspapeleo de resultados, y retrasos en la toma de decisiones terapéuticas urgentes.

HU-05 implementa la actividad **TB-05** del TO-BE («Consolidación automática de exámenes y alertas críticas») y los casos de uso **CU-01** («Consolidar y consultar informes diagnósticos») y **CU-02** («Recibir avisos de hallazgos críticos», `<<extend>>` CU-01). Permite que el sistema indexe automáticamente los informes validados por RUN desde LIS y PACS simulados, verifique el avance porcentual de completitud diagnóstica, habilite la visualización integrada de copias en PDF, admita la carga en PDF de informes de compras de servicios externos (ej. PET-CT o EBUS) y genere una alerta de seguimiento gestionable de tipo «Hallazgo crítico» ante diagnósticos histopatológicos de malignidad o valores críticos.

## What Changes

- **Nueva capacidad `examenes-diagnosticos`:**
  - Consulta e indexación automatizada de informes validados desde LIS (laboratorio y biopsias) y PACS (radiología e imágenes) mediante RUN unívoco del paciente (HU-05-ESC-01).
  - Indicador derivado de completitud diagnóstica del caso: *exámenes con informe incorporado ÷ exámenes solicitados × 100*, visible tanto en la ficha del caso como en la tarjeta del tablero Kanban (HU-05-CA3 / ESC-01 / ESC-05).
  - Detección de informes pendientes de validación en los sistemas de origen: OncoTrace no los incorpora como validados ni computa los exámenes como recibidos, manteniéndolos pendientes (HU-05-ESC-04).
  - Manejo de discrepancias en la identificación del paciente: si el RUN no permite asociar inequívocamente el informe al caso, OncoTrace lo deriva a una bandeja de excepciones para auditoría sin asociarlo indebidamente, conservando el examen pendiente de recepción (HU-05-ESC-03).
  - Carga manual de informes de compras de servicios externos (ej. PET-CT o EBUS): la gestora puede adjuntar el informe externo en formato PDF, incorporándolo al expediente consolidado, registrando su origen y recalculando la completitud diagnóstica (HU-05-ESC-05).
  - Visualización y descarga directa de los informes consolidados en formato PDF desde la interfaz de la ficha (HU-05-CA4 / ESC-01 / ESC-05).
- **Capacidad modificada `alertas-seguimiento`:**
  - Alerta gestionable de **Hallazgo crítico**: al incorporar un informe validado de Anatomía Patológica con hallazgo de malignidad o valor crítico, OncoTrace genera automáticamente una `AlertaSeguimiento` con tipo «Hallazgo crítico», prioridad `Alta` y estado `Pendiente`, vinculada al estudio diagnóstico de origen mediante `estudioOrigenId` (HU-05-ESC-02).
  - Gestión y resolución de la alerta crítica: pasa a estado `En gestión` cuando la gestora registra la notificación al médico tratante, y a `Resuelta` cuando se documenta el hito clínico con la conducta adoptada (o `No aplica` ante causa documentada justificada), reutilizando el ciclo de vida EST-01 y el panel general de alertas.
  - Aviso visual destacado interno: notificación emergente dentro de OncoTrace visible al ingresar a la aplicación para el médico tratante y la gestora cuando existan alertas de hallazgos críticos activas; el aviso se retira a los cinco minutos o al cerrarlo, y la alerta permanece anclada al panel general y a la tarjeta del caso.
- **Modelo de datos y persistencia:**
  - Migración SQL `src/db/migrations/005_examenes_diagnosticos.sql`:
    - Tabla `orden_examen`: solicitud de estudio diagnóstico (`id`, `caso_id`, `identificador`, `tipo_estudio`, `fecha_solicitud`).
    - Tabla `estudio_diagnostico`: informe validado o adjunto (`id`, `orden_examen_id`, `caso_id`, `identificador_informe`, `run_informado`, `tipo_estudio`, `origen`, `fecha_informe`, `estado_validacion`, `estado_recepcion`, `hallazgo_critico`, `archivo_adjunto`, `fecha_registro`).
    - Bandeja de excepciones de auditoría por discrepancia de identidad: los informes se conservan como `estudio_diagnostico` con `caso_id` y `orden_examen_id` nulos y `estado_recepcion = 'Observado por identificación'`, sin una tabla aparte.
    - Modificación de tabla `alerta_seguimiento`: columna `estudio_origen_id` para trazabilidad directa con el informe.
- **Sistemas externos simulados:**
  - Adaptadores TypeScript para simular las interfaces LIS (`src/integraciones/lis.ts`) y PACS (`src/integraciones/pacs.ts`), proveyendo casos preconfigurados de prueba (informes validados, pendientes de validación, hallazgos críticos de malignidad y discrepancias de RUN).
- **Datos de prueba demostrativos:**
  - Actualización de `seed.ts` para proveer casos que permitan recorrer y validar los cinco escenarios de aceptación (ESC-01 a ESC-05).

## Capabilities

### New Capabilities
- `examenes-diagnosticos`: Consulta, indexación por RUN e incorporación de informes validados de LIS/PACS, verificación de completitud diagnóstica, soporte de adjuntos PDF para compras externas y registro de excepciones por discrepancias de identidad.

### Modified Capabilities
- `alertas-seguimiento`: Incorporación de la alerta de tipo «Hallazgo crítico» vinculada al estudio de origen (`estudioOrigenId`), con prioridad Alta, estado inicial Pendiente y ciclo de vida de gestión y resolución hasta su cierre formal.

## Fuera de alcance

- Lectura óptica de caracteres (OCR) o extracción automática de datos desde imágenes o PDFs escaneados.
- Notificaciones push externas (FCM, APNs, SMS o correo electrónico); los avisos son persistentes e internos a la aplicación web.
- Implementación de protocolos reales de interoperabilidad hospitalaria de RNF-04 (HL7 FHIR o DICOM de producción) o requisitos de disponibilidad RNF-01.
- Generación de la ficha de presentación a comité oncológico (alcance de HU-06).
- Edición o eliminación de informes diagnósticos previamente incorporados (inmutabilidad clínica).

## Impact

- **Trazabilidad institucional:** HU-05 · TB-05 · CU-01 y CU-02 · RF-05 · DSS-01 · EST-04 y EST-01.
- **Base de datos:** Migración `005_examenes_diagnosticos.sql` y tabla `alerta_seguimiento`.
- **Backend:** Servicios de sincronización de exámenes, adaptadores de integración simulada, controladores de consulta y adjunto de PDF, y ampliación del motor de alertas.
- **Frontend / Vistas:** Sección de exámenes diagnósticos y barra de completitud en `src/vistas/caso.ejs`, modal/formulario para adjuntar informe externo en PDF, banner o aviso emergente de hallazgo crítico en `header.ejs` / `caso.ejs`, e integración en el panel `alertas.ejs`.
- **Pruebas:** Nueva suite de pruebas automatizadas `tests/hu-05-examenes.test.ts` con cobertura para los cinco escenarios Gherkin (HU-05-ESC-01 a HU-05-ESC-05), cálculo de completitud, control de excepciones y casos borde.

