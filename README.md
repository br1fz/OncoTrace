# OncoTrace

**Gestión, navegación y trazabilidad oncológica**

CIN324 · Ingeniería de Requisitos  
Hospital Dr. Gustavo Fricke (HGF)  
Unidad de Gestión de Casos Oncológicos (UGCO)

OncoTrace es una propuesta académica para apoyar el seguimiento de pacientes, la gestión de plazos y la coordinación de derivaciones oncológicas. Este repositorio reúne el levantamiento de requisitos, la especificación y los modelos del proyecto.

## Acceso a las entregas

| Entrega | Alcance | Documento integrador |
| :--- | :--- | :--- |
| **Entrega 1** | Proceso actual, rediseño, requisitos e historias de usuario. | [Consultar Entrega 1](./Documentos/IngReq-Entrega%201.md) |
| **Entrega 2** | Criterios de aceptación, modelo de dominio, casos de uso, diagramas y trazabilidad. | [Consultar Entrega 2](./Documentos/IngReq-Entrega%202.md) |

[Documentos de la Entrega 1](#entrega-1) · [Documentos de la Entrega 2](#entrega-2) · [Diagramas y fuentes](#diagramas-y-fuentes-editables) · [Equipo](#equipo-de-trabajo)

---

## Entrega 1

Documentación del proceso actual y de la propuesta de mejora, con sus requisitos, fuentes de elicitación e historias de usuario.

| Documento | Contenido |
| :--- | :--- |
| [01 · Proceso AS-IS](./Documentos/01-proceso-as-is.md) | Proceso actual y problemas identificados. |
| [02 · Rediseño TO-BE](./Documentos/02-rediseno-to-be.md) | Proceso propuesto y actividades de mejora. |
| [03 · Requisitos](./Documentos/03-requisitos.md) | Requisitos funcionales, no funcionales y de proyecto. |
| [04 · Historias de usuario](./Documentos/04-historias-usuario.md) | Historias de usuario y requisitos asociados. |
| [05 · Elicitación](./Documentos/05-elicitacion.md) | Fuentes de elicitación EL-01 a EL-03. |
| [06 · Atributos de calidad](./Documentos/06-atributos-calidad.md) | Escenarios de calidad AC-01 a AC-03. |
| [07 · Matriz de trazabilidad](./Documentos/07-matriz-trazabilidad.md) | Relaciones entre problemas, actividades, requisitos e historias. |

## Entrega 2

Especificación de las historias **HU-01 · Seguimiento del caso**, **HU-04 · Alertas de seguimiento**, **HU-05 · Informes diagnósticos** y **HU-08 · Derivación y retorno**.

| Documento | Contenido |
| :--- | :--- |
| [07 · Criterios de aceptación](./Documentos/07-criterios-aceptacion.md) | Escenarios Gherkin para las cuatro historias seleccionadas. |
| [08 · Modelo de dominio](./Documentos/08-modelo-dominio.md) | Clases del dominio, atributos y asociaciones. |
| [09 · Casos de uso](./Documentos/09-casos-de-uso.md) | Actores, objetivos y relaciones representados en DCU-01. |
| [10 · Diagramas de secuencia](./Documentos/10-diagramas-secuencia.md) | DSS-01 para HU-05 y DSS-02 para HU-08. |
| [11 · Diagramas de estado](./Documentos/11-diagramas-estado.md) | EST-01 para `AlertaSeguimiento` y EST-02 para `DossierDigitalDerivacion`. |
| [12 · Matriz de trazabilidad](./Documentos/12-trazabilidad.md) | Relaciones entre requisitos, historias, criterios y artefactos. |

La elaboración, las colaboraciones, las responsabilidades individuales y el uso de IA generativa se detallan en el [documento integrador de la Entrega 2](./Documentos/IngReq-Entrega%202.md).

## Diagramas y fuentes editables

Los documentos explican el alcance de cada modelo. Las imágenes permiten consultarlo directamente y las fuentes conservan su versión editable.

| Modelo | Documento | Imagen | Fuente editable |
| :--- | :--- | :--- | :--- |
| Proceso actual | [01 · AS-IS](./Documentos/01-proceso-as-is.md) | — | [BPMN](./diagramas/as-is.bpmn) |
| Proceso propuesto | [02 · TO-BE](./Documentos/02-rediseno-to-be.md) | — | [BPMN](./diagramas/to-be.bpmn) |
| Modelo de dominio | [08 · Modelo de dominio](./Documentos/08-modelo-dominio.md) | [UML](./diagramas/modelo-dominio.png) | [PlantUML](./diagramas/modelo-dominio.puml) |
| Casos de uso | [09 · Casos de uso](./Documentos/09-casos-de-uso.md) | [DCU-01](./diagramas/casos-de-uso.png) | [PlantUML](./diagramas/casos-de-uso.puml) |
| Secuencias del sistema | [10 · Diagramas de secuencia](./Documentos/10-diagramas-secuencia.md) | [DSS-01](./diagramas/DSS-01-HU-05.png) · [DSS-02](./diagramas/DSS-02-HU-08.png) | [PlantUML](./diagramas/diagramas-secuencia.puml) |
| Estados de objetos | [11 · Diagramas de estado](./Documentos/11-diagramas-estado.md) | [EST-01](./diagramas/EST-01-AlertaSeguimiento.png) · [EST-02](./diagramas/EST-02-DossierDigitalDerivacion.png) | [PlantUML](./diagramas/estados-objetos.puml) |

---

## Contexto del proyecto

La propuesta aborda la dispersión de informes diagnósticos, el seguimiento de plazos GES, la gestión de comités y la trazabilidad de derivaciones externas. El proceso actual y las mejoras propuestas se desarrollan en los documentos AS-IS y TO-BE.

La UGCO depende administrativamente de la *Subdirección de Gestión del Cuidado* y técnicamente de la *Subdirección Médica*.

<details>
<summary>Consultar la trayectoria asistencial</summary>

La trayectoria comprende ocho etapas.

1. Sospecha.
2. Confirmación diagnóstica.
3. Etapificación.
4. Tratamiento.
5. Rehabilitación.
6. Cuidados paliativos y alivio del dolor.
7. Seguimiento y sobrevivientes.
8. Alta y contrarreferencia.

La presentación y resolución del Comité Oncológico se registra como hito previo al tratamiento.

</details>

<details>
<summary>Consultar los criterios de integración y resguardo</summary>

| Ámbito | Criterio de la propuesta |
| :--- | :--- |
| **LIS y PACS** | Comunicación mediante HL7 FHIR o API REST, según las interfaces institucionales disponibles. |
| **Hospital Carlos Van Buren** | Integración condicionada a la habilitación y autorización institucional. Si la interfaz está pendiente de habilitación, UGAA puede registrar la respuesta confirmada por el centro receptor. |
| **Plataforma de Seguimiento Oncológico del MINSAL** | Intercambio sujeto al acuerdo entre HGF y MINSAL sobre los datos autorizados, el mecanismo y la periodicidad. |
| **Seguridad y privacidad** | Control de acceso por roles, autenticación institucional y registro de auditoría de las operaciones con información clínica. |

Los requisitos y las condiciones de acceso se desarrollan en la [especificación de requisitos](./Documentos/03-requisitos.md) y en los [criterios de aceptación](./Documentos/07-criterios-aceptacion.md).

</details>

## Evidencias y material de apoyo

| Recurso | Contenido |
| :--- | :--- |
| [Evidencias del proyecto](./evidencia/) | Manuales, registros de entrevista y antecedentes utilizados en la elicitación. |
| [Guía de entrevistas](./entrevistador-elicitacion/skill.md) | Orientaciones para conducir las entrevistas de elicitación. |

## Equipo de trabajo

- Ignacio Jorquera
- Bruno Fernández
- Benjamín Carcamo
- Máximo Torrijo Espinoza

El detalle de las responsabilidades y contribuciones se encuentra en los documentos integradores de cada entrega.

[Responsabilidades de la Entrega 1](./Documentos/IngReq-Entrega%201.md#1-equipo-y-responsabilidades) · [Responsabilidades de la Entrega 2](./Documentos/IngReq-Entrega%202.md#responsabilidades-individuales)

## Referencias normativas y de calidad

El proyecto considera la Ley N° 20.584, la Ley Nacional del Cáncer N° 21.258, la normativa de garantías GES asociada al Decreto Supremo N° 29 y la norma ISO/IEC 25010:2023.

---

## Aplicación prototipo (HU-01, HU-02 y HU-04)

Como parte de la validación ejecutable de requisitos en OpenCode / OpenSpec, se implementaron los incrementos del sistema para las historias:
- **HU-01: Tablero de trazabilidad y línea de tiempo clínica por etapas** (TB-01 / CU-05).
- **HU-02: Evaluación multidimensional y estratificación por dominios** (TB-02 / CU-10).
- **HU-04: Motor de alertas preventivas de plazos GES e inactividad** (TB-04 / CU-06 / RF-04).

### Stack tecnológico
- **Lenguaje / Entorno:** Node.js (TypeScript estricto con `NodeNext`).
- **Framework web:** Express.js + EJS (interfaz accesible, ligera y multi-dispositivo).
- **Base de datos:** SQLite local (`better-sqlite3` con modo WAL y claves foráneas).
- **Pruebas:** Vitest + Supertest (pruebas unitarias de dominio y pruebas de integración de rutas vinculadas a los escenarios Gherkin).

### Requisitos previos
- Node.js versión 20 o superior.
- npm versión 9 o superior.

### Puesta en marcha

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Inicializar y poblar la base de datos de demostración:**
   ```bash
   npm run db:seed
   ```
   *Crea automáticamente la base de datos SQLite en `data/app.db`, aplica migraciones `001_inicial.sql`, `002_evaluacion_multidimensional.sql` y `003_alertas_ges.sql`, y carga 4 casos ficticios en etapas distintas con sus hitos, resoluciones, valoraciones multidimensionales basales y garantías GES relativas.*

3. **Ejecutar la suite de pruebas automatizadas:**
   ```bash
   npm test
   ```
   *Ejecuta 50 pruebas automatizadas (13 de HU-01, 10 de HU-02 y 27 de HU-04) que verifican exhaustivamente los escenarios Gherkin, las reglas de consistencia temporal, el calendario oficial de feriados 2026 de Chile, el umbral preventivo GES (≤ 5 días hábiles), la detección de inactividad (> 15 días corridos), el ciclo de vida de alertas (Pendiente → En gestión → Resuelta / No aplica), la bitácora de gestión, la exportación del reporte consolidado en CSV con BOM UTF-8 y el control de acceso por roles.*

4. **Iniciar el servidor en modo desarrollo:**
   ```bash
   npm run dev
   ```
   *La aplicación quedará disponible en [http://localhost:3000](http://localhost:3000).*

### Recorrido de prueba guiado (Demostración)

#### 1. Tablero de Trazabilidad y Semáforo de Riesgo (HU-01 / HU-02 / HU-04)
- Accede a [http://localhost:3000](http://localhost:3000).
- Observa las 8 columnas de la trayectoria asistencial (`Sospecha` hasta `Alta y contrarreferencia`).
- Cada tarjeta muestra RUN anonimizado, especialidad oncológica, CIE-10, último hito, semáforo de plazos, distintivo de vulnerabilidad derivado de HU-02 y el nuevo distintivo de alerta GES más urgente derivado de HU-04 con el tipo de garantía y los días hábiles restantes.
- En la parte superior, presiona el botón **«⚡ Evaluar alertas ahora»** para disparar la evaluación bajo demanda sin requerir tareas programadas (cron).

#### 2. Ficha del Caso y Valoración Vigente
- Selecciona el caso `CASO-2026-001` (Sospecha) o `CASO-2026-002` (Confirmación diagnóstica).
- En el panel lateral derecho observarás la sección **Valoración Multidimensional Vigente** con el detalle del ECOG, afectación psicoemocional, cuidador identificado, puntaje Zarit, profesional evaluador y las derivaciones activas al equipo psicosocial.
- En la sección **Alertas de Seguimiento**, puedes ver las alertas vigentes con sus días hábiles restantes o días de inactividad, y acceder a las acciones directas de gestión, acreditación de cumplimiento o cierre justificado.
- Si se han registrado gestiones, se muestra la **Bitácora de Gestión de Alertas** con fecha, canal de contacto e interlocutor.

#### 3. Aplicar una Nueva Evaluación Multidimensional (HU-02)
- En la ficha del caso, haz clic en **«+ Nueva evaluación multidimensional»** (o ingresa a `/casos/CASO-2026-001/evaluaciones/nueva`).
- Completa la pauta valorando los 6 dominios normados y presiona **«Guardar Evaluación Multidimensional»**.

#### 4. Panel General de Alertas y Exportación GES (HU-04)
- Accede a la barra superior y selecciona el enlace **«Alertas»** (o ingresa a `/alertas`).
- Visualiza el resumen consolidado de alertas activas, divididas en plazos GES próximos e inactividad asistencial.
- En la tabla de alertas vigentes, la gestora puede:
  1. **Gestionar:** Registra una llamada o contacto en la bitácora mínima; la alerta pasa a estado `En gestión` conservando la garantía pendiente (HU-04-ESC-05).
  2. **Cumplir:** Acredita el cumplimiento de la garantía registrando el hito asistencial; la alerta pasa a `Resuelta` y la garantía a `Cumplida` (HU-04-ESC-06).
  3. **Cerrar:** Documenta una causa legal o clínica que deja sin efecto la garantía (rechazo informado, fallecimiento, etc.); la alerta y la garantía pasan a `No aplica` (HU-04-ESC-07).
- Presiona **«📥 Exportar reporte GES (CSV)»**:
  - Descarga el archivo `alertas-vigentes-AAAA-MM-DD.csv` formateado con BOM UTF-8 y separador `;` para apertura nativa en Excel en Chile (HU-04-ESC-08).
  - Incluye exclusivamente alertas `Pendiente` y `En gestión`, excluyendo alertas resueltas y no aplicables.

#### 5. Control de Rol de Demostración
- En la barra superior, cambia el rol activo a `Médico tratante`.
- Observa que las opciones de evaluación, gestión, resolución, cierre y exportación CSV quedan deshabilitadas o protegidas con rechazo HTTP 403, reservadas exclusivamente al perfil `Gestor/a UGCO` (CU-06 / CU-10).
