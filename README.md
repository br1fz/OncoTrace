# Sistema de Trazabilidad y Gestión Oncológica (OncoTrace)
## Especificación de Requisitos de Software y Atributos de Calidad

> **Asignatura:** Metodología de Análisis / Ingeniería de Requisitos  
> **Dominio:** Trazabilidad de Pacientes en Servicio de Oncología y Quimioterapia Ambulatoria  
> **Estándares de Referencia:** ISO/IEC/IEEE 29148, ISO/IEC 25010:2023, ISO/IEC 25023:2016  

---

## 1. Introducción y Alcance del Producto

### 1.1 Propósito
El sistema **OncoTrace** es una solución especializada de misión crítica orientada a la gestión integral y trazabilidad de extremo a extremo del ciclo de atención oncológica: desde la prescripción médica protocolizada y la preparación de mezclas citostáticas en farmacia, hasta la doble verificación a pie de sillón y el monitoreo de toxicidades post-infusión.

### 1.2 Distinción: Requisitos del Producto vs. Requisitos del Proyecto
* **Requisitos del Producto:** Especifican la forma, ajuste, comportamiento y funciones intrínsecas del software y sistema (qué hace, cómo se comporta ante fallos, sus tiempos de respuesta y su nivel de seguridad).
* **Requisitos del Proyecto / Proceso:** Restringen la gestión, ejecución y entrega del proyecto (plazos de entrega de sprints, presupuesto asignado, entorno de pruebas pre-clínico, capacitación al personal de enfermería y migración de historiales oncológicos antiguos).

---

## 2. Requisitos de Usuario

Definen las necesidades de alto nivel expresadas desde la perspectiva de los stakeholders clínicos (médicos oncólogos, químicos farmacéuticos, enfermeros oncológicos y jefatura médica).

### 2.1 Requisitos de Usuario Funcionales (RF-USR)
* **RF-USR-01: Trazabilidad de Esquema Oncológico Multiciclo**  
  El oncólogo médico debe poder programar y visualizar la línea de tiempo completa del protocolo de quimioterapia de un paciente (ciclos, días de infusión, periodos de descanso y controles de laboratorio previos obligatorios).
* **RF-USR-02: Doble Verificación en Administración (Bedside Check)**  
  El profesional de enfermería y el químico farmacéutico deben poder registrar la doble verificación obligatoria de fármacos citostáticos (confirmación cruzada de identidad del paciente, dosis calculada por superficie corporal y lote de medicamento) antes de iniciar la infusión.
* **RF-USR-03: Notificación de Toxicidad y Alertas de Suspensión**  
  El equipo clínico debe registrar eventos adversos inmediatos o tardíos durante la sesión y recibir sugerencias automáticas de ajuste o suspensión de dosis según la escala internacional de toxicidad (CTCAE).

### 2.2 Requisitos de Usuario No Funcionales (RNF-USR)
* **RNF-USR-01 (Calidad de Servicio - Inocuidad / Safety):**  
  El personal de enfermería no debe poder autorizar por omisión la infusión de un fármaco citostático sin validación previa de farmacia; la interfaz debe forzar un flujo bloqueante de lectura de código/pulsera y advertencia explícita en pantalla roja ante discrepancias.
* **RNF-USR-02 (Restricción de Tecnología - Dispositivos de Operación):**  
  El sistema debe ser operable de forma ergonómica desde tabletas de grado médico en los sillones de infusión y estaciones fijas de enfermería bajo navegadores web con motor Chromium (versión 115 o superior).

---

## 3. Requisitos de Sistema

Especifican las capacidades y restricciones del sistema completo considerando hardware, periféricos, redes y componentes externos.

### 3.1 Requisitos de Sistema Funcionales (RF-SYS)
* **RF-SYS-01: Interoperabilidad con Laboratorio Clínico (LIS)**  
  El sistema debe ingerir automáticamente los resultados analíticos (hemograma, función renal y perfil hepático) desde el sistema LIS hospitalario y bloquear la liberación del ciclo si los parámetros se encuentran fuera del rango de seguridad oncológica prescrito.
