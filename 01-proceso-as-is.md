# 🏢 Proceso de negocio — AS-IS
 
## 📍 Macro-proceso y proceso específico
Atención Abierta de Especialidades (CAE) → Gestión, navegación y trazabilidad de pacientes oncológicos
 
## 🎯 Objetivo de negocio del proceso
Garantizar el acompañamiento continuo, la coordinación de estudios diagnósticos y la derivación oportuna a tratamientos de los pacientes con sospecha o confirmación de cáncer, evitando deserciones y asegurando el cumplimiento de los plazos GES.
 
## 🤝 Participantes y sus objetivos
| Participante | Objetivo en el proceso |
|---------------|------------------------|
| Gestor/a Oncológico/a | Monitorear al paciente, tramitar exámenes, coordinar comités y brindar acompañamiento asistencial. |
| Médico Tratante / Especialista | Evaluar sospecha diagnóstica, indicar estudios complementarios, derivar a comité y ejecutar tratamientos. |
| Comité Oncológico | Evaluar de forma multidisciplinaria los casos y definir la conducta terapéutica (cirugía, quimio, radio o paliativos). |
| Secretaría Oncológica | Agendar horas médicas y contactar telefónicamente a los pacientes para citaciones. |
| Unidades de Apoyo Diagnóstico | Procesar muestras y emitir resultados de biopsias, imagenología (TAC/RNM) y laboratorio. |
| Hospital Carlos Van Buren | Recibir derivaciones y ejecutar tratamientos de radioterapia y quimioterapia para tumores sólidos. |
| Centros Privados / Clínicas | Ejecutar procedimientos y exámenes de alta complejidad (PET-CT, EBUS) mediante compra de servicios. |
| Paciente / Familia | Recibir atención, orientación y tratamiento médico oportuno para su patología oncológica. |
 
## 📊 Diagrama AS-IS
![Proceso AS-IS](./diagramas/as-is.png)
 
Archivo fuente: [`./diagramas/as-is.bpmn`](./diagramas/as-is.bpmn)
 
 
## ⚠️ Nodos Críticos y Problemas Identificados (AS-IS)

A continuación se formalizan los nodos críticos identificados en el proceso actual, asignando a cada uno un identificador único para la trazabilidad integral del proyecto:

| ID Nodo | Nombre del Nodo Crítico | Descripción del Problema AS-IS | Participantes Afectados | Impacto Operativo y Clínico |
| :--- | :--- | :--- | :--- | :--- |
| **AS-01** | **Dispersión de Resultados Diagnósticos** | Búsqueda manual dispersa en sistemas aislados (Pathology, LIS, PACS) y papel para ubicar biopsias e imágenes. | Gestora Oncológica, Médico Tratante, Paciente | Demoras de hasta 15 días en la consolidación del diagnóstico inicial y retraso en el ingreso a comités. |
| **AS-02** | **Gestión Manual de Comités Oncológicos** | Preparación manual en Word de fichas de presentación y registro de actas de comité en papel físico. | Comité Oncológico, Gestora Oncológica, Médico | Alto consumo de horas administrativas, riesgo de omisión de antecedentes clínicos y actas no integradas a la ficha. |
| **AS-03** | **Pérdida de Trazabilidad en Derivaciones Externas** | Envío de interconsultas en papel físico al Hospital Carlos Van Buren y prestadores privados sin confirmación de recepción. | Gestora Oncológica, Médico Tratante, Paciente | Generación de "puntos ciegos" asistenciales; desconocimiento sobre si el paciente inició oportunamente su radioterapia/quimioterapia. |
| **AS-04** | **Monitoreo Manual y Riesgo de Vencimiento GES** | Cálculo y seguimiento manual de plazos legales de garantías GES mediante planillas Excel locales. | Gestora Oncológica, Dirección Médica, Paciente | Riesgo inminente de vencimiento de garantías legales, multas y sumarios institucionales por retrasos asistenciales. |
| **AS-05** | **Ausencia de Registro Centralizado de Acompañamiento** | Falta de una bitácora estructurada para registrar contactos y evaluar la vulnerabilidad sociofamiliar y funcional (ECOG). | Gestora Oncológica, Paciente / Familia | Dificultad para detectar a tiempo factores de riesgo psicosocial que conllevan a la deserción o abandono del tratamiento. |
| **AS-06** | **Interrupción Crítica por Demanda Espontánea** | Afluencia continua de pacientes (oncológicos y no oncológicos) en la oficina de gestión exigiendo estado de exámenes bajo la Ley N° 21.258. | Gestora Oncológica, Paciente / Familia | Colapso del tiempo asistencial de las gestoras debido a la obligación legal de acogida presencial, interrumpiendo la gestión de casos críticos. |

