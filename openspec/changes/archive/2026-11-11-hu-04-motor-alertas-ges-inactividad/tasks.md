# Tasks — Motor de alertas preventivas de plazos GES e inactividad (HU-04)

## 1. Calendario, esquema de datos y semilla

- [x] 1.1 Crear `src/dominio/calendario-ges.ts` con los feriados nacionales de Chile de 2026, `esDiaHabil`, `diasHabilesRestantes` y `diasCorridosEntre`; verificar con pruebas unitarias de fines de semana, feriados, límite exacto y fecha vencida.
- [x] 1.2 Crear `src/db/migrations/003_alertas_ges.sql` con `garantia_ges`, `entrada_bitacora`, las columnas nuevas de `alerta_seguimiento` y sus índices; verificar que `aplicarMigraciones` la registre en `schema_migrations` y que `PRAGMA table_info(alerta_seguimiento)` muestre las columnas nuevas.
- [x] 1.3 Actualizar `src/db/seed.ts` con tres garantías idempotentes (≤ 5 días hábiles, 6 días hábiles y cumplida) calculadas con el calendario, y retirar la alerta GES manual anterior; verificar que ejecutar la semilla dos veces no duplique garantías y que las fechas límite respeten el calendario.

## 2. Dominio y repositorio

- [x] 2.1 Crear `src/dominio/alertas.ts` con los tipos `GarantiaGES`, `EntradaBitacora`, `EstadoGarantia` y la ampliación de `AlertaSeguimiento` (`identificador`, `garantiaId`, `hitoCumplimientoId`, `motivoCierre`, `fechaCierre`, `responsableCierre`); verificar que `npm run build` compile sin errores.
- [x] 2.2 Ampliar `src/dominio/repositorios.ts` con lectura/escritura de garantías, alertas vigentes, entradas de bitácora, último registro asistencial y consultas de existencia de alertas activas; verificar con una prueba de integración sobre SQLite en memoria que los vínculos y las guardas persistan correctamente.
- [x] 2.3 Agregar las pruebas del repositorio y de los tipos en `tests/hu-04-alertas.test.ts`; verificar que `npx vitest run tests/hu-04-alertas.test.ts` las ejecute en verde.

## 3. Motor de evaluación de umbrales

- [x] 3.1 Implementar `ServicioAlertas.evaluarAlertas(fechaReferencia)` para garantías GES en `src/servicios/alertas.ts`, con prioridad Alta, estado Pendiente y guarda de no duplicidad por `garantia_id`; verificar con pruebas de HU-04-ESC-01 y HU-04-ESC-02 usando una fecha de referencia fija.
- [x] 3.2 Implementar la detección de inactividad con el máximo entre `fechaIngreso`, último hito y última evaluación, umbral `> 15` días corridos y guarda de no duplicidad por caso y tipo; verificar con pruebas de HU-04-ESC-03, HU-04-ESC-04 y evaluación repetida sin alertas redundantes.
- [x] 3.3 Verificar que la evaluación sea transaccional y que un error no deje alertas parciales; agregar una prueba que fuerce un fallo y compruebe que el conteo de alertas no cambia.

## 4. Gestión, resolución y cierre

- [x] 4.1 Implementar `registrarGestion` creando una `EntradaBitacora` y cambiando la alerta a En gestión sin marcar la garantía como cumplida; verificar con la prueba de HU-04-ESC-05.
- [x] 4.2 Implementar `registrarCumplimiento` creando el hito, vinculando `hito_cumplimiento_id`, cambiando la alerta a Resuelta y la garantía a Cumplida; verificar con la prueba de HU-04-ESC-06.
- [x] 4.3 Implementar `cerrarAlerta` con validación de motivo, fecha y responsable, guardando los antecedentes y cambiando la alerta y la garantía a No aplica; verificar con HU-04-ESC-07 y con el rechazo del cierre incompleto.
- [x] 4.4 Implementar una guarda de rol reutilizable en el servicio para que solo `Gestor/a UGCO` evalúe, gestione y cierre; verificar con una prueba que `Médico tratante` sea rechazado y que el estado de las alertas no cambie. La exportación reutilizará esta guarda en el grupo 6.

## 5. Rutas y vistas

- [x] 5.1 Crear `src/rutas/alertas.ts` con `GET /alertas`, `POST /alertas/evaluar`, `POST /alertas/:id/gestion`, `POST /alertas/:id/cumplimiento` y `POST /alertas/:id/cierre`, y montarlo en `src/app.ts`; verificar con supertest que las rutas respondan y respeten el rol.
- [x] 5.2 Crear `src/vistas/alertas.ejs` con el panel general de alertas vigentes y agregar el enlace «Alertas» en `src/vistas/parciales/header.ejs`; verificar que el panel muestre caso, tipo de alerta, tipo de garantía, días restantes, prioridad y estado.
- [x] 5.3 Actualizar `src/vistas/tablero.ejs` con el resumen de alertas, el botón «Evaluar alertas ahora» y, en cada tarjeta, el tipo de garantía y los días restantes de la alerta más urgente; verificar que la evaluación automática al abrir el tablero no duplique alertas.
- [x] 5.4 Actualizar `src/vistas/caso.ejs` con los formularios de gestión, cumplimiento y cierre, y con el modo solo lectura para `Médico tratante`; verificar que la gestora vea los formularios y el médico no.

## 6. Exportación del reporte consolidado

- [x] 6.1 Implementar `exportarCsv(fechaReferencia)` con BOM UTF-8, separador `;`, encabezado, escape de campos y exclusión de alertas Resuelta y No aplica; verificar con la prueba de HU-04-ESC-08 y con una prueba de escape de comillas y punto y coma.
- [x] 6.2 Agregar y conectar la descarga en `GET /alertas/exportar.csv` con `Content-Type: text/csv; charset=utf-8` y `Content-Disposition: attachment`, aplicando la guarda de rol; verificar con supertest el nombre del archivo, el rechazo para `Médico tratante` y que el cuerpo no incluya alertas cerradas.

## 7. Integración y documentación

- [x] 7.1 Ejecutar la suite completa (`npm test`) y la compilación (`npm run build`); verificar que las pruebas de HU-01, HU-02 y HU-04 pasen y que no haya errores de TypeScript.
- [x] 7.2 Actualizar `README.md` con las rutas de alertas, la semilla GES, el formato del CSV y los comandos para instalar, ejecutar y probar; verificar que las instrucciones funcionen tal como están escritas.
- [x] 7.3 Actualizar `.cin324/proyecto.md` marcando HU-04 como `en curso, pendiente de validación` y registrar el cambio `hu-04-motor-alertas-ges-inactividad`; verificar que el estado coincida con `openspec status --change hu-04-motor-alertas-ges-inactividad`.

## Workflow follow-up

- Presentar la aplicación al estudiante para la validación de HU-04.
- Archivar el cambio `hu-04-motor-alertas-ges-inactividad` después de la confirmación del estudiante.
- Verificar la especificación consolidada en `openspec/specs/alertas-seguimiento/spec.md` tras el archivado.
