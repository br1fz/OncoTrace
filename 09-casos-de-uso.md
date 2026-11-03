# Casos de uso

Este documento presenta la especificación de casos de uso del sistema **OncoTrace**, detallando los objetivos de los actores que participan en las historias de usuario **HU-01**, **HU-04**, **HU-05** y **HU-08**. 

El alcance de este artefacto coincide estrictamente con los [criterios de aceptación](./07-criterios-aceptacion.md) y el [modelo de dominio](./08-modelo-dominio.md) definidos para la Entrega 2.

**Requisitos de origen:** RF-01, RF-04, RF-05 y RF-08 de [03-requisitos.md](./03-requisitos.md).

---

## Actores del sistema

| Actor | Tipo (humano / sistema externo) | Descripción |
| :--- | :--- | :--- |
| **Gestor/a UGCO** | Humano | Consulta y actualiza el seguimiento del caso oncológico dentro de sus permisos, gestiona alertas de plazo, consulta informes diagnósticos y coordina las derivaciones asistenciales. |
| **Médico tratante** | Humano | Consulta informes diagnósticos consolidados y recibe avisos prioritarios de hallazgos críticos para su evaluación clínica formal. |
| **TENS UGCO** | Humano | Confecciona el dossier digital de derivación y registra la entrega formal del instructivo de pasajes (Anexo 6). |
| **Funcionario/a UGAA** | Humano | Valida los antecedentes clínicos, formaliza el despacho de derivaciones y registra la confirmación de recepción y citas del centro receptor. |
| **LIS** | Sistema externo | Proporciona informes de laboratorio y anatomía patológica junto con su estado de validación a través de las interfaces institucionales disponibles. |
| **PACS** | Sistema externo | Proporciona informes radiológicos e imagenológicos y su condición de validación mediante estándares del dominio (HL7/FHIR/DICOM). |
| **Sistema HCVB** | Sistema externo | Sistema del centro receptor (Hospital Carlos van Buren) que participa en la integración propuesta para el despacho, confirmación de recepción, asignación de cita y retorno con epicrisis. |

### Consideraciones sobre los Actores y Fronteras del Sistema
* **Autenticación y Permisos:** Los actores humanos deben estar autenticados y contar con los permisos del rol asignado (conforme a RNF-03 y REQ-DER-01). La autenticación y la auditoría operan como precondiciones del sistema, no como casos de uso aislados.
* **Integraciones Condicionadas:** La participación del **Sistema HCVB** describe una integración propuesta sujeta a la disponibilidad de interfaces institucionales. En su ausencia, las interacciones son registradas manualmente por el usuario autorizado (Funcionario/a UGAA).
* **Actores Indirectos:** Paciente y cuidador reciben asistencia a través del personal de la UGCO. No se representan como usuarios directos de OncoTrace en este alcance (la autoatención de HU-09 y la interoperabilidad con MINSAL de HU-11 quedan fuera de esta entrega).

---

## Diagrama de casos de uso

**Identificador del Diagrama:** DCU-01.

![DCU-01 — Diagrama de Casos de Uso de OncoTrace](./diagramas/casos-de-uso.png)

* **Archivo fuente editable:** [`./diagramas/casos-de-uso.puml`](./diagramas/casos-de-uso.puml)
* **Vista de integración de sistemas:** [`./diagramas/casos-de-uso-integracion.png`](./diagramas/casos-de-uso-integracion.png)

*Nota de modelado:* El diagrama delimita explícitamente el límite (*boundary*) de OncoTrace. Todos los actores permanecen fuera del rectángulo del sistema. La repetición de un actor en sub-vistas representa el mismo rol del negocio.

---

## Casos de uso y su origen

La siguiente tabla asocia cada caso de uso con su objetivo del actor, su historia de origen y los escenarios de aceptación correspondientes:

