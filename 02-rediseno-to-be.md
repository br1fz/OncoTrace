# 🏢 Proceso de negocio — AS-IS
 
## 📍 Macro-proceso y proceso específico
Atención Abierta de Especialidades (CAE) → Gestión, navegación y trazabilidad de pacientes oncológicos en el Hospital Dr. Gustavo Fricke (HGF).
 
## 🎯 Objetivo de negocio del proceso
Garantizar el acompañamiento continuo, la coordinación de estudios diagnósticos y la derivación oportuna a tratamientos de los pacientes con sospecha o confirmación de cáncer, evitando deserciones y asegurando el cumplimiento estricto de los plazos de las Garantías Explícitas en Salud (GES).
 
## 🤝 Participantes y sus objetivos
| Participante | Unidad / Institución | Objetivo en el Proceso |
|---------------|----------------------|------------------------|
| **Gestor/a Oncológico/a** | Servicio de Gestión Oncológica (HGF) | Monitorear al paciente, tramitar y consolidar exámenes, coordinar comités y brindar acompañamiento asistencial integral. |
| **Médico Tratante / Especialista** | Consultorio Adosado de Especialidades (CAE) | Evaluar sospecha diagnóstica, indicar estudios complementarios, derivar a comité y ejecutar tratamientos locales. |
| **Comité Oncológico** | Equipo Multidisciplinario HGF | Evaluar de forma colegiada los casos clínicos y definir la conducta terapéutica (cirugía, quimio, radio o paliativos). |
| **Secretaría Oncológica** | Unidad de Apoyo Administrativo | Agendar horas médicas y contactar telefónicamente a los pacientes para sus citaciones físicas. |
| **Unidades de Apoyo Diagnóstico** | Laboratorio, Anatomía Patológica, Imagenología | Procesar muestras y emitir resultados de biopsias, TAC, RNM y exámenes de sangre. |
| **Hospital Carlos Van Buren** | Prestador Público Externo | Recibir derivaciones y ejecutar tratamientos de radioterapia y quimioterapia para tumores sólidos. |
| **Centros Privados / Clínicas** | Prestadores en Convenio | Ejecutar procedimientos y exámenes de alta complejidad (PET-CT, EBUS) mediante compra de servicios. |
| **Paciente / Familia** | Usuario Asistencial | Recibir atención oportuna, orientación clara y tratamiento médico para su patología oncológica. |
 
## 📊 Diagrama AS-IS
![Proceso AS-IS](./diagramas/as-is.png)
 
Archivo fuente: [`./diagramas/as-is.bpmn`](./diagramas/as-is.bpmn)
 
*Nota: Se distinguen explícitamente tareas de usuario (User Task), tareas de servicio (Service Task) y tareas manuales (Manual Task) con el marcador correspondiente.*
 
## 🗺️ Secuencia de Fases del Proceso Actual
```text
[Sospecha / Ingreso] ──► [Estudios Diagnósticos] ──► [Comité Oncológico] ──► [Tratamiento / Derivación] ──► [Seguimiento]
       │                         │                        │                         │                        │
  Registro manual           Búsqueda manual          Elaboración manual        Derivación en papel      Seguimiento reactivo
  en planilla Excel        de resultados en         de ficha de caso y        y pérdida de tracking    por llamadas cuando
                           múltiples sistemas       acta en papel             en Van Buren/Privados    el paciente consulta
