# Modelo de dominio

El modelo describe los conceptos del negocio necesarios para las historias HU-01, HU-04, HU-05 y HU-08: seguimiento de casos, alertas, informes diagnósticos y derivaciones externas. Sus clases y asociaciones sirven de referencia para los demás artefactos de la Entrega 2.

**Referencias:** [Criterios de aceptación](./07-criterios-aceptacion.md) · [Historias de usuario](./04-historias-usuario.md) · [Requisitos](./03-requisitos.md) · [Proceso TO-BE](./02-rediseno-to-be.md).

## Diagrama

**Identificador:** MD-01.

![MD-01 — Modelo de dominio de OncoTrace](../diagramas/modelo-dominio.png)

Archivo fuente: [modelo-dominio.puml](../diagramas/modelo-dominio.puml).

## Descripción de las clases

| Clase | Qué representa en el negocio | Atributos |
| :--- | :--- | :--- |
| `Paciente` | Persona atendida que tiene uno o más casos oncológicos registrados. | run, nombreCompleto |
| `CasoOncologico` | Caso cuyo seguimiento se realiza a lo largo de la trayectoria asistencial. | numeroCaso, especialidad, codigoDiagnosticoOSospecha, etapaActual, fechaIngreso |
| `HitoAsistencial` | Hecho del proceso de atención que se conserva en la línea de tiempo del caso. | tipo, fechaOcurrencia, fechaRegistro, responsable, rolResponsable |
| `GarantiaGES` | Garantía de oportunidad que se controla para un caso. | identificador, tipoGarantia, fechaInicio, fechaLimite, estadoCumplimiento |
| `AlertaSeguimiento` | Situación que requiere gestión por vencimiento próximo, inactividad o rezago de una derivación. | identificador, tipo, prioridad, fechaGeneracion, estado, motivoCierre, fechaCierre, responsableCierre |
| `OrdenExamen` | Solicitud de un estudio diagnóstico para un caso. | identificador, tipoEstudio, fechaSolicitud |
| `EstudioDiagnostico` | Estudio y su informe, cuya validación e identificación se comprueban antes de incorporarlo al caso. | identificadorInforme, runInformado, tipoEstudio, origen, fechaInforme, estadoValidacion, estadoRecepcion, hallazgoCritico |
| `ResolucionComite` | Conducta terapéutica acordada por el comité para un caso. | identificador, conductaAcordada, fechaResolucion, fechaFirma |
| `DossierDigitalDerivacion` | Expediente preparado para una derivación externa y su seguimiento hasta el retorno. | identificador, centroDestino, estado, fechaConfeccion, folioUGAA, fechaDespacho, fechaRecepcion, confirmacionRecepcion, fechaCita, fechaInicioTratamiento |
| `InstructivoReembolsoPasajes` | Ejemplar del instructivo asociado a un dossier, con su constancia de entrega. | referenciaAnexo, mediosCubiertos, exclusiones, requisitos, fechaEntrega, destinatario, responsableEntrega |
| `ContraReferenciaEpicrisis` | Antecedentes de cierre de la atención externa y del retorno al HGF. | identificador, fechaEmision, fechaRetornoHGF, resumenTratamiento, planSeguimiento |

`Texto`, `Fecha` y `FechaHora` describen el significado de los datos. Los atributos de fecha, confirmación o cierre se completan cuando ocurre el hecho correspondiente; no se exige que existan al crear el caso o el dossier.

## Asociaciones

Las multiplicidades se leen en ambos extremos. Por ejemplo, un paciente puede presentar varios casos, mientras que cada caso corresponde a un solo paciente.

