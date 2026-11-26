# Guía de Transición de Etapa: CASO-2026-002 de «Confirmación diagnóstica» a «Etapificación»

Este documento explica en detalle cómo realizar la transición del **CASO-2026-002** desde la etapa de **Confirmación diagnóstica** a **Etapificación**, tanto desde la interfaz de usuario de la plataforma como a nivel de arquitectura de software, base de datos y reglas del modelo de dominio clínico.

---

## 1. Contexto Clínico del Caso

* **Número de caso:** `CASO-2026-002`
* **Paciente:** Carlos Araya (RUN: `12.345.678-5`, 62 años)
* **Diagnóstico confirmado:** `C18.9 — Neoplasia colon` (Gastroenterología)
* **Situación inicial:** 
  - El paciente cuenta con diagnóstico histopatológico emitido tras colonoscopía con biopsia (`ORD-COL-001`).
  - Su tarjeta en el tablero centralizado se ubica en la columna **Confirmación diagnóstica**.
  - Posee una garantía GES activa de etapificación (`GES-2026-002`).

---

## 2. Fundamento en el Modelo de Dominio y EST-03

En el diagrama de estados **EST-03** (*Ciclo de vida de CasoOncologico*) y en el rediseño **TO-BE** (TB-01 / RF-01 / CU-05):

$$\text{Confirmación diagnóstica} \xrightarrow[\text{/ Solicitud de estudios diagnósticos}]{\text{Indicación de etapificación}} \text{Etapificación}$$

* **Evento disparador:** Indicación médica o asistencial de estudios diagnósticos de extensión (TAC de tórax, abdomen y pelvis, colonoscopía completa o marcadores tumorales) para evaluar la diseminación tumoral.
* **Roles autorizados (CU-05):** `Gestor/a UGCO` o `Médico tratante`.
* **Efecto sistémico:**
  1. Se registra de forma inmutable el nuevo `HitoAsistencial` en la línea de tiempo.
  2. Se actualiza atómicamente el atributo `etapaActual` del caso a `'Etapificación'`.
  3. En el tablero Kanban (`/`), la tarjeta de Carlos Araya se mueve de la columna *Confirmación diagnóstica* a la columna *Etapificación*.

---

## 3. Procedimiento Paso a Paso en la Aplicación Web (UI)

Para realizar la transición en vivo en la plataforma:

### Paso 1: Iniciar el servidor
En la terminal del proyecto:
```bash
npm run dev
```
*(Si el puerto 3000 está en uso: `$env:PORT="3111"; npm run dev`)*.

### Paso 2: Abrir la plataforma y seleccionar rol
1. Abre tu navegador en `http://localhost:3000`.
2. En la barra superior (cabecera), asegúrate de tener activo el rol **Gestor/a UGCO** o **Médico tratante** (ambos roles están autorizados según CU-05).

### Paso 3: Abrir la ficha del caso
1. En el tablero Kanban (`/`), busca la tarjeta de **Carlos Araya** en la columna **Confirmación diagnóstica**.
2. Haz clic sobre la tarjeta o sobre el enlace `CASO-2026-002` para ingresar a su expediente clínico (`/casos/CASO-2026-002`).

### Paso 4: Registrar el hito de avance
1. En la ficha del caso, dentro de la sección *«Línea de tiempo asistencial»*, pulsa el botón:
   **`+ Registrar nuevo hito asistencial`** (lleva a `/casos/CASO-2026-002/hitos/nuevo`).
2. Completa el formulario con los siguientes datos:
   * **Tipo de hito asistencial:** Selecciona o escribe:
     `Indicación de etapificación y solicitud de estudios de extensión`
     *(o `Estudios de etapificación e imágenes solicitados`)*.
   * **Fecha de ocurrencia:** Selecciona la fecha de hoy (o una fecha válida posterior al último hito del caso, ej. `2026-10-25`).
   * **Rol del responsable:** `Médico tratante` (o `Gestor/a UGCO`).
   * **Nombre del profesional responsable:** Ej. `Dr. Andrés Silva` o `Enf. Patricia Soto`.
