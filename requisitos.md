# Especificación de Requisitos del Sistema (requisitos.md)

> **Dominio:** Sistema de Gestión Clínica y Trazabilidad de Atenciones  
> **Marco Teórico:** Ingeniería de Requisitos (Requisitos de Producto vs. Proyecto, Clasificación por Niveles y Atributos de Calidad ISO/IEC 25010:2023 / ISO/IEC 25023)

---

## 1. Clasificación Conceptual: Producto vs. Proyecto

* **Requisitos de Producto (Forma, Ajuste y Función):** Definen qué debe hacer el software, cómo debe comportarse, sus interfaces y las restricciones de plataforma o desempeño con las que debe operar en producción.
* **Requisitos de Proyecto / Proceso (Gestión, Herramientas y Restricciones de Construcción):** Restringen la metodología, herramientas de gestión, entornos, plazos y costos bajo los cuales el equipo de ingeniería desarrollará la solución.

---

## 2. Requisitos de Usuario (Nivel Stakeholder)

Expresan las necesidades y expectativas directas de los usuarios en su lenguaje de trabajo dentro del centro de salud.

### 2.1 Requisitos Funcionales de Usuario (RF-USR)
* **RF-USR-01 (Gestión de Ingreso y Búsqueda de Pacientes):**  
  La enfermera debe poder ingresar pacientes al sistema, permitiendo tanto la creación de un nuevo expediente clínico como la búsqueda y recuperación de registros ya existentes.
* **RF-USR-02 (Registro de Insumos Clínicos Utilizados):**  
  La Técnico en Enfermería Superior (TENS) debe poder registrar, dentro de la ficha clínica de la atención/sesión, el detalle de los insumos y materiales médicos utilizados en el paciente.

### 2.2 Requisitos No Funcionales de Usuario (RNF-USR)
* **RNF-USR-01 (Restricción de Calidad de Servicio - Capacidad de Interacción / Operabilidad y Autodescripción):**  
  La visualización de la ficha clínica debe ser clara, intuitiva y fácil de leer y comprender por el personal asistencial en situaciones de atención rápida.
  * **Atributo ISO/IEC 25010:2023:** Capacidad de interacción $\rightarrow$ Capacidad de autodescripción / Operabilidad.
  * **Criterio de Verificación:** Al menos el $90\%$ del personal asistencial evaluado debe interpretar la información clave de la ficha sin asistencia externa en el primer intento.

---

## 3. Requisitos de Sistema (Nivel Solución Integrada)

Especifican el comportamiento del sistema global en interacción con personas, procesos y canales de comunicación externos.

### 3.1 Requisitos Funcionales de Sistema (RF-SYS)
* **RF-SYS-01 (Notificación y Recordatorio de Citas a Pacientes):**  
  El sistema debe emitir alertas y recordatorios automáticos a los pacientes informando sobre sus próximas horas agendadas para tratamientos, consultas médicas u otros procedimientos.
* **RF-SYS-02 (Filtrado de Pacientes por Médico Tratante):**  
  El sistema debe proveer mecanismos de filtrado y segmentación de la nómina de pacientes según el médico tratante a cargo.

### 3.2 Requisitos No Funcionales de Sistema (RNF-SYS)
* **RNF-SYS-01 (Restricción de Calidad de Servicio - Fiabilidad / Disponibilidad):**  
  El sistema completo (servidores, bases de datos y servicios de red) debe estar disponible para consultas y operaciones clínicas las 24 horas del día, los 7 días de la semana ($24/7$).
  * **Atributo ISO/IEC 25010:2023:** Fiabilidad $\rightarrow$ Disponibilidad.
  * **Métrica (ISO/IEC 25023 - RAv-1-G):** $X = \frac{A}{B} \ge 0.995$ ($99.5\%$ de tiempo operativo real sobre tiempo programado).

---

## 4. Requisitos de Software (Nivel Lógica de Aplicación)

Detallan las reglas de negocio computacionales, algoritmos, validaciones y restricciones tecnológicas de la aplicación.

### 4.1 Requisitos Funcionales de Software (RF-SW)
* **RF-SW-01 (Control de Conflictos y Solapamiento de Agenda Médica):**  
  El módulo de agendamiento debe validar la disponibilidad del profesional y bloquear la operación arrojando un error explícito cuando se intente programar una cita en un bloque horario donde el médico ya cuente con una atención asignada.

### 4.2 Requisitos No Funcionales de Software (RNF-SW)