| Asociación | Clases | Multiplicidades | Justificación |
| :--- | :--- | :--- | :--- |
| presenta | `Paciente` — `CasoOncologico` | Un paciente: 1..* casos. Un caso: 1 paciente. | Se representan personas que ya tienen casos registrados; una persona puede tener más de un caso. |
| registra | `CasoOncologico` — `HitoAsistencial` | Un caso: 0..* hitos. Un hito: 1 caso. | La línea de tiempo crece a medida que se registran hechos asistenciales. |
| tiene | `CasoOncologico` — `GarantiaGES` | Un caso: 0..* garantías. Una garantía: 1 caso. | Un caso puede tener varias garantías aplicables; no se exige una garantía para todo caso. |
| presenta | `CasoOncologico` — `AlertaSeguimiento` | Un caso: 0..* alertas. Una alerta: 1 caso. | Cada alerta debe permitir identificar el caso que requiere gestión. |
| origina | `GarantiaGES` — `AlertaSeguimiento` | Una garantía: 0..* alertas. Una alerta: 0..1 garantía. | Las alertas GES identifican su garantía. Las de inactividad o rezago tienen otro origen. |
| requiere | `CasoOncologico` — `OrdenExamen` | Un caso: 0..* órdenes. Una orden: 1 caso. | El seguimiento distingue los exámenes solicitados de sus resultados recibidos. |
| obtiene | `OrdenExamen` — `EstudioDiagnostico` | Una orden: 0..1 estudio. Un estudio: 0..1 orden. | La orden puede estar pendiente. Un informe con identificación discrepante puede conservarse para revisión sin asociarlo todavía a una orden. |
| cuenta con | `CasoOncologico` — `ResolucionComite` | Un caso: 0..* resoluciones. Una resolución: 1 caso. | El caso puede existir antes de su presentación y puede recibir nuevas resoluciones durante su atención. |
| tramita | `CasoOncologico` — `DossierDigitalDerivacion` | Un caso: 0..* dossiers. Un dossier: 1 caso. | No todos los casos requieren derivación externa y un caso puede tener varias derivaciones. |
| se basa en | `DossierDigitalDerivacion` — `ResolucionComite` | Un dossier: 1 resolución. Una resolución: 0..* dossiers. | En el circuito de HU-08, la derivación se prepara a partir de una decisión del comité. |
| incluye | `DossierDigitalDerivacion` — `EstudioDiagnostico` | Un dossier: 0..* estudios. Un estudio: 0..* dossiers. | Los informes se reúnen según los antecedentes requeridos y pueden utilizarse en más de una derivación del mismo caso. |
| incorpora | `DossierDigitalDerivacion` — `InstructivoReembolsoPasajes` | Un dossier: 0..1 instructivo. Un instructivo entregado: 1 dossier. | La asociación permite distinguir el dossier preparado de aquel que ya tiene adjunto el instructivo y su constancia de entrega. |
| recibe | `DossierDigitalDerivacion` — `ContraReferenciaEpicrisis` | Un dossier: 0..1 contrarreferencia con epicrisis. Una contrarreferencia: 1 dossier. | El retorno se incorpora cuando finaliza la atención externa. |
| origina | `DossierDigitalDerivacion` — `AlertaSeguimiento` | Un dossier: 0..* alertas. Una alerta: 0..1 dossier. | Una alerta de rezago identifica la derivación que requiere seguimiento. |
| justifica cierre | `HitoAsistencial` — `AlertaSeguimiento` | Un hito: 0..* alertas. Una alerta: 0..1 hito de cumplimiento. | Cuando una garantía se cumple, se conserva el hito que permite resolver su alerta. |

## Decisiones de modelado

- Se mantienen conceptos ya usados en la Entrega 1 y se incorporan `HitoAsistencial` y `AlertaSeguimiento` para representar explícitamente la línea de tiempo y las alertas de las historias seleccionadas.

- Gestor/a, TENS, funcionario/a de UGAA y médico tratante se representan como roles de quienes participan en el proceso, no como clases distintas. Los atributos de responsabilidad conservan quién registró un hecho o una entrega. Los permisos y la auditoría se especifican en RNF-03 y REQ-DER-01.

- Se usan asociaciones simples. No se necesita herencia para distinguir los informes en este alcance: su tipo y origen permiten describirlos. No se usa agregación ni composición, porque las historias no establecen dependencia de eliminación entre estos registros.