3. Pulsa el botón **«Guardar hito asistencial»**.

### Paso 5: Verificación del resultado
1. **En la ficha del caso (`/casos/CASO-2026-002`):**
   - El distintivo superior cambia de color y muestra: **`Etapificación`**.
   - En la línea de tiempo aparece el hito recién registrado con su fecha, responsable y rol.
2. **En el Tablero centralizado (`/`):**
   - La tarjeta de Carlos Araya ahora se lista en la columna **Etapificación**.
   - El contador de la columna *Confirmación diagnóstica* disminuye en 1 y el de *Etapificación* aumenta en 1.

---

## 4. Mecanismo Técnico en el Código y Base de Datos

### A. Lógica de Dominio (`src/dominio/caso-oncologico.ts`)
La función de transición `evaluarTransicionHito` evalúa el hito ingresado:

```typescript
// En evaluarTransicionHito:
const esIndicacionEtapificacion = 
  norm.includes('etapificacion') || 
  norm.includes('estudios de extension') ||
  norm.includes('indicacion de etapificacion');

if (esIndicacionEtapificacion && etapaActual === 'Confirmación diagnóstica') {
  return {
    esValido: true,
    nuevaEtapa: 'Etapificación',
    esResolucionComite: false,
    esInicioTratamiento: false,
    esReclasificacionDiagnostica: false
  };
}
```

### B. Servicio de Aplicación (`src/servicios/seguimiento.ts`)
El método `registrarHito(numeroCaso, input)` ejecuta la operación transaccional:
1. Valida que el caso exista y que la fecha sea temporalmente consistente (no futura y $\ge$ a la fecha del último hito).
2. Invoca `evaluarTransicionHito(caso.etapaActual, input.tipo, tieneResolucion)`.
3. Si `nuevaEtapa !== caso.etapaActual`:
   ```typescript
   this.repo.actualizarEtapaCaso(caso.id!, evalTransicion.nuevaEtapa);
   ```
4. Inserta el registro en la tabla `hito_asistencial`.
5. Si corresponde a un hito normado (P1–P6), evalúa la bitácora y resuelve alertas de seguimiento asociadas.

### C. Modificación directa por Base de Datos (SQL de depuración o testing)
Si se desea cambiar la etapa directamente en la base de datos `data/app.db` sin pasar por la interfaz web:

```sql
-- 1. Actualizar la etapa actual del caso
UPDATE caso_oncologico 
SET etapa_actual = 'Etapificación' 
WHERE numero_caso = 'CASO-2026-002';

-- 2. Registrar el hito clínico de respaldo
INSERT INTO hito_asistencial (
  caso_id, tipo, fecha_ocurrencia, fecha_registro, responsable, rol_responsable
) 
SELECT 
  id, 
  'Indicación de etapificación y solicitud de estudios de extensión', 
  '2026-10-25', 
  datetime('now'), 
  'Dr. Andrés Silva', 
  'Médico tratante'
FROM caso_oncologico 
WHERE numero_caso = 'CASO-2026-002';
```

---

## 5. Escenarios de Prueba Automatizada (Gherkin)

El cambio queda cubierto bajo los escenarios del feature de trazabilidad (`HU-01`):

* **`HU-01-ESC-06` (Avance nominal):**
  - **GIVEN:** Caso en *Confirmación diagnóstica*.
  - **WHEN:** Profesional autorizado registra la indicación de etapificación.
  - **THEN:** El caso pasa a *Etapificación*, la línea de tiempo conserva el hito y el tablero se actualiza.
* **`HU-01-ESC-07` (Rechazo por etapa inválida):**
  - Si el caso no se encuentra en *Confirmación diagnóstica* (ej. ya está en *Tratamiento*), se rechaza la transición.
* **`HU-01-ESC-08` (Control de rol no autorizado):**
  - Roles sin atribución clínica (ej. consulta pública o roles no autorizados) reciben HTTP 403.
