# Design — Motor de alertas preventivas de plazos GES e inactividad (HU-04)

## Context

OncoTrace ya cuenta con el tablero por etapas y la ficha del caso (HU-01), con la evaluación multidimensional y su alerta por sobrecarga de cuidador (HU-02). La tabla `alerta_seguimiento` existe, pero solo almacena `caso_id`, `tipo`, `prioridad`, `estado` y `fecha_generacion`; no hay garantías GES, bitácora ni forma de vincular una alerta con la garantía que la origina o con el hito que la resuelve. Ver `proposal.md` para la motivación.

El diseño mantiene el stack definido: TypeScript estricto, Express 4, EJS, better-sqlite3 y Vitest. Respeta el modelo de dominio: la asociación `HitoAsistencial 0..1 — 0..* AlertaSeguimiento : justifica cierre` ya existe y no se modifica.

## Goals / Non-Goals

**Goals**

- Evaluar de forma determinista los umbrales GES (días hábiles) y de inactividad (días corridos).
- Evitar alertas duplicadas mientras la condición siga activa.
- Permitir el ciclo Pendiente → En gestión → Resuelta / No aplica con respaldo documental.
- Mostrar las alertas en el panel general y en la tarjeta del caso.
- Exportar el reporte consolidado en CSV sin interfaz en línea.
- Mantener el control de rol de demostración.

**Non-Goals**

- Implementar la bitácora completa de HU-03, las alertas de HU-08 o la búsqueda activa.
- Implementar autenticación real, RBAC institucional o auditoría de accesos (RNF-03).
- Integrarse en línea con la Unidad GES, el calendario oficial o un cron externo.
- Modificar `Documentos/` o `diagramas/`.

## Decisions

### D1 — Esquema de datos (migración 003)

Archivo: `src/db/migrations/003_alertas_ges.sql`. Se aplica una sola vez mediante el gestor de migraciones existente y se registra en `schema_migrations`.

```sql
CREATE TABLE IF NOT EXISTS garantia_ges (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  caso_id INTEGER NOT NULL REFERENCES caso_oncologico(id) ON DELETE RESTRICT,
  identificador TEXT NOT NULL UNIQUE,
  tipo_garantia TEXT NOT NULL,
  fecha_inicio TEXT NOT NULL,
  fecha_limite TEXT NOT NULL,
  estado_cumplimiento TEXT NOT NULL -- 'Pendiente' | 'Cumplida' | 'No aplica'
);

ALTER TABLE alerta_seguimiento ADD COLUMN identificador TEXT;
ALTER TABLE alerta_seguimiento ADD COLUMN garantia_id INTEGER REFERENCES garantia_ges(id);
ALTER TABLE alerta_seguimiento ADD COLUMN hito_cumplimiento_id INTEGER REFERENCES hito_asistencial(id);
ALTER TABLE alerta_seguimiento ADD COLUMN motivo_cierre TEXT;
ALTER TABLE alerta_seguimiento ADD COLUMN fecha_cierre TEXT;
ALTER TABLE alerta_seguimiento ADD COLUMN responsable_cierre TEXT;

UPDATE alerta_seguimiento SET identificador = 'ALR-' || id WHERE identificador IS NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_alerta_identificador ON alerta_seguimiento(identificador);
CREATE INDEX IF NOT EXISTS idx_alerta_garantia ON alerta_seguimiento(garantia_id);
CREATE INDEX IF NOT EXISTS idx_alerta_caso_estado ON alerta_seguimiento(caso_id, estado);

CREATE TABLE IF NOT EXISTS entrada_bitacora (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  caso_id INTEGER NOT NULL REFERENCES caso_oncologico(id) ON DELETE RESTRICT,
  identificador TEXT NOT NULL UNIQUE,
  punto_contacto_normado TEXT, -- nullable hasta HU-03
  fecha_contacto TEXT NOT NULL,
  canal_contacto TEXT NOT NULL,
  interlocutor TEXT,
  motivo_contacto TEXT,
  resumen_interaccion TEXT NOT NULL,
  acuerdos_establecidos TEXT,
  responsable_registro TEXT NOT NULL,
  estado_contacto TEXT NOT NULL,
  es_adenda INTEGER NOT NULL DEFAULT 0
);
```

