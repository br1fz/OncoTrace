# Proposal — Motor de alertas preventivas de plazos GES e inactividad (HU-04)

## Why

En el AS-IS, la UGCO calcula y revisa manualmente las fechas de las garantías GES (AS-04) y detecta tarde los casos que dejan de tener actividad asistencial (AS-05). Ese control manual no escala y expone a la institución a vencimientos de plazos legales y a abandonos de tratamiento que podrían prevenirse con alertas oportunas y trazables.

HU-04 implementa la actividad **TB-04** del TO-BE («Motor de alertas preventivas GES e inactividad») y el caso de uso **CU-06** («Gestionar alertas de seguimiento»), para que la Gestora UGCO reciba alertas automáticas cuando una garantía GES está a cinco días hábiles o menos de vencer o cuando un caso lleva más de quince días corridos sin actividad, y pueda gestionarlas, resolverlas o cerrarlas con respaldo documental.

## What Changes

- **Nueva capacidad `alertas-seguimiento`:** evaluación de umbrales GES e inactividad, generación de alertas no duplicadas, gestión, resolución, cierre por causa y exportación del reporte consolidado.
- **Calendario de días hábiles:** módulo de dominio con los feriados nacionales de Chile de 2026 y fines de semana, con fecha de referencia inyectable para pruebas deterministas.
- **Datos GES:** nueva tabla `garantia_ges` con identificador, tipo de garantía, fecha de inicio, fecha límite y estado de cumplimiento; semilla con tres garantías demostrativas (≤ 5 días hábiles, 6 días hábiles y cumplida).
- **Alertas ampliadas:** `alerta_seguimiento` incorpora identificador, vínculo a la garantía (`garantia_id`), vínculo al hito de cumplimiento (`hito_cumplimiento_id`) y antecedentes de cierre (motivo, fecha y responsable). La asociación alerta–hito ya existe en el modelo de dominio; no se modifica `Documentos/` ni `diagramas/`.
- **Bitácora mínima:** tabla `entrada_bitacora` con los campos necesarios para acreditar la acción de gestión de ESC-05. HU-03 la extenderá con los seis puntos normados del Journey Map y las adendas inmutables.
- **Motor de evaluación:** evaluación automática al abrir el tablero o la ficha y acción explícita «Evaluar alertas ahora» (`POST /alertas/evaluar`), sin cron.
- **Panel y tarjeta:** panel general de alertas vigentes y tarjeta del caso con tipo de garantía y días hábiles restantes.
- **Gestión de alertas:** registro de gestión (Pendiente → En gestión), registro del hito de cumplimiento (→ Resuelta) y cierre por causa documentada (→ No aplica), con guarda de no duplicidad.
- **Exportación CSV:** reporte consolidado de alertas en estado Pendiente o En gestión para la Unidad GES, sin interfaz en línea.
- **Control de rol de demostración:** solo `Gestor/a UGCO` evalúa, gestiona, cierra y exporta; `Médico tratante` queda en modo solo lectura.

**Fuera de alcance:**

- La bitácora completa de HU-03 (seis puntos del Journey Map y adendas inmutables).
- Las alertas por rezago de derivación de HU-08 y la búsqueda activa de HU-03.
- RNF-01 y RNF-03 (disponibilidad, RBAC real y auditoría de accesos): se leen, no se implementan.
- Autenticación institucional real; se mantiene el selector de rol de demostración.
- Interfaz en línea con la Unidad GES o con el calendario oficial.

## Capabilities

### New Capabilities

- `alertas-seguimiento`: evaluación de garantías GES e inactividad asistencial, generación y gestión del ciclo de vida de las alertas, visualización en panel y tarjeta, y exportación del reporte consolidado de alertas vigentes.

### Modified Capabilities

- Ninguna. La visualización de alertas se especifica dentro de la nueva capacidad; los requisitos existentes de `seguimiento-oncologico` y `evaluacion-multidimensional` no cambian su comportamiento.

## Impact

- **Historia:** HU-04. **Actividad TO-BE:** TB-04 — Motor de alertas preventivas GES e inactividad. **Caso de uso:** CU-06 — Gestionar alertas de seguimiento. **Requisito:** RF-04; contexto RNF-01 (no implementado).
- **Modelo de datos:** migración `003_alertas_ges.sql` con la tabla `garantia_ges`, la tabla `entrada_bitacora` y columnas nuevas en `alerta_seguimiento`.
- **Código:** nuevos módulos `src/dominio/calendario-ges.ts`, `src/dominio/alertas.ts`, `src/servicios/alertas.ts`, `src/rutas/alertas.ts` y `src/vistas/alertas.ejs`; actualización de `src/dominio/repositorios.ts`, `src/dominio/caso-oncologico.ts`, `src/servicios/seguimiento.ts`, `src/app.ts`, `src/vistas/tablero.ejs`, `src/vistas/caso.ejs`, `src/vistas/parciales/header.ejs` y `src/db/seed.ts`.
- **Pruebas:** nueva suite `tests/hu-04-alertas.test.ts` con una prueba por escenario Gherkin, pruebas del calendario y pruebas de control de rol.
- **Documentación:** `README.md` y `.cin324/proyecto.md`.
