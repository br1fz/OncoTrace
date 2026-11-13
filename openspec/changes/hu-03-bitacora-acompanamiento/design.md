# Design — Bitácora digital de acompañamiento y puntos de contacto obligatorios (HU-03)

## Context

La historia HU-03 formaliza el acompañamiento activo y la navegación asistencial en OncoTrace, implementando la actividad **TB-03** del TO-BE y el caso de uso **CU-11**. La base de datos ya cuenta con una versión preliminar de `entrada_bitacora` (introducida para documentar la gestión en HU-04), pero carece del catálogo de puntos normados del Journey Map, la programación del próximo contacto, las adendas inmutables, la evaluación de puntos pendientes a las 48 horas hábiles y el protocolo de no contactabilidad con búsqueda activa.

## Architecture & Code Changes

### 1. Migración de Base de Datos (`src/db/migrations/004_bitacora_puntos_normados.sql`)

```sql
-- Agregar columnas a entrada_bitacora para soporte de HU-03
ALTER TABLE entrada_bitacora ADD COLUMN fecha_proximo_contacto TEXT;
ALTER TABLE entrada_bitacora ADD COLUMN objetivo_proximo_contacto TEXT;
ALTER TABLE entrada_bitacora ADD COLUMN entrada_original_id TEXT;

-- Agregar columnas de trazabilidad y origen a alerta_seguimiento
ALTER TABLE alerta_seguimiento ADD COLUMN hito_origen_id INTEGER REFERENCES hito_asistencial(id);
ALTER TABLE alerta_seguimiento ADD COLUMN entrada_origen_id INTEGER REFERENCES entrada_bitacora(id);
ALTER TABLE alerta_seguimiento ADD COLUMN entrada_cumplimiento_id INTEGER REFERENCES entrada_bitacora(id);

CREATE INDEX IF NOT EXISTS idx_bitacora_caso_fecha ON entrada_bitacora(caso_id, fecha_contacto DESC);
CREATE INDEX IF NOT EXISTS idx_bitacora_original ON entrada_bitacora(entrada_original_id);
CREATE INDEX IF NOT EXISTS idx_alerta_hito_origen ON alerta_seguimiento(hito_origen_id);
```

### 2. Dominio y Repositorios

#### Entidades (`src/dominio/alertas.ts` y `src/dominio/caso-oncologico.ts`)
- `EntradaBitacora`: agrega `fechaProximoContacto?: string`, `objetivoProximoContacto?: string` y `entradaOriginalId?: string`.
- `AlertaSeguimiento`: agrega `hitoOrigenId?: number`, `entradaOrigenId?: number` y `entradaCumplimientoId?: number`.

#### Catálogo y Tipos (`src/dominio/alertas.ts`)
- `PuntoContactoNormado`:
  - `P1 Ingreso/Sospecha inicial`
  - `P2 Post-confirmación diagnóstica con IPD`
  - `P3 Etapificación/Post-resolución de comité`
  - `P4 Alta de hospitalización o cirugía`
  - `P5 Fin del tratamiento activo y retorno a la vida cotidiana`
  - `P6 Derivación a otro establecimiento de la red`
  - `No normado`
- `EstadoContactoBitacora`: `'Efectivo' | 'No contactable'`.
- `TipoAlerta`: Se incorpora `'Punto de contacto pendiente'`. Se mantiene `'Búsqueda activa por no contactabilidad'` como valor canónico y se mapea a «Búsqueda activa APS» en la interfaz de usuario.
- `MapeoTextoHitoAPunto`: Tabla de coincidencia insensible a mayúsculas:
  - P1: `«ingreso de sospecha»`, `«recepción de interconsulta»`, `«primera consulta»`, `«derivación desde urgencia con sospecha»`.
  - P2: `«confirmación diagnóstica»`, `«confirmación histológica»`, `«notificación diagnóstica»`, `«notificación GES»`, `«entrega de IPD»`, `«informe de biopsia confirmatoria»`, `«diagnóstico confirmado»`.
  - P3: `«resolución de comité»`.
  - P4: `«alta hospitalaria»`, `«intervención quirúrgica»`, `«cirugía»`.
  - P5: `«término de quimioterapia»`, `«término de radioterapia»`, `«ingreso a seguimiento»`, `«sobrevivientes»`.
  - P6: `«despacho de derivación»`.

