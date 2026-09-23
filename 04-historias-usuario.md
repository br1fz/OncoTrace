# Historias de Usuario (HU) – Plataforma OncoTrace

**CIN324 – Metodología de Análisis e Ingeniería de Requisitos**  
*Hospital Dr. Gustavo Fricke – Servicio de Gestión Oncológica*

---

## 📌 Resumen de Historias de Usuario

| ID | Título | Rol Principal | Prioridad | **Actividad TO-BE Asociada** |
|---|---|---|---| :--- |
| **HU-01** | Tablero Visual de Trazabilidad y Timeline Clínico | Gestor/a Oncológico/a | Alta (Must) | **User Task: TB_Task_MonitoreoTablero** |
| **HU-02** | Evaluación Multidimensional y Estratificación | Gestor/a Oncológico/a | Alta (Must) | **User Task: TB_Task_EvaluacionMultidimensional** |
| **HU-03** | Bitácora de Acompañamiento y Seguimiento Activo | Gestor/a Oncológico/a | Alta (Must) | **User Task: TB_Task_BitacoraAcompanamiento** |
| **HU-04** | Sistema de Alertas de Plazos GES y Deserción | Gestor/a Oncológico/a | Alta (Must) | **Service Task: TB_Task_MotorAlertasGES** |
| **HU-05** | Consolidación Automatizada de Biopsias | Gestor/a Oncológico/a | Alta (Must) | **Service Task: TB_Task_ConsolidacionAuto** |
| **HU-06** | Generación de Ficha para Comité Oncológico | Gestor/a Oncológico/a | Alta (Must) | **Service Task: TB_Task_GenerarFichaComite** |
| **HU-07** | Registro en Línea y Acta Digital de Comité | Médico / Comité | Alta (Must) | **User Task: TB_Task_ComiteDigital** |
| **HU-08** | Monitoreo y Trazabilidad de Derivaciones | Gestor/a Oncológico/a | Alta (Must) | **User Task: TB_Task_TrazabilidadDerivaciones** |
| **HU-09** | Reportes de Gestión y Cumplimiento GES | Jefatura de Oncología | Media (Should)| *(Transversal a la plataforma)* |
| **HU-10** | Control de Roles, Privilegios y Auditoría | Administrador / Seguridad | Alta (Must) | *(Restricción global de sistema)* |

---

## 📋 Detalle de Historias de Usuario

### HU-01: Tablero Visual de Trazabilidad y Timeline Clínico
- **Como** Gestora Oncológica,
- **Quiero** visualizar un tablero centralizado y una línea de tiempo cronológica por paciente con sus hitos completados y pendientes,
- **Para** conocer instantáneamente el estado del paciente en su proceso asistencial sin tener que revisar múltiples carpetas o planillas.

#### Criterios de Aceptación (Given-When-Then):
- **Escenario 1: Visualización del tablero Kanban oncológico**
  - **Dado que** la gestora oncológica ha iniciado sesión en OncoTrace,
  - **Cuando** ingresa al módulo de "Trazabilidad de Pacientes",
  - **Entonces** visualiza a los pacientes clasificados en columnas según su fase actual (*Sospecha, Diagnóstico, En Comité, En Tratamiento HGF, Derivado Externo, Seguimiento*).
- **Escenario 2: Apertura de la línea de tiempo (Timeline) individual**
  - **Dado que** la gestora hace clic en un paciente específico,
  - **Cuando** se despliega el perfil del paciente,
  - **Entonces** se muestra una línea de tiempo interactiva con la fecha exacta de cada hito (ingreso, biopsia, comité, inicio de terapia) y los días transcurridos entre etapas.

---

### HU-02: Evaluación Multidimensional y Estratificación de Riesgo
- **Como** Gestora Oncológica,
- **Quiero** registrar y actualizar la evaluación clínica, funcional y psicosocial del paciente,
- **Para** identificar factores de riesgo y priorizar el acompañamiento a pacientes con mayor vulnerabilidad.

#### Criterios de Aceptación (Checklist):
- [x] El formulario permite registrar el estado funcional según escalas estandarizadas (ECOG 0 a 4 y/o Karnofsky).
- [x] Incluye campos para evaluación socioeconómica: red de apoyo familiar, comuna de residencia, dificultades de traslado y situación laboral.
- [x] El sistema calcula un puntaje de riesgo asistencial (Bajo, Medio, Alto) que resalta al paciente en el tablero principal.
- [x] Permite registrar comorbilidades relevantes que influyan en el plan terapéutico.

