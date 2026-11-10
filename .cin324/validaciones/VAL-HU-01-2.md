# Informe de validación — HU-01 · Tablero de trazabilidad y línea de tiempo (vuelta 2)

**Fecha:** 2026-11-10  
**Cambio validado:** `hu-01-tablero-trazabilidad` (archivado 2026-11-09)  
**Estado:** pendiente de actualización de artefactos (brecha de especificación)

---

## Resumen de observaciones

| Obs. | Lo que observaste | Tipo | Artefacto principal | También revisar |
| :--- | :--- | :---: | :--- | :--- |
| **OBS-1** | El sistema no rechaza una fecha de ocurrencia futura; se espera que la rechace porque un hito ya ocurrió. | **B. Brecha de especificación** | `Documentos/07-criterios-aceptacion.md` → nuevo `HU-01-ESC-04` | 03 (RF-01), 04 (CA), 09 (CU-05), 10 (DSS-03 + .puml), 12 |
| **OBS-2** | La burbuja del navegador pide los campos vacíos («Complete este campo» / «Seleccione un elemento de la lista») | **F. Uso** | Ninguno (validación nativa HTML5 esperada) | — |

---

## Lo que sí funcionó en esta vuelta
- Rechazo del inicio de tratamiento sin resolución previa (mensaje correcto y el caso permaneció en Confirmación diagnóstica).
- Manejo de rutas inexistentes (404).
- Cambio de rol persistente con cookie.
- «Tablero por Etapas» sin caídas (resuelto tras upgrade a `better-sqlite3@13`).
- Seguimiento y cambios de estado correctos según EST-03.
- 11/11 pruebas automatizadas pasando.

---

## Detalle de OBS-1 (Fecha de ocurrencia futura)
- **Diagnóstico:** B (Brecha de especificación). Un hito asistencial es un hecho clínico acontecido; registrar fechas futuras es conceptualmente inválido.
- **Regla de negocio acordada:** Se permite fecha de hoy o pasada. Se rechaza cualquier fecha posterior a hoy con el mensaje: `«La fecha de ocurrencia no puede ser futura»`.
- **Artefactos a modificar en orden:**
  1. `Documentos/03-requisitos.md` (RF-01)
  2. `Documentos/04-historias-usuario.md` (HU-01: nuevo criterio de aceptación)
  3. `Documentos/07-criterios-aceptacion.md` (nuevo escenario `HU-01-ESC-04`)
  4. `Documentos/09-casos-de-uso.md` (CU-05)
  5. `Documentos/10-diagramas-secuencia.md` y `diagramas/diagramas-secuencia.puml` (DSS-03)
  6. `Documentos/12-trazabilidad.md`

