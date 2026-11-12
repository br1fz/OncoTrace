# Design — Indicación de hito o contacto resolutivo en ficha del caso (Ajuste HU-04)

## Context

El modelo de datos ya almacena la relación entre la alerta y su hito resolutivo en la columna `alerta_seguimiento.hito_cumplimiento_id`. Al resolver una alerta mediante `ServicioAlertas.registrarCumplimiento()`, se crea el `HitoAsistencial` correspondiente y se vincula su clave foránea en la alerta.

Sin embargo, en la consulta de alertas para la ficha del caso (`listarAlertasPorCasoId`), no se recuperaban los campos descriptivos del hito (`tipo` y `fecha_ocurrencia`), y la plantilla `caso.ejs` solo renderizaba el badge de estado `Resuelta` y el motivo de cierre cuando era `No aplica`.

## Architecture & Code Changes

### 1. Repositorio (`src/dominio/repositorios.ts`)

Actualizar la consulta de `listarAlertasPorCasoId(casoId)`:

```sql
SELECT 
  a.id, a.caso_id as casoId, a.identificador, a.tipo, a.prioridad, a.estado,
  a.fecha_generacion as fechaGeneracion, a.garantia_id as garantiaId,
  a.hito_cumplimiento_id as hitoCumplimientoId, a.motivo_cierre as motivoCierre,
  a.fecha_cierre as fechaCierre, a.responsable_cierre as responsableCierre,
  g.tipo_garantia as tipoGarantia, g.fecha_limite as fechaLimiteGarantia,
  h.tipo as tipoHitoCumplimiento, h.fecha_ocurrencia as fechaHitoCumplimiento
FROM alerta_seguimiento a
LEFT JOIN garantia_ges g ON g.id = a.garantia_id
LEFT JOIN hito_asistencial h ON h.id = a.hito_cumplimiento_id
WHERE a.caso_id = ?
ORDER BY a.fecha_generacion DESC, a.id DESC
```

### 2. Vista de Ficha de Caso (`src/vistas/caso.ejs`)

Dentro de la tarjeta de cada alerta, agregar el bloque condicional para alertas resueltas:

```ejs
<% if (alerta.estado === 'Resuelta' && (alerta.tipoHitoCumplimiento || alerta.hitoCumplimientoId)) { %>
  <p style="font-size: 0.75rem; color: #166534; margin-top: 0.35rem; background: #f0fdf4; padding: 0.35rem 0.5rem; border-radius: 4px; border: 1px solid #bbf7d0;">
    <strong>Resolución:</strong> <%= alerta.tipoHitoCumplimiento || 'Hito resolutivo' %><% if (alerta.fechaHitoCumplimiento) { %> (<%= alerta.fechaHitoCumplimiento %>)<% } %>
  </p>
<% } %>
```

### 3. Suite de Pruebas (`tests/hu-04-alertas.test.ts`)

Agregar el escenario correspondiente a la verificación en la ficha del caso tras la resolución:
- Resolver una alerta activa.
- Realizar `GET /casos/:numeroCaso`.
- Verificar que el HTML contenga el texto `Resolución:` junto con el tipo del hito y la fecha de ocurrencia.
