# Diagramas de secuencia de sistema

Este documento describe, mediante diagramas de secuencia del sistema (DSS), las interacciones de caja negra entre los actores externos y el núcleo de OncoTrace para las historias de usuario HU-05 y HU-08.

**Referencias:** [Criterios de aceptación](./07-criterios-aceptacion.md) · [Modelo de dominio](./08-modelo-dominio.md) · [Casos de uso](./09-casos-de-uso.md) · [Historias de usuario](./04-historias-usuario.md).

---

## DSS-01 — Incorporar y consultar informes diagnósticos

- Caso de uso: [CU-01, CU-02](./09-casos-de-uso.md)
- Historia: [HU-05](./04-historias-usuario.md#hu-05)
- Sistemas externos que participan: LIS / PACS, Servicio Validación RUN

![DSS-01 — Incorporar y consultar informes diagnósticos](./diagramas/DSS-01-HU-05.png)

Archivo fuente: [`./diagramas/diagramas-secuencia.puml`](./diagramas/diagramas-secuencia.puml)

Variantes representadas:
- **alt / else (Validación y coincidencia de RUN):** Maneja la incorporación exitosa con RUN validado frente a la discrepancia de identidades o informes no validados.
- **alt / else (Completitud de exámenes):** Actualiza la completitud al 50% en escenario de múltiples exámenes (HU-05-ESC-01) manteniendo pendiente el resto, o la marca al 100% cuando el conjunto está completo.
- **opt (Hallazgo crítico):** Emisión prioritaria de notificaciones al profesional clínico ante alertas detectadas en origen (CU-02).
- **opt (Descarga PDF):** Descarga del informe validado en formato PDF por parte del profesional clínico.

### Especificación de Líneas de Interacción y Flujo
El flujo contempla la ingesta automatizada o manual de informes provenientes de laboratorios (LIS) o imágenes médicas (PACS). 
1. **Identificación y Validación:** El sistema evalúa el estado de validación del informe y contrasta el RUN del paciente con el caso oncológico activo.
2. **Asociación Exitosa:** Cuando el informe cuenta con validación clínica y el RUN permite asociarlo inequívocamente, el sistema consolida el resultado, actualiza la completitud del expediente y deja el documento disponible para consulta y descarga en formato PDF.
3. **Escenario de Completitud Parcial:** Si el caso médico requiere múltiples exámenes y solo se recibe uno, el escenario HU-05-ESC-01 actualiza la completitud al 50% y mantiene el saldo como pendiente sin bloquear la vista clínica.
4. **Manejo de Excepciones y Discrepancias:** Si existe una discrepancia de identificación o el informe figura como no validado, el sistema rechaza la incorporación automática como resultado definitivo y genera una alerta de revisión.

---

## DSS-02 — Gestionar derivación externa y retorno

- Caso de uso: [CU-03, CU-04, CU-06, CU-07, CU-08, CU-09](./09-casos-de-uso.md)
- Historia: [HU-08](./04-historias-usuario.md#hu-08)
- Sistemas externos que participan: Sistema Externo HCVB (Hospital Carlos van Buren)

![DSS-02 — Gestionar derivación externa y retorno](./diagramas/DSS-02-HU-08.png)

Archivo fuente: [`./diagramas/diagramas-secuencia.puml`](./diagramas/diagramas-secuencia.puml)

Variantes representadas:
- **alt / else (Integración institucional con HCVB):** Transmisión automatizada a HCVB si la interfaz está habilitada, o registro manual por el usuario en caso contrario.
- **opt (Alerta de seguimiento por plazo):** Evaluación al día hábil 11 sin cita confirmada, conservando el estado "Despachado por UGAA" y disparando la alerta de seguimiento (CU-06).
- **alt (Confirmación de cita asistencial):** Registro asíncrono de la fecha de atención confirmada por HCVB (CU-04).

### Especificación de Líneas de Interacción y Flujo
El diagrama detalla el ciclo completo de transferencia del paciente a un centro de alta complejidad:
1. **Confección y Despacho:** El operador consolida el dossier digital, registra la entrega anticipada del instructivo de pasajes (Anexo 6) y ejecuta el despacho formal asignando fecha y folio.
2. **Integración con HCVB:** La interacción se modela sujeta a disponibilidad institucional; en su ausencia, se contempla el registro manual de la confirmación.
3. **Monitoreo de Plazos:** Si transcurren 11 días hábiles sin confirmación de recepción ni cita, el sistema activa automáticamente una alerta de seguimiento (CU-06).
4. **Cierre del Ciclo:** El inicio del tratamiento y el retorno formal del paciente mediante el envío de la epicrisis se registran como eventos de cierre.

---

## Correspondencia con la Entrega 2

| Diagrama | Historia y escenarios | Casos de uso | Actores Principales | Conceptos del modelo de dominio |
| :--- | :--- | :--- | :--- | :--- |
| **DSS-01** | HU-05-ESC-01 a HU-05-ESC-04 | CU-01 y CU-02 | LIS / PACS, Servicio RUN, Profesional Clínico | `CasoOncologico`, `OrdenExamen`, `EstudioDiagnostico` |
| **DSS-02** | HU-08-ESC-01 a HU-08-ESC-06 | CU-03, CU-04, CU-06, CU-07, CU-08, CU-09 | Gestor/a UGCO, Funcionario/a UGAA, Sistema HCVB | `CasoOncologico`, `DossierDigitalDerivacion`, `InstructivoReembolsoPasajes`, `ContraReferenciaEpicrisis`, `AlertaSeguimiento`, `HitoAsistencial` |
