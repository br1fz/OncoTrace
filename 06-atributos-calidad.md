# Atributos de Calidad y Escenarios Arquitectónicos – OncoTrace

**CIN324 – Metodología de Análisis e Ingeniería de Requisitos**  
*Hospital Dr. Gustavo Fricke (HGF) – Plataforma OncoTrace*

---

## 1. Modelo de Calidad ISO/IEC 25010

Se han priorizado cuatro características esenciales para la plataforma OncoTrace:
1. **Seguridad y Confidencialidad:** Protección estricta de fichas oncológicas y registro inmutable de auditoría.
2. **Rendimiento y Eficiencia Temporal:** Respuesta inmediata en consultas y carga de tableros de trazabilidad.
3. **Fiabilidad y Disponibilidad:** Operación continua sin interrupciones que afecten la atención de pacientes.
4. **Usabilidad y Eficiencia Operativa:** Reducción de la carga cognitiva y clics para las gestoras oncológicas.

---

## 2. Escenarios de Calidad Arquitectónicos (Formato SEI / Bass et al.)

### Escenario 1: Rendimiento en Carga de Tablero de Trazabilidad
- **Fuente de estímulo:** Gestora Oncológica.
- **Estímulo:** Accede al tablero general de trazabilidad con más de 1.000 pacientes activos en el servicio.
- **Entorno:** Operación normal en horario asistencial pico con 50 usuarios concurrentes.
- **Artefacto:** Módulo de Trazabilidad y API de Consultas de OncoTrace.
- **Respuesta:** El sistema filtra, pagina y renderiza los datos en pantalla.
- **Medida de respuesta:** Tiempo de carga completo ≤ 1.8 segundos, sin bloqueo de interfaz.

### Escenario 2: Seguridad y Auditoría de Acceso a Ficha Oncológica
- **Fuente de estímulo:** Usuario del sistema (Gestora, Médico o Personal Administrativo).
- **Estímulo:** Consulta, edita o exporta antecedentes de la ficha clínica o bitácora de un paciente.
- **Entorno:** Operación normal del sistema.
- **Artefacto:** Servicio de Autorización y Módulo de Logs de Auditoría.
- **Respuesta:** Se valida el rol del usuario mediante RBAC y se escribe una entrada inmutable en la base de auditoría con RUN, usuario, IP, timestamp y operación realizada.
- **Medida de respuesta:** 100% de los accesos registrados en log inmutable; tiempo de registro en auditoría < 50 ms.

### Escenario 3: Fiabilidad y Recuperabilidad ante Fallas
- **Fuente de estímulo:** Fallo inesperado en el servidor de base de datos o corte de energía en el datacenter.
- **Estímulo:** Caída del nodo principal de base de datos durante la jornada laboral.
- **Entorno:** Horario de atención clínica.
- **Artefacto:** Capa de persistencia y cluster de respaldo.
- **Respuesta:** Conmutación por error automática (failover) a réplica secundaria y preservación de transacciones confirmadas.
- **Medida de respuesta:** RTO (Recovery Time Objective) ≤ 5 minutos, RPO (Recovery Point Objective) = 0 datos clínicos perdidos.

### Escenario 4: Usabilidad y Operabilidad en la Bitácora de Acompañamiento
- **Fuente de estímulo:** Gestora Oncológica durante una llamada telefónica con un paciente.
- **Estímulo:** Registra una nueva nota de acompañamiento con indicación de apoyo social.
- **Entorno:** Sesión activa en estación de trabajo.
- **Artefacto:** Formulario de Bitácora de Acompañamiento.
- **Respuesta:** Formulario simplificado con autoguardado y autocompletado de campos clave.
- **Medida de respuesta:** La gestora completa y guarda el registro en menos de 45 segundos y en menos de 3 clics.
