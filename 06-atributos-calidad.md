# Atributos de Calidad (ISO/IEC 25010)

## Priorización de los Atributos de Primer Nivel

La priorización de los atributos de calidad para la plataforma **OncoTrace** responde a la naturaleza crítica de la gestión oncológica en el Hospital Dr. Gustavo Fricke, donde la reserva legal de antecedentes clínicos, la continuidad operativa del servicio y la oportunidad diagnóstica representan los factores de mayor impacto asistencial y normativo.

1. **Seguridad:** Gestión de diagnósticos sensibles y fichas oncológicas bajo estricta reserva legal (cumplimiento Ley N° 20.584 de Derechos y Deberes del Paciente y Ley N° 21.258 Nacional del Cáncer).
2. **Fiabilidad:** Disponibilidad ininterrumpida de la plataforma durante la jornada hospitalaria y las sesiones colegiadas del Comité Oncológico Regional, garantizando tolerancia a fallos.
3. **Eficiencia de Desempeño:** Tiempos de respuesta ágiles en la consulta y renderizado del tablero Kanban y expedientes clínicos, evitando demoras en la atención asistencial.
4. **Compatibilidad (Interoperabilidad):** Intercambio fluido de datos diagnósticos con sistemas de apoyo (LIS para biopsias, PACS para imagenología) y coordinación de derivaciones hacia el Hospital Carlos Van Buren.
5. **Usabilidad:** Interfaz intuitiva y accesible para gestoras clínicas, médicos especialistas y pacientes en el módulo de autoatención.
6. **Idoneidad Funcional:** Cumplimiento riguroso de las reglas asistenciales comprometidas (alertas de plazos GES, confección de actas de comité y reportes estadísticos REM 0.7).
7. **Mantenibilidad:** Arquitectura modular desacoplada que permita incorporar nuevas patologías oncológicas o ajustar plazos normativos sin rehacer el sistema.
8. **Portabilidad:** Compatibilidad multiplataforma en navegadores web estándar utilizados en las estaciones de trabajo institucionales del hospital.
9. **Protección (Safety):** Resguardo de la persistencia de datos y prevención de inconsistencias clínicas ante contingencias físicas o fallos de infraestructura.

---

## Escenarios de Calidad Arquitectónicos para los 3 Atributos Principales

Para los tres atributos de mayor criticidad se formalizan las métricas mediante **Escenarios de Calidad (SEI)**, asegurando criterios medibles y verificables:

### 1. Seguridad (AC-01)
* **Requisitos no funcionales asociados:** RNF-03 | REQ-DER-01
* **Métrica objetivo:** Control de acceso estricto basado en roles (RBAC) e inmutabilidad en la bitácora de auditoría.
* **Escenario de Calidad:**
  * **Fuente del estímulo:** Usuario del sistema (gestora, médico, administrativo o usuario no autenticado).
  * **Estímulo:** Intento de consulta, edición o exportación de antecedentes confidenciales de la ficha oncológica.
  * **Entorno:** Operación normal del sistema en horario asistencial.
  * **Artefacto:** Módulo de Autenticación, Servicio de Autorización y Bitácora Transaccional.
  * **Respuesta:** El sistema verifica las credenciales y permisos según el rol asignado antes de autorizar la acción, generando una entrada inmutable de auditoría.
  * **Medida de respuesta:** 
    * 100% de los accesos e intentos de modificación registrados con RUN, perfil, timestamp, IP y tipo de operación.
    * 0% de accesos o derivaciones no autorizadas a datos protegidos.
    * Tiempo de persistencia del log de auditoría $\le 50$ milisegundos sin bloquear la experiencia de usuario.

---

### 2. Fiabilidad (AC-02)
* **Requisito no funcional asociado:** RNF-01
* **Métrica objetivo:** Disponibilidad operativa asistencial (Uptime) y Tiempo de Recuperación Objetivo (RTO).
* **Escenario de Calidad:**
  * **Fuente del estímulo:** Infraestructura interna (fallo imprevisto en nodo primario de base de datos o corte de suministro).
  * **Estímulo:** Pérdida de conectividad con la instancia principal durante la sesión de un comité médico.
  * **Entorno:** Horario asistencial pico de atención hospitalaria.
  * **Artefacto:** Capa de persistencia, base de datos y réplica secundaria de contingencia.
  * **Respuesta:** Conmutación por error automática (*failover*) hacia la réplica secundaria y aislamiento del nodo afectado.
  * **Medida de respuesta:** 
    * Disponibilidad mensual $\ge 99.5\%$ en horario de jornada clínica (08:00 a 18:00 hrs).
    * Tiempo de recuperación del servicio (RTO) $\le 5$ minutos.
    * Punto de recuperación objetivo (RPO) = 0 transacciones clínicas confirmadas perdidas.

---

### 3. Eficiencia de Desempeño (AC-03)
* **Requisito no funcional asociado:** RNF-02
* **Métrica objetivo:** Latencia de carga y renderizado del tablero Kanban bajo condiciones de concurrencia.
* **Escenario de Calidad:**
  * **Fuente del estímulo:** Gestor/a oncológico/a o jefatura de unidad.
  * **Estímulo:** Consulta y filtrado del tablero central de trazabilidad con más de 1.000 pacientes registrados y alertas activas.
  * **Entorno:** Horario de atención simultánea con una carga concurrente de 50 usuarios institucionales.
  * **Artefacto:** API de Consulta de Trazabilidad y Módulo Frontend de Seguimiento.
  * **Respuesta:** La plataforma ejecuta la paginación, ordena los registros y renderiza las 8 columnas asistenciales.
  * **Medida de respuesta:** 
    * Tiempo total de respuesta y visualización completa en pantalla $\le 2.0$ segundos.
    * Tasa de uso de CPU en el servidor de aplicaciones $\le 70\%$ bajo la carga nominal establecida.
