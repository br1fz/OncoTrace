# Diagramas de estado

Este documento describe los estados y transiciones de dos clases del dominio de OncoTrace con ciclo de vida relevante: `AlertaSeguimiento` y `DossierDigitalDerivacion`. Los diagramas muestran las situaciones de cada objeto; las tablas precisan los eventos, las condiciones y las acciones que justifican los cambios.

**Referencias:** [Criterios de aceptación](./07-criterios-aceptacion.md) · [Modelo de dominio](./08-modelo-dominio.md) · [Casos de uso](./09-casos-de-uso.md) · [Diagramas de secuencia](./10-diagramas-secuencia.md) · [Historias de usuario](./04-historias-usuario.md).

---

## EST-01 — Ciclo de vida de AlertaSeguimiento

- **Clase del dominio:** [`AlertaSeguimiento`](./08-modelo-dominio.md).
- **Historias relacionadas:** [HU-04](./04-historias-usuario.md#hu-04) y [HU-08](./04-historias-usuario.md#hu-08).
- **Caso de uso relacionado:** [CU-06 — Gestionar alertas de seguimiento](./09-casos-de-uso.md#casos-de-uso-y-su-origen).
- **Diagrama de secuencia relacionado:** [DSS-02 — Derivación externa y retorno](./10-diagramas-secuencia.md).

![EST-01 — Ciclo de vida de una alerta de seguimiento](./diagramas/EST-01-AlertaSeguimiento.png)

**Archivo fuente:** [estados-objetos.puml](./diagramas/estados-objetos.puml).

### Descripción del ciclo de vida

La alerta comienza en **Pendiente** cuando se cumple el umbral correspondiente: cinco días hábiles o menos para el vencimiento de una garantía GES; más de quince días corridos de inactividad; o, para una derivación, once días hábiles desde el despacho sin confirmación de recepción ni fecha de atención. En HU-04, la evaluación repetida no genera alertas redundantes mientras la condición siga activa y pendiente de resolución.

### Tabla de transiciones

Los rótulos del diagrama resumen las transiciones en el formato `evento [guarda] / acción` cuando corresponde. La tabla conserva el detalle de cada una. La flecha inicial muestra la acción de inicialización. Las condiciones de creación de la alerta se explican en la descripción y en el recuadro de creación del diagrama.

| Estado origen | Evento | Guarda | Acción | Estado destino |
| :--- | :--- | :--- | :--- | :--- |
| **Nodo inicial** | — | — | Vincular la alerta al caso y, si corresponde, a la garantía GES o al dossier | **Pendiente** |
| **Pendiente** | Registro de una acción de gestión | [Alerta GES y gestora autorizada] | Conservar la acción en la bitácora; no equivale al cumplimiento de la garantía | **En gestión** |
| **Pendiente** | Registro de hito de cumplimiento | [Cumplimiento de la garantía GES] | Vincular el hito que acredita el cumplimiento | **Resuelta** |
| **En gestión** | Registro de hito de cumplimiento | [Cumplimiento de la garantía GES] | Vincular el hito y cerrar la alerta | **Resuelta** |
| **Pendiente** | Registro de causa documentada | [La causa deja sin efecto la garantía GES] | Conservar el motivo, la fecha y la responsable del cierre | **No aplica** |
| **En gestión** | Registro de causa documentada | [La causa deja sin efecto la garantía GES] | Conservar el motivo, la fecha y la responsable del cierre | **No aplica** |
| **Resuelta** | — | — | — | **Fin** |
| **No aplica** | — | — | — | **Fin** |

**Nota:** Los criterios definen las transiciones a **En gestión**, **Resuelta** y **No aplica** para alertas GES. No especifican transiciones posteriores a la generación de alertas por inactividad o rezago. El aviso clínico de hallazgo crítico de HU-05, representado en DSS-01, no forma parte del ciclo de `AlertaSeguimiento`.

---

## EST-02 — Ciclo de vida de DossierDigitalDerivacion

- **Clase del dominio:** [`DossierDigitalDerivacion`](./08-modelo-dominio.md).
- **Historia relacionada:** [HU-08](./04-historias-usuario.md#hu-08).
- **Diagrama de secuencia relacionado:** [DSS-02 — Derivación externa y retorno](./10-diagramas-secuencia.md).

![EST-02 — Seguimiento de una derivación externa](./diagramas/EST-02-DossierDigitalDerivacion.png)

**Archivo fuente:** [estados-objetos.puml](./diagramas/estados-objetos.puml).

### Descripción del ciclo de vida

El dossier recorre los seis estados definidos para HU-08. Su ciclo comienza cuando TENS solicita confeccionarlo y están disponibles los antecedentes requeridos y la resolución firmada que indica la derivación. Para formalizar el despacho, el dossier debe estar completo y validado por UGAA, la entrega anticipada del instructivo del Anexo 6 debe quedar registrada y se deben informar la fecha y el folio. La recepción requiere confirmación emitida por HCVB. Si al cumplirse once días hábiles desde el despacho no hay confirmación de recepción ni fecha de atención, se genera una alerta y el dossier permanece **Despachado por UGAA**.

La asignación de una cita no acredita el inicio del tratamiento. El estado **Tratamiento Iniciado** requiere confirmar ese hecho. Al finalizar la atención externa, la gestora incorpora la epicrisis y la contrarreferencia, y registra el retorno como hito. El estado finaliza el ciclo de la derivación; el seguimiento del caso continúa en HGF.

### Tabla de transiciones

Los rótulos del diagrama resumen las transiciones en el formato `evento [guarda] / acción` cuando corresponde. La tabla conserva el detalle de cada una. La flecha inicial muestra la acción de inicialización y el recuadro superior indica las condiciones de creación del dossier.

Los eventos asociados a interacciones corresponden a los mensajes de [DSS-02](./10-diagramas-secuencia.md). El cumplimiento del plazo de once días hábiles es un evento temporal. Cuando HCVB no tiene una interfaz habilitada, UGAA registra la confirmación de recepción o la fecha de atención comunicada por ese hospital.

| Estado origen | Evento | Guarda | Acción | Estado destino |
| :--- | :--- | :--- | :--- | :--- |
| **Nodo inicial** | — | — | Reunir los antecedentes y dejar el dossier disponible para validación de UGAA | **Dossier Confeccionado** |
| **Dossier Confeccionado** | Formalizar despacho con fecha y folio UGAA | [Dossier completo y validado por UGAA, constancia de entrega anticipada registrada y fecha y folio informados] | Registrar la fecha y el folio del despacho y asociar la constancia de entrega | **Despachado por UGAA** |
| **Despachado por UGAA** | Confirmar recepción y fecha | [Confirmación emitida por HCVB para esa derivación] | Conservar la confirmación y la fecha de recepción | **Recepcionado en HCVB** |
| **Despachado por UGAA** | Al cumplirse 11 días hábiles desde el despacho | [Sin confirmación de recepción ni fecha de atención] | Generar y notificar una alerta preventiva vinculada a la derivación | **Despachado por UGAA** |
| **Recepcionado en HCVB** | Informar la fecha de atención confirmada | [Fecha confirmada por el centro receptor] | Vincular la fecha de atención a la derivación | **Cita Asignada** |
| **Cita Asignada** | Registrar el inicio confirmado del tratamiento | [Antecedente que confirma el inicio disponible] | Registrar el hito de inicio en el caso | **Tratamiento Iniciado** |
| **Tratamiento Iniciado** | Registrar el retorno al HGF | [Atención externa finalizada y epicrisis y contrarreferencia disponibles] | Vincular ambos documentos, registrar el hito de retorno y notificar a la gestora | **Contrarreferido con Epicrisis** |
| **Contrarreferido con Epicrisis** | — | — | — | **Fin** |

---

## Fuente editable

El archivo PlantUML editable que contiene ambos diagramas de estado se encuentra en el repositorio:

- [estados-objetos.puml](./diagramas/estados-objetos.puml)
