# Design — HU-01 Tablero de trazabilidad y línea de tiempo

## Context

Este es el primer cambio del proyecto: no existe código de aplicación todavía. El repositorio solo contiene la documentación de requisitos y las fichas confirmadas (`.cin324/historias/HU-01.md`). La aplicación se crea desde cero con el stack confirmado: TypeScript estricto, Express, EJS, SQLite con `better-sqlite3` y Vitest + supertest. Ver `proposal.md` para la motivación; los requisitos están en `specs/seguimiento-oncologico/spec.md`.

## Goals / Non-Goals

**Goals:**
- Crear la estructura mínima de la aplicación web y su base SQLite con migraciones numeradas.
- Modelar `Paciente`, `CasoOncologico`, `HitoAsistencial`, `ResolucionComite` y `AlertaSeguimiento` tal como están en `diagramas/modelo-dominio.puml` (sin métodos ni atributos inventados).
- Implementar el tablero, la ficha con línea de tiempo y el registro de hitos con las transiciones de EST-03 previstas.
- Dejar datos de ejemplo idempotentes y una prueba por escenario.

**Non-Goals:**
- Autenticación real: el rol se elige con un selector de demostración.
- Cálculo de riesgo (HU-02) y generación de alertas (HU-04).
- Crear o editar pacientes/casos, y cualquier transición de etapa distinta de las de esta historia.
- Requisitos no funcionales (RNF-02, RNF-03) e integraciones externas.

## Decisions

### 1. Tablas derivadas del modelo de dominio
Una tabla por clase; nombres de columna en `snake_case` y valores de dominio en español.

| Tabla | Columnas principales | Origen |
|---|---|---|
| `paciente` | `id`, `run` (único), `nombre_completo` | `Paciente` |
| `caso_oncologico` | `id`, `numero_caso` (único), `paciente_id` → `paciente`, `especialidad`, `codigo_diagnostico_o_sospecha`, `etapa_actual`, `fecha_ingreso` | `CasoOncologico` |
| `hito_asistencial` | `id`, `caso_id` → `caso_oncologico`, `tipo`, `fecha_ocurrencia`, `fecha_registro`, `responsable`, `rol_responsable` | `HitoAsistencial` |
| `resolucion_comite` | `id`, `caso_id` → `caso_oncologico`, `identificador`, `conducta_acordada`, `fecha_resolucion`, `fecha_firma` | `ResolucionComite` |
| `alerta_seguimiento` | `id`, `caso_id` → `caso_oncologico`, `tipo`, `prioridad`, `estado`, `fecha_generacion` | `AlertaSeguimiento` (solo lectura) |

Multiplicidades: un paciente puede presentar 1..* casos; un caso registra 0..* hitos, 0..* resoluciones y 0..* alertas. Claves foráneas con `ON DELETE RESTRICT` y sin borrado de hitos (integridad del registro).

`etapa_actual` se guarda como texto con uno de los ocho valores de EST-03. La aplicación valida ese conjunto al escribir y al leer.

### 2. Transiciones de estado concentradas en el dominio
`src/dominio/caso-oncologico.ts` define `ETAPAS` (las ocho), el tipo `EtapaTrayectoria` y la función `evaluarHito(...)` que devuelve el nuevo estado del caso o un error de guarda:

- `resolucion_comite` → registra `ResolucionComite` y hito; la etapa no cambia (sigue en `Etapificación`).
- `inicio_tratamiento` → solo si existe al menos una `ResolucionComite` del caso y la etapa actual es `Etapificación`; pasa a `Tratamiento`. En cualquier otro caso devuelve un error de negocio que la ruta muestra al usuario.

El resto de las transiciones de EST-03 no se programan: si llega un tipo de hito no soportado, se registra como hito sin cambiar la etapa, salvo que sea `inicio_tratamiento` (que sí se valida).

### 3. Rutas derivadas de DSS-03
| Método y ruta | Acción | Vista / resultado |
|---|---|---|
| `GET /` | Tablero: casos agrupados por las ocho etapas | `tablero.ejs` |
| `GET /casos/:numeroCaso` | Ficha y línea de tiempo (hitos ordenados, días entre hitos) | `caso.ejs` |
| `GET /casos/:numeroCaso/hitos/nuevo` | Formulario de registro de hito | `hito-nuevo.ejs` |
| `POST /casos/:numeroCaso/hitos` | Valida datos, aplica guarda y registra | Redirección a la ficha o error 400 con mensaje |
| `POST /rol` | Selector de rol de demostración (`gestora` / `medico`) | Cookie `rol` y vuelta a la página anterior |

El rol se lee de la cookie `rol` y se muestra en la cabecera; si no existe, se asume `gestora`. No hay login real. `responsable` y `rol_responsable` del hito se toman del formulario y del selector.

### 4. Capas y archivos
```text
src/app.ts                       # crea la app Express (sin escuchar puerto)
src/server.ts                    # arranca en el puerto 3000
src/db/conexion.ts               # abre SQLite y aplica migraciones
src/db/migrations/001_inicial.sql
src/db/seed.ts                   # 4 casos ficticios, idempotente
src/dominio/caso-oncologico.ts   # etapas, tipos y transiciones
src/dominio/repositorios.ts      # consultas SQL (paciente, caso, hito, resolución, alerta)
src/servicios/seguimiento.ts     # tablero, ficha y registro de hito
src/rutas/seguimiento.ts         # rutas HTTP
src/vistas/tablero.ejs, caso.ejs, hito-nuevo.ejs, parciales/
tests/hu-01-*.test.ts            # una prueba por escenario
README.md
```

### 5. Fechas y orden
`fecha_registro` se genera en el servidor al insertar (ISO 8601). `fecha_ocurrencia` viene del formulario. La línea de tiempo ordena por `fecha_ocurrencia` y, en empate, por `fecha_registro`. Los «días transcurridos» se calculan como diferencia en días corridos entre hitos consecutivos.

### 6. Datos de ejemplo y pruebas
- `npm run db:seed` inserta 4 pacientes/casos ficticios en Sospecha, Confirmación diagnóstica, Etapificación (con resolución de comité) y Tratamiento, con 2–3 hitos cada uno y una alerta pendiente en un caso. Es idempotente (no duplica si ya existen los RUN).
- Las pruebas abren una base SQLite en memoria, aplican las migraciones y cargan un subconjunto de datos de prueba; usan supertest contra `app.ts`.

### 7. Integraciones externas
Ninguna en esta historia. El semáforo de alertas lee `alerta_seguimiento`; el motor que las genera pertenece a HU-04. El marcador «Riesgo» se muestra como «Sin evaluar» porque HU-02 aún no existe. No hay adaptadores que simular.

## Risks / Trade-offs

| Riesgo | Mitigación |
|---|---|
| `better-sqlite3` requiere compilación nativa en Windows | Node 24 trae binarios compatibles; si falla, usar el módulo `node:sqlite` manteniendo el mismo esquema y repositorios |
| Datos de ejemplo que se duplican al re-ejecutar el seed | `INSERT ... ON CONFLICT DO NOTHING` sobre `run` y `numero_caso` |
| Mostrar «Riesgo» sin evaluación puede confundir | Etiqueta explícita «Sin evaluar» y nota en la ficha de que HU-02 lo completará |
| Registrar hitos con etapa inconsistente por datos de ejemplo | La guarda de dominio solo permite `Etapificación → Tratamiento`; los demás hitos no alteran la etapa |
| Fechas en zona horaria local vs. ISO | Guardar ISO 8601 y mostrar `dd-mm-aaaa` con `Intl.DateTimeFormat('es-CL')` |
