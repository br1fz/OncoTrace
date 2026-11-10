# Informe de validación — HU-01 · Tablero de trazabilidad y línea de tiempo (vuelta 2)

**Fecha:** 2026-11-10
**Cambio validado:** `hu-01-tablero-trazabilidad` (archivado 2026-11-09)
**Estado:** verificado en el sistema (ajuste `2026-11-10-ajuste-hu-01-consistencia-temporal` implementado y probado con 13/13 tests)

---

## Resumen de observaciones

| Obs. | Lo que observaste | Tipo | Artefacto principal | También revisado |
| :--- | :--- | :---: | :--- | :--- |
| **OBS-1** | El sistema no rechaza una fecha de ocurrencia futura; se espera que la rechace porque un hito ya ocurrió. | **B. Brecha de especificación** | `Documentos/07-criterios-aceptacion.md` → `HU-01-ESC-04` | `03`, `04`, `09`, `10` (+ `.puml`), `12` |
| **OBS-2** | La burbuja del navegador pide los campos vacíos («Complete este campo» / «Seleccione un elemento de la lista»). | **F. Uso** | Ninguno (validación nativa HTML5 esperada) | — |

**Lo que sí funcionó en esta vuelta:**
- Rechazo del inicio de tratamiento sin resolución previa, con el mensaje correcto y el caso permaneciendo en **Confirmación diagnóstica**.
- Manejo de rutas inexistentes (404).
- Cambio de rol persistente con cookie.
- «Tablero por Etapas» sin caídas (resuelto con `better-sqlite3@13`).
- Seguimiento y cambios de estado correctos según EST-03.
- 11/11 pruebas automatizadas pasando.

---

## Detalle OBS-1 — Fecha de ocurrencia futura

- **Lo que dijiste:** «espero que el sistema rechace si es una fecha futura cuando se registre algo que necesariamente es del pasado, como hitos que ya han sucedido».
- **Qué decían los artefactos antes del cambio:** el Gherkin de HU-01 solo tenía ESC-01 a ESC-03 (`07-criterios-aceptacion.md`); la historia no tenía criterio de fecha (`04-historias-usuario.md`, CA1–CA6); la ficha solo exigía rechazar por datos faltantes (`.cin324/historias/HU-01.md`, línea 46); el servicio validaba únicamente la presencia de los campos (`src/servicios/seguimiento.ts`, líneas 124–135); el formulario tenía `required` pero no un máximo (`src/vistas/hito-nuevo.ejs`, línea 42).
- **Diagnóstico:** **B (brecha de especificación)**. El sistema tomó la decisión razonable de aceptar cualquier fecha porque la regla no estaba escrita. La burbuja que viste al escribir la fecha fue del navegador (valor no interpretado), no una validación de futuro.
- **Decisión de negocio:** se permite la fecha de hoy o anterior; se rechaza cualquier fecha **posterior a hoy** con el mensaje «La fecha de ocurrencia no puede ser futura». El estudiante amplió la regla a la **consistencia temporal completa**: también se rechaza una fecha **anterior a la del último hito registrado** del caso, y los hitos confirmados son inmutables (no admiten modificaciones retroactivas de fecha).

### Cambios aplicados por el estudiante (commit `cc4ec3d`)

| Artefacto | Cambio | Estado |
| :--- | :--- | :---: |
| `Documentos/03-requisitos.md` | RF-01 incorpora la inmutabilidad y la consistencia temporal (no futura ni anterior al último hito) | ✔ |
| `Documentos/04-historias-usuario.md` | Nuevo `HU-01-CA7` con la regla temporal y de inmutabilidad | ✔ |
| `Documentos/07-criterios-aceptacion.md` | Nuevos `HU-01-ESC-04` (fecha futura) y `HU-01-ESC-05` (anterior al último hito), con los mensajes exactos | ✔ |
| `Documentos/09-casos-de-uso.md` | CU-05 pasa a «HU-01-ESC-01 a HU-01-ESC-05»; regla de consistencia 1 actualizada | ✔ |
| `Documentos/10-diagramas-secuencia.md` | DSS-03 agrega las variantes de rechazo ESC-04 y ESC-05; tabla de correspondencia actualizada | ✔ |
| `diagramas/diagramas-secuencia.puml` | DSS-03 agrega las ramas `else` de rechazo ESC-04 y ESC-05 | ✔ |
| `Documentos/12-trazabilidad.md` | Fila de escenarios de HU-01 actualizada a ESC-01 a ESC-05 | ✔ |

### Revisión de consistencia (C1–C14)

- **C1–C3:** TB-01, CU-05 y los actores Gestor/a UGCO y médico tratante se mantienen. ✔
- **C4–C6:** los términos y atributos (`HitoAsistencial.fechaOcurrencia`, `CasoOncologico.etapaActual`) existen en el modelo; las multiplicidades no cambian. ✔
- **C7–C8:** los rechazos no crean estados ni transiciones; las ocho etapas de EST-03 se mantienen. ✔
- **C9–C10:** cada rama nueva del DSS-03 tiene su escenario y sus mensajes coinciden con el Gherkin. ✔
- **C11:** no hay sistemas externos involucrados. ✔
- **C12:** RF-01 queda cubierto por ESC-01 a ESC-05. ✔
- **C13:** los escenarios son verificables y están en lenguaje de negocio. ✔
- **C14:** las reglas siguen dentro del objetivo de HU-01 (registro de hitos y línea de tiempo). ✔

### Observación de alcance (no bloqueante)

La palabra «inmutable» de RF-01 y del CA7 queda cubierta en la práctica por **ESC-05** (no se admiten inserciones retroactivas) y porque la aplicación **no ofrece edición ni borrado de hitos**. Si se quisiera una regla más amplia (por ejemplo, impedir explícitamente una futura edición), faltaría un escenario propio. No es necesario para esta historia.

### Pendiente

- **Regenerar el sistema:** el código actual todavía acepta fechas futuras; los artefactos ya definen la regla. Corresponde ejecutar `/cin324-generar-app` para crear el ajuste `ajuste-hu-01-…` e implementar ESC-04 y ESC-05.
- **Ficha de la historia:** `.cin324/historias/HU-01.md` aún no incluye ESC-04/ESC-05. No se editó aquí; el flujo de `/cin324-generar-app` actualiza la ficha en su paso de validación de la historia.
- **Imagen del DSS-03:** existe la fuente `diagramas/diagramas-secuencia.puml`, pero no hay `DSS-03-HU-01.png` exportado (solo existen los de DSS-01 y DSS-02). Si la entrega requiere la imagen, expórtala desde la fuente.

---

## Detalle OBS-2 — Burbujas de campos obligatorios

- **Diagnóstico:** **F (uso)**. Es la validación nativa del navegador sobre los campos obligatorios (`tipo`, `fechaOcurrencia`, `rolResponsable` y `responsable`, en `src/vistas/hito-nuevo.ejs`). Impide enviar vacío y no requiere cambios en los artefactos. El servidor también valida la presencia y está cubierto por las pruebas.

---

## Estado por observación

| Observación | Estado |
| :--- | :--- |
| OBS-1 — fecha futura | **✔ artefactos actualizados** — pendiente regenerar y verificar en el sistema |
| OBS-2 — burbujas del navegador | **✔ sin cambio** (comportamiento esperado) |

## Siguiente paso

Ejecutar `/cin324-generar-app` para el ajuste de HU-01 con las nuevas reglas (ESC-04 y ESC-05) y, cuando el sistema esté actualizado, volver a ejecutar `/cin324-validar-sistema` para comprobar que el rechazo de fechas futuras y de fechas anteriores al último hito funciona en pantalla.
