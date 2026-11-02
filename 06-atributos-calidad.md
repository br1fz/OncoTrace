# Atributos de calidad (ISO/IEC 25010:2023)

## Priorización de las características de calidad

La siguiente priorización considera los riesgos de la gestión oncológica en el Hospital Dr. Gustavo Fricke: confidencialidad de los antecedentes clínicos, continuidad de la atención y oportunidad de las decisiones asistenciales.

1. **Seguridad de la información:** Protección de diagnósticos y fichas clínicas mediante control de acceso y auditoría. Se consideran la Ley N° 20.584, la Ley N° 21.258 y la normativa de protección de datos personales, incluida la Ley N° 19.628 y sus modificaciones por la [Ley N° 21.719](https://www.bcn.cl/leychile/navegar?idNorma=1209272), vigente desde el 1 de diciembre de 2026.

2. **Fiabilidad:** Disponibilidad operativa durante la jornada asistencial y las sesiones del Comité Oncológico Regional, con medidas de recuperación ante fallos.

3. **Eficiencia de desempeño:** Respuesta oportuna al consultar y filtrar el tablero Kanban, incluso con pacientes y usuarios concurrentes.

4. **Compatibilidad:** Intercambio de información diagnóstica con LIS y PACS, y apoyo a la coordinación de derivaciones al Hospital Carlos Van Buren.

5. **Capacidad de interacción:** Interfaz comprensible y accesible para gestores, médicos y pacientes, incluido el módulo de autoatención.

6. **Idoneidad funcional:** Cumplimiento de las reglas asistenciales definidas, como alertas de plazos GES, actas de comité y reportes REM 7.

7. **Mantenibilidad:** Organización modular que facilite los ajustes de requisitos, plazos y funciones del sistema.

8. **Flexibilidad:** Capacidad de adaptarse a nuevas patologías, cambios normativos y necesidades de la UGCO.

9. **Seguridad operacional (Safety):** Prevención de errores del sistema que puedan producir información clínica incorrecta o decisiones asistenciales inseguras. Ante datos incompletos o no validados, el sistema debe advertir al usuario y permitir la revisión profesional.

---

## Escenarios de calidad de los tres atributos priorizados

Los siguientes escenarios especifican fuente, estímulo, entorno, artefacto, respuesta y medidas para evaluar seguridad, fiabilidad y eficiencia.

### AC-01 — Seguridad de la información

- **Requisitos asociados:** RNF-03 y REQ-DER-01.
- **Métrica objetivo:** Control de acceso basado en roles (RBAC) y registro inmutable de las operaciones sobre información clínica.
- **Fuente del estímulo:** Profesional de la UGCO, administrador del sistema o persona no autenticada.
- **Estímulo:** Intento de consultar, modificar o exportar antecedentes de una ficha oncológica.
- **Entorno:** Operación normal del sistema durante la jornada asistencial.
- **Artefacto:** Módulos de autenticación y autorización, y bitácora de auditoría.
- **Respuesta:** El sistema valida la identidad y los permisos antes de autorizar la operación. Rechaza los intentos sin autorización y registra los accesos y las operaciones.
- **Medidas de respuesta:**
  - El 100 % de los accesos y de los intentos de consulta, modificación o exportación debe quedar registrado con RUN, rol, fecha y hora, dirección IP y tipo de operación.
  - No debe completarse ningún acceso no autorizado a datos protegidos.
  - La persistencia de cada registro de auditoría debe tardar 50 milisegundos o menos, sin bloquear la operación del usuario.

---

### AC-02 — Fiabilidad

- **Requisito asociado:** RNF-01.
- **Métrica objetivo:** Disponibilidad durante el horario asistencial y recuperación ante fallos.
- **Fuente del estímulo:** Infraestructura interna, ante un fallo del nodo principal de base de datos o un corte de suministro.
- **Estímulo:** Pérdida de conectividad con la instancia principal durante una sesión del comité médico.
- **Entorno:** Jornada asistencial, entre las 08:00 y las 18:00.
- **Artefacto:** Capa de persistencia, base de datos y réplica secundaria de contingencia.
- **Respuesta:** El sistema detecta el fallo, aísla el nodo afectado y activa la instancia de contingencia para restablecer el servicio.
- **Medidas de respuesta:**
  - Disponibilidad mensual de al menos 99,5 % durante la jornada asistencial.
  - Tiempo objetivo de recuperación (RTO) de cinco minutos o menos.
  - Punto objetivo de recuperación (RPO) igual a cero: no se pierden transacciones clínicas confirmadas.

---

### AC-03 — Eficiencia de desempeño

- **Requisito asociado:** RNF-02.
- **Métrica objetivo:** Tiempo de respuesta y visualización del tablero bajo condiciones de concurrencia.
- **Fuente del estímulo:** Gestor/a oncológico/a o jefatura de la unidad.
- **Estímulo:** Consulta y filtrado del tablero con más de 1.000 pacientes registrados con alertas activas.
- **Entorno:** Atención simultánea con 50 usuarios institucionales concurrentes.
- **Artefacto:** API de consulta de trazabilidad y módulo de seguimiento.
- **Respuesta:** El sistema permite paginar y ordenar los registros, y muestra las ocho columnas asistenciales.
- **Medidas de respuesta:**
  - La carga y visualización completa del tablero debe tardar 2,0 segundos o menos.
  - El uso de CPU del servidor de aplicaciones debe ser de 70 % o menos bajo la carga indicada.
