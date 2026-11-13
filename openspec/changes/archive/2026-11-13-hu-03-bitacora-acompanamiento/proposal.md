# Proposal — Bitácora digital de acompañamiento y puntos de contacto obligatorios (HU-03)

## Why

En el proceso asistencial actual (AS-IS), la Unidad de Gestión de Casos Oncológicos (UGCO) carece de un canal unificado para registrar las atenciones de navegación: los contactos telefónicos y presenciales se consignan de forma fragmentada en cuadernos y notas locales (AS-05) y las consultas de pacientes y cuidadores se atienden de manera desordenada (AS-06). Esta dispersión impide verificar el cumplimiento de los momentos críticos de acompañamiento normados a lo largo de la trayectoria oncológica y dificulta detectar oportunamente el desenganche asistencial o la pérdida de contacto.

HU-03 implementa la actividad **TB-03** del TO-BE («Bitácora digital de acompañamiento») y el caso de uso **CU-11** («Registrar interacción en bitácora de acompañamiento»), permitiendo que el/la Gestor/a UGCO y el/la TENS UGCO registren cronológicamente cada interacción asistencial, verifiquen el cumplimiento de los seis puntos de contacto normados según la curva de vulnerabilidad del *Patient Journey Map* (P1 a P6), agenden la próxima acción de seguimiento, enmienden registros mediante adendas inmutables y activen alertas automatizadas ante puntos de contacto pendientes (48 horas hábiles) o no contactabilidad reiterada (protocolo de búsqueda activa tras 3 intentos fallidos).

## What Changes

- **Nueva capacidad `bitacora-acompanamiento`:**
  - Registro estructurado de interacciones asistenciales: fecha, canal (presencial, telefónico, visita en sala), interlocutor (paciente, cuidador), motivo, resumen de interacción y acuerdos establecidos (HU-03-ESC-01).
  - Catálogo formal de los 6 puntos normados del Journey Map (P1 a P6 o No normado), con sugerencia automática basada en el último hito asistencial pendiente y preselección editable en el formulario.
  - Programación de próxima acción: fecha y objetivo del próximo contacto o seguimiento de exámenes, visible en la ficha del caso (HU-03-ESC-05).
  - Validación y rechazo de registros incompletos cuando falten fecha, canal, interlocutor, motivo o resumen (HU-03-ESC-06).
  - Integridad inmutable y adendas rectificatorias: prohibición de eliminación física o modificación directa; soporte de adendas vinculadas a la entrada original mediante `entradaOriginalId` con usuario, fecha/hora y motivo de la enmienda (HU-03-ESC-04).
  - Indicador de contactabilidad derivado del caso (no persistido en `CasoOncologico`): deriva del `estadoContacto` de la última **entrada de acompañamiento** —no adenda y con `puntoContactoNormado` registrado— (`Efectivo` → Contactable; `No contactable` → No contactable). Las adendas no alteran este indicador ni resetean la racha de intentos fallidos, y las entradas de gestión de alertas de HU-04, que no declaran punto normado, quedan excluidas del cálculo.
- **Capacidad modificada `alertas-seguimiento`:**
  - Alerta preventiva por **Punto de contacto pendiente**: evaluación automatizada de hitos clínicos normados que superen más de 2 días hábiles completos sin una entrada de acompañamiento del punto con fecha igual o posterior al hito. Nace en estado `Pendiente` con prioridad `Alta`, vinculada a `hitoOrigenId`, visible en el panel `/alertas`, en el tablero Kanban y en la exportación CSV. Se resuelve automáticamente al registrar la entrada del punto adeudado, vinculando `entradaCumplimientoId` (HU-03-ESC-02).
  - Alerta de **Búsqueda activa por no contactabilidad** (etiqueta visible: «Búsqueda activa APS»): se genera automáticamente en estado `Pendiente` con prioridad `Alta` al registrar el 3.er intento consecutivo con resultado `No contactable` en entradas de acompañamiento (no adenda y con punto normado), vinculada a `entradaOrigenId`. Cuenta con guarda de idempotencia (un 4.° intento fallido consecutivo no duplica la alerta). Se resuelve automáticamente ante un contacto `Efectivo` o manualmente mediante la acción «Resolver» acreditando la respuesta de APS (HU-03-ESC-03).
  - Visualización observable del hito o contacto resolutivo en la ficha del caso (OBS-1 / HU-04-ESC-06).