**Por qué:** SQLite permite agregar columnas nulables con `ALTER TABLE` sin reconstruir la tabla; las columnas nuevas quedan nulas en las alertas históricas y se completa el identificador con el `id`. No se agrega una tabla de enlace porque la asociación alerta–hito ya está en el modelo y se representa con la FK `hito_cumplimiento_id`.

**Alternativas descartadas:** recrear `alerta_seguimiento` (riesgo de perder datos y de romper FKs existentes) y agregar una tabla puente alerta–hito (duplicaría una asociación ya modelada).

### D2 — Calendario de días hábiles

Módulo `src/dominio/calendario-ges.ts`:

- `FERIADOS_2026`: conjunto de fechas `YYYY-MM-DD` con los feriados nacionales oficiales de Chile de 2026: 01-01, 04-03, 04-04, 05-01, 05-21, 06-21, 06-29, 07-16, 08-15, 09-18, 09-19, 10-12, 10-31, 11-01, 12-08 y 12-25.
- `esFinDeSemana(fecha)`, `esFeriado(fecha)`, `esDiaHabil(fecha)`.
- `diasHabilesRestantes(fechaLimite, fechaReferencia): number`: cuenta los días hábiles posteriores a la referencia y hasta la fecha límite inclusive. Si la fecha límite ya pasó, devuelve un valor negativo con la misma convención.
- `diasCorridosEntre(desde, hasta): number`: diferencia en días de calendario.

Todas las fechas se manipulan como cadenas `YYYY-MM-DD` y se convierten con `Date.UTC(año, mes - 1, día)` para evitar desfases por huso horario o cambio de hora. Para años distintos de 2026 el módulo solo descuenta fines de semana; la lista de feriados se actualiza cuando cambie el año.

**Por qué:** el curso no provee una fuente de feriados y la demostración se ejecuta en 2026. Centralizar la lista permite reemplazarla por un adaptador sin cambiar el motor.

### D3 — Motor de evaluación

Servicio `src/servicios/alertas.ts`, clase `ServicioAlertas`:

- `evaluarAlertas(fechaReferencia?: string): ResultadoEvaluacionAlertas`.
- `listarAlertasVigentes(fechaReferencia?: string)`.
- `registrarGestion(alertaId, entrada, rol)`.
- `registrarCumplimiento(alertaId, hito, rol)`.
- `cerrarAlerta(alertaId, cierre, rol)`.
- `exportarCsv(fechaReferencia?: string)`.

La fecha de referencia por defecto es la fecha local de hoy (`YYYY-MM-DD`) y puede inyectarse en pruebas. La evaluación se ejecuta en una transacción y sigue este orden:

1. **Garantías GES:** para cada garantía con `estado_cumplimiento = 'Pendiente'`, calcula `diasHabilesRestantes(fechaLimite, fechaReferencia)`. Si el resultado es `<= 5` y no existe una alerta en estado `Pendiente` o `En gestión` con la misma `garantia_id`, crea una alerta `tipo = 'Vencimiento de plazo GES'`, `prioridad = 'Alta'`, `estado = 'Pendiente'`, vinculada a la garantía.
2. **Inactividad:** para cada caso, obtiene el último registro como el máximo entre `fechaIngreso`, la `fechaOcurrencia` del último hito y la `fechaEvaluacion` de la última evaluación multidimensional. Si `diasCorridosEntre(ultimoRegistro, fechaReferencia) > 15` y no existe una alerta `tipo = 'Riesgo de Inactividad/Abandono'` en estado `Pendiente` o `En gestión` para el caso, crea la alerta con prioridad `Alta` y estado `Pendiente`.

Los días restantes y los días de inactividad **no se persisten**: se calculan al leer, porque cambian con el tiempo. La alerta conserva la garantía y la fecha de generación. Cada alerta nueva recibe un identificador `ALR-<uuid>` generado con `crypto.randomUUID()`.

**Por qué:** el Gherkin exige una única alerta por garantía y una única alerta por inactividad; la guarda se implementa como consulta de existencia dentro de la misma transacción.