---

### HU-03: Bitácora de Acompañamiento y Seguimiento Activo
- **Como** Gestora Oncológica,
- **Quiero** registrar cada contacto telefónico, presencial o gestión asistencial en una bitácora cronológica,
- **Para** mantener una memoria continua del acompañamiento y coordinar oportunamente apoyos clínicos o sociales.

#### Criterios de Aceptación (Given-When-Then):
- **Escenario 1: Registro de un nuevo contacto de acompañamiento**
  - **Dado que** la gestora contacta al paciente o a su cuidador por teléfono,
  - **Cuando** presiona "Nuevo Registro de Acompañamiento" en la ficha del paciente,
  - **Entonces** puede ingresar el tipo de contacto, estado anímico/físico, adherencia a indicaciones, incidencias reportadas y compromisos acordados.
- **Escenario 2: Consulta del historial de acompañamiento**
  - **Dado que** cualquier miembro autorizado del equipo abre la ficha del paciente,
  - **Cuando** accede a la pestaña "Bitácora",
  - **Entonces** visualiza todas las intervenciones previas ordenadas de más reciente a más antigua con fecha, hora y profesional responsable.

---

### HU-04: Sistema de Alertas de Plazos GES y Detección de Deserción
- **Como** Gestora Oncológica,
- **Quiero** que el sistema me alerte preventivamente sobre plazos GES por vencer o pacientes sin actividad reciente,
- **Para** intervenir a tiempo, evitar la deserción del tratamiento y cumplir las garantías de oportunidad legal.

#### Criterios de Aceptación (Given-When-Then):
- **Escenario 1: Alerta preventiva de plazo GES**
  - **Dado que** un paciente con patología GES se encuentra a menos de 5 días hábiles de cumplir el plazo máximo de confirmación o tratamiento,
  - **Cuando** la gestora ingresa al sistema o revisa el panel de alertas,
  - **Entonces** el paciente aparece destacado con semáforo amarillo/rojo indicando los días restantes para el vencimiento de la garantía.
- **Escenario 2: Detección de paciente en riesgo de abandono**
  - **Dado que** un paciente no registra citas, exámenes ni notas de bitácora por más de 15 días consecutivos en una fase activa,
  - **Cuando** el motor de reglas nocturno ejecuta la verificación,
  - **Entonces** se genera una alerta prioritaria de "Riesgo de Inactividad/Abandono" asignada a la gestora responsable.

---

### HU-05: Consolidación Automatizada de Biopsias e Informes Diagnósticos
- **Como** Gestora Oncológica,
- **Quiero** que los informes de anatomía patológica e imagenología se vinculen automáticamente a la ficha del paciente,
- **Para** no tener que buscar manualmente los resultados en sistemas externos ni depender del retiro físico de papeles.

#### Criterios de Aceptación (Checklist):
- [x] El sistema sincroniza automáticamente con el sistema de patología e imagenología mediante el RUN del paciente.
- [x] Cuando un informe de biopsia pasa a estado "Validado/Firmado", se notifica a la gestora en su panel de novedades.
- [x] El informe completo en PDF o texto estructurado queda disponible para lectura directa y descarga en la ficha del paciente.
- [x] Muestra indicador visual de "Exámenes Completos para Comité" cuando todos los estudios solicitados han sido recibidos.

---

### HU-06: Preparación y Generación de Ficha para Comité Oncológico
- **Como** Gestora Oncológica,
- **Quiero** generar automáticamente la ficha de presentación del paciente para el comité multidisciplinario,
- **Para** agilizar la citación a comité y asegurar que los médicos cuenten con todos los antecedentes clínicos ordenados.

#### Criterios de Aceptación (Given-When-Then):
- **Escenario 1: Asignación a tabla de comité**
  - **Dado que** un paciente cuenta con sus exámenes diagnósticos completos,
  - **Cuando** la gestora selecciona la fecha y especialidad del comité (Digestivo, Tórax, Mama, etc.),
  - **Entonces** el paciente queda agendado en la tabla de sesión correspondiente.
