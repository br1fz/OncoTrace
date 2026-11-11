# evaluacion-multidimensional Specification

## Purpose
Permite registrar la pauta de valoración inicial y periódica por dominios biopsicosociales normados, calcular de manera automática el nivel de vulnerabilidad asistencial (`Bajo`, `Medio`, `Alto`), alertar sobrecargas severas del cuidador (Zarit > 56) y sugerir derivaciones multidisciplinarias oportunas.

## Requirements

### Requirement: Registro de valoración por dominios normados
El sistema SHALL permitir el registro de una pauta de valoración que comprende obligatoriamente los seis dominios normados: `CLINICO_FUNCIONAL`, `PSICOEMOCIONAL`, `CUIDADOR`, `SOCIOECONOMICO`, `ESPIRITUAL` y `COMPRENSION_DIAGNOSTICA`. Cada evaluación SHALL registrar fecha, hora y usuario evaluador responsable.

#### Scenario: HU-02-ESC-01 Registro de evaluación inicial y cálculo de vulnerabilidad
- **GIVEN** un caso oncológico en etapa de sospecha o confirmación diagnóstica
- **AND** una gestora UGCO autorizada aplicando la pauta inicial de valoración
- **WHEN** la gestora registra los puntajes de los seis dominios (clínico-funcional ECOG, psicoemocional, cuidador Zarit, socioeconómico, espiritual y comprensión diagnóstica)
- **THEN** OncoTrace almacena la evaluación vinculada al caso y paciente
- **AND** calcula el índice de vulnerabilidad asistencial global registrando el nivel de vulnerabilidad en Bajo, Medio o Alto
- **AND** genera sugerencias de derivación al equipo psicosocial si el dominio psicoemocional o socioeconómico presenta alteración crítica

### Requirement: Pesquisa y gestión de sobrecarga del cuidador (Zarit)
El sistema SHALL permitir identificar al cuidador principal del paciente (nombre, RUN, parentesco, teléfono) y registrar el puntaje de la escala de sobrecarga Zarit (0 a 88). Cuando el puntaje Zarit sea superior a 56 puntos, el sistema SHALL generar automáticamente una alerta prioritaria de tipo 'Sobrecarga de cuidador' para la Unidad de Servicio Social y SHALL exigir el registro de una derivación formal de apoyo psicosocial.

#### Scenario: HU-02-ESC-02 Detección de sobrecarga severa en cuidador principal
- **GIVEN** un caso oncológico con cuidador principal identificado
- **WHEN** la gestora registra en la pauta un puntaje de escala Zarit superior a 56 puntos
- **THEN** OncoTrace emite una alerta prioritaria para la Unidad de Servicio Social
- **AND** exige el registro de una solicitud formal de apoyo o intervención psicosocial para el cuidador

### Requirement: Obligatoriedad del índice funcional clínico ECOG
El sistema SHALL validar que el puntaje clínico-funcional ECOG sea un número entero entre 0 y 4. Si el usuario intenta guardar la evaluación multidimensional sin ingresar un valor ECOG válido, el sistema SHALL rechazar el registro indicando el campo clínico obligatorio y SHALL mantener el caso en su estado previo sin alterar su estratificación.

#### Scenario: HU-02-ESC-03 Exigencia de índice funcional clínico mínimo
- **GIVEN** un paciente oncológico sin registro de rendimiento funcional previo
- **WHEN** la gestora intenta guardar la evaluación multidimensional sin ingresar el valor ECOG (0-4)
- **THEN** el sistema rechaza el registro indicando el campo clínico obligatorio
- **AND** mantiene el caso en su estado previo sin alterar la estratificación

### Requirement: Cálculo ponderado de vulnerabilidad global
El sistema SHALL calcular de forma automática el nivel de vulnerabilidad asistencial global (`Bajo`, `Medio`, `Alto`) considerando:
1. Rendimiento funcional (ECOG 0–1 = 0 pts; ECOG 2 = 1 pt; ECOG 3–4 = 2 pts).
2. Vulnerabilidad socioeconómica (Baja = 0 pts; Media = 1 pt; Alta = 2 pts).
3. Sobrecarga del cuidador (Zarit ≤ 46 = 0 pts; Zarit 47–56 = 1 pt; Zarit > 56 o ausencia de red/cuidador = 2 pts).
La suma (0 a 6 pts) determinará:
- 0 a 2 puntos: `Bajo`
- 3 a 4 puntos: `Medio`
- 5 a 6 puntos: `Alto`

### Requirement: Inmutabilidad del historial de evaluaciones
El sistema SHALL persistir cada evaluación como un registro nuevo e inmutable (operación de solo inserción). En ningún caso SHALL modificarse o eliminarse una evaluación previa registrada. El caso y el tablero Kanban SHALL reflejar el resultado de la evaluación más reciente.

### Requirement: Visualización de distintivo categórico en Kanban y Ficha
El sistema SHALL mostrar el nivel de vulnerabilidad asistencial (`Bajo`, `Medio`, `Alto`) mediante distintivos visuales diferenciados en la tarjeta del tablero Kanban y en la ficha integral del caso.