| ID | Caso de uso (objetivo del actor) | Actor principal | Historia de origen | Escenarios de aceptación cubiertos |
| :--- | :--- | :--- | :--- | :--- |
| **CU-01** | Consolidar y consultar informes diagnósticos | Gestor/a UGCO, Médico tratante | [HU-05](./04-historias-usuario.md#hu-05) | HU-05-ESC-01, HU-05-ESC-03, HU-05-ESC-04 |
| **CU-02** | Recibir avisos de hallazgos críticos | Gestor/a UGCO, Médico tratante | [HU-05](./04-historias-usuario.md#hu-05) | HU-05-ESC-02 |
| **CU-03** | Despachar derivación externa | Funcionario/a UGAA | [HU-08](./04-historias-usuario.md#hu-08) | HU-08-ESC-02 |
| **CU-04** | Registrar recepción y cita en HCVB | Funcionario/a UGAA, Gestor/a UGCO | [HU-08](./04-historias-usuario.md#hu-08) | HU-08-ESC-03, HU-08-ESC-04 |
| **CU-05** | Dar seguimiento al caso oncológico | Gestor/a UGCO | [HU-01](./04-historias-usuario.md#hu-01) | HU-01-ESC-01 a HU-01-ESC-03 |
| **CU-06** | Gestionar alertas de seguimiento | Gestor/a UGCO | [HU-04](./04-historias-usuario.md#hu-04), [HU-08](./04-historias-usuario.md#hu-08) | HU-04-ESC-01 a HU-04-ESC-07, HU-08-ESC-05 |
| **CU-07** | Confeccionar dossier de derivación | TENS UGCO | [HU-08](./04-historias-usuario.md#hu-08) | HU-08-ESC-01 |
| **CU-08** | Registrar entrega del instructivo de pasajes | Gestor/a UGCO, TENS UGCO | [HU-08](./04-historias-usuario.md#hu-08) | HU-08-ESC-02 |
| **CU-09** | Registrar retorno con epicrisis | Gestor/a UGCO | [HU-08](./04-historias-usuario.md#hu-08) | HU-08-ESC-06 |

---

## Relaciones entre los casos de uso

* **CU-02 extiende CU-01 (`<<extend>>`):** La notificación de hallazgo crítico se activa cuando un informe validado incorpora un resultado de malignidad o valor de alerta informado por el LIS/PACS de origen. El punto de extensión es la *incorporación del informe*. La relación `<<extend>>` nace en `CU-02` y apunta hacia `CU-01`.
* **Independencia de CU-04 respecto a CU-03:** La confirmación de recepción y la asignación de cita son eventos asíncronos y posteriores al despacho. Se modelan como casos de uso independientes y no como extensiones obligatorias del despacho.
* **Independencia de CU-08 respecto a CU-03:** La entrega del instructivo de pasajes se registra de forma anticipada. El despacho (`CU-03`) verifica la existencia de esta entrega como precondición del negocio, sin requerir reejecutar la entrega dentro del flujo.
* **Ausencia de relaciones `<<include>>` superfluas:** Se evita el uso desmedido de `include` para no sobrecargar el diagrama con pasos procedurales o funciones de software. Cada caso de uso representa un objetivo completo de negocio.

---

## Reglas de consistencia con otros artefactos

1. **Ciclo de vida del Caso (CU-05):** El seguimiento transita por las etapas definidas en el Modelo de Dominio (`08-modelo-dominio.md`). La resolución del comité constituye un hito documental y no altera por sí sola la etapa asistencial del paciente.
2. **Evaluación de Alertas (CU-06):** Las alertas de 11 días hábiles o vencimiento de plazos son evaluadas internamente por OncoTrace. No se modela un "timer" o "sistema interno" como actor externo.
3. **Validación de Resultados (CU-01 y CU-02):** Todo informe con inconsistencia de RUN o sin firma de validación queda en estado de revisión y no consolida completitud en el expediente del paciente.
4. **Trazabilidad de Derivaciones (CU-03, CU-04 y CU-09):** El despacho genera un folio único; la recepción requiere confirmación explícita del centro receptor y el cierre del ciclo exige la carga de la contra-referencia con epicrisis.
