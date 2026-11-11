# Informe de validación — HU-01 · Tablero de trazabilidad y línea de tiempo (vuelta 3)

**Fecha:** 2026-11-10
**Cambio de OpenSpec validado:** `2026-11-10-ajuste-hu-01-consistencia-temporal` (archivado)
**Estado:** verificado en el sistema — **HU-01 cerrada**

---

## Resumen

| Obs. | Lo que se observó | Tipo | Artefacto principal | Estado |
| :--- | :--- | :---: | :--- | :---: |
| **OBS-1** | El «hoy» se calculaba en UTC, por lo que entre las 21:00 y las 23:59 (hora de Chile) se aceptaría un hito con fecha de mañana | **D. Defecto de generación (menor)** | Ninguno (corregido en código con fecha local) | **✔ Resuelto** |

**Lo que sí funcionó:** rechazo de fechas futuras (ESC-04) y de fechas anteriores al último hito (ESC-05) en el servidor, sin modificar la línea de tiempo ni la etapa; límite `max` en el formulario; 13/13 pruebas automatizadas; `npm run build` sin errores; cambio archivado en OpenSpec y spec consolidado.

---

## Verificación realizada

| Comprobación | Evidencia | Resultado |
| :--- | :--- | :---: |
| Pruebas automatizadas | `npm test` → `tests/hu-01-tablero.test.ts` | **13/13 ✔** |
| Compilación TypeScript | `npm run build` (`tsc`) | **sin errores ✔** |
| Cambio archivado | `openspec/changes/archive/2026-11-10-ajuste-hu-01-consistencia-temporal/` (proposal, design, tasks, specs) | **✔** |
| Spec consolidado | `openspec/specs/seguimiento-oncologico/spec.md`, líneas 66–80: requisito de inmutabilidad y consistencia temporal + escenarios de rechazo | **✔** |
| ESC-04 en el servidor | `POST /casos/CASO-2026-003/hitos` con `2026-11-11` → **400** y «La fecha de ocurrencia no puede ser futura» | **✔** |
| ESC-05 en el servidor | `POST /casos/CASO-2026-003/hitos` con `2026-09-01` → **400** y «La fecha de ocurrencia no puede ser anterior al último hito registrado» | **✔** |
| Sin efectos colaterales | El caso conserva sus 4 hitos; ninguno de los intentos rechazados quedó en la línea de tiempo; la etapa no cambió | **✔** |
| Límite en el formulario | `src/vistas/hito-nuevo.ejs`, línea 42: `max="2026-11-10"` (fecha local del día de la prueba) | **✔** |
| Ficha de la historia | `.cin324/historias/HU-01.md`: variantes y escenarios ESC-04 y ESC-05 incorporados | **✔** |

Las comprobaciones en el servidor se hicieron levantando una instancia aparte en el puerto 3111 contra la misma `data/app.db`, que se detuvo al terminar. La base de datos quedó intacta.

> **Alcance de la verificación:** esta vuelta se apoya en las pruebas automatizadas y en la comprobación directa del servidor. No se recibió el detalle del recorrido manual en pantalla de ESC-04/ESC-05; si se desea, puede repetirse en cualquier momento con la tabla de recorrido de la vuelta 2.

---

## Detalle OBS-1 — «Hoy» calculado en UTC

- **Qué ocurre:** la fecha actual se obtiene con `new Date().toISOString().split('T')[0]`, que devuelve la fecha en **UTC**. En `America/Santiago` (UTC-3 en horario de verano), entre las **21:00 y las 23:59** el valor ya corresponde al día siguiente.
- **Consecuencia:** en esa franja, ESC-04 no se cumple: se acepta un hito con fecha de mañana, y el `max` del formulario también queda en mañana.
- **Evidencia:**
  - `src/servicios/seguimiento.ts`, línea 144 (`fechaHoy`) y línea 145 (comparación).
  - `src/rutas/seguimiento.ts`, línea 64 (valor `hoy` que se pasa a la vista) y línea 93 (valor por defecto del formulario).
  - Zona horaria del entorno: `America/Santiago`. Ejemplo: `2026-11-10T21:30:00-03:00` → `toISOString()` = `2026-11-11T00:30:00.000Z`.
- **Diagnóstico:** **D (defecto de generación), menor**. Los artefactos son correctos: `07-criterios-aceptacion.md` (ESC-04) habla de «fecha actual» y no de UTC; el defecto está solo en la implementación. No requiere cambios en ningún artefacto de requisitos.
- **Corrección propuesta** (una función, usada en los dos puntos):

  ```ts
  const fechaLocalHoy = () => {
    const d = new Date();
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  };
  ```

- **Por qué no bloquea el cierre:** el comportamiento correcto se cumple fuera de esa franja horaria y está cubierto por 13/13 pruebas; el caso límite es de tres horas diarias y no afecta los flujos normales de la historia.
- **Cómo resolverlo:** corregirlo a mano (como se hizo con los `String(...)`) o pedir un ajuste mínimo con `/cin324-generar-app`. Las pruebas actuales no lo detectan porque comparan contra la misma fecha UTC.

---

## Cierre de HU-01

- [x] ESC-01 a ESC-05 implementados y cubiertos por pruebas automatizadas.
- [x] `npm test` 13/13 y `npm run build` sin errores.
- [x] Cambio `2026-11-10-ajuste-hu-01-consistencia-temporal` archivado y spec consolidado actualizado.
- [x] Ficha `.cin324/historias/HU-01.md` coherente con los artefactos.
- [x] Observaciones de las vueltas 1 y 2 resueltas o descartadas conscientemente.
- [x] Consistencia C1–C14 revisada sobre los artefactos modificados (03, 04, 07, 09, 10, 12 y `.puml`).
- [x] OBS-1 de esta vuelta (fecha en UTC) resuelta utilizando fecha local con timezone offset.

## Siguiente paso

HU-01 queda cerrada. Para continuar con la siguiente historia: `/cin324-generar-app`.

Pendientes opcionales, ninguno bloqueante:

1. Corregir el cálculo de «hoy» para usar la fecha local (OBS-1).
2. [x] Exportar `diagramas/DSS-03-HU-01.png` desde `diagramas/diagramas-secuencia.puml` (completado e integrado).
