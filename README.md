# Sistema de Trazabilidad y Gestión Oncológica (OncoTrace)
## Especificación Integral de Requisitos de Software y Atributos de Calidad

> **Asignatura / Marco:** Metodología de Análisis / Ingeniería de Requisitos  
> **Dominio:** Sistema de Gestión Clínica, Quimioterapia Ambulatoria y Trazabilidad Oncológica  
> **Estándares de Referencia:** ISO/IEC/IEEE 29148, ISO/IEC 25010:2023, ISO/IEC 25023:2016, HL7 FHIR v4.0  

---

## 1. Introducción y Alcance del Producto

### 1.1 Propósito
El sistema **OncoTrace** es una solución integral de misión crítica orientada a la gestión asistencial y trazabilidad de extremo a extremo del ciclo de atención oncológica y hospitalaria. Su alcance abarca desde el ingreso del paciente, búsqueda de expedientes y agenda médica, pasando por la prescripción de protocolos multiciclo, la preparación de citostáticos en farmacia y el registro de insumos por parte de TENS/enfermería, hasta la doble verificación a pie de sillón (*Bedside Check*) y el monitoreo de toxicidades post-infusión.

### 1.2 Distinción Conceptual: Requisitos de Producto vs. Requisitos de Proyecto
* **Requisitos del Producto (Forma, Ajuste y Función):** Especifican las funciones intrínsecas, comportamiento lógico, interfaces, tiempos de respuesta, niveles de seguridad y plataformas operativas con las que el software interactúa en producción.
* **Requisitos del Proyecto / Proceso (Gestión, Entorno y Flujo de Trabajo):** Restringen la metodología de ingeniería, plazos de entrega, presupuesto, herramientas de desarrollo mandatorias (ej. Antigravity CLI), capacitación al personal clínico y migración de datos históricos.

---

## 2. Requisitos de Usuario (Nivel Stakeholder)

Expresan las necesidades directas de los usuarios en el entorno clínico (médicos oncólogos, químicos farmacéuticos, enfermeros/as, técnicos en enfermería TENS y personal administrativo).

### 2.1 Requisitos Funcionales de Usuario (RF-USR)

* **RF-USR-01: Gestión de Ingreso y Búsqueda de Pacientes**  
  El personal de enfermería y admisión debe poder ingresar pacientes al sistema, permitiendo la creación de un nuevo expediente clínico oncológico, así como la búsqueda y recuperación ágil de registros ya existentes mediante identificador nacional o nombre.
* **RF-USR-02: Registro de Insumos Clínicos y Materiales Utilizados**  
  El Técnico en Enfermería de Nivel Superior (TENS) y el personal asistencial deben poder registrar, dentro de la ficha clínica de la atención o sesión, el detalle de insumos médicos (agujas Huber, catéteres, filtros, soluciones vehiculares) y materiales utilizados durante el procedimiento.
* **RF-USR-03: Trazabilidad de Esquema Oncológico Multiciclo**  
  El oncólogo médico debe poder programar y visualizar la línea de tiempo completa del protocolo de quimioterapia de un paciente (ciclos, días de infusión, periodos de descanso, dosis acumuladas y controles analíticos previos obligatorios).
* **RF-USR-04: Doble Verificación en Administración (Bedside Check)**  
  El profesional de enfermería y el químico farmacéutico deben registrar obligatoriamente la doble verificación cruzada de fármacos citostáticos (confirmación de identidad del paciente, dosis calculada por superficie corporal y lote de medicamento) antes de iniciar la infusión.
* **RF-USR-05: Notificación de Toxicidad y Alertas de Suspensión**  
  El equipo clínico debe registrar eventos adversos inmediatos o tardíos durante la sesión y recibir sugerencias automáticas de ajuste o suspensión de dosis según la escala internacional de toxicidad (CTCAE).

### 2.2 Requisitos No Funcionales de Usuario (RNF-USR)

* **RNF-USR-01 (Calidad de Servicio - Usabilidad / Capacidad de Autodescripción):**  
  La visualización de la ficha clínica debe ser clara, intuitiva y fácil de interpretar bajo situaciones de alta presión asistencial.  
  * *Atributo ISO/IEC 25010:2023:* Capacidad de interacción $\rightarrow$ Capacidad de autodescripción / Operabilidad.
  * *Criterio de Verificación:* Al menos el $90\%$ del personal asistencial evaluado debe interpretar la información crítica de la ficha clínica sin asistencia externa en el primer intento.
