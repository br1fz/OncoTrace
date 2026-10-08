# Proceso de Negocio Actual (AS-IS)

## Macro-proceso y Proceso Específico
Unidad de Gestión de Casos Oncológicos (UGCO) → Acompañamiento integral, navegación clínica y trazabilidad de la persona con cáncer.

*Nota Institucional: La UGCO posee dependencia mixta en el Hospital Dr. Gustavo Fricke (HGF), dependiendo administrativamente de la Subdirección de Gestión del Cuidado (SDGC) y técnicamente de la Subdirección Médica (SDM).*

---

## Objetivo de Negocio del Proceso
Garantizar el acompañamiento continuo, la coordinación oportuna de estudios diagnósticos y la derivación expedita a tratamiento de las personas con sospecha o confirmación de cáncer, otorgando soporte multidimensional (clínico, informativo, psicosocial y familiar), asegurando el cumplimiento estricto de los plazos legales de garantías GES (Decreto Supremo N° 29) y minimizando el riesgo de abandono asistencial.

---

## Participantes y Objetivos en el Proceso

| Participante / Actor | Rol y Objetivo en el Proceso |
| :--- | :--- |
| **Enfermera Supervisora UGCO** | Liderar la gestión de la unidad, planificar la distribución de carga asistencial, asignar casos y supervisar indicadores de gestión. |
| **Gestor/a Oncológico/a (Enfermero/a o Matrón/a)** | Realizar el acompañamiento directo, ejecutar los puntos de contacto obligatorio normados, compilar antecedentes para comités y coordinar derivaciones. |
| **Técnico en Enfermería (TENS UGCO)** | Confeccionar el dossier físico de derivación, apoyar la contactabilidad telefónica de pacientes y asistir operativamente en la coordinación asistencial. |
| **Administrativo/a UGCO** | Gestionar rescate de fichas clínicas en archivo, coordinar citaciones y apoyar el despacho formal de correspondencia médica hacia unidades de apoyo. |
| **Médico Tratante / Especialista** | Evaluar la sospecha clínica, confirmar diagnósticos histopatológicos, presentar casos a comités oncológicos y ejecutar indicaciones terapéuticas. |
| **Equipo Multidisciplinario de Apoyo** | Otorgar soporte complementario (dupla psicosocial, nutrición, cuidados paliativos, oncogeriatría) mediante interconsultas generadas por la gestora. |
| **Comité Oncológico Regional** | Sesionar de forma colegiada y multidisciplinaria para definir la conducta terapéutica consensuada y estadificación TNM previo al tratamiento. |
| **Unidades de Apoyo Diagnóstico (LIS/PACS)** | Procesar muestras de anatomía patológica (biopsias) y estudios imagenológicos (TAC, resonancias, ecografías), emitiendo informes diagnósticos. |
| **Hospital Carlos Van Buren (HCVB) / Red** | Centro de referencia de la macrored para ejecutar tratamientos oncológicos de alta complejidad (radioterapia y quimioterapia para tumores sólidos). |
| **Centros Privados en Convenio** | Ejecutar estudios de alta complejidad no disponibles institucionalmente (PET-CT, EBUS) mediante el mecanismo de compra de servicios. |
| **Paciente y Cuidador Principal** | Recibir información clara, orientación continua y atención médica oportuna, manteniendo la adherencia al plan de tratamiento prescrito. |

---

## Trayectoria Oncológica (Etapas del Proceso Asistencial)

El flujo del paciente oncológico en el establecimiento se estructura en 8 etapas secuenciales, sobre las cuales el gestor ejecuta seguimiento y puntos de contacto normados:

1. **Sospecha:** Ingreso derivado desde Atención Primaria de Salud (APS), Servicio de Urgencia o pesquisa por hallazgo crítico en anatomía patológica.
2. **Confirmación Diagnóstica:** Emisión de informe anatomopatológico (biopsia) concluyente y notificación médica del diagnóstico.
3. **Etapificación:** Ejecución de estudios imagenológicos y de laboratorio para determinar extensión anatómica tumoral.
4. **En Comité:** Evaluación colegiada por los especialistas del Comité Oncológico y emisión de resolución terapéutica.
5. **Tratamiento:** Ejecución de la terapia prescrita (cirugía oncológica en pabellón, quimioterapia, radioterapia o terapias sistémicas).
6. **Rehabilitación:** Derivación oportuna a servicios de kinesiología, terapia ocupacional o fonoaudiología según secuelas asistenciales.
7. **Seguimiento:** Controles médicos periódicos de vigilancia y monitoreo post-tratamiento activo.
8. **Alta y Contrarreferencia:** Cierre administrativo y asistencial del caso por remisión completa, traslado de red, fallecimiento o contrarreferencia a APS.

---

## Diagrama del Proceso AS-IS

![Proceso AS-IS](./diagramas/as-is.png)

*Archivo fuente del modelo:* [`./diagramas/as-is.bpmn`](./diagramas/as-is.bpmn)

---

## Nodos Críticos y Problemas Identificados (AS-IS)

La siguiente tabla resume los nodos críticos levantados en el proceso actual, base de la trazabilidad hacia los requisitos y rediseño de la plataforma OncoTrace:

| ID Nodo | Nombre del Nodo Crítico | Descripción del Problema AS-IS | Participantes Afectados | Impacto Operativo y Clínico |
| :--- | :--- | :--- | :--- | :--- |
| **AS-01** | **Dispersión de Resultados Diagnósticos** | Búsqueda manual y fragmentada de biopsias e informes imagenológicos distribuidos en sistemas desacoplados (Pathology, LIS, PACS) y archivo en papel. | Gestor/a Oncológico/a, Médico Tratante, Paciente | Retrasos de hasta 15 días en la consolidación del expediente inicial, postergando la presentación a comité y el inicio terapéutico. |
| **AS-02** | **Gestión Manual de Comités Oncológicos** | Confección manual de fichas de presentación en procesador de texto (Word) y registro de actas de resolución en soporte físico de papel. | Comité Oncológico, Gestor/a Oncológico/a, Médico | Alto consumo de horas administrativas, riesgo de omisión de antecedentes clínicos y falta de incorporación oportuna del acta en la ficha clínica. |
| **AS-03** | **Pérdida de Trazabilidad en Derivaciones Externas** | Elaboración física del dossier de derivación para despacho manual a través de la UGAA al Hospital Carlos Van Buren, sin confirmación de entrega en línea. | TENS, Gestor/a Oncológico/a, UGAA, Paciente | Generación de "puntos ciegos" en la red; desconocimiento sobre la fecha de recepción, asignación de cita e inicio de radioterapia/quimioterapia externa. |
| **AS-04** | **Monitoreo Manual y Riesgo de Vencimiento GES** | Control y cálculo manual de plazos legales de garantías de oportunidad GES mediante planillas de cálculo locales no integradas. | Gestor/a Oncológico/a, Supervisora UGCO, Paciente | Riesgo inminente de expiración de plazos legales (Decreto Supremo N° 29), exponiendo al hospital a sumarios sanitarios y multas de la Superintendencia. |
| **AS-05** | **Registro Fragmentado y Falta de Bitácora Estandarizada** | Carencia de un registro unificado para documentar contactos asistenciales, evaluar la vulnerabilidad sociofamiliar y registrar el índice funcional (ECOG). | Gestor/a Oncológico/a, TENS, Paciente y Familia | Dificultad para pesquisar oportunamente factores de claudicación familiar o abandono de tratamiento, sumado al doble registro con plataformas ministeriales. |
| **AS-06** | **Interrupción Operativa por Demanda Espontánea** | Afluencia desordenada de usuarios al mesón de la UGCO solicitando estado de trámites bajo el marco de la Ley N° 21.258 (Ley Nacional del Cáncer). | Gestor/a Oncológico/a, Paciente y Cuidador | Saturación de la jornada asistencial de las gestoras debido a consultas de orientación general, restando tiempo a la resolución de casos de alta complejidad. |
