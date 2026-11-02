# Proceso de negocio actual (AS-IS)

## Macroproceso y proceso específico

Unidad de Gestión de Casos Oncológicos (UGCO) → Acompañamiento integral, navegación clínica y trazabilidad de la persona con cáncer.

*Nota institucional: La UGCO tiene dependencia administrativa de la Subdirección de Gestión del Cuidado (SDGC) y dependencia técnica de la Subdirección Médica (SDM) en el Hospital Dr. Gustavo Fricke (HGF).*

---

## Objetivo de negocio del proceso

Brindar acompañamiento continuo a las personas con diagnóstico de cáncer y su red de apoyo, coordinar los estudios diagnósticos y las derivaciones a tratamiento, y ofrecer soporte clínico, informativo, psicosocial, familiar y espiritual. El proceso también busca facilitar el seguimiento de los plazos de las garantías GES, conforme al Decreto Supremo N° 29, y reducir el riesgo de interrupción de la atención.

---

## Participantes y objetivos en el proceso

| Participante / actor | Rol y objetivo en el proceso |
| :--- | :--- |
| **Enfermera supervisora UGCO** | Liderar la gestión de la unidad, planificar la distribución de la carga asistencial, asignar casos y supervisar indicadores de gestión. |
| **Gestor/a oncológico/a (enfermero/a o matrón/a)** | Realizar el acompañamiento directo, ejecutar los puntos de contacto definidos, compilar antecedentes para comités, orientar sobre beneficios de traslado y coordinar derivaciones. |
| **Técnico en Enfermería (TENS UGCO)** | Confeccionar el dossier físico de derivación, apoyar la contactabilidad telefónica de pacientes y colaborar en la coordinación asistencial. |
| **Administrativo/a UGCO** | Gestionar el rescate de fichas clínicas en archivo, coordinar citaciones y apoyar el despacho formal de correspondencia médica hacia unidades de apoyo. |
| **Médico tratante o especialista** | Evaluar la sospecha clínica, confirmar diagnósticos histopatológicos, presentar casos a comités oncológicos y ejecutar indicaciones terapéuticas. |
| **Equipo multidisciplinario de apoyo** | Otorgar soporte complementario mediante interconsultas de la dupla psicosocial, nutrición, cuidados paliativos, oncogeriatría, kinesiología, fonoaudiología y terapia ocupacional, entre otras áreas. |
| **Unidad de Servicio Social HGF** | Evaluar la situación socioeconómica, tramitar ayudas técnicas y gestionar el reembolso de pasajes de locomoción pública para pacientes derivados a la red asistencial. |
| **Comité Oncológico Regional** | Revisar los casos de forma colegiada y multidisciplinaria, y consensuar la conducta terapéutica antes de iniciar el tratamiento. |
| **Unidades de apoyo diagnóstico (LIS/PACS)** | Procesar muestras de anatomía patológica y estudios imagenológicos, como TAC, resonancias y ecografías, y emitir sus informes. |
| **Hospital Carlos Van Buren (HCVB) y red asistencial** | Recibir derivaciones y ejecutar tratamientos oncológicos de alta complejidad, como radioterapia y quimioterapia para tumores sólidos, según la oferta de la red. |
| **Centros privados en convenio** | Ejecutar estudios de alta complejidad no disponibles en el hospital, como PET-CT y EBUS, mediante el mecanismo de compra de servicios. |
| **Paciente y cuidador principal** | Recibir información clara, orientación continua y atención médica oportuna, y participar en el plan de tratamiento indicado. |

---

## Trayectoria oncológica (etapas del proceso asistencial)

La trayectoria de la persona con cáncer en el establecimiento se organiza en ocho etapas. Durante el proceso, el gestor realiza el seguimiento y los puntos de contacto definidos por la UGCO.