* **RNF-USR-02 (Calidad de Servicio - Inocuidad / Safety):**  
  El personal de enfermería no debe poder autorizar por omisión la infusión de un fármaco citostático sin validación previa de farmacia; la interfaz debe forzar un flujo bloqueante de lectura de código/pulsera con advertencia visual explícita en pantalla roja ante discrepancias.
* **RNF-USR-03 (Restricción de Tecnología - Dispositivos de Operación Asistencial):**  
  El sistema debe ser operable de forma ergonómica desde tabletas de grado médico en los sillones de infusión y estaciones fijas de enfermería bajo navegadores web con motor Chromium (versión 115 o superior).

---

## 3. Requisitos de Sistema (Nivel Solución Integrada)

Especifican las capacidades y restricciones del sistema completo considerando hardware, redes, periféricos y subsistemas hospitalarios externos.

### 3.1 Requisitos Funcionales de Sistema (RF-SYS)

* **RF-SYS-01: Notificación y Recordatorio Automatizado de Citas a Pacientes**  
  El sistema debe emitir alertas y recordatorios automáticos (vía SMS, correo electrónico o notificación push) informando a los pacientes sobre sus próximas horas agendadas para quimioterapia, consultas de oncología o exámenes de laboratorio.
* **RF-SYS-02: Filtrado y Segmentación de Pacientes por Médico Tratante**  
  El sistema debe proveer mecanismos de filtrado y segmentación de la nómina global de pacientes según el médico tratante a cargo, servicio clínico, protocolo asignado o estado de tratamiento.
* **RF-SYS-03: Interoperabilidad con Laboratorio Clínico (LIS)**  
  El sistema debe ingerir automáticamente los resultados analíticos (hemograma, función renal y perfil hepático) desde el sistema LIS hospitalario y bloquear la liberación del ciclo si los parámetros se encuentran fuera del rango de seguridad oncológica prescrito.
* **RF-SYS-04: Trazabilidad Física Trilateral por Lectura Óptica (QR / Código de Barras)**  
  El sistema integrado (lector óptico + software de control) debe validar la coincidencia unívoca entre:
  1. Pulsera identificadora del paciente.
  2. Etiqueta del preparado citostático emitida por la central de mezclas.
  3. Identificador de la bomba de infusión asignada.

### 3.2 Requisitos No Funcionales de Sistema (RNF-SYS)

* **RNF-SYS-01 (Calidad de Servicio - Fiabilidad / Disponibilidad Continua):**  
  El sistema completo (servidores, base de datos y servicios de red) debe mantener disponibilidad operativa continua $24/7$ ($RAv-1-G \ge 0.995$), elevando la garantía a $RAv-1-G \ge 0.999$ durante la ventana crítica de infusión ($07:00$ a $20:00$, lunes a viernes), proveyendo búfer local (*offline storage*) ante micro-cortes de red.
  * *Atributo ISO/IEC 25010:2023:* Fiabilidad $\rightarrow$ Disponibilidad.
* **RNF-SYS-02 (Restricción de Tecnología - Infraestructura y Persistencia):**  
  La solución debe desplegarse sobre una arquitectura de contenedores Docker / Kubernetes y persistir sus datos en un motor relacional PostgreSQL (v15+) configurado con réplica sincrónica para auditoría médica en tiempo real.

---

## 4. Requisitos de Software (Nivel Lógica de Aplicación)

Detallan las reglas de negocio computacionales, algoritmos, validaciones de integridad y restricciones técnicas del software.

### 4.1 Requisitos Funcionales de Software (RF-SW)

* **RF-SW-01: Control de Conflictos y Solapamiento de Agenda Médica**  
  El módulo de agendamiento debe validar en tiempo real la disponibilidad del profesional y de los sillones de infusión, bloqueando la operación y arrojando un error explícito cuando se intente programar una cita en un bloque horario que presente solapamiento.
* **RF-SW-02: Algoritmo de Cálculo de Superficie Corporal y Validación de Dosis**  
  El software debe calcular la superficie corporal ($SC$) mediante la fórmula de Mosteller:
  $$\text{SC (m}^2\text{)} = \sqrt{\frac{\text{Peso (kg)} \times \text{Altura (cm)}}{3600}}$$
  y emitir una alerta crítica de bloqueo si la dosis prescrita excede en más de un $\pm 5\%$ el protocolo estándar registrado en el vademécum oncológico institucional.