* **RF-SYS-02: Trazabilidad Física Trilateral por Lectura Óptica (QR / Código de Barras)**  
  El sistema integrado (lector óptico + software de control) debe validar la coincidencia unívoca entre:
  1. Pulsera identificadora del paciente.
  2. Etiqueta del preparado citostático emitida por la central de mezclas.
  3. Identificador de la bomba de infusión asignada.

### 3.2 Requisitos de Sistema No Funcionales (RNF-SYS)
* **RNF-SYS-01 (Calidad de Servicio - Fiabilidad / Disponibilidad):**  
  El sistema debe mantener una disponibilidad operativa continua ($RAv-1-G \ge 0.999$) durante la ventana de atención clínica ($07:00$ a $20:00$, lunes a viernes), proveyendo un mecanismo de almacenamiento en búfer local (*offline storage*) ante micro-cortes de red.
* **RNF-SYS-02 (Restricción de Tecnología - Infraestructura y Persistencia):**  
  La solución debe desplegarse sobre una arquitectura de contenedores Docker / Kubernetes y persistir sus datos en un motor relacional PostgreSQL (v15+) configurado con réplica sincrónica para auditoría médica en tiempo real.

---

## 4. Requisitos de Software

Detallan el comportamiento lógico interno, algoritmos, reglas de validación, manejo de datos y restricciones arquitectónicas.

### 4.1 Requisitos de Software Funcionales (RF-SW)
* **RF-SW-01: Algoritmo de Cálculo de Superficie Corporal y Validación de Dosis**  
  El software debe calcular la superficie corporal ($SC$) mediante la fórmula de Mosteller:
  $$\text{SC (m}^2\text{)} = \sqrt{\frac{\text{Peso (kg)} \times \text{Altura (cm)}}{3600}}$$
  y emitir una alerta crítica de bloqueo si la dosis prescrita excede en más de un $\pm 5\%$ el protocolo estándar registrado en el vademécum oncológico institucional.
* **RF-SW-02: Registro Inmutable de Estados de Trazabilidad (Audit Trail)**  
  El software debe registrar en una bitácora protegida contra escritura cada cambio en la máquina de estados de la quimioterapia (`Prescrito` $\rightarrow$ `Validado` $\rightarrow$ `Preparado` $\rightarrow$ `Recepcionado` $\rightarrow$ `Infundiendo` $\rightarrow$ `Finalizado`), consignando marca de tiempo UTC, ID de usuario, rol y hash criptográfico de integridad.

### 4.2 Requisitos de Software No Funcionales (RNF-SW)
* **RNF-SW-01 (Calidad de Servicio - Eficiencia de Desempeño / Comportamiento Temporal):**  
  El software debe renderizar la ficha oncológica completa y la línea de tiempo de ciclos en menos de **1.0 segundo** ($P95$) ante una carga concurrente de hasta 100 sesiones clínicas simultáneas.
* **RNF-SW-02 (Restricción de Tecnología - Estándar de Intercambio de Salud):**  
  Las interfaces de datos clínicos con subsistemas externos deben implementarse bajo el estándar internacional **HL7 FHIR v4.0** en formato JSON mediante API REST sobre transporte cifrado TLS 1.3.

---

## 5. Requisitos Derivados

Requisitos originados internamente por decisiones del equipo de ingeniería y arquitectura:

* **RD-01 (Módulo de Backend / Mensajería Asíncrona):**  
  Debido a la decisión arquitectónica de desacoplar el motor de alertas de toxicidad del flujo de atención directa, el servicio de prescripción debe publicar eventos en un bus Apache Kafka (`oncology.events.vitals-changed`) cada vez que se actualicen las constantes vitales del paciente.
* **RD-02 (Módulo de Base de Datos y Cumplimiento):**  
  Debido a la decisión de garantizar la inmutabilidad y no repudio de la auditoría médica, la tabla de trazabilidad debe implementarse siguiendo un patrón *Append-Only* con particionamiento mensual por identificador de servicio.