- **Escenario 2: Generación de Ficha de Presentación**
  - **Dado que** el paciente está en la tabla de comité,
  - **Cuando** se solicita generar la ficha de caso,
  - **Entonces** OncoTrace compila automáticamente diagnóstico de sospecha, resumen de biopsia, informe de imágenes, antecedentes mórbidos y estado funcional (ECOG).

---

### HU-07: Registro en Línea y Acta Digital de Comité Oncológico
- **Como** Médico integrante del Comité Oncológico,
- **Quiero** registrar el análisis multidisciplinario y la resolución terapéutica directamente en la plataforma durante la sesión,
- **Para** que el acta quede formalizada inmediatamente, disponible en la ficha clínica y con validez institucional.

#### Criterios de Aceptación (Checklist):
- [x] Durante la sesión se registran los médicos asistentes, el TNM/estadificación clínica y la conducta terapéutica acordada.
- [x] Permite seleccionar la indicación principal (Quimioterapia, Cirugía, Radioterapia, Cuidados Paliativos, Estudios Adicionales).
- [x] Al finalizar la presentación del caso, el acta se cierra y firma digitalmente.
- [x] Se genera automáticamente una tarea en el tablero de la gestora con el plan a ejecutar (ej. derivar a Van Buren o coordinar pabellón).

---

### HU-08: Monitoreo y Trazabilidad de Derivaciones Externas
- **Como** Gestora Oncológica,
- **Quiero** registrar y dar seguimiento a las derivaciones enviadas al Hospital Carlos Van Buren y prestadores privados,
- **Para** no perder la trazabilidad de los pacientes que reciben radioterapia, quimioterapia o exámenes fuera del HGF.

#### Criterios de Aceptación (Given-When-Then):
- **Escenario 1: Registro de derivación a Hospital Carlos Van Buren**
  - **Dado que** el comité resolvió derivar al paciente a radioterapia o quimioterapia en el HCVB,
  - **Cuando** la gestora registra el envío de la interconsulta,
  - **Entonces** se activa un estado de seguimiento externo donde se pueden ingresar hitos (fecha de citación en HCVB, fecha de inicio y término del ciclo).
- **Escenario 2: Seguimiento de exámenes comprados (PET-CT / EBUS)**
  - **Dado que** se tramita una compra de servicio en clínica privada,
  - **Cuando** el centro privado emite el resultado,
  - **Entonces** la gestora puede adjuntar el informe digital en OncoTrace cerrando el hito de espera.

---

### HU-09: Reportes de Gestión, Cumplimiento GES y Carga Asistencial
- **Como** Jefa del Servicio de Oncología,
- **Quiero** generar métricas e indicadores de gestión sobre tiempos de atención, cumplimiento de plazos y volumen de pacientes,
- **Para** evaluar el desempeño del servicio, detectar cuellos de botella y justificar recursos asistenciales.

#### Criterios de Aceptación (Checklist):
- [x] Genera reporte de tiempos promedio entre: *Sospecha ➔ Biopsia*, *Biopsia ➔ Comité*, *Comité ➔ Inicio de Tratamiento*.
- [x] Muestra porcentaje de cumplimiento de garantías GES por patología oncológica.
- [x] Desglosa la cantidad de pacientes activos por gestora oncológica y estado de avance.
- [x] Permite exportar los datos agregados en formato Excel y PDF.

---

### HU-10: Control de Roles, Privilegios y Auditoría de Ficha Clínica
- **Como** Administrador del Sistema / Oficial de Seguridad,
- **Quiero** controlar los permisos de acceso según el perfil profesional y auditar cada acción sobre los datos del paciente,
- **Para** proteger la confidencialidad de la información médica conforme a la Ley N° 20.584.

#### Criterios de Aceptación (Given-When-Then):
- **Escenario 1: Control de acceso por rol**
  - **Dado que** un usuario inicia sesión con credenciales válidas,
  - **Cuando** intenta acceder a un módulo de la plataforma,
  - **Entonces** el sistema sólo le permite ver y ejecutar las funciones habilitadas para su rol (Gestora, Médico, Secretaría, Administrador).
- **Escenario 2: Registro de auditoría clínica inmutable**
  - **Dado que** un usuario consulta o modifica la ficha o bitácora de un paciente,
  - **Cuando** se realiza la operación,
  - **Entonces** el sistema guarda en el log inmutable el RUN del paciente, ID de usuario, fecha, hora y tipo de acción realizada.