- Se conserva `EstudioDiagnostico` como concepto común para el estudio y su informe. La relación con `OrdenExamen` representa un resultado consolidado por orden, como en el modelo previo. Las discrepancias se conservan para revisión antes de establecer la asociación definitiva.

- `InstructivoReembolsoPasajes` representa el ejemplar asociado a una derivación y su entrega al paciente o cuidador. La plantilla institucional del Anexo 6 puede ser común; la constancia de entrega corresponde a cada dossier.

- `ContraReferenciaEpicrisis` reúne los antecedentes de retorno vinculados a una derivación, conservando el concepto usado en la Entrega 1.

### Tipos y estados del negocio

| Tipo | Valores o significado |
| :--- | :--- |
| `EtapaTrayectoria` | Sospecha; Confirmación diagnóstica; Etapificación; Tratamiento; Rehabilitación; Cuidados paliativos y alivio del dolor; Seguimiento y sobrevivientes; Alta y contrarreferencia. |
| `TipoAlerta` | Proximidad de vencimiento GES; Riesgo de Inactividad/Abandono; Rezago de derivación. |
| `EstadoAlerta` | Pendiente; En gestión; Resuelta; No aplica. Pendiente identifica una alerta generada que aún no tiene una gestión registrada; los otros estados se aplican según HU-04. |
| `EstadoDerivacionRed` | Dossier Confeccionado; Despachado por UGAA; Recepcionado en HCVB; Cita Asignada; Tratamiento Iniciado; Contrarreferido con Epicrisis. |

### Restricciones que complementan las multiplicidades

- El comité se registra como un hito; no es un valor de `EtapaTrayectoria`. Firmar su resolución no cambia por sí solo la etapa del caso.

- Cada alerta GES debe vincularse a una garantía del mismo caso. Cada alerta de rezago debe vincularse a un dossier del mismo caso. Una alerta de inactividad se vincula directamente al caso y no necesita garantía ni dossier de origen.

- Una gestión registrada no resuelve una garantía pendiente. El estado Resuelta requiere el hito de cumplimiento. El estado No aplica requiere una causa documentada, fecha y responsable del cierre.

- Un informe incorporado debe estar validado y vinculado a una orden del caso cuyo paciente coincida con el RUN informado. Si hay discrepancia, se conserva para revisión y no cuenta como examen recibido. Un informe pendiente de validación tampoco cuenta como recibido.

- Los estudios y la resolución incluidos en un dossier deben corresponder al mismo caso. La confección exige los antecedentes de HU-08-ESC-01 y la resolución firmada; las multiplicidades opcionales no eliminan esos prerrequisitos.

- Para el despacho a HCVB deben existir la fecha, el folio UGAA, el instructivo del Anexo 6 y su constancia de entrega anticipada, según HU-08-ESC-02. La recepción requiere una confirmación del centro receptor; no se deduce del despacho. Una cita asignada tampoco acredita el inicio del tratamiento.

- La contrarreferencia con epicrisis se asocia al dossier cuando se registra el retorno al HGF, según HU-08-ESC-06.

## Relación con las historias seleccionadas

| Historia | Conceptos principales |
| :--- | :--- |
| [HU-01](./04-historias-usuario.md#hu-01) | `Paciente`, `CasoOncologico`, `HitoAsistencial`, `ResolucionComite`. |
| [HU-04](./04-historias-usuario.md#hu-04) | `CasoOncologico`, `GarantiaGES`, `AlertaSeguimiento`, `HitoAsistencial`. |
| [HU-05](./04-historias-usuario.md#hu-05) | `CasoOncologico`, `OrdenExamen`, `EstudioDiagnostico`. |
| [HU-08](./04-historias-usuario.md#hu-08) | `CasoOncologico`, `ResolucionComite`, `DossierDigitalDerivacion`, `EstudioDiagnostico`, `InstructivoReembolsoPasajes`, `ContraReferenciaEpicrisis`, `AlertaSeguimiento`. |
