# Tasks

## 1. Estructura del proyecto y arranque

- [x] 1.1 Crear `package.json`, `tsconfig.json` (estricto) y la estructura `src/` del diseño; verificar que `npm install` termina sin errores
- [x] 1.2 Crear `src/app.ts` (app Express con EJS, estáticos y `express.urlencoded`) y `src/server.ts`; verificar que `npm run dev` sirve una página de inicio en `http://localhost:3000`
- [x] 1.3 Agregar el layout EJS con cabecera y el selector de rol de demostración (`POST /rol` con cookie `rol`); verificar que la cabecera muestra el rol elegido y vuelve a la página anterior

## 2. Base de datos y datos de ejemplo

- [x] 2.1 Crear `src/db/migrations/001_inicial.sql` con `paciente`, `caso_oncologico`, `hito_asistencial`, `resolucion_comite`, `alerta_seguimiento` y `schema_migrations`; verificar que aplicar la migración crea todas las tablas (consulta a `sqlite_master`)
- [x] 2.2 Crear `src/db/conexion.ts` que aplique las migraciones pendientes al arrancar; verificar que dos arranques seguidos no fallan ni reaplican la migración
- [x] 2.3 Crear `src/db/seed.ts` con 4 casos ficticios en Sospecha, Confirmación diagnóstica, Etapificación (con resolución de comité) y Tratamiento, 2–3 hitos cada uno y una alerta pendiente; verificar que `npm run db:seed` dos veces seguidas no duplica registros

## 3. Dominio y tablero por etapas

- [x] 3.1 Implementar `src/dominio/caso-oncologico.ts` con las ocho etapas, el tipo `EtapaTrayectoria` y la validación del conjunto de etapas; verificar con una prueba unitaria que acepta las ocho y rechaza un valor desconocido
- [x] 3.2 Implementar `src/dominio/repositorios.ts` y `src/servicios/seguimiento.ts` con `listarCasosPorEtapa()` (incluye último hito y alertas pendientes); verificar con una prueba que agrupa por etapa y que una etapa sin casos queda vacía
- [x] 3.3 Crear la ruta `GET /` y `src/vistas/tablero.ejs` con las ocho columnas y las tarjetas (RUN, nombre, especialidad, CIE-10, etapa, último hito, semáforo, «Riesgo: Sin evaluar»); verificar con la prueba del escenario «Visualización del tablero por etapas» que pasa

## 4. Ficha del caso y línea de tiempo

- [x] 4.1 Implementar `obtenerCasoConLineaDeTiempo(numeroCaso)` con hitos ordenados por fecha y días transcurridos entre hitos consecutivos; verificar con una prueba unitaria el cálculo de días y el orden
- [x] 4.2 Crear la ruta `GET /casos/:numeroCaso` y `src/vistas/caso.ejs` con ficha y línea de tiempo (fecha, tipo de hito, días desde el hito anterior), incluyendo el estado vacío «Sin hitos registrados»; verificar con la prueba del escenario «Consulta del seguimiento de un caso» que pasa
- [x] 4.3 Cubrir el caso de un `numeroCaso` inexistente con respuesta 404 y mensaje claro; verificar con una prueba de la ruta

## 5. Registro de hitos y transiciones de etapa

- [x] 5.1 Implementar la validación de datos obligatorios del hito (tipo, fecha de ocurrencia, responsable, rol) y `fecha_registro` automática; verificar con una prueba que un formulario incompleto responde 400 con el campo faltante
- [x] 5.2 Implementar `registrarResolucionComite(...)` que guarde `ResolucionComite` y hito sin cambiar la etapa; verificar con la prueba del escenario «Resolución de comité sin inicio del tratamiento» que el caso sigue en Etapificación y no existe etapa «Comité»
- [x] 5.3 Implementar `registrarInicioTratamiento(...)` con la guarda «existe resolución de comité y etapa = Etapificación»; verificar con la prueba del escenario «Cambio de etapa por inicio del tratamiento» que el caso pasa a Tratamiento y guarda fecha, hora, usuario y rol
- [x] 5.4 Implementar el rechazo del inicio de tratamiento sin resolución previa; verificar con la prueba del escenario «Rechazo del inicio de tratamiento sin resolución de comité» que responde 400 y la etapa no cambia
- [x] 5.5 Crear `GET /casos/:numeroCaso/hitos/nuevo` y `POST /casos/:numeroCaso/hitos` con `src/vistas/hito-nuevo.ejs` (tipo de hito, fecha, responsable, rol); verificar manualmente que registrar cada tipo redirige a la ficha y muestra el hito en la línea de tiempo

## 6. Verificación integral y documentación

- [x] 6.1 Ejecutar `npm test` y verificar que pasan todas las pruebas de los escenarios (tablero, consulta, cambio de etapa, resolución sin cambio y rechazo sin resolución)
- [x] 6.2 Escribir el `README.md` con instalación, `npm run db:seed`, `npm run dev`, `npm test` y un recorrido breve; verificar que los comandos documentados funcionan tal como están escritos

## Workflow follow-up

- Revisar las especificaciones con el estudiante antes de implementar.
- Archivar el cambio cuando el estudiante valide el sistema y no queden observaciones pendientes.
