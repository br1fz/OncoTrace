# Informe de validación — HU-05 · Consolidación e indexación automática de biopsias y PACS con alertas críticas

**Fecha:** 2026-11-18
**Cambio de OpenSpec validado:** `hu-05-consolidacion-examenes-alertas-criticas` (con ajuste de reclasificación diagnóstica y retroceso de etapa CA7 / ESC-06)
**Estado:** verificado en el sistema — **HU-05 cerrada, sin observaciones**

---

## Resumen

| Obs. | Lo que se observó | Tipo | Artefacto principal | Estado |
| :--- | :--- | :---: | :--- | :---: |
| — | Sin observaciones bloqueantes: el recorrido completo y las 6 pruebas de aceptación coinciden con los artefactos y el modelo de dominio | — | Ninguno | **✔** |

**Lo que sí funcionó:** los 6 escenarios Gherkin (incorporación de informe validado LIS/PACS por RUN inequívoco, alerta transaccional y aviso emergente por hallazgo crítico, derivación a bandeja de excepciones por RUN discrepante, exclusión de informes pendientes de validación en el origen, adjunto manual de informes externos en PDF con rechazo de extensiones no autorizadas, y reclasificación diagnóstica con retroceso de Etapificación a Confirmación diagnóstica y registro de hito auditable); cálculo derivado de completitud diagnóstica en ficha y tablero (50 % sin persistencia en base de datos); visualización de copias PDF en el navegador (`Content-Disposition: inline`); control de acceso por rol (Gestor/a UGCO gestiona y adjunta; Médico tratante en solo lectura con pop-up de hallazgo crítico y 403 en peticiones mutadoras no autorizadas); idempotencia de la semilla de base de datos; sincronización estricta de especificaciones OpenSpec (`examenes-diagnosticos`, `alertas-seguimiento`, `seguimiento-oncologico`); 101/101 pruebas automatizadas y compilación TypeScript sin errores.

---

## Verificación realizada

| Comprobación | Evidencia del recorrido | Resultado |
| :--- | :--- | :---: |
| Pruebas automatizadas | `npm test` → 5 suites, 101 pruebas (13 HU-01, 10 HU-02, 19 HU-03, 30 HU-04, 29 HU-05) | **101/101 ✔** |
| Compilación TypeScript | `npm run build` (`tsc`) | **sin errores ✔** |
| HU-05-ESC-01 (incorporación de informe validado) | `CASO-2026-001`: sincronización LIS incorpora biopsia core mamaria (`ORD-MAM-001`), mamografía sigue pendiente | **✔** |
| HU-05-CA3 (completitud diagnóstica derivada) | Ficha del caso y tarjeta en tablero muestran 50 %; el valor se calcula en memoria y no se persiste como columna en `caso_oncologico` | **✔** |
| HU-05-CA4 (informe en PDF integrado) | Ruta `/casos/CASO-2026-001/examenes/:id/informe.pdf` entrega `application/pdf` con `Content-Disposition: inline` | **✔** |
| HU-05-ESC-02 (hallazgo crítico y alerta transaccional) | `CASO-2026-002`: sincronización detecta adenocarcinoma en LIS; genera `EstudioDiagnostico` "Incorporado con hallazgo crítico" y `AlertaSeguimiento` Alta/Pendiente en una única transacción SQLite (rollback verificado ante fallo inducido) | **✔** |
| Aviso emergente (D8) | Cabecera y tablero despliegan modal/banner durante 5 minutos para Médico tratante y Gestora UGCO ante alertas críticas activas | **✔** |
| HU-05-ESC-03 (discrepancia de RUN) | `CASO-2026-005`: informe LIS con RUN `99.888.777-K` se deriva a `/excepciones` como "Observado por identificación"; el examen del paciente permanece pendiente | **✔** |
| HU-05-ESC-04 (informe pendiente de validación) | `CASO-2026-004`: informe preliminar en LIS no se incorpora; estado permanece "Pendiente de validación" y examen pendiente | **✔** |
| HU-05-ESC-05 (compra de servicio externo) | `CASO-2026-003`: adjunto de PDF para `ORD-PET-001` incorpora estudio con origen "Compra externa" y actualiza completitud | **✔** |
| HU-05-CA5 (rechazo de archivos no PDF) | Intento de subir archivo `.txt` o `.png` retorna HTTP 400 con mensaje de rechazo de formato; examen permanece pendiente | **✔** |
| HU-05-ESC-06 (reclasificación y retroceso de etapa) | `CASO-2026-003`: ante biopsia o evaluación no concluyente/discordante, se registra hito de reclasificación, el caso retrocede de "Etapificación" a "Confirmación diagnóstica", la tarjeta se reubica en el tablero y se habilita solicitud de nuevos exámenes | **✔** |
| Roles y permisos | Gestor/a UGCO puede sincronizar y adjuntar; Médico tratante ve ficha, recibe avisos y tiene bloqueada la mutación | **✔** |
| Idempotencia de la semilla | `npm run db:seed` ejecutado múltiples veces sin errores de clave única; precarga los 5 casos y datos de prueba | **✔** |
| Especificaciones OpenSpec | `npx openspec validate --specs --strict` ejecutado con éxito (5/5 specs válidas, 0 errores, 0 advertencias) | **✔** |
| Diagramas actualizados | `EST-03-CasoOncologico.png` y `DSS-01-HU-05.png` reexportados y sincronizados con `.puml` | **✔** |

---

## Cierre de HU-05

- [x] HU-05-ESC-01 a HU-05-ESC-06 implementados, probados y verificados.
- [x] `npm test` 101/101 y `npm run build` limpios.
- [x] Transacción atómica garantizada entre incorporación de examen crítico y emisión de `AlertaSeguimiento`.
- [x] Completitud calculada dinámicamente sin campos redundantes en la base.
- [x] Bandeja de excepciones `/excepciones` operativa para auditoría de discrepancias de RUN.
- [x] Soporte de adjuntos PDF para compras de servicios externos con validación de tipo de archivo.
- [x] Retroceso asistencial atómico a "Confirmación diagnóstica" con registro inmutable en línea de tiempo (CA7 / ESC-06).
- [x] Especificaciones consolidadas en OpenSpec validadas en modo estricto.
- [x] Diagramas de estado y de secuencia exportados y vigentes.
- [x] Ficha `.cin324/historias/HU-05.md` y `.cin324/proyecto.md` actualizadas a estado cerrada/verificada.

---

## Siguiente paso

Con HU-05 formalmente validada y cerrada sin brechas, el proyecto queda en condiciones de avanzar a la siguiente historia de usuario del backlog:
- **HU-06 — Generación automática de ficha de presentación a comité oncológico** (Must, CU-12 / TB-06 / RF-06).