* **RF-SW-03: Registro Inmutable de Estados de Trazabilidad (Audit Trail)**  
  El software debe registrar en una bitácora protegida contra escritura cada cambio en la máquina de estados de la quimioterapia (`Prescrito` $\rightarrow$ `Validado` $\rightarrow$ `Preparado` $\rightarrow$ `Recepcionado` $\rightarrow$ `Infundiendo` $\rightarrow$ `Finalizado`), consignando marca de tiempo UTC, ID de usuario, rol y hash criptográfico de integridad (SHA-256).

### 4.2 Requisitos No Funcionales de Software (RNF-SW)

#### A. Calidad de Servicio (QoS)
* **RNF-SW-01 (Fiabilidad y Tolerancia a Fallos en Periodos Críticos):**  
  El software debe garantizar operatividad continua y disponibilidad prioritaria durante las ventanas de entrega de turno del personal asistencial y durante la carga o sincronización concurrente de expedientes clínicos y archivos adjuntos.
  * *Atributo ISO/IEC 25010:2023:* Fiabilidad $\rightarrow$ Disponibilidad / Tolerancia a fallos.
* **RNF-SW-02 (Eficiencia de Desempeño / Comportamiento Temporal y Concurrencia):**  
  El software debe responder a consultas clínicas críticas en un tiempo $\le 1.0\text{ s}$ ($P95$) para fichas individuales y $\le 1.5\text{ s}$ ($P95$) en consultas y agregaciones complejas bajo una carga simultánea de hasta 100 sesiones concurrentes.
  * *Atributo ISO/IEC 25010:2023:* Eficiencia de desempeño $\rightarrow$ Comportamiento temporal / Capacidad.

#### B. Restricciones de Tecnología
* **RNF-SW-03 (Estándar de Intercambio de Salud):**  
  Las interfaces de datos clínicos con subsistemas hospitalarios externos deben implementarse bajo el estándar internacional **HL7 FHIR v4.0** en formato JSON mediante API REST sobre transporte seguro TLS 1.3.
* **RNF-SW-04 (Flexibilidad / Adaptabilidad Multiplataforma Nativa):**  
  El software cliente debe ser compatible y operar de forma nativa/adaptativa en los diversos entornos y dispositivos del centro: iOS, Android, Windows, macOS y distribuciones Linux (Ubuntu, Debian, Red Hat).
  * *Atributo ISO/IEC 25010:2023:* Flexibilidad $\rightarrow$ Adaptabilidad / Instalabilidad.

---

## 5. Requisitos Derivados (Decisiones Arquitectónicas)

Requisitos originados internamente por decisiones del equipo de ingeniería y arquitectura:

* **RD-01 (Módulo de Backend / Mensajería Asíncrona):**  
  Para desacoplar el motor de alertas de toxicidad y el sistema de notificaciones automáticas del flujo transaccional principal, el backend publicará eventos en un bus Apache Kafka (`oncology.events.vitals-changed`, `oncology.events.appointment-scheduled`).
* **RD-02 (Módulo de Base de Datos y Cumplimiento Legal):**  
  Para garantizar la inmutabilidad y no repudio de la auditoría médica, la tabla de trazabilidad se implementará siguiendo un patrón *Append-Only* con particionamiento mensual por identificador de servicio.

---

## 6. Requisitos de Distribución del Producto y Requisitos de Proyecto

### 6.1 Requisito No Funcional de Producto (Distribución y Despliegue)
* **RNF-PROD-01 (Canales de Distribución en Tiendas Oficiales):**  
  Las aplicaciones cliente del producto deben compilarse, firmarse y distribuirse a través de las plataformas oficiales:
  * Apple App Store (iOS / macOS).
  * Google Play Store (Android).
  * Microsoft Store (Windows).
  * Repositorios oficiales / Snap Store / Flathub para distribuciones Linux.

### 6.2 Requisitos de Proyecto y Proceso (Metodología y Herramientas)
* **REQ-PROY-01 (Herramienta Mandatoria de Gestión y CLI):**  
  El equipo de ingeniería debe utilizar obligatoriamente **Antigravity CLI** para la inicialización, gestión del ciclo de vida, compilación, pruebas y administración del flujo de trabajo del proyecto.
