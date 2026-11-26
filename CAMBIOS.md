# Evaluación 2 · Implementación del Equipo 10

La especificación inicial del equipo está en el commit [fe704b1](https://github.com/br1fz/OncoTrace/commit/fe704b1ae788154eb1416f207dc86b1b848bff42). Este registro describe los ajustes de implementación.

| Artefacto | Situación inicial | Ajuste y motivo |
| :--- | :--- | :--- |
| RF-01 y HU-01 | El avance estaba dibujado en EST-03. La ficha preliminar lo condicionaba a la resolución de comité. | HU-01-CA5 identifica la indicación de estudios de extensión como evento de entrada a Etapificación, de acuerdo con EST-03. |
| Criterios de aceptación | HU-01-ESC-06 describía el avance con comité previo. | ESC-06 comprueba etapa, hito y tablero. ESC-07 y ESC-08 cubren los rechazos por etapa y rol. |
| Modelo de dominio | `CasoOncologico` ya tenía etapa actual y relación con `HitoAsistencial`. | La regla de avance usa esos campos. El registro de la indicación y el cambio de etapa se guardan juntos. |
| CU-05 | El seguimiento se asociaba a HU-01-ESC-01 a ESC-05. | CU-05 incluye la indicación y se vincula con los tres escenarios. La gestora y el médico tratante son los actores autorizados en la ficha de HU-01. |
| DSS-03 | La secuencia mostraba la consulta, el inicio de tratamiento, la resolución de comité y los rechazos de fechas. | Se agregan el registro de la indicación, el aviso de avance y los rechazos por etapa y rol. |
| EST-03 | La transición ya existía como indicación de estudios de extensión. | La flecha se vincula con ESC-06 y explicita el efecto del registro en el hito y el tablero. |
| Trazabilidad | RF-01 enlazaba HU-01, CU-05, DSS-03 y EST-03. | Se incorporan ESC-06 a ESC-08 y las referencias al código y a las pruebas. |

## Revisión de las seis historias

| Historia | Relación con el avance |
| :--- | :--- |
| HU-01 | Registra el hito, cambia la etapa y actualiza la ficha y el tablero. |
| HU-02 | La evaluación multidimensional sigue asociada al mismo caso. |
| HU-03 | La bitácora conserva sus puntos de contacto. El hito de indicación pertenece a la línea de tiempo clínica. |
| HU-04 | El motor de alertas conserva sus reglas de seguimiento. |
| HU-05 | El flujo de informes conserva la reevaluación que puede devolver el caso a Confirmación diagnóstica. |
| HU-06 | La ficha de presentación a comité tiene sus propios requisitos y se mantiene como una operación distinta al avance de etapa. |

## Evidencia

La suite completa pasó 105 pruebas y la compilación de TypeScript terminó sin errores. La demostración con `CASO-2026-002` confirmó el hito en la ficha y la tarjeta en la columna Etapificación.

- [Escenarios de HU-01](../Documentos/07-criterios-aceptacion.md#hu-01--tablero-de-trazabilidad-y-línea-de-tiempo-clínica-por-etapas)
- [Pruebas de seguimiento](../tests/hu-01-tablero.test.ts)
- [Demostración en el README](../README.md#2-ficha-del-caso-y-valoración-vigente)
