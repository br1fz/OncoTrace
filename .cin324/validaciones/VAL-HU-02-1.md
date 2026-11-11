# Informe de validación — HU-02 · Evaluación multidimensional y estratificación por dominios

**Fecha:** 2026-11-11
**Cambio de OpenSpec validado:** `hu-02-evaluacion-multidimensional` (abierto, pendiente de archivar)
**Estado:** verificado en el sistema — **HU-02 cerrada, sin observaciones**

---

## Resumen

| Obs. | Lo que se observó | Tipo | Artefacto principal | Estado |
| :--- | :--- | :---: | :--- | :---: |
| **OBS-1** | No hay forma de corregir un dato mal registrado ni de saber quién lo cambió; se propuso permitir correcciones restringidas por rol con un log de responsables | **A. Cambio de requisito** (con parte **B**) | `04-historias-usuario.md`, HU-02-CA5 | **✔ Descartada** por decisión del estudiante: se mantiene el historial inmutable |

**Lo que sí funcionó:** los 3 escenarios Gherkin (registro y cálculo, sobrecarga severa con Zarit > 56, ECOG obligatorio); cálculo del nivel Bajo/Medio/Alto; alerta prioritaria y exigencia de derivación a Servicio Social; rechazo sin ECOG; inmutabilidad del historial (revaluaciones como registros nuevos); bloqueo de registro al rol Médico tratante; distintivos visuales en ficha y tablero; 23/23 pruebas automatizadas; `npm run build` sin errores.

---

## Verificación realizada

| Comprobación | Evidencia | Resultado |
| :--- | :--- | :---: |
| Pruebas automatizadas | `npm test` → `tests/hu-02-evaluacion.test.ts` (10) + `tests/hu-01-tablero.test.ts` (13) | **23/23 ✔** |
| Compilación TypeScript | `npm run build` (`tsc`) | **sin errores ✔** |
| HU-02-ESC-01 (registro y cálculo) | `tests/hu-02-evaluacion.test.ts`, escenario 2.1 | **✔** |
| HU-02-ESC-02 (Zarit > 56) | `tests/hu-02-evaluacion.test.ts`, escenario 2.2 | **✔** |
| HU-02-ESC-03 (ECOG obligatorio) | `tests/hu-02-evaluacion.test.ts`, escenario 2.3 | **✔** |
| Inmutabilidad (D5) | `tests/hu-02-evaluacion.test.ts`, caso 3.1: las revaluaciones se insertan y no borran las anteriores | **✔** |
| Autorización de rol | `tests/hu-02-evaluacion.test.ts`, caso 3.2: Médico tratante no puede registrar (CU-10) | **✔** |
| Límite Zarit 56 vs 57 | `tests/hu-02-evaluacion.test.ts`, caso 3.3: 56 sin alerta; 57 con alerta | **✔** |
| Recorrido manual del estudiante | Tabla de 7 pasos (caso, formulario, Zarit, ECOG, revaluación, rol, tablero) | **✔ sin errores lógicos, de cálculo ni visuales** |
| Artefactos de requisitos | `git status`: sin cambios en `Documentos/` ni `diagramas/` | **✔** |
| Ficha de la historia | `.cin324/historias/HU-02.md` coherente con lo implementado | **✔** |

---

## Detalle OBS-1 — Corrección de datos con registro de responsables

- **Lo que planteaste:** si se etiqueta mal un dato o se entrega mal un resultado, debe poder corregirse; solo algunos actores deberían poder hacerlo y debe quedar registro de quién corrigió, para tener un log completo de responsables (con la normativa de transparencia de Chile).
- **Qué decían los artefactos:** `04-historias-usuario.md`, HU-02-CA5, exige «manteniendo el historial **inmutable** de evaluaciones previas»; `07-criterios-aceptacion.md` solo define ESC-01 a ESC-03; `08-modelo-dominio.md` no tiene atributos de versión, corrección ni auditoría; la spec del cambio (`specs/evaluacion-multidimensional/spec.md`) indica que «en ningún caso SHALL modificarse o eliminarse una evaluación previa»; `src/servicios/evaluacion.ts` solo inserta.
- **Diagnóstico:** **A. Cambio de requisito**, con una parte **B** (los artefactos no definían quién corrige ni cómo se registra). No es defecto de generación: el sistema cumplía exactamente lo especificado.
- **Decisión del estudiante (2026-11-11):** se mantiene todo inmutable. Si el historial fuera mutable, se abriría la posibilidad de que el paciente modifique su propia ficha, lo que no es correcto ni conveniente.
- **Coherencia de la decisión:** la inmutabilidad protege el historial (append-only) y el control de acceso protege la ficha. `CU-10` reserva el registro a `Gestor/a UGCO` y deja al `Médico tratante` en solo lectura; el RBAC real corresponde a `RNF-03`, que por regla del taller no se implementa (selector de rol de demostración).
- **Artefactos modificados:** ninguno. No hay regeneración pendiente por este punto.
- **Nota normativa:** para la ficha clínica aplican la Ley N° 20.584 y el DS N° 29/2012, junto con la Ley N° 19.628 y la Ley N° 21.719 (desde diciembre de 2026). La Ley N° 20.285 regula el acceso a información pública y aporta el principio de trazabilidad, pero no la custodia de la ficha clínica.

---

## Cierre de HU-02

- [x] HU-02-ESC-01 a HU-02-ESC-03 implementados y cubiertos por pruebas automatizadas.
- [x] `npm test` 23/23 y `npm run build` sin errores.
- [x] Recorrido manual del estudiante sin errores lógicos, de cálculo ni visuales.
- [x] Inmutabilidad del historial verificada (solo inserción; revaluaciones como registros nuevos).
- [x] Permisos verificados: solo `Gestor/a UGCO` registra; `Médico tratante`, solo lectura.
- [x] Ficha `.cin324/historias/HU-02.md` coherente con los artefactos.
- [x] OBS-1 descartada conscientemente; sin cambios en artefactos de requisitos.

## Siguiente paso

1. Hacer commit de la implementación y de este informe (mensaje sugerido: `feat(hu-02): implementar evaluación multidimensional y estratificación de vulnerabilidad`).
2. Archivar el cambio: `/opsx-archive hu-02-evaluacion-multidimensional`.
3. Continuar con HU-03 mediante `/cin324-generar-app`.
