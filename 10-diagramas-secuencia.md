# Diagramas de secuencia del sistema

Este documento describe, mediante diagramas de secuencia del sistema (DSS), las interacciones entre los actores externos y OncoTrace para las historias HU-05 y HU-08. OncoTrace se representa como una caja negra: los mensajes expresan objetivos y resultados del negocio, sin detallar métodos, componentes internos ni protocolos de comunicación.

**Referencias:** [Criterios de aceptación](./07-criterios-aceptacion.md) · [Modelo de dominio](./08-modelo-dominio.md) · [Casos de uso](./09-casos-de-uso.md) · [Historias de usuario](./04-historias-usuario.md).

## DSS-01 — Incorporar y consultar informes diagnósticos

**Identificador:** DSS-01.  
**Historia:** [HU-05](./04-historias-usuario.md#hu-05).  
**Casos de uso relacionados:** CU-01, Consolidar y consultar informes diagnósticos; CU-02, Recibir avisos de hallazgos críticos.

![DSS-01 — Incorporar y consultar informes diagnósticos](./diagramas/DSS-01-HU-05.png)

El flujo contempla informes disponibles en LIS o PACS y distingue su estado de validación e identificación. Cuando el informe está validado y el RUN permite asociarlo inequívocamente al caso, queda disponible para consulta y descarga en PDF. Si hay dos exámenes solicitados y solo uno se recibe, el escenario HU-05-ESC-01 deja la completitud en 50 % y mantiene pendiente el otro examen.

El fragmento `opt` representa la notificación prioritaria cuando el sistema de origen informa un hallazgo crítico. Las alternativas muestran el tratamiento de una discrepancia de identificación y de un informe todavía no validado, sin incorporarlos como resultados recibidos. El aviso comunica información del origen y no sustituye la evaluación clínica.

**Escenarios relacionados:** HU-05-ESC-01, HU-05-ESC-02, HU-05-ESC-03 y HU-05-ESC-04, definidos en [07-criterios-aceptacion.md](./07-criterios-aceptacion.md).

## DSS-02 — Gestionar derivación externa y retorno

**Identificador:** DSS-02.  
**Historia:** [HU-08](./04-historias-usuario.md#hu-08).  
**Casos de uso relacionados:** CU-03, Despachar derivación externa; CU-04, Registrar recepción y cita en HCVB; CU-06, Gestionar alertas de seguimiento; CU-07, Confeccionar dossier de derivación; CU-08, Registrar entrega del instructivo de pasajes; CU-09, Registrar retorno con epicrisis.

![DSS-02 — Gestionar derivación externa y retorno](./diagramas/DSS-02-HU-08.png)

El flujo muestra la confección del dossier con sus antecedentes, el registro de la entrega anticipada del instructivo del Anexo 6 y el despacho formalizado por UGAA con fecha y folio. La recepción solo cambia de estado cuando se registra la confirmación emitida por HCVB. La fecha de atención confirmada se registra como un hecho posterior y no significa que el tratamiento haya comenzado.

La interacción con el Sistema HCVB representa una integración propuesta, condicionada a la habilitación institucional. Si no existe una interfaz habilitada, el diagrama contempla que UGAA registre la respuesta recibida. La falta de recepción confirmada y de fecha de atención al cumplirse once días hábiles genera una alerta y mantiene la derivación como **Despachado por UGAA**. El inicio efectivo del tratamiento y el retorno con epicrisis se registran solo cuando existe el antecedente correspondiente.

**Escenarios relacionados:** HU-08-ESC-01 a HU-08-ESC-06, definidos en [07-criterios-aceptacion.md](./07-criterios-aceptacion.md).

## Correspondencia con la Entrega 2

| Diagrama | Historia y escenarios | Casos de uso | Conceptos del modelo de dominio |
| :--- | :--- | :--- | :--- |
| DSS-01 | HU-05-ESC-01 a HU-05-ESC-04 | CU-01 y CU-02 | `CasoOncologico`, `OrdenExamen` y `EstudioDiagnostico` |
| DSS-02 | HU-08-ESC-01 a HU-08-ESC-06 | CU-03, CU-04, CU-06, CU-07, CU-08 y CU-09 | `CasoOncologico`, `DossierDigitalDerivacion`, `InstructivoReembolsoPasajes`, `ContraReferenciaEpicrisis`, `AlertaSeguimiento` y `HitoAsistencial` |

Las relaciones con las clases se refieren a los conceptos del modelo de dominio; no implican que las clases sean participantes del DSS. Las secuencias son complementarias a los casos de uso y criterios de aceptación: no agregan actores, protocolos ni resultados clínicos nuevos.

## Archivos fuente

La fuente PlantUML editable contiene ambos diagramas:

- [diagramas-secuencia.puml](./diagramas/diagramas-secuencia.puml)
- [DSS-01 — HU-05](./diagramas/DSS-01-HU-05.png)
- [DSS-02 — HU-08](./diagramas/DSS-02-HU-08.png)
