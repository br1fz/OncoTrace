# Diagramas de estado

Este documento describe los estados y transiciones de dos objetos del dominio de OncoTrace: `AlertaSeguimiento` y `DossierDigitalDerivacion`. Los diagramas muestran situaciones del objeto y los hechos que justifican cada cambio, no una secuencia de tareas de los funcionarios.

**Referencias:** [Criterios de aceptación](./07-criterios-aceptacion.md) · [Modelo de dominio](./08-modelo-dominio.md) · [Casos de uso](./09-casos-de-uso.md) · [Diagramas de secuencia](./10-diagramas-secuencia.md) · [Historias de usuario](./04-historias-usuario.md).

## EST-01 — Ciclo de vida de una alerta de seguimiento

**Objeto:** `AlertaSeguimiento`.  
**Historias relacionadas:** HU-04 y HU-08.  
**Casos de uso relacionados:** CU-06, Gestionar alertas de seguimiento.

![EST-01 — Ciclo de vida de una alerta de seguimiento](./diagramas/EST-01-AlertaSeguimiento.png)

La alerta comienza en **Pendiente** cuando se alcanza un umbral y no existe una alerta activa equivalente. El umbral depende del tipo: cinco días hábiles para una garantía GES pendiente; más de quince días corridos de inactividad; u once días hábiles desde el despacho sin recepción confirmada ni fecha de atención. La evaluación repetida no debe generar alertas duplicadas.

| Estado de origen | Evento y condición | Estado de destino | Efecto registrado |
| :--- | :--- | :--- | :--- |
| Inicial | Se alcanza el umbral aplicable y no hay alerta activa equivalente. | Pendiente | Se crea la alerta con su caso y, cuando corresponda, su garantía o dossier asociado. |
| Pendiente | Una gestora autorizada registra una acción de gestión. | En gestión | Se conserva la acción; la alerta sigue abierta. |
| Pendiente | Se registra el hito que acredita el cumplimiento de una garantía GES. | Resuelta | Se vincula el hito que acredita el cumplimiento. |
| En gestión | Se registra el hito que acredita el cumplimiento de una garantía GES. | Resuelta | Se vincula el hito y se cierra la alerta. |
| Pendiente | Se registra una causa documentada que deja sin efecto una garantía GES. | No aplica | Se conservan el motivo, la fecha y la responsable del cierre. |
| En gestión | Se registra una causa documentada que deja sin efecto una garantía GES. | No aplica | Se conservan el motivo, la fecha y la responsable del cierre. |
| Resuelta o No aplica | El estado de cierre es terminal para esta alerta. | — | No se define una reapertura en los criterios de aceptación. |

Las transiciones a **Resuelta** y **No aplica** con causa GES están limitadas a las alertas de garantías. Los criterios actuales no especifican una regla de cierre para alertas de inactividad o rezago; por eso no se les atribuye una transición de cierre nueva en este diagrama.

## EST-02 — Seguimiento de una derivación externa

**Objeto:** `DossierDigitalDerivacion`.  
**Historia relacionada:** HU-08.  
**Casos de uso relacionados:** CU-03, CU-04, CU-06, CU-07, CU-08 y CU-09.

![EST-02 — Seguimiento de una derivación externa](./diagramas/EST-02-DossierDigitalDerivacion.png)

El dossier avanza por los seis estados definidos para HU-08. El registro de despacho requiere el dossier validado, la constancia de entrega anticipada del instructivo y los datos de despacho de UGAA. La recepción requiere confirmación emitida por HCVB. Si transcurren once días hábiles sin recepción ni fecha de atención, se genera una alerta y el dossier permanece despachado.

| Estado de origen | Evento y condición | Estado de destino | Efecto registrado |
| :--- | :--- | :--- | :--- |
| Inicial | Se confecciona el dossier con los antecedentes requeridos y la resolución firmada. | Dossier Confeccionado | Queda disponible para validación y despacho por UGAA. |
| Dossier Confeccionado | UGAA valida el dossier; la entrega anticipada del instructivo está registrada; se ingresan fecha y folio. | Despachado por UGAA | Se conserva la fecha y el folio del despacho. El despacho no confirma recepción. |
| Despachado por UGAA | Se registra una confirmación de recepción emitida por HCVB. | Recepcionado en HCVB | Se conservan la confirmación y la fecha de recepción. |
| Despachado por UGAA | Se cumplen once días hábiles sin recepción confirmada ni fecha de atención. | Despachado por UGAA | Se genera una alerta preventiva; el estado del dossier no cambia. |
| Recepcionado en HCVB | Se registra la fecha de atención confirmada por el centro receptor. | Cita Asignada | La fecha queda vinculada a la derivación; no representa inicio de tratamiento. |
| Cita Asignada | Se confirma el inicio efectivo del tratamiento. | Tratamiento Iniciado | Se registra el hito del caso con el antecedente disponible. |
| Tratamiento Iniciado | Finaliza la atención externa y la gestora incorpora la epicrisis y la contrarreferencia. | Contrarreferido con Epicrisis | Los documentos quedan vinculados al caso y el retorno se registra como hito. |
| Contrarreferido con Epicrisis | Estado final del circuito definido para HU-08. | — | El seguimiento continúa en el HGF según los antecedentes de retorno. |

El registro de recepción, cita, inicio de tratamiento y retorno puede realizarse a partir de antecedentes confirmados por el centro receptor. La eventual integración entre sistemas queda sujeta a habilitación institucional; el modelo no presupone una interfaz activa.

## Fuente editable

El archivo PlantUML contiene ambos diagramas de estado:

- [estados-objetos.puml](./diagramas/estados-objetos.puml)
- [EST-01 — AlertaSeguimiento](./diagramas/EST-01-AlertaSeguimiento.png)
- [EST-02 — DossierDigitalDerivacion](./diagramas/EST-02-DossierDigitalDerivacion.png)
