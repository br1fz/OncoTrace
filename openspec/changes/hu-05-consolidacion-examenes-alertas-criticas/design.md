# Design — Consolidación de exámenes diagnósticos y alerta de hallazgo crítico (HU-05)

## Context

La aplicación ya resuelve HU-01 a HU-04 con el patrón del curso: migraciones SQL numeradas aplicadas al arrancar (`src/db/migrations/`), un repositorio por dominio (`src/dominio/repositorios.ts`), funciones puras de transición (`evaluarTransicionHito` en `src/dominio/caso-oncologico.ts`), servicios que orquestan (`src/servicios/*.ts`), rutas Express por historia (`src/rutas/*.ts`) y vistas EJS con el rol actual en la cookie `rol`. Las alertas de HU-04 ya tienen `POST /alertas/:id/gestion`, `/cumplimiento` y `/cierre`, y la tabla `alerta_seguimiento` ya recibió columnas de trazabilidad en `003` y `004`.

HU-05 no existe en la base: no hay tablas de órdenes ni de estudios diagnósticos. La motivación y el alcance están en `proposal.md`; el comportamiento exigido, en `specs/examenes-diagnosticos/spec.md` y `specs/alertas-seguimiento/spec.md`.

Restricciones que condicionan el diseño: Express 4 con `better-sqlite3` síncrono, sin autenticación real (selector de rol), sistemas externos simulados, requisitos no funcionales fuera de implementación y una sola historia por cambio.

## Goals / Non-Goals

**Goals:**

- Persistir `OrdenExamen` y `EstudioDiagnostico` con las multiplicidades del modelo y la columna `estudio_origen_id` en `alerta_seguimiento`.
- Implementar EST-04 como una función pura de transición y un único aplicador, igual que EST-03.
- Exponer el flujo de DSS-01 con rutas mínimas: consultar, descargar PDF y adjuntar PDF externo.
- Generar la alerta de hallazgo crítico en la misma transacción que incorpora el informe.
- Reutilizar el ciclo de vida de alertas de HU-04 para gestión, resolución y cierre.

**Non-Goals:**

- OCR, extracción de datos desde PDF escaneado o lectura de imágenes.
- Interoperabilidad real HL7 FHIR o DICOM, o cualquier RNF-01/RNF-04.
- Notificaciones push, correo o SMS.
- Edición o eliminación de informes ya incorporados.
- Ficha de comité (HU-06) y consumo de informes por otras historias.

## Decisions

### D1 — Tablas derivadas del modelo, sin tabla de excepciones

Se crean `orden_examen` y `estudio_diagnostico`, y se agrega `estudio_origen_id` a `alerta_seguimiento`. **No** se crea `excepcion_informe`: la bandeja de excepciones se modela como `estudio_diagnostico` con `caso_id` y `orden_examen_id` nulos y `estado_recepcion = 'Observado por identificación'`, que es exactamente el estado que EST-04 ya define para ese caso.

- *Por qué:* el modelo dice que un estudio puede existir sin orden y el diagrama de estado ya nombra la situación. Una tabla aparte duplicaría la fuente de verdad y obligaría a mover filas al subsanar.
- *Alternativa descartada:* tabla `excepcion_informe` (la del borrador de la propuesta). Se descarta por duplicación; la propuesta se ajusta en consecuencia.
- *Alternativa descartada:* guardar el informe discrepante sin fila y solo un log. Impide mostrar la bandeja y auditar el RUN informado.

Se agrega además `fecha_registro` en `estudio_diagnostico` como dato técnico de auditoría (ordena la bandeja y registra cuándo se detectó), no como atributo del modelo.

### D2 — `orden_examen` no guarda estado

La orden guarda `identificador`, `caso_id`, `tipo_estudio` y `fecha_solicitud`. El estado se lee del `estudio_diagnostico` asociado; si no hay estudio, la orden se muestra como *Solicitado*.

- *Por qué:* EST-04 describe el ciclo de vida de `EstudioDiagnostico`, no de `OrdenExamen`. Duplicar el estado en la orden permitiría que ambos se contradigan.
- *Consecuencia:* la completitud y el listado de exámenes se calculan con un `LEFT JOIN`.

### D3 — EST-04 como función pura y un solo aplicador

`src/dominio/examenes.ts` define `EstadoRecepcion`, los eventos y `evaluarTransicionEstudio(estadoActual, evento, contexto)`, que devuelve `{ esValido, nuevoEstado, accion, error }`. Un único método del servicio (`aplicarTransicionEstudio`) valida, ejecuta la acción y persiste.

- *Por qué:* replica el patrón ya aceptado en EST-03 (`evaluarTransicionHito`) y cumple la regla de «una sola función que aplica transiciones».
- *Eventos:* `informe_preliminar`, `detectar_discrepancia`, `subsanar_discrepancia`, `incorporar_sin_hallazgo`, `incorporar_con_hallazgo`, `adjuntar_externo`.
- *Guardas:* RUN inequívoco, origen validado, hallazgo crítico informado, compra externa no disponible en LIS/PACS. Una transición no permitida falla con mensaje explícito.

