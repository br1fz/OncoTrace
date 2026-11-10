# Tasks — Consistencia temporal e inmutabilidad de hitos (Ajuste HU-01)

## 1. Validación de fechas en ServicioSeguimiento
- [x] 1.1 Implementar en `ServicioSeguimiento.registrarHito()` la guarda de fecha futura (`fechaOcurrencia <= fechaHoy`), retornando `{ ok: false, error: 'La fecha de ocurrencia no puede ser futura' }`
- [x] 1.2 Implementar en `ServicioSeguimiento.registrarHito()` la guarda de cronología (`fechaOcurrencia >= ultimoHito.fechaOcurrencia`), retornando `{ ok: false, error: 'La fecha de ocurrencia no puede ser anterior al último hito registrado' }`

## 2. Ajuste en interfaz web y rutas
- [x] 2.1 Enviar `fechaHoy` en `GET /casos/:numeroCaso/hitos/nuevo` y actualizar `src/vistas/hito-nuevo.ejs` agregando el atributo `max="<%= fechaHoy %>"` al input de fecha

## 3. Pruebas automatizadas y verificación
- [x] 3.1 Agregar prueba en `tests/hu-01-tablero.test.ts` para `HU-01-ESC-04` (rechazo de fecha futura con 400 y mensaje normado)
- [x] 3.2 Agregar prueba en `tests/hu-01-tablero.test.ts` para `HU-01-ESC-05` (rechazo de fecha anterior al último hito con 400 y mensaje normado)
- [x] 3.3 Ejecutar `npm test` y verificar que las 13 pruebas automatizadas pasan con éxito