1. **Sospecha:** Ingreso derivado desde Atención Primaria de Salud (APS), el Servicio de Urgencia u otra vía de pesquisa, incluido un hallazgo crítico en anatomía patológica.
2. **Confirmación diagnóstica:** Emisión del informe anatomopatológico concluyente y comunicación del diagnóstico por el equipo médico.
3. **Etapificación:** Realización de estudios imagenológicos y de laboratorio para determinar la extensión de la enfermedad.
4. **Tratamiento:** Ejecución de la terapia indicada, que puede incluir cirugía, quimioterapia, radioterapia u otras terapias sistémicas.
5. **Rehabilitación:** Derivación a las áreas de rehabilitación que correspondan, como kinesiología, terapia ocupacional o fonoaudiología.
6. **Cuidados paliativos y alivio del dolor:** Derivación a los equipos correspondientes según las necesidades de la persona y la etapa de atención.
7. **Seguimiento y sobrevivientes:** Controles médicos y monitoreo posteriores al tratamiento, según el plan definido para cada caso.
8. **Alta y contrarreferencia:** Cierre asistencial y administrativo, con contrarreferencia a APS cuando corresponda.

El Comité Oncológico Regional es una instancia de evaluación y decisión asociada al proceso diagnóstico y a la definición del tratamiento. Se registra como un hito del proceso, no como una etapa independiente.

---

## Diagrama del proceso AS-IS

[Ver diagrama del proceso AS-IS en BPMN 2.0](./diagramas/as-is.bpmn)

---

## Nodos críticos y problemas identificados (AS-IS)

La siguiente tabla resume los problemas identificados en el proceso actual y sirve de base para su trazabilidad hacia los requisitos y el rediseño de OncoTrace.

| ID nodo | Nombre del nodo crítico | Descripción del problema AS-IS | Participantes afectados | Impacto operativo y clínico |
| :--- | :--- | :--- | :--- | :--- |
| **AS-01** | **Dispersión de resultados diagnósticos** | Búsqueda manual y fragmentada de biopsias e informes imagenológicos distribuidos en sistemas separados, como Pathology, LIS y PACS, además de documentos en papel. | Gestor/a oncológico/a, médico tratante y paciente | Se han identificado retrasos de hasta 15 días en la consolidación del expediente inicial, lo que puede postergar la presentación a comité y el inicio del tratamiento. |
| **AS-02** | **Gestión manual de comités oncológicos** | Confección de fichas de presentación en procesador de texto y registro de las decisiones del comité en actas de papel. | Comité Oncológico, gestor/a oncológico/a y equipo médico | Alto consumo de tiempo administrativo, riesgo de omitir antecedentes y demora en incorporar el acta a la ficha clínica. |
| **AS-03** | **Pérdida de trazabilidad en derivaciones externas** | Elaboración física del dossier de derivación y despacho manual a través de UGAA, sin confirmación en línea de su recepción ni orientación oportuna sobre el reembolso de pasajes ante Servicio Social. | TENS, gestor/a oncológico/a, UGAA y paciente | Puede haber falta de información sobre la recepción o la fecha de cita en HCVB. La entrega tardía de orientación también puede dificultar la preparación de los antecedentes requeridos para solicitar el reembolso. |
| **AS-04** | **Monitoreo manual y riesgo de vencimiento GES** | Control y cálculo manual de los plazos de las garantías de oportunidad GES mediante planillas locales no integradas. | Gestor/a oncológico/a, supervisora UGCO y paciente | Existe riesgo de no detectar a tiempo garantías próximas a vencer, con posibles consecuencias administrativas y efectos en la oportunidad de atención. |
| **AS-05** | **Registro fragmentado y falta de interoperabilidad** | No hay un registro unificado para documentar los contactos asistenciales y la evaluación de la vulnerabilidad sociofamiliar y funcional (ECOG). Además, el registro local no interopera con la Plataforma de Seguimiento Oncológico del MINSAL, lo que obliga a duplicar el ingreso de algunos datos. | Gestor/a oncológico/a, TENS, paciente y familia | Se dificulta el seguimiento de los contactos y de las necesidades de la persona. La duplicidad de registros también complica la consistencia de la información y el reporte nacional. |
| **AS-06** | **Interrupción operativa por demanda espontánea** | Afluencia de pacientes y cuidadores al mesón de la UGCO para consultar el estado de trámites y exámenes, además de solicitar orientación general. | Gestor/a oncológico/a, paciente y cuidador | Las consultas frecuentes pueden reducir el tiempo disponible de las gestoras para resolver casos que requieren seguimiento asistencial. |