* **REQ-PROY-02 (Gestión Metodológica y Transferencia Clínica):**  
  El proyecto debe ejecutarse bajo metodología ágil Scrum (sprints quincenales), incluyendo un entorno de pruebas pre-clínico (*staging*), capacitación certificada al personal asistencial y protocolo seguro de migración de registros históricos.

---

## 7. Atributos de Calidad y Métricas Formales (ISO/IEC 25010:2023 & ISO/IEC 25023)

Alineado con la norma **ISO/IEC 25010:2023**, se seleccionan y especifican formalmente los atributos de calidad críticos del sistema:

### 7.1 Inocuidad (Safety) $\rightarrow$ Seguridad ante fallos (Fail-safe)
* **Definición:** Grado en que el sistema entra en un estado seguro y previene daños al paciente cuando ocurre un fallo o error en la prescripción/administración.
* **Código de Métrica (ISO/IEC 25023 Adaptada):** `SAF-1-G` (Tasa de Prevención de Sobredosis y Fallas Críticas).
* **Fórmula de Medición:**
  $$X = \frac{A}{B}$$
  * $A =$ Número de alertas bloqueantes emitidas correctamente ante prescripciones erróneas o incompatibilidades detectadas en pruebas.
  * $B =$ Total de casos de prueba de prescripción riesgosa o fuera de protocolo ejecutados.
* **Meta / Criterio de Aceptación:** $X = 1.0$ ($100\%$ de detección y bloqueo preventivo).

---

### 7.2 Seguridad $\rightarrow$ Confidencialidad (Confidentiality)
* **Definición:** Grado en que el sistema asegura que los datos médicos y diagnósticos oncológicos son accesibles únicamente por personal autorizado según su rol clínico.
* **Código de Métrica (ISO/IEC 25023):** `SCo-1-G` (Controlabilidad del Acceso a Datos Sensibles).
* **Fórmula de Medición:**
  $$X = 1 - \frac{A}{B}$$
  * $A =$ Número de registros oncológicos accesibles sin las credenciales o permisos requeridos.
  * $B =$ Total de registros oncológicos confidenciales auditados en pruebas de penetración.
* **Meta / Criterio de Aceptación:** $X = 1.0$ ($0$ accesos indebidos permitidos).

---

### 7.3 Fiabilidad $\rightarrow$ Disponibilidad (Availability)
* **Definición:** Grado en que el sistema permanece operativo y accesible para el personal asistencial durante los horarios de atención y administración de tratamientos.
* **Código de Métrica (ISO/IEC 25023):** `RAv-1-G` (Disponibilidad del Sistema).
* **Fórmula de Medición:**
  $$X = \frac{A}{B}$$
  * $A =$ Tiempo de operación continuo efectivamente provisto durante el horario evaluado.
  * $B =$ Tiempo de operación programado total.
* **Meta / Criterio de Aceptación:**
  * Ventana Crítica de Infusión ($07:00$ - $20:00$ L-V): $X \ge 0.999$ ($99.9\%$).
  * Operación General $24/7$: $X \ge 0.995$ ($99.5\%$).

---

### 7.4 Usabilidad $\rightarrow$ Capacidad de Interacción y Autodescripción (Self-descriptiveness)
* **Definición:** Grado en que la interfaz del software presenta la información de forma clara y autoexplicativa para el personal de salud.
* **Código de Métrica (ISO/IEC 25023):** `USD-1-G` (Efectividad de Interpretación Clínica).
* **Fórmula de Medición:**
  $$X = \frac{A}{B}$$
  * $A =$ Personal de enfermería/TENS que interpreta correctamente los datos clave de la ficha sin asistencia en la primera prueba.
  * $B =$ Total de usuarios participantes en la muestra de prueba de usabilidad.
* **Meta / Criterio de Aceptación:** $X \ge 0.90$ ($90\%$ de éxito autónomo).

---

## 8. Matriz Integral de Clasificación y Trazabilidad

