# Tasks — HU-05 Consolidación de exámenes y alerta de hallazgo crítico

## 1. Esquema, tipos y repositorio

- [x] 1.1 Crear `src/db/migrations/005_examenes_diagnosticos.sql` con las tablas `orden_examen` y `estudio_diagnostico`, la columna `alerta_seguimiento.estudio_origen_id` y sus índices; verificar que `npm run db:seed` aplica la migración y que `schema_migrations` registra la versión `005`.
- [x] 1.2 Definir en `src/dominio/examenes.ts` los tipos `EstadoRecepcion`, `OrigenInforme`, `OrdenExamen` y `EstudioDiagnostico` con los atributos del modelo; verificar con `npm run build` sin errores de TypeScript.
- [x] 1.3 Extender `src/dominio/repositorios.ts` con alta y consulta de órdenes y estudios, la bandeja de excepciones (`caso_id` y `orden_examen_id` nulos) y el cálculo de completitud; verificar con una prueba unitaria sobre base en memoria que un caso con dos órdenes y un estudio incorporado devuelve 50 %.
- [x] 1.4 Verificar que la bandeja de excepciones lista solo estudios en `Observado por identificación` y que las alertas previas conservan `estudio_origen_id` nulo.

## 2. Transiciones de EST-04

- [x] 2.1 Implementar `evaluarTransicionEstudio(estadoActual, evento, contexto)` en `src/dominio/examenes.ts` con las siete transiciones de `design.md` y un mensaje de error por transición no permitida; verificar con pruebas unitarias de cada transición válida y de al menos tres inválidas.
- [x] 2.2 Implementar `aplicarTransicionEstudio` como única función que valida, ejecuta la acción y persiste el nuevo estado en el servicio; verificar con una prueba que un evento no permitido deja el estado intacto y devuelve el error.

## 3. Integraciones LIS y PACS simuladas

- [x] 3.1 Crear `src/integraciones/lis.ts` y `src/integraciones/pacs.ts` con la interfaz `consultarInformes(run)`, la implementación `...Simulado` y la fábrica que elige según `INTEGRACIONES_MODO`; verificar con pruebas unitarias de los cuatro informes simulados (validado sin hallazgo, con hallazgo crítico, pendiente de validación y RUN discrepante).
- [x] 3.2 Registrar cada consulta a LIS y PACS con el mensaje del DSS-01; verificar en la prueba que la llamada deja el registro esperado.

## 4. Incorporación de informes y completitud

- [x] 4.1 Implementar el servicio de consulta que llama a ambos adaptadores, incorpora los informes validados e informa el resultado; verificar con la prueba **HU-05 · incorporación de un informe validado** (ESC-01) que el examen queda recibido, la copia en PDF disponible y el otro pendiente.
- [x] 4.2 Exponer la completitud en la ficha del caso y en la tarjeta del tablero; verificar con la prueba **HU-05 · indicador de completitud en ficha y tablero** (CA3) que ambos muestran 50 % y el examen pendiente.
- [x] 4.3 Implementar la detección de discrepancia de identidad y la bandeja de excepciones; verificar con la prueba **HU-05 · discrepancia en la identificación del paciente** (ESC-03) que el informe no se asocia y el examen sigue pendiente.
- [x] 4.4 Implementar la exclusión de informes pendientes de validación; verificar con la prueba **HU-05 · informe pendiente de validación** (ESC-04).
- [x] 4.5 Agregar las rutas `POST /casos/:numeroCaso/examenes/consultar` y `GET /casos/:numeroCaso/examenes/:id/informe.pdf`; verificar con supertest el código de respuesta y las cabeceras `Content-Type: application/pdf` y `Content-Disposition: inline`.
- [x] 4.6 Agregar en `src/vistas/caso.ejs` la sección de exámenes con estado, completitud y enlaces de consulta y descarga; verificar que el HTML renderizado contiene los estados y el porcentaje de la prueba de 4.2.

## 5. Compra de servicio externo en PDF

- [x] 5.1 Implementar la ruta `POST /casos/:numeroCaso/examenes/:id/adjunto` con `multer` en disco (`data/informes/<uuid>.pdf`), validación de PDF y límite opcional por `LIMITE_ADJUNTO_MB`; verificar con la prueba **HU-05 · incorporación de un informe de compra de servicio externo** (ESC-05) que el origen queda registrado, el examen recibido y la completitud actualizada.
- [x] 5.2 Verificar con una prueba que un archivo que no es PDF se rechaza con mensaje, no se escribe en disco y el examen sigue pendiente.
- [x] 5.3 Agregar el formulario de adjunto en la ficha del caso y la vista de bandeja de excepciones; verificar que el formulario declara `enctype="multipart/form-data"` y que la bandeja muestra el informe discrepante.

## 6. Alerta de hallazgo crítico

- [x] 6.1 Incorporar el tipo «Hallazgo crítico» al dominio de alertas y generar la alerta en la misma transacción que incorpora el informe (`tipo`, prioridad `Alta`, estado `Pendiente`, `caso_id`, `estudio_origen_id`); verificar con la prueba **HU-05 · recepción de un informe con hallazgo crítico** (ESC-02) que la alerta identifica el caso y el informe.
- [x] 6.2 Verificar con una prueba que, si falla la inserción de la alerta, se revierte el cambio de estado del estudio y no queda un hallazgo crítico sin alerta.

## 7. Ciclo de vida de la alerta y aviso emergente

- [x] 7.1 Agregar `POST /alertas/:id/notificacion-medico` y la acción «Notificar al médico tratante» en el panel y en la ficha; verificar con una prueba que la alerta pasa de `Pendiente` a `En gestión` y conserva el registro.
- [x] 7.2 Reutilizar `POST /alertas/:id/cumplimiento` para registrar el hito clínico; verificar con una prueba que la alerta queda `Resuelta` y que la ficha muestra el hito con tipo y fecha.
- [x] 7.3 Verificar con una prueba que el cierre por causa documentada deja la alerta crítica en `No aplica` y conserva motivo, fecha y responsable.
- [x] 7.4 Implementar el middleware `avisosCriticos` en `src/app.ts` y el pop-up en `parciales/header.ejs` con retiro a los cinco minutos y botón «Entendido»; verificar con una prueba que el HTML incluye el aviso con el caso y el informe, y que el panel general y la tarjeta del caso muestran la misma alerta.
- [x] 7.5 Verificar con una prueba que un rol sin alertas críticas activas no recibe el aviso.

## 8. Datos de ejemplo

- [x] 8.1 Ampliar `src/db/seed.ts` con un caso de dos exámenes (uno recepcionable), uno con hallazgo crítico, uno con RUN discrepante, uno con informe pendiente de validación y uno con compra externa; verificar que `npm run db:seed` es idempotente y que los cinco casos se recorren desde la interfaz.

## 9. Integración y documentación

- [x] 9.1 Ejecutar `npm test` y verificar que las 72 pruebas previas siguen pasando junto con las nuevas de HU-05.
- [x] 9.2 Ejecutar `npm run build` y verificar cero errores de TypeScript.
- [x] 9.3 Actualizar `README.md` con la nueva ruta de exámenes, la carpeta `data/informes/`, la variable `LIMITE_ADJUNTO_MB` y los pasos para recorrer ESC-01 a ESC-05; verificar que los comandos documentados funcionan tal como están escritos.

## Workflow follow-up

- Revisar las especificaciones y confirmar antes de implementar.
- Archivar el cambio y sincronizar las specs principales cuando el sistema esté validado.
- Actualizar `.cin324/proyecto.md` con el estado de HU-05 y el nombre del cambio.
