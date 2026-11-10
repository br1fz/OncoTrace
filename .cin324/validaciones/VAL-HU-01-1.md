# Informe de validación — HU-01 · Tablero de trazabilidad y línea de tiempo

**Fecha:** 2026-11-10  
**Cambio validado:** `hu-01-tablero-trazabilidad` (archivado 2026-11-09)  
**Estado:** Resuelto (ajuste de generación y dependencias aplicado)

---

## Resumen de observaciones

| Obs. | Lo que observaste | Tipo | Diagnóstico y resolución |
| :--- | :--- | :---: | :--- |
| **OBS-1** | «Revisé si podía cambiar de rol, pero estaba vacío (como esperaba)» | **F (uso)** | No es defecto. El desplegable renderiza dos opciones (`Gestor/a UGCO` y `Médico tratante`) y la insignia activa. El cambio de rol envía `POST /rol` con cookie. El síntoma aparente se debió a la caída previa del servidor por OBS-2. |
| **OBS-2** | «Hice click en “Tablero por Etapas” y se cae el sistema» | **F (entorno)** | Caída por regresión de Node 24.19.0 (`nodejs/node#65446`: aborto en `Statement::scalar deleting destructor` al recolectar basura). **Resolución:** Se actualizó `better-sqlite3` a `^13.0.3` con `@types/better-sqlite3` `^9.6.0`, el cual utiliza N-API y evita completamente la llamada a la API interna de V8. |
| **OBS-3** | El `README.md` indica rutas y roles que no existen en el sistema | **D (defecto de generación)** | **Resolución:** Se corrigió el `README.md` para reflejar los identificadores reales de casos (`CASO-2026-003`, `CASO-2026-002`) y los dos roles implementados en la demostración. |

---

## Verificación de funcionamiento
- Tablero con las 8 etapas asistenciales.
- Tarjeta de paciente con semáforo de plazos GES y datos clínicos anonimizados.
- Ficha del caso con motivo de alerta y línea de tiempo con días transcurridos.
- Transición de etapa *Etapificación* → *Tratamiento* (validación de guarda EST-03).
- Rechazo (400) al registrar inicio de tratamiento sin resolución previa.
- Manejo de rutas inexistentes (404).
- **11/11 pruebas unitarias y de integración pasando en Vitest.**
