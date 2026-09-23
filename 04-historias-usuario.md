# 👤 Historias de usuario

> **Resumen Ejecutivo:** Las siguientes historias documentan las funcionalidades requeridas por el equipo clínico. Cada historia está trazada explícitamente a una actividad rediseñada en el modelo TO-BE.

| ID | Título | Rol Principal | Prioridad |
|---|---|---|---|
| **HU-01** | Tablero de Trazabilidad | Gestora Oncológica | Alta (Must) |
| **HU-02** | Evaluación Multidimensional | Gestora Oncológica | Alta (Must) |
| **HU-03** | Bitácora de Acompañamiento | Gestora Oncológica | Alta (Must) |
| **HU-04** | Alertas de Plazos GES | Gestora Oncológica | Alta (Must) |
| **HU-05** | Consolidación de Biopsias | Sistema OncoTrace | Alta (Must) |
| **HU-06** | Generación Ficha Comité | Gestora Oncológica | Alta (Must) |
| **HU-07** | Acta Digital de Comité | Médico / Comité | Alta (Must) |
| **HU-08** | Trazabilidad Derivaciones | Gestora Oncológica | Alta (Must) |

---
 
## 📌 HU-01
Como Gestora Oncológica, quiero visualizar un tablero centralizado y una línea de tiempo cronológica por paciente con sus hitos, para conocer el estado asistencial sin revisar múltiples planillas.
**Actividad TO-BE asociada:** Gestora monitorea tablero Kanban y revisa resultados consolidados
**Criterios de aceptación:**
- **CA1 (Escenario Kanban):** Dado que la gestora ingresa al módulo, cuando visualiza el tablero, entonces ve a los pacientes clasificados en columnas según su fase actual (Sospecha, En Comité, Tratamiento).
- **CA2 (Escenario Timeline):** Dado que la gestora hace clic en un paciente, cuando se despliega el perfil, entonces se muestra una línea de tiempo con la fecha exacta de cada hito y días transcurridos.
 
## 📌 HU-02
Como Gestora Oncológica, quiero registrar y actualizar la evaluación clínica, funcional y psicosocial del paciente, para identificar factores de riesgo y priorizar el acompañamiento a pacientes vulnerables.
**Actividad TO-BE asociada:** Gestora realiza Evaluación Multidimensional (ECOG, Social, Red)
**Criterios de aceptación:**
- **CA1 (Validación Clínica):** El formulario debe permitir registrar el estado funcional (ECOG 0 a 4).
- **CA2 (Validación Social):** El formulario debe incluir campos obligatorios para evaluación socioeconómica y red de apoyo.
- **CA3 (Cálculo de Riesgo):** El sistema debe calcular un puntaje de riesgo asistencial que resalte al paciente en el tablero principal.
 
## 📌 HU-03
Como Gestora Oncológica, quiero registrar cada contacto telefónico o gestión asistencial en una bitácora cronológica, para mantener una memoria del acompañamiento y coordinar apoyos clínicos.
**Actividad TO-BE asociada:** Gestora registra primer contacto en Bitácora de Acompañamiento
**Criterios de aceptación:**
- **CA1 (Registro):** Dado que la gestora contacta al paciente, cuando presiona "Nuevo Registro", entonces puede ingresar el tipo de contacto, estado anímico, incidencias y compromisos.
- **CA2 (Lectura):** Dado que un miembro autorizado abre la ficha, cuando accede a "Bitácora", entonces visualiza todas las intervenciones ordenadas de más reciente a más antigua.
 
## 📌 HU-04
Como Gestora Oncológica, quiero que el sistema me alerte preventivamente sobre plazos GES por vencer o pacientes inactivos, para evitar la deserción del tratamiento y cumplir las garantías legales.
**Actividad TO-BE asociada:** Motor de alertas evalúa plazos GES y riesgo de inactividad
**Criterios de aceptación:**
- **CA1 (Alerta GES):** Dado que un paciente está a menos de 5 días hábiles de vencer su plazo, cuando la gestora revisa el panel, entonces el paciente se destaca con un semáforo de alerta.
- **CA2 (Alerta Abandono):** Dado que un paciente no registra actividad por >15 días, cuando el motor nocturno verifica la BD, entonces se genera una alerta prioritaria de "Riesgo de Abandono".
 
## 📌 HU-05
Como Gestora Oncológica, quiero que los informes de patología e imagenología se vinculen automáticamente a la ficha, para no buscar manualmente en sistemas externos ni depender de papeles.
**Actividad TO-BE asociada:** OncoTrace consolida e indexa informes de patología e imágenes
**Criterios de aceptación:**
- **CA1 (Sincronización):** El sistema debe sincronizarse automáticamente con LIS/PACS usando el RUN del paciente.
- **CA2 (Notificación):** Cuando un informe se valida, el sistema debe notificar a la gestora y adjuntar el PDF en la ficha.
- **CA3 (Completitud):** El sistema debe mostrar un indicador de "Exámenes Completos" al recibir todos los estudios solicitados.
 
## 📌 HU-06
Como Gestora Oncológica, quiero generar automáticamente la ficha de presentación para el comité multidisciplinario, para agilizar la citación y asegurar que los médicos cuenten con antecedentes ordenados.
**Actividad TO-BE asociada:** OncoTrace compila antecedentes y genera Ficha de Presentación
**Criterios de aceptación:**
- **CA1 (Agendamiento):** Dado que un paciente tiene exámenes completos, cuando la gestora selecciona la fecha, entonces el paciente queda agendado en la tabla de sesión.
- **CA2 (Generación):** Dado que el paciente está en tabla, cuando se solicita generar la ficha, entonces OncoTrace compila diagnóstico, biopsia, imágenes y estado ECOG en un solo PDF.
 
## 📌 HU-07
Como Médico del Comité Oncológico, quiero registrar el análisis y la resolución terapéutica directamente en la plataforma durante la sesión, para que el acta quede formalizada y disponible en la ficha clínica.
**Actividad TO-BE asociada:** Comité evalúa caso y firma Acta Digital con conducta terapéutica
**Criterios de aceptación:**
- **CA1 (Registro):** El sistema debe permitir registrar médicos asistentes, estadificación TNM y la indicación principal.
- **CA2 (Firma):** Al finalizar la presentación, el sistema debe permitir cerrar y firmar digitalmente el acta.
- **CA3 (Traspaso):** Una vez firmada, el sistema debe generar automáticamente una tarea de seguimiento en el tablero de la gestora.
 
## 📌 HU-08
Como Gestora Oncológica, quiero registrar y dar seguimiento a las derivaciones enviadas al Hospital Van Buren y prestadores privados, para no perder la trazabilidad de los pacientes derivados.
**Actividad TO-BE asociada:** Gestora realiza seguimiento activo de derivación en OncoTrace
**Criterios de aceptación:**
- **CA1 (Derivación Pública):** Dado que el comité deriva al paciente, cuando la gestora registra la interconsulta, entonces se activa un estado de seguimiento externo (HCVB).
- **CA2 (Derivación Privada):** Dado que se tramita un examen en clínica privada, cuando se emite el resultado, entonces la gestora puede adjuntar el informe digital para cerrar el hito de espera.