| Identificador | Nivel | Tipo | Categoría / Estándar ISO | Resumen del Requisito | Trazabilidad Cruzada |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **RF-USR-01** | Usuario | Funcional | Proceso asistencial | Ingreso, búsqueda y recuperación de fichas de pacientes. | RF-SYS-02, RF-SW-01 |
| **RF-USR-02** | Usuario | Funcional | Proceso asistencial | Registro de insumos clínicos y materiales utilizados (TENS). | RF-SYS-04, RF-SW-03 |
| **RF-USR-03** | Usuario | Funcional | Proceso oncológico | Programación y línea de tiempo de esquemas multiciclo. | RF-SYS-03, RF-SW-02 |
| **RF-USR-04** | Usuario | Funcional | Seguridad asistencial | Doble verificación (Bedside Check) de citostáticos. | RF-SYS-04, RF-SW-03, `SAF-1-G` |
| **RF-USR-05** | Usuario | Funcional | Monitorización | Registro de toxicidades y ajuste de dosis (CTCAE). | RD-01, RF-SW-02 |
| **RNF-USR-01** | Usuario | No Funcional (QoS) | ISO 25010: Usabilidad | Ficha clínica intuitiva y de rápida comprensión. | `USD-1-G` |
| **RNF-USR-02** | Usuario | No Funcional (QoS) | ISO 25010: Inocuidad (Safety) | Flujo bloqueante ante falta de validación de farmacia. | `SAF-1-G` |
| **RNF-USR-03** | Usuario | No Funcional (Tecnología) | Compatibilidad | Operación ergonómica en tabletas y estaciones Chromium. | RNF-SW-04 |
| **RF-SYS-01** | Sistema | Funcional | Comunicación externa | Envío automático de recordatorios de citas y procedimientos. | RD-01, RF-SW-01 |
| **RF-SYS-02** | Sistema | Funcional | Filtrado y visualización | Filtro de nómina de pacientes por médico tratante. | RF-USR-01 |
| **RF-SYS-03** | Sistema | Funcional | Interoperabilidad LIS | Ingesta automática de analítica y bloqueo por rangos de riesgo. | RF-USR-03, RNF-SW-03 |
| **RF-SYS-04** | Sistema | Funcional | Trazabilidad física | Validación trilateral: Paciente + Preparado + Bomba infusión. | RF-USR-04, RF-SW-03 |
| **RNF-SYS-01** | Sistema | No Funcional (QoS) | ISO 25010: Fiabilidad | Disponibilidad 24/7 ($99.5\%$) y ventana crítica ($99.9\%$). | `RAv-1-G` |
| **RNF-SYS-02** | Sistema | No Funcional (Tecnología) | Infraestructura | Despliegue en Docker/K8s y base de datos PostgreSQL v15+. | RD-02 |
| **RF-SW-01** | Software | Funcional | Regla de negocio | Detección y bloqueo de solapamientos en agenda médica. | RF-SYS-01, RF-USR-01 |
| **RF-SW-02** | Software | Funcional | Algoritmo clínico | Cálculo de Superficie Corporal (Mosteller) y control $\pm 5\%$. | RF-USR-03, `SAF-1-G` |
| **RF-SW-03** | Software | Funcional | Seguridad / Auditoría | Registro inmutable con hash SHA-256 de cambios de estado. | RD-02, `SCo-1-G` |
| **RNF-SW-01** | Software | No Funcional (QoS) | ISO 25010: Fiabilidad | Disponibilidad en cambios de turno y carga de archivos. | `RAv-1-G` |
| **RNF-SW-02** | Software | No Funcional (QoS) | ISO 25010: Rendimiento | Tiempos $\le 1.0\text{ s} - 1.5\text{ s}$ ($P95$) con 100 usuarios concurrentes. | `PE-1-G` |
| **RNF-SW-03** | Software | No Funcional (Tecnología) | Estándar de salud | Interoperabilidad bajo estándar HL7 FHIR v4.0 sobre TLS 1.3. | RF-SYS-03 |
| **RNF-SW-04** | Software | No Funcional (Tecnología) | Flexibilidad / Portabilidad | Soporte nativo para iOS, Android, Windows, macOS y Linux. | RNF-PROD-01 |
| **RNF-PROD-01** | Producto | No Funcional (Distribución) | Distribución oficial | Publicación en App Store, Play Store, Microsoft Store y Linux. | RNF-SW-04 |
| **REQ-PROY-01** | Proyecto | Proceso / Herramientas | Requisito de Proyecto | Uso mandatorio de Antigravity CLI para el ciclo del proyecto. | Gestión interna |
| **REQ-PROY-02** | Proyecto | Proceso / Metodología | Requisito de Proyecto | Metodología Scrum, staging preclínico y capacitación. | Plan de Proyecto |