### D4 — PDF en disco y solo la ruta en la base

El archivo se guarda en `data/informes/<uuid>.pdf`; `estudio_diagnostico.archivo_adjunto` guarda la ruta relativa. La validación es por extensión y `Content-Type` PDF. **No se fija un tamaño máximo**: el tope queda configurable con la variable `LIMITE_ADJUNTO_MB` y, si no está definida, no se aplica límite. La descarga se sirve con `Content-Type: application/pdf` y `Content-Disposition: inline`.

- *Por qué:* cada prestador externo entrega sus informes con un tamaño distinto y un tope fijo podría rechazar documentos legítimos. El archivo va a disco, así que el tamaño no afecta a SQLite ni a la memoria del proceso.
- *Alternativa descartada:* un tope fijo de 10 MB. Se descarta porque no hay evidencia del tamaño real de los informes de cada prestador.
- *Alternativa descartada:* guardar el binario como BLOB. Complica la copia de seguridad y el servido.
- *Alternativa descartada:* guardar solo el enlace al sistema de origen. El informe externo no existe en LIS ni en PACS.

### D5 — Integraciones LIS y PACS simuladas tras una interfaz

`src/integraciones/lis.ts` y `src/integraciones/pacs.ts` declaran la interfaz (`consultarInformes(run)`), una implementación `...Simulado` con casos preestablecidos y una fábrica que elige la implementación según `INTEGRACIONES_MODO` (por defecto `simulado`). Cada consulta se registra en consola con el mensaje del DSS.

- *Por qué:* el DSS-01 muestra la consulta a ambos sistemas y la historia prohíbe fijar un protocolo real.
- *Datos:* el simulado devuelve, según el caso, un informe validado sin hallazgo, uno con hallazgo crítico, uno pendiente de validación y uno con RUN discrepante, para poder recorrer ESC-01 a ESC-05.

### D6 — La alerta crítica se crea en la misma transacción

Al aplicar `incorporar_con_hallazgo`, el servicio cambia el estado del estudio y, en la misma transacción, inserta la alerta con tipo «Hallazgo crítico», prioridad `Alta`, estado `Pendiente`, `caso_id` y `estudio_origen_id`. Si la inserción falla, se revierte la incorporación.

- *Por qué:* la spec exige que la alerta exista cuando el informe queda incorporado; una alerta huérfana o un informe crítico sin alerta serían estados imposibles de justificar.
- *Alternativa descartada:* generar la alerta en un job posterior. Añade una ventana en la que el hallazgo crítico no es visible.

### D7 — Ciclo de vida de la alerta sobre las rutas de HU-04

- `POST /alertas/:id/notificacion-medico` (nueva): registra la notificación al médico tratante y pasa la alerta a `En gestión`.
- `POST /alertas/:id/cumplimiento` (reutilizada): registra el `HitoAsistencial` que documenta la conducta y resuelve la alerta, conservando la relación con el hito.
- `POST /alertas/:id/cierre` (reutilizada): cierra en `No aplica` con motivo, fecha y responsable.

- *Por qué:* reutilizar cumplimiento y cierre evita duplicar reglas de rol y de visibilidad de 14 horas que ya están probadas.
- *Alternativa descartada:* una ruta nueva por cada transición de la alerta crítica. Duplicaría validaciones y pruebas.

### D8 — Aviso emergente temporal y alerta anclada al panel

`app.ts` registra un middleware que, para cada `GET` de página, consulta las alertas «Hallazgo crítico» en `Pendiente` o `En gestión` del rol actual y las deja en `res.locals.alertasCriticas`. `parciales/header.ejs` renderiza un pop-up cuando la lista no está vacía. El pop-up se cierra a los **cinco minutos** o cuando el usuario pulsa «Entendido»; desde el primer momento la alerta ya está listada en el panel general del tablero y en la tarjeta del caso.

- *Por qué:* el aviso es un realce temporal, no un canal de notificación. La alerta es persistente y gestionable desde el panel, y el pop-up no debe quedar bloqueando la pantalla.
- *Implementación:* temporizador de cliente (300 000 ms) en el propio parcial; no requiere sesión ni estado en el servidor y no altera la prueba del escenario.
- *Alternativa descartada:* mostrar el pop-up solo una vez por sesión con una cookie. Añade estado que la historia no necesita y complica las pruebas.
- *Alternativa descartada:* pop-up permanente hasta la gestión de la alerta. Tapa la ficha y duplica la función del panel general.

### D9 — Completitud calculada, nunca almacenada

La completitud se calcula con dos conteos sobre el caso: órdenes de examen y estudios en estado `Incorporado` o `Incorporado con hallazgo crítico`. Se expone como propiedad calculada del caso y se usa en la ficha y en la tarjeta del tablero.

- *Por qué:* la ficha lo declara valor derivado; persistirlo abriría la puerta a porcentajes desactualizados.

## Rutas derivadas de DSS-01

