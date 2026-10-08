# 🏢 Proceso de negocio — AS-IS
 
## 📍 Macro-proceso y proceso específico
Unidad de Gestión de Casos Oncológicos (UGCO) → Acompañamiento integral, navegación y trazabilidad de la persona con cáncer
 
*Nota: La UGCO posee una dependencia mixta, dependiendo administrativamente de la Subdirección de Gestión del Cuidado (SDGC) y técnicamente de la Subdirección Médica (SDM).*

## 🎯 Objetivo de negocio del proceso
Garantizar el acompañamiento continuo, la coordinación de estudios diagnósticos y la derivación oportuna a tratamientos de las personas con sospecha o confirmación de cáncer, brindando apoyo en las dimensiones clínico-terapéutica, informativa, psicosocial y espiritual, asegurando el cumplimiento de los plazos GES y evitando deserciones.
 
## 🤝 Participantes y sus objetivos
| Participante | Objetivo en el proceso |
|---------------|------------------------|
| Enfermera Supervisora UGCO | Liderar la unidad, planificar estratégicamente, asignar casos y evaluar el desempeño. |
| Gestor/a Oncológico/a (Enfermero/a o Matrón/a) | Realizar acompañamiento directo en las 4 dimensiones (clínico, informativo, psicosocial, espiritual), ejecutar puntos de contacto obligatorio, gestionar comités y coordinar derivaciones. |
| Técnico en Enfermería (TENS) | Confeccionar el dossier de derivación, mantener la contactabilidad, agendar atenciones y apoyar el comité de tiroides. |
| Administrativo/a UGCO | Solicitar fichas clínicas, archivar, enviar correspondencia y coordinar la toma de exámenes con las unidades de apoyo. |
| Médico Tratante / Especialista | Evaluar sospecha diagnóstica, confirmar diagnóstico, derivar a comité y ejecutar tratamientos médicos y quirúrgicos. |
| Equipo Multidisciplinario | Brindar apoyo complementario (dupla psicosocial, nutricionista, kinesiólogo, oncogeriatría, etc.) tras derivación del gestor. |
| Comité Oncológico | Evaluar de forma multidisciplinaria los casos y definir la conducta terapéutica previa al inicio de cualquier tratamiento. |
| Unidades de Apoyo Diagnóstico | Procesar muestras y emitir resultados de biopsias, imagenología, procedimientos y laboratorio. |
| Hospital Carlos Van Buren / Red | Recibir derivaciones y ejecutar tratamientos de alta complejidad (radioterapia, quimioterapia para tumores sólidos). |
| Paciente y Cuidador Principal | Recibir acompañamiento, orientación, tratamiento médico oportuno y apoyo comunitario durante la trayectoria oncológica. |
 
## 🔄 Trayectoria Oncológica (Etapas del Proceso)
El proceso actual se organiza en las siguientes etapas secuenciales, donde el Gestor realiza intervenciones o "puntos de contacto obligatorio":
1. **Sospecha:** Ingreso por urgencias, APS, o informe crítico de anatomía patológica.
2. **Confirmación Diagnóstica:** Informe de biopsia y comunicación del médico.
3. **Etapificación:** Estudios de extensión.
4. **Tratamiento:** Resolución de Comité Oncológico e inicio de terapia (cirugía, quimioterapia, radioterapia, etc.).
5. **Rehabilitación:** Derivaciones a kinesiología, terapia ocupacional o fonoaudiología.
6. **Cuidados Paliativos y Alivio del Dolor:** Asistencia integral de calidad de vida.
7. **Seguimiento y Sobrevivientes:** Controles periódicos.
8. **Alta y Contrarreferencia:** Cierre de caso por remisión, fallecimiento, traslado o alta clínica a APS.

## 📊 Diagrama AS-IS
![Proceso AS-IS](./diagramas/as-is.png)
 
Archivo fuente: [`./diagramas/as-is.bpmn`](./diagramas/as-is.bpmn)
 
 
## ⚠️ Nodos Críticos y Problemas Identificados (AS-IS)

A continuación se formalizan los nodos críticos identificados en el proceso actual, asignando a cada uno un identificador único para la trazabilidad integral del proyecto:

| ID Nodo | Nombre del Nodo Crítico | Descripción del Problema AS-IS | Participantes Afectados | Impacto Operativo y Clínico |
| :--- | :--- | :--- | :--- | :--- |
| **AS-01** | **Dispersión de Resultados Diagnósticos** | Búsqueda manual dispersa en sistemas aislados (Pathology, LIS, PACS) y papel para ubicar biopsias e imágenes. | Gestor/a Oncológico/a, Médico Tratante, Paciente | Demoras de hasta 15 días en la consolidación del diagnóstico inicial y retraso en el ingreso a comités. |
| **AS-02** | **Gestión Manual de Comités Oncológicos** | Preparación manual en Word de fichas de presentación y registro de actas de comité en papel físico. | Comité Oncológico, Gestor/a Oncológico/a, Médico | Alto consumo de horas administrativas, riesgo de omisión de antecedentes clínicos y actas no integradas a la ficha. |
| **AS-03** | **Pérdida de Trazabilidad en Derivaciones Externas** | El TENS confecciona un "dossier" físico que se entrega a UGAA para su envío, perdiendo visibilidad del estado de recepción y agendamiento en la red (ej. Hosp. Carlos Van Buren). | TENS, Gestor/a Oncológico/a, Médico, Paciente | Generación de "puntos ciegos" asistenciales; desconocimiento sobre si el paciente inició oportunamente su radioterapia/quimioterapia. |
| **AS-04** | **Monitoreo Manual y Riesgo de Vencimiento GES** | Cálculo y seguimiento manual de plazos legales de garantías GES mediante planillas Excel locales. | Gestor/a Oncológico/a, Supervisora UGCO, Paciente | Riesgo inminente de vencimiento de garantías legales, multas y sumarios institucionales por retrasos asistenciales. |
| **AS-05** | **Falta de Interoperabilidad con MINSAL y Registro Fragmentado** | La UGCO utiliza una plataforma local que no interopera con la Plataforma de Seguimiento Oncológico del MINSAL, obligando a doble registro (ficha + plataforma) y dificultando la trazabilidad nacional. | Gestor/a Oncológico/a, Supervisora UGCO | Dificulta la obtención de reportes, el envío de datos al Ministerio y fragmenta la evaluación de vulnerabilidad psicosocial. |
| **AS-06** | **Interrupción Crítica por Demanda Espontánea** | Afluencia continua de pacientes (oncológicos y no oncológicos) en la oficina de gestión exigiendo estado de exámenes bajo la Ley N° 21.258. | Gestor/a Oncológico/a, Paciente y Cuidador | Colapso del tiempo asistencial de los gestores debido a la obligación legal de acogida presencial, interrumpiendo la gestión de casos críticos. |