#### Regla de 48 horas hábiles (> 2 días hábiles completos)
- Utiliza `calendario-ges.ts` (`esDiaHabil` y `sumarDiasHabiles`).
- Se calcula `umbral = sumarDiasHabiles(fechaHito, 2)` y se abre la alerta cuando la fecha de referencia, comparada por día, es **posterior** a `umbral`. Con hito un lunes, el umbral es el miércoles y la alerta se genera el jueves; con hito un viernes, el umbral es el martes siguiente y la alerta se genera el miércoles.
- La entrada que cumple la obligación es una entrada de acompañamiento con el mismo punto y fecha igual o posterior a la fecha del hito.

#### Comparación de fechas por día
- `hito_asistencial.fecha_ocurrencia` se guarda como `YYYY-MM-DD` y `entrada_bitacora.fecha_contacto` como ISO con hora. Toda comparación «fecha ≥ hito» o «fecha > umbral» se hace sobre `substr(fecha, 1, 10)` para no considerar una entrada del mismo día como anterior al hito.

#### Indicador derivado de contactabilidad y racha de fallos
- Se calcula solo sobre **entradas de acompañamiento**: `es_adenda = 0` y `punto_contacto_normado IS NOT NULL`. Las entradas que crea la gestión de alertas de HU-04 (`registrarGestion`) no declaran punto normado y quedan excluidas, para que una coordinación administrativa no marque el caso como contactable ni reinicie la racha.
  - Contactabilidad: estado de la última entrada de acompañamiento (`Efectivo` → Contactable; `No contactable` → No contactable).
  - Racha de fallos: conteo de entradas de acompañamiento consecutivas más recientes con `estado_contacto = 'No contactable'`. Al alcanzar 3, detona la alerta de búsqueda activa.

#### Repositorio (`src/dominio/repositorios.ts`)
- Se amplían los métodos existentes en lugar de duplicarlos:
  - `crearEntradaBitacora(entrada)`: incorpora `fechaProximoContacto`, `objetivoProximoContacto` y `entradaOriginalId` en el `INSERT` y mantiene la generación del identificador.
  - `listarEntradasPorCasoId(casoId)`: devuelve los tres campos nuevos y conserva `ORDER BY fecha_contacto DESC, id DESC`.
  - `crearAlerta(alerta)`: incorpora `hito_origen_id`, `entrada_origen_id` y `entrada_cumplimiento_id` en el `INSERT`.
  - `listarAlertasPorCasoId(casoId)`: agrega el vínculo `LEFT JOIN entrada_bitacora ec ON ec.id = a.entrada_cumplimiento_id` para mostrar el identificador y la fecha de la entrada que resolvió la alerta (`BIT-YYYY-NNN (YYYY-MM-DD)`).
- Nuevos métodos de consulta:
  - `obtenerUltimaEntradaAcompanamiento(casoId)`: última entrada con `es_adenda = 0` y punto normado, para derivar la contactabilidad.
  - `contarIntentosFallidosConsecutivos(casoId)`: racha actual de entradas de acompañamiento con `estado_contacto = 'No contactable'`.
  - `existeEntradaDelPunto(casoId, punto, fechaHito)`: verifica el cumplimiento comparando por día.
  - `existeAlertaActivaPorHitoOrigen(hitoId)` y `existeAlertaActivaPorTipo(casoId, tipo)`: guardas de idempotencia.

### 3. Servicios

