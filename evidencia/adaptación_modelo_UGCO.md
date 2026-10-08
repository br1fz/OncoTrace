# Catastro de Cambios: Adaptación al Modelo UGCO (Versión 2.0)

Este documento detalla los hallazgos y ajustes necesarios para adaptar la documentación del estado actual del proyecto (As-Is) a los manuales oficiales de la Unidad de Gestión de Casos Oncológicos (UGCO) (Versión 2.0).

## 1. Nomenclatura y Estructura Organizacional
* **Nombre de la Unidad:** El proyecto actual se refiere al proceso bajo el "Centro de Atención de Especialidades (CAE)". Debe actualizarse formalmente a **Unidad de Gestión de Casos Oncológicos (UGCO)**.
* **Dependencia:** Se debe reflejar que la UGCO tiene una **dependencia mixta**: administrativamente depende de la Subdirección de Gestión del Cuidado (SDGC) y técnicamente de la Subdirección Médica (SDM).

## 2. Actualización de Participantes y Roles
Actualmente, el levantamiento de procesos lista únicamente a la Gestora, Médico, Comité, Secretaría, Unidades de apoyo y Paciente. Según los manuales, la dotación es de 9 personas. Se deben incorporar los siguientes roles:
* **Enfermera Supervisora:** Lidera la unidad, asigna especialidades, evalúa desempeño y elabora planes estratégicos.
* **Gestor/a Oncológico/a (Enfermero/a o Matrón/a):** Ejerce un acompañamiento integral en cuatro dimensiones: clínico-terapéutica, informativa, psicosocial y espiritual.
* **Técnico en Enfermería (TENS):** Rol operativo clave. Apoya en la creación del "dossier" de derivación, contactabilidad, agendamiento de pacientes y brinda apoyo al comité de tiroides.
* **Administrativo/a:** Encargado/a de solicitar fichas clínicas, archivar, enviar correspondencia y coordinar toma de exámenes.
* **Equipo Multidisciplinario:** Se deben incluir actores a los que el gestor deriva: dupla psicosocial, nutricionista, kinesiólogo, oncogeriatría, etc.
* **Cuidador Principal:** Incorporado formalmente como sujeto de acompañamiento junto al paciente.

## 3. Uso de Sistemas Informáticos (Aclaración del AS-IS)
* **Nodo Crítico AS-05:** El documento `01-proceso-as-is.md` indica una "Ausencia de Registro Centralizado". Sin embargo, el Manual de Organización establece explícitamente que la Unidad **sí utiliza una plataforma de registro local** complementada con la ficha clínica institucional. 
* **El verdadero nodo crítico:** Esta plataforma local **no interopera** con la Plataforma de Seguimiento Oncológico del MINSAL (Salud Digital). Esto genera un desafío de migración de datos e impide el reporte y trazabilidad a nivel nacional, por lo que el problema AS-05 debe ser reescrito.

## 4. Etapas del Proceso (Trayectoria Oncológica)
El flujo del proceso (Diagramas y documentos) debe ajustarse a las etapas formales y secuenciales definidas en el Manual de Procedimientos:
1. **Sospecha** (incluyendo el ingreso desde Urgencias, APS, o por informe crítico de anatomía patológica).
2. **Confirmación Diagnóstica.**
3. **Etapificación.**
4. **Tratamiento** (con presentación obligatoria a Comité Oncológico Regional previo al inicio).
5. **Rehabilitación** (etapa nueva a documentar, con derivaciones a kinesiología/terapia ocupacional).
6. **Cuidados Paliativos y Alivio del Dolor.**
7. **Seguimiento y Sobrevivientes.**
8. **Alta y Contrarreferencia** (criterios de cierre: remisión, fallecimiento, traslado o decisión clínica).

## 5. Puntos de Contacto Obligatorio
El proceso debe reflejar que el gestor no solo reacciona, sino que tiene intervenciones programadas obligatorias: al ingreso del caso, posterior a la confirmación diagnóstica, tras la resolución de comité, al alta de hospitalizaciones, al finalizar el tratamiento y ante derivaciones externas.

## 6. Gestión de Derivaciones y Trazabilidad (Nodo AS-03)
* En el As-Is actual se describe el envío de interconsultas "en papel" al Hospital Carlos Van Buren. 
* El Manual de Procedimientos aclara este flujo: **el TENS confecciona un "dossier"** con toda la documentación y lo entrega a la UGAA, unidad que realiza la derivación final. Si bien el problema de pérdida de trazabilidad en la red persiste, se debe ajustar la descripción de cómo se origina y tramita este dossier para ser exactos con el manual operativo.