#### A. Restricciones de Calidad de Servicio
* **RNF-SW-01 (Fiabilidad / Disponibilidad en Periodos Críticos):**  
  El software debe garantizar operatividad continua y disponibilidad prioritaria durante las ventanas de entrega de turno del personal y durante la subida y sincronización de archivos clínicos de pacientes.
  * **Atributo ISO/IEC 25010:2023:** Fiabilidad $\rightarrow$ Disponibilidad / Tolerancia a fallos.
* **RNF-SW-02 (Eficiencia de Desempeño / Comportamiento Temporal y Concurrencia):**  
  El software debe responder a las solicitudes de consulta y procesamiento de datos clínicos críticos en un tiempo de respuesta $\le 1.5\text{ segundos}$ ($P95$), manteniendo estabilidad operativa bajo condiciones de alta concurrencia de usuarios simultáneos.
  * **Atributo ISO/IEC 25010:2023:** Eficiencia de desempeño $\rightarrow$ Comportamiento temporal / Capacidad.

#### B. Restricciones de Tecnología
* **RNF-SW-03 (Flexibilidad / Adaptabilidad Multiplataforma Nativa):**  
  El software cliente debe ejecutarse y operar de forma nativa en los diversos dispositivos y sistemas operativos utilizados dentro del centro de salud: iOS, Android, Windows, macOS y distribuciones nativas de Linux (ej. Ubuntu, Debian, Red Hat).
  * **Atributo ISO/IEC 25010:2023:** Flexibilidad $\rightarrow$ Adaptabilidad / Instalabilidad.

---

## 5. Requisitos de Proyecto y Distribución

### 5.1 Requisito No Funcional de Producto (Distribución y Publicación)
* **RNF-PROD-01 (Canales de Distribución en Tiendas Oficiales):**  
  Las aplicaciones cliente del producto deben compilarse, empaquetarse y distribuirse a través de las tiendas oficiales de aplicaciones:
  * Apple App Store (iOS/macOS).
  * Google Play Store (Android).
  * Microsoft Store (Windows).
  * Repositorios oficiales / Snap Store / Flathub para entornos Linux (ej. Ubuntu).

### 5.2 Requisito de Proceso / Proyecto (Herramientas de Construcción y Gestión)
* **REQ-PROY-01 (Herramienta CLI de Gestión de Proyecto):**  
  El equipo de ingeniería debe utilizar obligatoriamente **Antigravity CLI** para la inicialización, gestión del ciclo de vida, compilación o administración del flujo de trabajo del proyecto.
  * *Nota metodológica:* Es un requisito de proceso/proyecto, ya que restringe cómo trabaja el equipo y no añade una funcionalidad directa al usuario final en tiempo de ejecución.

---

## 6. Resumen y Matriz de Clasificación

| Identificador | Nivel | Tipo | Categoría / Estándar | Resumen del Requisito |
| :--- | :--- | :--- | :--- | :--- |
| **RF-USR-01** | Usuario | Funcional | Proceso asistencial | Ingresar, buscar y recuperar registros de pacientes (Enfermera). |
| **RF-USR-02** | Usuario | Funcional | Proceso asistencial | Anotar insumos utilizados en la ficha clínica (TENS). |
| **RNF-USR-01** | Usuario | No Funcional (QoS) | ISO 25010: Capacidad de interacción | Ficha clínica fácil de leer y entender. |
| **RF-SYS-01** | Sistema | Funcional | Comunicación externa | Alertar/recordar a pacientes sobre sus citas agendadas. |
| **RF-SYS-02** | Sistema | Funcional | Filtro y procesamiento | Filtrar listados de pacientes por médico a cargo. |
| **RNF-SYS-01** | Sistema | No Funcional (QoS) | ISO 25010: Fiabilidad (Disponibilidad) | Disponibilidad continua 24/7 para consultas. |
| **RF-SW-01** | Software | Funcional | Regla de negocio / Validación | Error y bloqueo por solapamiento de agenda médica. |
| **RNF-SW-01** | Software | No Funcional (QoS) | ISO 25010: Fiabilidad | Disponibilidad garantizada en cambio de turno y subida de archivos. |
| **RNF-SW-02** | Software | No Funcional (QoS) | ISO 25010: Eficiencia de desempeño | Respuesta rápida y soporte de alta concurrencia en datos críticos. |
| **RNF-SW-03** | Software | No Funcional (Tecnología) | ISO 25010: Flexibilidad | Compatibilidad nativa con iOS, Android, Windows, Mac y Linux. |
| **RNF-PROD-01** | Producto | No Funcional (Tecnología) | Distribución / Despliegue | Publicación en App Store, Play Store, Microsoft Store y Linux. |
| **REQ-PROY-01** | Proyecto | Proceso / Gestión | Requisito de Proyecto | Uso mandatorio de Antigravity CLI en la gestión del proyecto. |