**Prioridad de inactividad:** la documentación no fija una prioridad para CA3. Se usa `Alta` por tratarse de un riesgo de abandono; queda como decisión revisable.

### D4 — Ciclo de vida y transiciones

| Estado origen | Evento | Acción | Estado destino |
| :--- | :--- | :--- | :--- |
| Nodo inicial | Evaluación de umbral | Crear alerta y vincular caso/garantía | Pendiente |
| Pendiente | Registro de gestión | Crear `EntradaBitacora` y conservar la acción | En gestión |
| Pendiente / En gestión | Registro de hito de cumplimiento | Crear hito, vincular `hito_cumplimiento_id`, marcar la garantía `Cumplida` | Resuelta |
| Pendiente / En gestión | Cierre por causa | Guardar motivo, fecha y responsable; marcar la garantía `No aplica` | No aplica |
| Resuelta / No aplica | — | — | Fin |

Guardas: solo se gestiona una alerta en estado `Pendiente`; solo se resuelve o cierra una alerta en `Pendiente` o `En gestión`; el cierre exige motivo, fecha y responsable; el cumplimiento exige que la alerta tenga una garantía asociada y que el hito corresponda al caso.

### D5 — Bitácora mínima

`EntradaBitacora` se implementa con los campos del modelo que permiten acreditar la acción: fecha, canal, interlocutor, motivo, resumen, acuerdos, responsable, estado del contacto y `es_adenda`. `punto_contacto_normado` queda nullable hasta HU-03. La entrada se crea en la misma transacción que el cambio de estado de la alerta; no se agrega una FK a la alerta porque el modelo no define esa asociación y la trazabilidad se obtiene por el caso y la fecha.

**Por qué:** permite cumplir ESC-05 sin inventar los seis puntos normados del Journey Map ni el mecanismo de adendas, que pertenecen a HU-03.

### D6 — Rutas HTTP y control de rol

| Método | Ruta | Propósito | Rol |
| :--- | :--- | :--- | :--- |
| GET | `/alertas` | Panel general de alertas vigentes | Ambos (solo lectura) |
| POST | `/alertas/evaluar` | Evaluar umbrales y generar alertas | Gestor/a UGCO |
| POST | `/alertas/:id/gestion` | Registrar gestión en bitácora | Gestor/a UGCO |
| POST | `/alertas/:id/cumplimiento` | Registrar hito de cumplimiento | Gestor/a UGCO |
| POST | `/alertas/:id/cierre` | Cerrar por causa documentada | Gestor/a UGCO |
| GET | `/alertas/exportar.csv` | Descargar reporte consolidado | Gestor/a UGCO |

La evaluación también se ejecuta al abrir `GET /` y `GET /casos/:numeroCaso`, antes de consultar el tablero o la ficha. El rol se lee de la cookie de demostración `rol`; si no es `Gestor/a UGCO`, las rutas de escritura responden `403` con un mensaje de acceso denegado y la interfaz oculta los formularios.

**Por qué:** DSS-04 muestra la evaluación periódica y la consulta de alertas; el botón explícito hace visible el proceso sin depender de un cron.

### D7 — Vistas

- `src/vistas/alertas.ejs`: panel general con caso, paciente, tipo de alerta, tipo de garantía, días restantes o período de inactividad, prioridad, estado y acciones.
- `src/vistas/tablero.ejs`: resumen de alertas vigentes y botón «Evaluar alertas ahora»; en cada tarjeta, el tipo de garantía y los días restantes de la alerta más urgente. Para esto, `CasoResumenTablero` incorpora `alertaMasUrgente?: { tipo, tipoGarantia, diasRestantes }`, calculado por `ServicioSeguimiento.obtenerTablero(fechaReferencia)` con el calendario y las alertas vigentes del caso.
- `src/vistas/caso.ejs`: tarjetas de alerta con formularios de gestión, cumplimiento y cierre para la gestora; en modo solo lectura se muestran los datos sin formularios.
- `src/vistas/parciales/header.ejs`: enlace «Alertas».

