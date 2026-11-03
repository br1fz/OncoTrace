# Diagramas de secuencia del sistema (DSS)

Este documento describe, mediante diagramas de secuencia del sistema (DSS), las interacciones de caja negra entre los actores externos y el núcleo de **OncoTrace** para las historias de usuario **HU-05** y **HU-08**. 

Bajo este enfoque, el sistema se representa como una unidad indivisible (caja negra): los mensajes expresan objetivos de negocio, eventos del dominio y resultados verificables, abstrayéndose de detalles de implementación interna, protocolos de red específicos o persistencia de datos.

**Referencias del Proyecto:** 
* [Criterios de aceptación](./07-criterios-aceptacion.md) 
* [Modelo de dominio](./08-modelo-dominio.md) 
* [Casos de uso](./09-casos-de-uso.md) 
* [Historias de usuario](./04-historias-usuario.md)

---

## DSS-01 — Incorporar y consultar informes diagnósticos

* **Identificador:** DSS-01.
* **Historia de Usuario asociada:** [HU-05](./04-historias-usuario.md#hu-05) (*Consolidar y consultar informes diagnósticos*).
* **Casos de uso relacionados:** 
  * `CU-01`: Consolidar y consultar informes diagnósticos.
  * `CU-02`: Recibir avisos de hallazgos críticos.
* **Actores involucrados:** Sistemas Externos (LIS / PACS), Profesional Clínico, Subsistema de Validación de Identidad (RUN).

![DSS-01 — Incorporar y consultar informes diagnósticos](./diagramas/DSS-01-HU-05.png)

### Especificación de Líneas de Interacción y Flujo
El flujo contempla la ingesta automatizada o manual de informes provenientes de laboratorios (LIS) o imágenes médicas (PACS). 
1. **Identificación y Validación:** El sistema evalúa el estado de validación del informe y contrasta el RUN del paciente con el caso oncológico activo.
2. **Asociación Exitosa:** Cuando el informe cuenta con validación clínica y el RUN permite asociarlo inequívocamente, el sistema consolida el resultado, actualiza la completitud del expediente y deja el documento disponible para consulta y descarga en formato PDF.
3. **Escenario de Completitud Parcial:** Si el caso médico requiere múltiples exámenes (por ejemplo, dos solicitudes activas) y solo se recibe uno, el escenario `HU-05-ESC-01` actualiza el porcentaje de completitud (ej. 50 %) y mantiene el saldo como pendiente sin bloquear la vista clínica.
4. **Manejo de Excepciones y Discrepancias:** 
   * Si existe una discrepancia de identificación o el informe figura como *no validado*, el sistema rechaza la incorporación automática como resultado definitivo y genera una alerta de revisión.
   * El fragmento interactivo `opt` gestiona la **notificación prioritaria** en caso de que el sistema de origen marque un hallazgo crítico. Este aviso opera como mecanismo de alerta temprana y no sustituye el juicio ni la evaluación clínica formal.

**Escenarios de aceptación cubiertos:** `HU-05-ESC-01`, `HU-05-ESC-02`, `HU-05-ESC-03` y `HU-05-ESC-04`, definidos en [07-criterios-aceptacion.md](./07-criterios-aceptacion.md).

---

## DSS-02 — Gestionar derivación externa y retorno

* **Identificador:** DSS-02.
* **Historia de Usuario asociada:** [HU-08](./04-historias-usuario.md#hu-08) (*Gestionar derivación externa y retorno*).
* **Casos de uso relacionados:** 
  * `CU-03`: Despachar derivación externa.
  * `CU-04`: Registrar recepción y cita en HCVB (Hospital Carlos van Buren).
  * `CU-06`: Gestionar alertas de seguimiento.
  * `CU-07`: Confeccionar dossier de derivación.
  * `CU-08`: Registrar entrega del instructivo de pasajes.
  * `CU-09`: Registrar retorno con epicrisis.
* **Actores involucrados:** Gestor UGAA, Sistema Externo HCVB, Paciente / Tutor.

![DSS-02 — Gestionar derivación externa y retorno](./diagramas/DSS-02-HU-08.png)

### Especificación de Líneas de Interacción y Flujo
El diagrama detalla el ciclo completo de transferencia del paciente a un centro de alta complejidad (HCVB):
1. **Confección y Despacho:** El operador UGAA consolida el dossier digital con todos los antecedentes clínicos requeridos, registra la entrega anticipada del instructivo de pasajes (Anexo 6) y ejecuta el despacho formal, asignando fecha y folio de salida.
2. **Integración con HCVB:** La interacción con el sistema del Hospital Carlos van Buren se modela como una integración sujeta a disponibilidad institucional. En ausencia de interfaz automatizada, el operador registra manualmente la respuesta recibida.
3. **Monitoreo de Plazos y Alertas:** 
   * Si transcurren **once días hábiles** sin confirmación de recepción ni fecha de cita agendada, el sistema activa automáticamente una **alerta de seguimiento** (`CU-06`), conservando el estado de la derivación como **Despachado por UGAA**.
   * La confirmación de recepción por parte de HCVB actualiza el estado operativo. La fecha de cita registrada representa un hito administrativo y **no implica** el inicio efectivo del tratamiento.
4. **Cierre del Ciclo:** El inicio del tratamiento clínico y el retorno formal del paciente mediante el envío de la epicrisis se registran como eventos de cierre cuando los antecedentes físicos o digitales son convalidados.

**Escenarios de aceptación cubiertos:** `HU-08-ESC-01` a `HU-08-ESC-06`, definidos en [07-criterios-aceptacion.md](./07-criterios-aceptacion.md).

---

## Matriz de Trazabilidad y Correspondencia (Entrega 2)

La siguiente tabla amplía la trazabilidad formal entre los diagramas de secuencia, las especificaciones funcionales y los conceptos estructurales del dominio:

| Diagrama | Historia / Escenarios | Casos de Uso | Actores Principales | Conceptos del Modelo de Dominio | Estado Inicial / Final Relevante |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **DSS-01** | `HU-05-ESC-01`<br>`HU-05-ESC-02`<br>`HU-05-ESC-03`<br>`HU-05-ESC-04` | `CU-01`<br>`CU-02` | LIS / PACS, Profesional Clínico | `CasoOncologico`, `OrdenExamen`, `EstudioDiagnostico`, `InformeClinico` | Pendiente de Recepción $\rightarrow$ Consolidado / Validado |
| **DSS-02** | `HU-08-ESC-01`<br>`HU-08-ESC-02`<br>`HU-08-ESC-03`<br>`HU-08-ESC-04`<br>`HU-08-ESC-05`<br>`HU-08-ESC-06` | `CU-03`, `CU-04`, `CU-06`, `CU-07`, `CU-08`, `CU-09` | Gestor UGAA, Sistema HCVB | `CasoOncologico`, `DossierDigitalDerivacion`, `InstructivoReembolsoPasajes`, `ContraReferenciaEpicrisis`, `AlertaSeguimiento`, `HitoAsistencial` | En Derivación $\rightarrow$ Despachado $\rightarrow$ Retornado / Con Epicrisis |

> *Nota técnica:* Las asociaciones indicadas con las clases del dominio representan los objetos afectados o consultados durante las interacciones del sistema, manteniendo la separación estricta entre la vista de comportamiento dinámico (DSS) y la estructura estática (Modelo de Dominio).

---

## Consideraciones de Diseño y Robustez

1. **Idempotencia en Ingesta (DSS-01):** Los mensajes provenientes de LIS/PACS deben asegurar identificadores únicos de transacción para evitar duplicidad de informes ante reintentos de red.
2. **Gestión Asíncrona de Tiempos (DSS-02):** El control del plazo crítico de 11 días hábiles se apoya en un servicio de tareas programadas (*scheduler*) interno que evalúa diariamente los casos en estado de despacho y dispara las alertas alfanuméricas correspondientes en la bandeja del gestor UGAA.

---

## Código Fuente PlantUML

```plantuml
@startuml diagramas-secuencia
skinparam style strictuml
skinparam sequenceMessageAlign center
skinparam maxMessageSize 250

title Diagramas de Secuencia del Sistema (DSS) - OncoTrace

' ==========================================
' DSS-01: Incorporar y consultar informes diagnósticos (HU-05)
' ==========================================
newpage DSS-01 — Incorporar y consultar informes diagnósticos (HU-05)

actor "Sistema Externo\n(LIS / PACS)" as LIS_PACS
actor "Profesional Clínico" as Clinico
participant "OncoTrace\n(Sistema)" as Sistema
actor "Servicio Validación\nRUN" as RUN

activate LIS_PACS
LIS_PACS -> Sistema: enviarInformeDiagnostico(idExamen, runPaciente, payloadInforme, estadoValidacion)
activate Sistema

Sistema -> RUN: validarIdentidadPaciente(runPaciente)
activate RUN
RUN --> Sistema: confirmacionIdentidad(valido)
deactivate RUN

alt Informe validado y RUN coincide inequívocamente
    Sistema -> Sistema: asociarInformeACaso(idExamen, runPaciente)
    
    alt Caso requiere múltiples exámenes (HU-05-ESC-01)
        Sistema -> Sistema: actualizarCompletitudExpediente(porcentajeCompletitud)
        Sistema --> LIS_PACS: recepcionConfirmada(estado: "Parcial/Pendiente")
    else Examen único o finalización de conjunto
        Sistema -> Sistema: actualizarCompletitudExpediente(100%)
        Sistema --> LIS_PACS: recepcionConfirmada(estado: "Consolidado")
    end

    opt Hallazgo Crítico detectado en origen (CU-02)
        Sistema -> Sistema: generarAlertaHallazgoCritico(idExamen)
        Sistema -> Clinico: notificarHallazgoCriticoPrioritario(idCaso, detalleAlerta)
    end

else Discrepancia de RUN o Informe No Validado
    Sistema -> Sistema: registrarInconsistencia(idExamen, motivo)
    Sistema --> LIS_PACS: rechazoIncorporacion(motivoError)
    Sistema -> Clinico: notificarDiscrepanciaParaRevision(idExamen)
end
deactivate Sistema

... Posterior a la incorporación ...

activate Clinico
Clinico -> Sistema: consultarExpedientePaciente(idCaso)
activate Sistema
Sistema --> Clinico: mostrarResumenExpediente(informesDisponibles, porcentajeCompletitud)

opt Descargar Informe
    Clinico -> Sistema: solicitarDescargaPDF(idInforme)
    Sistema --> Clinico: entregarDocumentoPDF(bytesPDF)
end
deactivate Sistema
deactivate Clinico


' ==========================================
' DSS-02: Gestionar derivación externa y retorno (HU-08)
' ==========================================
newpage DSS-02 — Gestionar derivación externa y retorno (HU-08)

actor "Gestor UGAA" as UGAA
participant "OncoTrace\n(Sistema)" as Sistema
actor "Sistema Externo\nHCVB" as HCVB

activate UGAA
UGAA -> Sistema: confeccionarDossierDerivacion(idCaso, antecedentesClinicos)
activate Sistema
Sistema --> UGAA: dossierConfeccionado(idDossier, estado: "En Borrador")

UGAA -> Sistema: registrarEntregaInstructivoPasajes(idCaso, comprobanteAnexo6)
Sistema --> UGAA: confirmacionRegistroPasajes()

UGAA -> Sistema: despacharDerivacionExterna(idDossier)
Sistema -> Sistema: generarFolioDespacho()
Sistema -> Sistema: actualizarEstadoCaso("Despachado por UGAA")
Sistema --> UGAA: despachoConfirmado(folio, fechaDespacho)
deactivate Sistema

alt Integración Automatizada Habilitada
    Sistema -> HCVB: transmitirDossierDerivacion(folio, idDossier, datosPaciente)
    activate HCVB
    HCVB --> Sistema: confirmarRecepcionDossier(idRecepcionHCVB)
    deactivate HCVB
else Interfaz No Habilitada / Registro Manual
    UGAA -> Sistema: registrarConfirmacionRecepcionManual(folio, codigoRecepcionHCVB)
    activate Sistema
    Sistema --> UGAA: recepcionRegistrada()
    deactivate Sistema
end

opt Control de Tiempos y Alerta de Seguimiento (Día hábil 11 sin cita)
    Sistema -> Sistema: evaluarPlazoDerivacion()
    note over Sistema
      Si transcurren 11 días hábiles sin cita confirmada,
      el sistema mantiene el estado "Despachado por UGAA"
      y dispara una alerta de seguimiento (CU-06).
    end note
    Sistema -> Sistema: generarAlertaSeguimiento(idDossier, motivo: "Plazo Vencido")
    Sistema -> UGAA: notificarAlertaSeguimiento(idDossier)
end

... Confirmación de Cita en HCVB ...

alt Confirmación de Cita Asistencial (CU-04)
    HCVB -> Sistema: notificarFechaAtencion(folio, fechaCitaProgramada)
    activate Sistema
    Sistema -> Sistema: registrarHitoAsistencial(fechaCitaProgramada)
    Sistema --> HCVB: acuseRecibo()
    deactivate Sistema
end

... Etapa de Cierre y Retorno ...

UGAA -> Sistema: registrarInicioTratamiento(idCaso, fechaInicioEfectiva)
activate Sistema
Sistema --> UGAA: hitoTratamientoRegistrado()
deactivate Sistema

UGAA -> Sistema: registrarRetornoConEpicrisis(idCaso, datosContraReferencia)
activate Sistema
Sistema -> Sistema: actualizarEstadoCaso("Retornado con Epicrisis")
Sistema --> UGAA: cierreDerivacionConfirmado()
deactivate Sistema
deactivate UGAA

@enduml
