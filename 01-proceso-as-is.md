# Caracterización del Proceso Actual (AS-IS) – Gestión Oncológica HGF

## 1. Contexto Organizacional y Alcance

El Hospital Dr. Gustavo Fricke (HGF) atiende una alta demanda de pacientes con patologías oncológicas pertenecientes a la red del Servicio de Salud Viña del Mar-Quillota (SSVQ). El **Servicio de Gestión Oncológica** cumple un rol crítico en la coordinación, navegación y seguimiento de los pacientes diagnosticados o con alta sospecha de cáncer.

Sin embargo, el proceso actual se caracteriza por una alta dependencia de tareas manuales, registros fragmentados (planillas Excel locales, fichas de papel y sistemas desconectados) y una grave falta de visibilidad del estado del paciente entre los distintos servicios del hospital y la red asistencial.

---

## 2. Participantes del Proceso (Roles y Responsabilidades)

| Rol / Participante | Unidad / Institución | Responsabilidad en el Proceso AS-IS |
|--------------------|----------------------|------------------------------------|
| **Gestor/a Oncológico/a** | Servicio de Gestión Oncológica (HGF) | Monitoreo manual de pacientes, búsqueda de exámenes pendientes, coordinación de comités oncológicos y acompañamiento asistencial. |
| **Médico Tratante / Especialista** | Consultorio Adosado de Especialidades (CAE) | Sospecha diagnóstica, indicación de estudios complementarios, derivación a comité y ejecución de tratamientos locales. |
| **Comité Oncológico** | Equipo Multidisciplinario HGF | Evaluación colegiada de casos clínicos, definición de conducta terapéutica (cirugía, quimioterapia, radioterapia o paliativos). |
| **Secretaría Oncológica** | Unidad de Apoyo Administrativo | Agendamiento manual de horas, contacto telefónico con pacientes y citación física. |
| **Unidades de Apoyo Diagnóstico** | Laboratorio, Anatomía Patológica, Imagenología | Procesamiento y emisión de resultados de biopsias, TAC, RNM y exámenes de sangre. |
| **Hospital Carlos Van Buren (HCVB)** | Prestador Público Externo (Caja Negra) | Recepción de derivaciones para radioterapia y quimioterapia en tumores sólidos. |
| **Centros Privados / Clínicas** | Prestadores Privados en Convenio (Caja Negra) | Ejecución de exámenes de alta complejidad comprados por el HGF (PET-CT, EBUS). |
| **Paciente y Familia** | Usuario Asistencial | Receptor de indicaciones y citaciones telefónicas, sin canales integrados de seguimiento. |

---

## 3. Descripción de las Fases del Proceso AS-IS

```
[Sospecha / Ingreso] ──► [Estudios Diagnósticos] ──► [Comité Oncológico] ──► [Tratamiento / Derivación] ──► [Seguimiento]
        │                           │                        │                         │                         │
  Registro manual             Búsqueda manual         Elaboración manual         Derivación en papel       Seguimiento reactivo
  en planilla Excel          de resultados en         de ficha de caso y         y pérdida de tracking      por llamadas cuando
                             múltiples sistemas       acta en papel              en Van Buren/Privados      el paciente consulta
```

### Fase 1: Sospecha Diagnóstica e Ingreso
1. El paciente ingresa derivado desde Atención Primaria (APS) o interconsulta intrahospitalaria.
2. La gestora oncológica ingresa manualmente los datos del paciente en una planilla Excel personal/local.
3. Se revisan los antecedentes preliminares para verificar si corresponde a patología GES.

### Fase 2: Ejecución y Búsqueda de Estudios Diagnósticos
1. El médico solicita exámenes de sangre, biopsias y estudios de imagenología.
2. Si el examen no se realiza en el HGF (ej. PET-CT o EBUS), se tramita la compra de servicio a centros privados.
3. **Punto crítico:** La gestora debe revisar diariamente y de forma manual los sistemas de laboratorio, anatomía patológica e imagenología para saber si el informe ya está emitido.

### Fase 3: Coordinación y Sesión de Comité Oncológico
1. Una vez reunidos los exámenes, la gestora elabora manualmente un resumen del caso clínico en Word o papel.
2. Se agenda al paciente en la tabla del Comité Oncológico correspondiente.
3. Durante la sesión, los especialistas discuten el caso y redactan el acta médica en formato físico.
4. La secretaría digita posteriormente el acta y la archiva en la ficha clínica.

### Fase 4: Definición Terapéutica y Derivación Externa
- **Cirugía / Hematología en HGF:** Se coordina internamente con pabellón o policlínico de hematología.
- **Radioterapia / Quimioterapia de tumores sólidos (Van Buren):** Se emite formulario de interconsulta en papel y se envía al Hospital Carlos Van Buren. El HGF pierde la trazabilidad del paciente hasta que el usuario o el hospital externo informa novedades.
- **Exámenes en centros privados:** El paciente asiste por cuenta propia a la clínica en convenio y debe llevar personalmente el informe impreso al HGF.

### Fase 5: Acompañamiento y Seguimiento
1. La gestora realiza llamadas telefónicas esporádicas para conocer si el paciente inició tratamiento en Van Buren o si retiró sus resultados.
2. No existe una bitácora centralizada donde quede registro de la situación social, efectos adversos o adherencia del paciente.

---

## 4. Matriz de Cuellos de Botella e Ineficiencias

| Etapa AS-IS | Ineficiencia / Dolor Identificado | Impacto en la Gestión Oncológica |
|-------------|-----------------------------------|----------------------------------|
| **Consolidación de Exámenes** | Dispersión de resultados en sistemas aislados (Pathology, LIS, RIS/PACS). | Pérdida de hasta 15-30 días sólo esperando que la gestora descubra que la biopsia está lista. |
| **Comité Oncológico** | Resumen de casos preparado manualmente en papel/Word. | Retraso en la presentación de casos y riesgo de omisión de antecedentes relevantes. |
| **Derivación Externa (Van Buren)** | Envío de interconsultas físicas sin confirmación electrónica de recepción ni inicio de terapia. | Punto ciego asistencial; desconocimiento de si el paciente está recibiendo radioterapia o desertó. |
| **Compra de Servicios Privados** | El paciente debe llevar físicamente los resultados de PET-CT/EBUS. | Extravío de informes, citas de comité suspendidas por falta de documentos. |
| **Acompañamiento del Paciente** | Registro de contactos inexistente o disperso en cuadernos y notas personales. | Imposibilidad de realizar un seguimiento integral, detectar vulnerabilidades y evitar la deserción. |
| **Control de Plazos GES** | Cálculo manual de días transcurridos respecto a la garantía legal. | Riesgo de multas institucionales y, principalmente, progresión de la enfermedad por atención tardía. |
