# ⚖️ Atributos de calidad (ISO 25010)
 
## 🏆 Priorización de los 9 atributos de primer nivel
1. 🛡️ Fiabilidad (Reliability)
2. ⚡ Eficiencia de desempeño (Performance Efficiency)
3. 🔒 Seguridad (Security)
4. 🖱️ Capacidad de interacción / Usabilidad (Interaction Capability)
5. ✅ Idoneidad funcional (Functional Suitability)
6. 🔄 Compatibilidad (Compatibility)
7. 🛠️ Mantenibilidad (Maintainability)
8. 🔀 Flexibilidad / Portabilidad (Flexibility)
9. 🛑 Protección / Seguridad física (Safety)
 
## 📏 Métricas de los 3 atributos más importantes

### 🛡️ AC-01: Fiabilidad (Reliability)
- **Requisito no funcional trazado:** **RNF-SYS-01**
- **Métrica:** Tiempo de Recuperación Objetivo (RTO) y Punto de Recuperación (RPO) medidos mediante el siguiente **Escenario de Calidad Arquitectónico (SEI):**
  - **Estímulo:** Caída inesperada del nodo principal de base de datos o corte de energía.
  - **Entorno:** Horario pico de atención clínica.
  - **Artefacto:** Capa de persistencia y cluster de respaldo de OncoTrace.
  - **Respuesta:** Conmutación por error automática (failover) a réplica secundaria.
  - **Medida de respuesta:** El sistema debe garantizar un RTO ≤ 5 minutos y un RPO = 0 (cero pérdida de datos y transacciones clínicas confirmadas).

### ⚡ AC-02: Eficiencia de desempeño (Performance Efficiency)
- **Requisito no funcional trazado:** **RNF-SW-01**
- **Métrica:** Latencia en carga de datos bajo concurrencia, medida mediante el siguiente **Escenario de Calidad Arquitectónico (SEI):**
  - **Estímulo:** Gestora accede al tablero general de trazabilidad con >1.000 pacientes activos.
  - **Entorno:** Operación normal en horario asistencial con 50 usuarios concurrentes.
  - **Artefacto:** Módulo de Trazabilidad y API de Consultas.
  - **Respuesta:** El sistema filtra, pagina y renderiza los datos en pantalla sin bloquear el hilo principal.
  - **Medida de respuesta:** Tiempo de carga completo en pantalla ≤ 1.8 segundos.

### 🔒 AC-03: Seguridad (Security)
- **Requisito no funcional trazado:** **RNF-SW-02** | **REQ-DER-01**
- **Métrica:** Integridad de logs transaccionales, medida mediante el siguiente **Escenario de Calidad Arquitectónico (SEI):**
  - **Estímulo:** Usuario consulta, edita o exporta antecedentes de la ficha clínica de un paciente.
  - **Entorno:** Operación normal del sistema.
  - **Artefacto:** Servicio de Autorización y Módulo de Logs de Auditoría.
  - **Respuesta:** Se valida el rol mediante RBAC y se escribe una entrada inmutable en la base de auditoría.
  - **Medida de respuesta:** 100% de los accesos registrados con RUN, usuario, IP, timestamp y operación, con un tiempo de escritura < 50 ms.

