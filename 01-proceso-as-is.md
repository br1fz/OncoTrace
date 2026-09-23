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
 
 
## ⚠️ Problemas identificados
- 🔍 **Dispersión de resultados** en sistemas aislados (Pathology, LIS, PACS) que obliga a búsquedas manuales, generando demoras de hasta 15 días (afecta al Gestor y al Paciente).
- 📝 **Preparación manual** (papel/Word) de resúmenes de casos y actas de Comité Oncológico, aumentando el riesgo de omitir antecedentes (afecta al Comité).
- 👁️ **Pérdida de trazabilidad** (punto ciego) al enviar interconsultas físicas al Hospital Van Buren para tratamientos externos, desconociendo si el paciente inició su terapia (afecta al Gestor y al Médico).
- ⏳ **Riesgo de incumplimiento** y multas institucionales por el cálculo manual de plazos de garantías legales GES (afecta al Paciente y a la Institución).
- 🤝 **Ausencia de un registro centralizado** de acompañamiento, lo que dificulta el seguimiento integral y aumenta el riesgo de deserción por vulnerabilidad social (afecta al Gestor y al Paciente).
