# Tasks — Bitácora digital de acompañamiento y puntos de contacto obligatorios (HU-03)

## 1. Esquema de datos y semilla

- [ ] 1.1 Crear `src/db/migrations/004_bitacora_puntos_normados.sql` con las columnas `fecha_proximo_contacto`, `objetivo_proximo_contacto` y `entrada_original_id` en `entrada_bitacora`, las columnas `hito_origen_id`, `entrada_origen_id` y `entrada_cumplimiento_id` en `alerta_seguimiento` y sus índices; verificar que `aplicarMigraciones` la registre en `schema_migrations` y que `PRAGMA table_info(entrada_bitacora)` y `PRAGMA table_info(alerta_seguimiento)` muestren las columnas nuevas.
- [ ] 1.2 Ampliar `src/db/seed.ts` con entradas de bitácora previas para puntos cumplidos, un hito P2 de más de dos días hábiles sin contacto y una racha de dos fallos consecutivos; verificar ejecutando `npm run db:seed` dos veces que no duplique entradas ni alertas.

## 2. Dominio y repositorio

- [ ] 2.1 Definir en `src/dominio/alertas.ts` el tipo `PuntoContactoNormado`, la unión `EstadoContactoBitacora` (`Efectivo` | `No contactable`) y la tabla de mapeo textual hito → punto (insensible a mayúsculas); verificar con pruebas unitarias de coincidencia y de tipo no reconocido.
- [ ] 2.2 Ampliar las interfaces `EntradaBitacora` (`fechaProximoContacto`, `objetivoProximoContacto`, `entradaOriginalId`) y `AlertaSeguimiento` (`hitoOrigenId`, `entradaOrigenId`, `entradaCumplimientoId`); verificar que `npm run build` compile sin errores.
- [ ] 2.3 Ampliar `crearEntradaBitacora`, `listarEntradasPorCasoId`, `crearAlerta` y `listarAlertasPorCasoId` en `src/dominio/repositorios.ts`, y agregar `obtenerUltimaEntradaAcompanamiento`, `contarIntentosFallidosConsecutivos`, `existeEntradaDelPunto`, `existeAlertaActivaPorHitoOrigen` y `existeAlertaActivaPorTipo`; verificar con una prueba de integración sobre SQLite en memoria que los vínculos y las guardas persistan.
- [ ] 2.4 Agregar las pruebas de repositorio y de tipos en `tests/hu-03-bitacora.test.ts`; verificar que `npx vitest run tests/hu-03-bitacora.test.ts` las ejecute en verde.

## 3. Servicios

- [ ] 3.1 Implementar `ServicioSeguimiento.registrarInteraccion` con la guarda de rol (Gestor/a UGCO y TENS UGCO; Médico tratante rechazado), la validación de campos obligatorios, el identificador `BIT-2026-NNN` y la persistencia con `esAdenda = false`; verificar con HU-03-ESC-01 y HU-03-ESC-06.
- [ ] 3.2 Implementar la resolución automática de la alerta de punto pendiente cuando la entrada corresponde al punto y su fecha, comparada por día, es igual o posterior al hito; verificar que registrar P3 no resuelva una alerta de P2.
- [ ] 3.3 Implementar el conteo de la racha solo sobre entradas de acompañamiento y la creación única de la alerta de búsqueda activa al tercer fallo, vinculada a `entradaOrigenId`; verificar HU-03-ESC-03, el cuarto fallo sin duplicación y que una entrada de gestión de HU-04 no marque el caso como contactable ni reinicie la racha.
- [ ] 3.4 Implementar `ServicioSeguimiento.registrarAdenda` con validación de rol, existencia de la entrada original, `esAdenda = true`, `entradaOriginalId`, motivo, usuario y fecha/hora; verificar HU-03-ESC-04 y que la adenda no altere la contactabilidad ni la racha.
- [ ] 3.5 Implementar `ServicioAlertas.evaluarPuntosPendientes(referencia)` con `umbral = sumarDiasHabiles(fechaHito, 2)`, comparación por día, vínculo a `hitoOrigenId` y guarda de idempotencia; integrarla en `evaluarAlertas()` y verificar HU-03-ESC-02 con una fecha de referencia fija (hito lunes → alerta jueves; hito viernes → alerta miércoles siguiente).

## 4. Rutas y vistas

- [ ] 4.1 Crear `POST /casos/:numeroCaso/bitacora` y `POST /casos/:numeroCaso/bitacora/:identificador/adenda` en `src/rutas/seguimiento.ts`, con manejo de errores y redirección a la ficha; verificar con supertest que las rutas respondan y respeten el rol.
- [ ] 4.2 Agregar la opción `TENS UGCO` en `src/vistas/parciales/header.ejs` y el mapeo `'tens' → 'TENS UGCO'` en `POST /rol`; verificar con supertest que la cookie quede en `TENS UGCO` y no en Gestor/a UGCO.
- [ ] 4.3 Actualizar `src/vistas/caso.ejs` con el formulario de interacción (incluida la fecha y el objetivo del próximo contacto), el formulario de adenda, la línea de tiempo descendente, el indicador derivado de contactabilidad, la próxima acción programada y la etiqueta `Resolución: Contacto BIT-…`; verificar HU-03-ESC-05 y que `Médico tratante` vea la bitácora sin formularios.

## 5. Pruebas por escenario

- [ ] 5.1 Cubrir un caso por cada escenario: HU-03-ESC-01, ESC-02, ESC-03, ESC-04, ESC-05 y ESC-06, con fechas de referencia fijas; verificar que `npx vitest run tests/hu-03-bitacora.test.ts` pase en verde.
- [ ] 5.2 Agregar pruebas de borde: dos puntos pendientes con registro de uno solo, entrada anterior al hito que no cumple, adenda que no altera la racha, cuarto fallo sin duplicar y rechazo de eliminación.

## 6. Integración y documentación

- [ ] 6.1 Ejecutar la suite completa (`npm test`) y la compilación (`npm run build`); verificar que las pruebas de HU-01, HU-02, HU-04 y HU-03 pasen y que no haya errores de TypeScript.
- [ ] 6.2 Actualizar `.cin324/proyecto.md` marcando HU-03 como `en curso, pendiente de validación` y registrar el cambio `hu-03-bitacora-acompanamiento`; verificar que el estado coincida con `npx openspec status --change hu-03-bitacora-acompanamiento`.
- [ ] 6.3 Actualizar `README.md` con las rutas de bitácora, los puntos normados, la semilla de acompañamiento y los comandos para instalar, ejecutar y probar; verificar que las instrucciones funcionen tal como están escritas.

## Workflow follow-up

- Presentar la aplicación al estudiante para la validación de HU-03.
- Archivar el cambio `hu-03-bitacora-acompanamiento` después de la confirmación del estudiante.
- Verificar la especificación consolidada en `openspec/specs/` tras el archivado.
