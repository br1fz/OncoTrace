# ⚖️ Atributos de Calidad (ISO 25010)

## 🏆 Priorización de los 9 Atributos de Primer Nivel

1. 🔒 **Seguridad:** Maneja diagnósticos y fichas de pacientes con cáncer; la reserva clínica es una exigencia legal estricta (Ley N° 20.584 y Ley N° 21.258).
2. 🛡️ **Fiabilidad:** El sistema no puede caerse durante la atención diaria ni mientras sesiona el comité oncológico decidiendo tratamientos.
3. ⚡ **Eficiencia de desempeño:** La carga de fichas y exámenes debe ser rápida para no demorar la atención médica ni saturar a las gestoras.
4. 🔄 **Compatibilidad (Interoperabilidad):** Vital para intercambiar datos con laboratorios, imágenes y derivaciones al Hospital Carlos Van Buren.
5. 🖱️ **Usabilidad:** Debe ser fácil e intuitivo de usar para evitar errores humanos y disminuir la sobrecarga de trabajo.
6. ✅ **Idoneidad funcional:** Debe cubrir todas las funciones pactadas (alertas GES, actas de comités y seguimiento de pacientes).
7. 🛠️ **Mantenibilidad:** Capacidad de actualizar reglas o agregar nuevas patologías en el futuro sin rehacer el sistema.
8. 🔀 **Flexibilidad / Portabilidad:** Operar sin problemas en distintos navegadores web y computadores del hospital.
9. 🛑 **Protección (Safety):** Prevenir pérdidas accidentales de información clínica ante fallos de hardware.

---

## 📏 Métricas de los 3 Atributos Más Importantes

### 🔒 1. Seguridad
* **Requisito asociado:** RNF-SW-02 | REQ-DER-01
* **Métrica:** Registro inalterable de accesos y control de permisos (Ley 20.584).
* **Cómo se mide:** 
  * Se valida que cada usuario solo acceda a los pacientes asignados a su rol (médico, gestora o secretaría).
  * Cada vez que alguien entra, edita o descarga una ficha, el sistema guarda automáticamente: RUN del usuario, fecha, hora, IP y acción realizada.
* **Meta esperada:** 100% de los accesos clínicos registrados en la bitácora de auditoría y 0% de accesos no autorizados.

### 🛡️ 2. Fiabilidad
* **Requisito asociado:** RNF-SYS-01
* **Métrica:** Tiempo de disponibilidad operativa (Uptime) y recuperación ante fallos.
* **Cómo se mide:** 
  * Monitoreo del tiempo que la plataforma permanece activa durante la jornada del hospital.
  * Si el servidor principal falla, el sistema conmuta a un servidor secundario de respaldo.
* **Meta esperada:** 
  * Disponibilidad mínima del 99.5% mensual en horario asistencial.
  * Tiempo de recuperación menor a 5 minutos ante caídas, asegurando que no se pierdan datos guardados.

### ⚡ 3. Eficiencia de Desempeño
* **Requisito asociado:** RNF-SW-01
* **Métrica:** Tiempo de respuesta al abrir el tablero principal de pacientes.
* **Cómo se mide:** 
  * Tiempo en segundos desde que la gestora hace clic en el tablero con más de 1.000 pacientes registrados hasta que los datos se muestran listos en pantalla.
  * Se prueba bajo uso simultáneo de 50 usuarios en el hospital.
* **Meta esperada:** Tiempo total de carga en pantalla inferior a 2 segundos.