---

## 6. Atributos de Calidad y Métricas Formales (ISO/IEC 25010:2023 & ISO/IEC 25023)

Alineado con la norma vigente **ISO/IEC 25010:2023**, se seleccionan y especifican con rigor matemático los 3 atributos de calidad más críticos para el sistema oncológico:

### 6.1 Inocuidad (Safety) $\rightarrow$ Seguridad ante fallos (Fail-safe)
* **Definición:** Grado en que el sistema entra en un estado seguro y previene daños al paciente cuando ocurre un fallo o error humano en la prescripción.
* **Código de Métrica (ISO/IEC 25023 Adaptada):** `SAF-1-G` (Tasa de Prevención de Sobredosis y Fallas Críticas).
* **Fórmula de Medición:**
  $$X = \frac{A}{B}$$
  * $A =$ Número de alertas bloqueantes emitidas correctamente ante prescripciones erróneas o incompatibilidades detectadas en pruebas.
  * $B =$ Total de casos de prueba de prescripción riesgosa o fuera de protocolo ejecutados.
* **Meta / Criterio de Aceptación:** $X = 1.0$ ($100\%$ de detección y bloqueo preventivo).

---

### 6.2 Seguridad $\rightarrow$ Confidencialidad (Confidentiality)
* **Definición:** Grado en que el sistema asegura que los datos médicos y diagnósticos oncológicos son accesibles únicamente por personal autorizado según su rol clínico.
* **Código de Métrica (ISO/IEC 25023):** `SCo-1-G` (Controlabilidad del Acceso a Datos Sensibles).
* **Fórmula de Medición:**
  $$X = 1 - \frac{A}{B}$$
  * $A =$ Número de registros oncológicos accesibles sin las credenciales o permisos requeridos.
  * $B =$ Total de registros oncológicos confidenciales auditados en pruebas de penetración.
* **Meta / Criterio de Aceptación:** $X = 1.0$ ($0$ accesos indebidos permitidos).

---

### 6.3 Fiabilidad $\rightarrow$ Disponibilidad (Availability)
* **Definición:** Grado en que el sistema permanece operativo y accesible para el personal asistencial durante los horarios críticos de administración de tratamientos.
* **Código de Métrica (ISO/IEC 25023):** `RAv-1-G` (Disponibilidad del Sistema en Horario de Infusión).
* **Fórmula de Medición:**
  $$X = \frac{A}{B}$$
  * $A =$ Tiempo de operación continuo efectivamente provisto durante el horario de infusión.
  * $B =$ Tiempo de operación programado ($13\text{ h/día} \times 20\text{ días hábiles/mes} = 260\text{ horas}$).
* **Meta / Criterio de Aceptación:** $X \ge 0.999$ (Disponibilidad mínima del $99.9\%$; indisponibilidad máxima acumulada $\le 15.6\text{ minutos/mes}$).

---

## 7. Matriz de Trazabilidad Rápida

| Id Req. Usuario | Id Req. Sistema | Id Req. Software | Atributo Calidad (ISO 25010) | Métrica ISO 25023 |
| :--- | :--- | :--- | :--- | :--- |
| **RF-USR-01** | RF-SYS-01 | RF-SW-01 | Inocuidad (Safety) | `SAF-1-G` |
| **RF-USR-02** | RF-SYS-02 | RF-SW-02 | Seguridad / Fiabilidad | `SCo-1-G`, `RAv-1-G` |
| **RF-USR-03** | RF-SYS-01 | RF-SW-01, RD-01 | Eficiencia / Inocuidad | `SAF-1-G` |
| **RNF-USR-01** | RNF-SYS-01 | RNF-SW-01 | Fiabilidad / Inocuidad | `RAv-1-G` |
| **RNF-USR-02** | RNF-SYS-02 | RNF-SW-02, RD-02 | Compatibilidad / Flexibilidad | `MMo-1-G` |