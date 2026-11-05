# Diagramas de secuencia del sistema

Este documento describe las interacciones de los actores con OncoTrace para las historias HU-05 y HU-08. Los diagramas representan el sistema como una caja negra y muestran los mensajes y resultados que observan sus participantes.

**Referencias:** [Criterios de aceptación](./07-criterios-aceptacion.md) · [Modelo de dominio](./08-modelo-dominio.md) · [Casos de uso](./09-casos-de-uso.md) · [Historias de usuario](./04-historias-usuario.md).

---

## DSS-01 — Incorporar y consultar informes diagnósticos

- **Casos de uso:** [CU-01 y CU-02](./09-casos-de-uso.md#casos-de-uso-y-su-origen).
- **Historia:** [HU-05](./04-historias-usuario.md#hu-05).
- **Sistemas externos:** LIS y PACS.

![DSS-01 — Incorporar y consultar informes diagnósticos](../diagramas/DSS-01-HU-05.png)

**Archivo fuente:** [diagramas-secuencia.puml](../diagramas/diagramas-secuencia.puml).

La gestora consulta los informes y el estado de los exámenes del caso. OncoTrace obtiene los antecedentes disponibles de LIS y PACS a través de las interfaces institucionales habilitadas. Si el informe está validado y el RUN permite asociarlo inequívocamente al caso, OncoTrace lo incorpora y deja disponible su copia en PDF. En HU-05-ESC-01, al recibir uno de los dos exámenes solicitados, la completitud queda en 50 % y el otro examen sigue pendiente.

### Variantes representadas

- **`alt` — Validación e identificación.** Si el RUN no permite identificar al paciente con certeza, el informe queda como excepción pendiente de revisión, se registra la discrepancia para auditoría y el examen sigue pendiente. Si el informe aún no está validado en el sistema de origen, se mantiene pendiente la recepción del resultado validado.
- **`opt` — Hallazgo crítico.** Si se incorpora un informe validado de anatomía patológica con un hallazgo de malignidad o un valor crítico informado por el origen, OncoTrace notifica al médico tratante y a la gestora. El aviso permite identificar el caso y el informe.

---

## DSS-02 — Gestionar derivación externa y retorno

- **Casos de uso:** [CU-03, CU-04, CU-06, CU-07, CU-08 y CU-09](./09-casos-de-uso.md#casos-de-uso-y-su-origen).
- **Historia:** [HU-08](./04-historias-usuario.md#hu-08).
- **Sistema externo:** Sistema del Hospital Carlos Van Buren (HCVB), sujeto a la habilitación y autorización de la interfaz institucional.

![DSS-02 — Gestionar derivación externa y retorno](../diagramas/DSS-02-HU-08.png)

**Archivo fuente:** [diagramas-secuencia.puml](../diagramas/diagramas-secuencia.puml).

TENS solicita la confección del dossier. En el flujo representado, la gestora registra la entrega anticipada del instructivo de pasajes del Anexo 6. UGAA valida los antecedentes del dossier y, con la constancia de entrega registrada, formaliza el despacho con su fecha y folio. La derivación queda en estado **Despachado por UGAA**.

### Variantes representadas

- **`opt` — Envío de antecedentes.** OncoTrace envía los antecedentes a HCVB por el mecanismo acordado cuando la interfaz institucional está habilitada y autorizada.
- **`opt` — Alerta de seguimiento.** Si al cumplirse once días hábiles desde el despacho siguen sin registrarse la confirmación de recepción y la fecha de atención, OncoTrace genera una alerta preventiva que identifica la derivación y el tiempo transcurrido. El dossier permanece en estado **Despachado por UGAA**. La confirmación puede llegar después de la alerta.
- **`opt` y `alt` — Recepción y cita.** La derivación pasa a **Recepcionado en HCVB** al registrar la confirmación emitida por ese hospital. La fecha de atención confirmada se registra por separado y permite pasar a **Cita Asignada**. Con una interfaz habilitada, los antecedentes se reciben desde el sistema de HCVB. Si la interfaz no está habilitada, UGAA registra la información confirmada por el centro receptor.
- **`opt` — Inicio del tratamiento y retorno.** El estado **Tratamiento Iniciado** requiere confirmar el inicio efectivo. Cuando finaliza la atención externa, la gestora incorpora la epicrisis y la contrarreferencia. OncoTrace registra **Contrarreferido con Epicrisis**, deja un hito en la línea de tiempo y notifica a la gestora para continuar el seguimiento.

---

## Correspondencia con la Entrega 2

| Diagrama | Escenarios de aceptación | Casos de uso | Participantes externos a OncoTrace | Conceptos del modelo de dominio |
| :--- | :--- | :--- | :--- | :--- |
| **DSS-01** | HU-05-ESC-01 a HU-05-ESC-04 | CU-01 y CU-02 | Gestor/a UGCO, médico tratante, LIS y PACS | `CasoOncologico`, `OrdenExamen`, `EstudioDiagnostico` |
| **DSS-02** | HU-08-ESC-01 a HU-08-ESC-06 | CU-03, CU-04, CU-06, CU-07, CU-08 y CU-09 | TENS UGCO, funcionario/a UGAA, gestor/a UGCO y Sistema HCVB | `CasoOncologico`, `DossierDigitalDerivacion`, `InstructivoReembolsoPasajes`, `ContraReferenciaEpicrisis`, `AlertaSeguimiento`, `HitoAsistencial` |
