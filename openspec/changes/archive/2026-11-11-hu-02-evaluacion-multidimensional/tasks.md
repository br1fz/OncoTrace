# Tasks — Evaluación multidimensional y estratificación por dominios (HU-02)

- [x] 1. Base de datos y migración <!-- id: 1-migracion -->
  - [x] 1.1 Crear archivo `src/db/migrations/002_evaluacion_multidimensional.sql` con tablas `cuidador_autorizado`, `evaluacion_multidimensional` y `dominio_valoracion`. <!-- id: 1-1 -->
  - [x] 1.2 Probar aplicación de migración en base de datos SQLite en memoria. <!-- id: 1-2 -->

- [x] 2. Capa de Dominio <!-- id: 2-dominio -->
  - [x] 2.1 Crear `src/dominio/evaluacion.ts` con interfaces (`EvaluacionMultidimensional`, `DominioValoracion`, `CuidadorAutorizado`), tipos (`NivelVulnerabilidad`, `TipoDominio`) y validaciones. <!-- id: 2-1 -->
  - [x] 2.2 Implementar función de cálculo ponderado `calcularNivelVulnerabilidad` conforme al acuerdo D1 (0–6 puntos $\rightarrow$ Bajo, Medio, Alto). <!-- id: 2-2 -->
  - [x] 2.3 Ampliar `src/dominio/repositorios.ts` con métodos de lectura/escritura de cuidadores, evaluaciones y dominios, e integrar la última evaluación en `listarCasosResumen()` y `obtenerFichaCaso()`. <!-- id: 2-3 -->

- [x] 3. Capa de Servicio <!-- id: 3-servicio -->
  - [x] 3.1 Crear `src/servicios/evaluacion.ts` implementando el caso de uso CU-10 (validación obligatoria de ECOG 0–4, cálculo, exigencia de derivación ante Zarit > 56 y generación atómica de alerta). <!-- id: 3-1 -->
  - [x] 3.2 Actualizar `src/servicios/seguimiento.ts` para que `marcadorRiesgo` devuelva el nivel de vulnerabilidad de la última evaluación registrada (o 'Sin evaluar'). <!-- id: 3-2 -->

- [x] 4. Capa Web y Rutas HTTP <!-- id: 4-rutas -->
  - [x] 4.1 Crear `src/rutas/evaluacion.ts` con rutas `GET /casos/:numeroCaso/evaluaciones/nueva` y `POST /casos/:numeroCaso/evaluaciones`. <!-- id: 4-1 -->
  - [x] 4.2 Restringir registro a `Gestor/a UGCO` (modo lectura / rechazo para `Médico tratante`). <!-- id: 4-2 -->
  - [x] 4.3 Montar rutas de evaluación en `src/app.ts`. <!-- id: 4-3 -->

- [x] 5. Vistas EJS <!-- id: 5-vistas -->
  - [x] 5.1 Crear `src/vistas/evaluacion-nueva.ejs` con formulario para los 6 dominios normados, selector ECOG, escala Zarit, datos de cuidador, previsión y situación laboral. <!-- id: 5-1 -->
  - [x] 5.2 Actualizar `src/vistas/caso.ejs` agregando botón «+ Nueva evaluación multidimensional», ficha de estratificación vigente, sugerencias de derivación y tabla de historial inmutable de evaluaciones. <!-- id: 5-2 -->
  - [x] 5.3 Actualizar `src/vistas/tablero.ejs` para formatear el distintivo de riesgo con colores según el nivel (`Bajo`, `Medio`, `Alto`, `Sin evaluar`). <!-- id: 5-3 -->

- [x] 6. Semilla de datos y Pruebas <!-- id: 6-pruebas -->
  - [x] 6.1 Actualizar `src/db/seed.ts` para incluir evaluaciones iniciales en casos semilla. <!-- id: 6-1 -->
  - [x] 6.2 Crear suite `tests/hu-02-evaluacion.test.ts` cubriendo `HU-02-ESC-01`, `HU-02-ESC-02`, `HU-02-ESC-03`, validaciones y control de acceso por rol. <!-- id: 6-2 -->
  - [x] 6.3 Ejecutar verificación completa (`npm test` y `npm run build`). <!-- id: 6-3 -->

- [x] 7. Documentación del Estado del Proyecto <!-- id: 7-docs -->
  - [x] 7.1 Actualizar `.cin324/proyecto.md` marcando HU-02 como `en curso, pendiente de validación`. <!-- id: 7-1 -->
  - [x] 7.2 Crear ficha de historia `.cin324/historias/HU-02.md`. <!-- id: 7-2 -->
  - [x] 7.3 Actualizar `README.md` con las pantallas y pruebas de HU-02. <!-- id: 7-3 -->