### D8 — Exportación CSV

`GET /alertas/exportar.csv` genera un archivo con BOM UTF-8, separador `;` y encabezado:

`Caso;Paciente;Tipo de alerta;Tipo de garantía;Días restantes;Estado;Prioridad;Fecha de generación`

Incluye solo alertas en `Pendiente` o `En gestión`. Para las alertas de inactividad, `Tipo de garantía` y `Días restantes` quedan vacíos. Los campos se escapan duplicando comillas y encerrando entre comillas cuando contienen `;`, comillas o saltos de línea. El nombre del archivo es `alertas-vigentes-AAAA-MM-DD.csv`.

**Por qué:** la Unidad GES recibe un reporte consolidado sin integración en línea; el BOM y el separador `;` facilitan su apertura en Excel en configuración regional chilena.

### D9 — Semilla y datos de demostración

`src/db/seed.ts` crea garantías idempotentes (por `identificador`) para los casos semilla:

1. Una garantía con fecha límite a cinco días hábiles de la fecha de ejecución (dispara alerta).
2. Una garantía a seis días hábiles (no dispara alerta).
3. Una garantía ya cumplida (no dispara alerta).

Las fechas se calculan con el calendario para que la demostración funcione en cualquier día de 2026. Se elimina la alerta GES creada manualmente en la semilla anterior; las alertas se generan en la primera evaluación (al abrir el tablero, la ficha o al usar «Evaluar alertas ahora»), y la guarda de no duplicidad mantiene la semilla idempotente.

**Por qué:** la demostración debe mostrar los escenarios sin depender de fechas fijas.

### D10 — Pruebas

`tests/hu-04-alertas.test.ts`:

- Unitarias del calendario: feriados, fines de semana, límites y valores negativos.
- Servicio con `fechaReferencia` fija: ESC-01 a ESC-04, no duplicidad y cálculo de inactividad con y sin evaluaciones.
- Ciclo de vida: ESC-05 (bitácora + En gestión), ESC-06 (hito + Resuelta + garantía Cumplida), ESC-07 (No aplica + antecedentes) y rechazo de cierre incompleto.
- HTTP con supertest: panel, evaluación explícita, formularios de la ficha, exportación CSV y rechazo `403` para `Médico tratante`.

**Por qué:** una prueba por escenario Gherkin y pruebas de borde del calendario, sin depender de la fecha real.

## Risks / Trade-offs

- **Feriados hardcodeados para 2026** → mitigación: lista centralizada y documentada; para otro año se actualiza el módulo o se reemplaza por un adaptador.
- **Evaluación automática en cada `GET`** → mitigación: la guarda de no duplicidad evita alertas redundantes y la evaluación es transaccional.
- **Casos cerrados en Alta y contrarreferencia** → podrían generar alertas de inactividad; se mantiene el comportamiento literal del Gherkin y se registra como pregunta abierta.
- **Alertas históricas sin garantía** → las columnas nuevas son nulables y el identificador se completa en la migración; las alertas antiguas siguen siendo visibles.
- **Control de rol solo por cookie** → es una demostración; no reemplaza RNF-03 ni la autenticación institucional.
- **CSV con separador `;`** → si se abre en otra configuración regional puede requerir importación; se documenta en el README.

## Migration Plan

1. Aplicar `003_alertas_ges.sql` al iniciar la aplicación; el gestor de migraciones la registra en `schema_migrations`.
2. Ejecutar la semilla idempotente (`npm run db:seed`) para crear garantías y alertas demostrativas.
3. Verificar que las alertas históricas conserven su estado y que las nuevas columnas queden nulas cuando no correspondan.
4. Rollback: en una base de demostración, restaurar el respaldo de `data/app.db` o eliminar el archivo y volver a aplicar migraciones y semilla. SQLite no elimina columnas de forma portable, por lo que no se intenta un rollback parcial.

## Open Questions

- ¿Debe excluirse la etapa `Alta y contrarreferencia` del cálculo de inactividad? Se implementará sin exclusión, porque el Gherkin no la menciona; si se confirma la exclusión, se agrega una guarda en el motor sin cambiar el esquema.