| Mensaje del DSS-01 | Ruta | Método | Actor | Resultado visible |
| :--- | :--- | :--- | :--- | :--- |
| Consultar informes y estado de los exámenes | `/casos/:numeroCaso/examenes/consultar` | POST | Gestor/a UGCO, Médico tratante | Redirige a la ficha con el resultado de la consulta a LIS y PACS |
| Mostrar informe incorporado y estado de recepción | `/casos/:numeroCaso` | GET | Gestor/a UGCO, Médico tratante | Sección de exámenes con estado y completitud |
| Solicitar copia del informe | `/casos/:numeroCaso/examenes/:id/informe.pdf` | GET | Gestor/a UGCO, Médico tratante | PDF en línea o descarga |
| Adjuntar informe externo en PDF | `/casos/:numeroCaso/examenes/:id/adjunto` | POST (multipart) | Gestora UGCO | Estudio incorporado y completitud actualizada |
| Generar alerta y notificar al médico | `/alertas/:id/notificacion-medico` | POST | Gestora UGCO | Alerta en `En gestión` |
| Resolver por hito clínico | `/alertas/:id/cumplimiento` | POST | Gestora UGCO | Alerta `Resuelta` con hito vinculado |
| Cerrar por causa documentada | `/alertas/:id/cierre` | POST | Gestora UGCO | Alerta `No aplica` |

## Modelo de datos (migración `005_examenes_diagnosticos.sql`)

| Tabla | Columnas | Origen |
| :--- | :--- | :--- |
| `orden_examen` | `id`, `caso_id` (FK, `NOT NULL`), `identificador` (`UNIQUE`), `tipo_estudio`, `fecha_solicitud` | `OrdenExamen` + asociación `requiere` con `CasoOncologico` (1 caso → 0..* órdenes) |
| `estudio_diagnostico` | `id`, `orden_examen_id` (FK, nulo), `caso_id` (FK, nulo), `identificador_informe`, `run_informado`, `tipo_estudio`, `origen`, `fecha_informe`, `estado_validacion`, `estado_recepcion`, `hallazgo_critico`, `archivo_adjunto`, `fecha_registro` | `EstudioDiagnostico` + asociación `obtiene` (0..1 orden por estudio) |
| `alerta_seguimiento` | `+ estudio_origen_id` (FK a `estudio_diagnostico`, nulo) | Asociación `origina` (un estudio: 0..* alertas) |

Índices: `orden_examen(caso_id)`, `estudio_diagnostico(caso_id)`, `estudio_diagnostico(orden_examen_id)`, `alerta_seguimiento(estudio_origen_id)`.

## Transiciones de EST-04

| Estado origen | Evento | Guarda | Estado destino |
| :--- | :--- | :--- | :--- |
| — | emisión de la orden | — | `Solicitado` |
| `Solicitado` | `informe_preliminar` | informe no validado en el origen | `Pendiente de validación` |
| `Solicitado` | `adjuntar_externo` | compra externa sin informe en LIS/PACS y PDF válido | `Incorporado` |
| `Pendiente de validación` | `detectar_discrepancia` | RUN no permite asociación inequívoca | `Observado por identificación` |
| `Observado por identificación` | `subsanar_discrepancia` | identificación ratificada | `Incorporado` |
| `Pendiente de validación` | `incorporar_sin_hallazgo` | RUN inequívoco, sin hallazgo crítico | `Incorporado` |
| `Pendiente de validación` | `incorporar_con_hallazgo` | RUN inequívoco y hallazgo crítico | `Incorporado con hallazgo crítico` |

## Riesgos / Trade-offs

- **PDF en `data/` y sincronización de OneDrive** → usar rutas relativas y crear el directorio al arrancar; las pruebas usan un directorio temporal.
- **Nueva dependencia `multer`** → es la opción mínima para multipart en Express 4; queda aislada en la ruta de adjunto y puede reemplazarse sin tocar el servicio.
- **Aviso emergente recurrente** → se retira a los cinco minutos o con el botón «Entendido», y la alerta siempre está en el panel; la consulta va indexada por `tipo` y `estado`.
- **Adjuntos de gran tamaño sin tope por defecto** → el archivo va a disco y el límite es configurable con `LIMITE_ADJUNTO_MB`; se documenta en el README para que el equipo lo fije si el volumen lo exige.
- **Transacción entre estudio y alerta** → `better-sqlite3` permite envolver ambas escrituras; se prueba con un caso de fallo forzado.
- **Simulados poco realistas** → los datos de ejemplo cubren los cinco escenarios; el adaptador real queda detrás de la misma interfaz.

## Plan de migración

1. Aplicar `005_examenes_diagnosticos.sql` al arrancar (queda registrada en `schema_migrations`).
2. Ejecutar `npm run db:seed` para crear los casos con exámenes de ESC-01 a ESC-05.
3. Sin backfill: las alertas existentes quedan con `estudio_origen_id` nulo.
4. Reversión: borrar las dos tablas nuevas y la columna `estudio_origen_id` (SQLite ≥ 3.45 soporta `DROP COLUMN`); no hay datos previos que dependan de ellas.