- **Modelo de datos y migraciones:**
  - Migración `src/db/migrations/004_bitacora_puntos_normados.sql`: agrega columnas `fecha_proximo_contacto`, `objetivo_proximo_contacto` y `entrada_original_id` a la tabla `entrada_bitacora`; agrega columnas `hito_origen_id`, `entrada_origen_id` y `entrada_cumplimiento_id` a la tabla `alerta_seguimiento`.
- **Control de roles:**
  - Incorporación del rol `TENS UGCO` en el selector de demostración, con permisos de registro de interacciones y adendas. El mapeo del selector `POST /rol` en `src/rutas/seguimiento.ts` incorpora `'tens' → 'TENS UGCO'`; sin ese mapeo la opción quedaría guardada como Gestor/a UGCO.
  - El rol `Médico tratante` se mantiene en modo solo lectura para la bitácora de acompañamiento (sin permisos de registro ni gestión, con formularios ocultos en la vista).
- **Semilla demostrativa:**
  - Actualización de `seed.ts` incorporando entradas de bitácora previas para casos con puntos ya cumplidos, un caso con alerta de punto pendiente lista para resolver y un caso con racha de 2 fallos consecutivos para demostrar la detonación de la búsqueda activa al 3.er intento.

## Capabilities

### New Capabilities
- `bitacora-acompanamiento`: Registro cronológico e inmutable de interacciones de navegación, catalogación de puntos de contacto del Journey Map, programación de acciones futuras, gestión de adendas rectificatorias y cálculo derivado de contactabilidad.

### Modified Capabilities
- `alertas-seguimiento`: Incorporación de las alertas de punto de contacto pendiente y de búsqueda activa por no contactabilidad en el motor de evaluación, garantizando idempotencia, vinculación formal con sus orígenes y resolución observable por contacto efectivo o cumplimiento.

## Fuera de alcance

- La creación de un DSS-05 para CU-11: el flujo se mantiene como reconstrucción validada y el curso conserva sus cuatro diagramas de secuencia.
- La activación del punto P6 por la derivación externa de HU-08: se activará cuando exista el hito de despacho de derivación.
- RNF-01 y RNF-03 (disponibilidad, RBAC real y auditoría de accesos): se leen y se respetan, pero no se implementan en esta historia.
- Autenticación real y asignación formal de gestora por caso; el selector de rol sigue siendo de demostración.
- Edición o eliminación física de entradas de bitácora.
- Cambios en los umbrales GES e inactividad de HU-04, salvo reutilizar su motor de evaluación y su panel de alertas.

## Impact

- **Historia:** HU-03. **Actividad TO-BE:** TB-03 — Bitácora digital de acompañamiento. **Caso de uso:** CU-11 — Registrar interacción en bitácora de acompañamiento (relacionado con CU-05 y CU-06). **Requisito:** RF-03.
- **Base de datos:** Migración `004_bitacora_puntos_normados.sql` actualizando `entrada_bitacora` y `alerta_seguimiento`.
- **Código:**
  - Dominio: `src/dominio/caso-oncologico.ts`, `src/dominio/alertas.ts`, `src/dominio/repositorios.ts`.
  - Servicios: `src/servicios/seguimiento.ts`, `src/servicios/alertas.ts`.
  - Rutas y controladores: `src/rutas/seguimiento.ts`, `src/rutas/alertas.ts`.
  - Vistas: `src/vistas/caso.ejs` (formulario de registro de interacción, formulario de adenda, línea de tiempo de bitácora, indicador de contactabilidad y próxima acción agendada), `src/vistas/alertas.ejs` y `src/vistas/parciales/header.ejs` (soporte de rol TENS UGCO).
- **Pruebas:** Nueva suite `tests/hu-03-bitacora.test.ts` con cobertura automatizada para los escenarios `HU-03-ESC-01` a `HU-03-ESC-06`, control de permisos por rol, idempotencia y casos borde.