#### `ServicioSeguimiento` (`src/servicios/seguimiento.ts`)
- `registrarInteraccion(casoId, datos, usuario, rol)`:
  - Valida permisos: `Gestor/a UGCO` y `TENS UGCO` autorizados; `Médico tratante` denegado (403).
  - Valida campos obligatorios: `fechaContacto`, `canalContacto`, `interlocutor`, `motivoContacto`, `resumenInteraccion`.
  - Genera identificador `BIT-2026-NNN` (secuencia anual, distinta de los identificadores aleatorios previos de HU-04).
  - Persiste con `esAdenda = false`.
  - Si el punto normado coincide con una alerta activa de tipo `Punto de contacto pendiente` del caso (comparando por día, con fecha igual o posterior al hito de origen), resuelve automáticamente la alerta vinculando `entradaCumplimientoId`.
  - Si el estado es `Efectivo`, resuelve cualquier alerta de `Búsqueda activa por no contactabilidad` activa del caso.
  - Si el estado es `No contactable`, evalúa la racha sobre las entradas de acompañamiento: si llega a 3, invoca la generación de alerta de búsqueda activa vinculada a la entrada actual (`entradaOrigenId`).
- `registrarAdenda(casoId, identificadorOriginal, datos, usuario, rol)`:
  - Valida permisos.
  - Verifica existencia de la entrada original.
  - Crea nueva entrada con `esAdenda = true`, `entradaOriginalId = identificadorOriginal`, fecha actual y motivo de enmienda.
  - La adenda no altera el indicador de contactabilidad ni la racha de fallos.

#### `ServicioAlertas` (`src/servicios/alertas.ts`)
- `evaluarPuntosPendientes(referencia?)`:
  - Recorre los casos y sus hitos.
  - Mapea hitos a P1–P6 según la tabla de textos.
  - Si la fecha de referencia es posterior a `sumarDiasHabiles(fechaHito, 2)` y no existe una entrada de acompañamiento del punto con fecha igual o posterior al hito (comparación por día), crea una `AlertaSeguimiento` de tipo `Punto de contacto pendiente` vinculada a `hitoOrigenId`.
  - Guarda de idempotencia: no duplica si ya existe una alerta activa para ese `hitoOrigenId`.
  - Las entradas de gestión de alertas de HU-04 (`punto_contacto_normado` nulo) no cuentan como cumplimiento del punto.
- Integración en `evaluarAlertas()`: el motor ejecuta la evaluación GES, inactividad y puntos pendientes de forma consolidada.

### 4. Rutas y Vistas

- `POST /casos/:numeroCaso/bitacora`: Endpoint para registrar interacción.
- `POST /casos/:numeroCaso/bitacora/:identificador/adenda`: Endpoint para registrar adenda.
- Vista `src/vistas/caso.ejs`:
  - Panel colapsable / modal «Registrar interacción» con formulario estructurado.
  - Lista cronológica de interacciones de bitácora con badges de punto normado, contactabilidad y autor.
  - Bloque visual para adendas vinculadas a su entrada original.
  - Tarjeta superior con indicador de contactabilidad derivado y próxima acción programada (fecha y objetivo).
  - Despliegue de alertas resueltas por contacto: `Resolución: Contacto BIT-2026-NNN (YYYY-MM-DD)`.
  - Los formularios de registro y adenda se ocultan cuando el rol activo es `Médico tratante`; el servicio rechaza igualmente la operación con 403.
- Selector de roles: añade la opción `TENS UGCO` en `src/vistas/parciales/header.ejs` y el mapeo `'tens' → 'TENS UGCO'` en `POST /rol` (`src/rutas/seguimiento.ts`). Sin ese mapeo, la opción quedaría guardada como Gestor/a UGCO.

### 5. Semilla Demostrativa (`src/db/seed.ts`)

- `CASO-2026-001`: Con entrada de bitácora para P1 cumplida y próxima acción programada.
- `CASO-2026-002`: Con hito de confirmación diagnóstica (P2) de hace más de 3 días hábiles sin entrada de bitácora; la alerta de `Punto de contacto pendiente` se genera en la primera evaluación del motor (al abrir el tablero o la ficha, o con «Evaluar alertas ahora») y queda lista para resolver.
- `CASO-2026-003`: Con 2 intentos fallidos consecutivos previos, permitiendo al evaluador registrar el 3.er fallo y verificar en vivo la activación de la alerta de búsqueda activa con APS.
- `CASO-2026-004`: Con entradas normales para consulta.
- La semilla es idempotente: ejecutarla dos veces no duplica entradas ni alertas.

