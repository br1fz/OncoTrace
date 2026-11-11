# Proposal — Evaluación multidimensional y estratificación por dominios (HU-02)

## Why

En el modelo actual (AS-IS), la valoración biopsicosocial de los pacientes oncológicos carece de estandarización y se encuentra dispersa en notas clínicas no estructuradas (problema AS-05). Esto impide identificar oportunamente factores críticos de riesgo funcional, sobrecarga de los cuidadores principales y barreras socioeconómicas para el tratamiento.

HU-02 implementa la actividad **TB-02** del TO-BE («Evaluación multidimensional estandarizada») y el caso de uso **CU-10** («Aplicar evaluación multidimensional y estratificar riesgo»), permitiendo a la Gestora UGCO aplicar la pauta por dominios normados, calcular de manera automática el índice de vulnerabilidad global (`Bajo`, `Medio`, `Alto`), pesquisar sobrecarga severa en cuidadores (Zarit > 56) y alertar al equipo de Servicio Social oportunamente.

## What Changes

- **Pauta de valoración por los 6 dominios normados:**
  - `CLINICO_FUNCIONAL`: Desempeño funcional con índice ECOG / OMS obligatorio (0 a 4).
  - `PSICOEMOCIONAL`: Detección de distrés o afectación psicoemocional y derivación a Psicología / Psicooncología.
  - `CUIDADOR`: Identificación del cuidador principal (`CuidadorAutorizado`), parentesco, teléfono y pesquisa de sobrecarga mediante escala Zarit (0 a 88).
  - `SOCIOECONOMICO`: Previsión de salud, situación laboral, nivel socioeconómico declarado y derivación a Servicio Social.
  - `ESPIRITUAL`: Aspectos culturales, religiosos o soporte espiritual relevante.
  - `COMPRENSION_DIAGNOSTICA`: Grado de entendimiento del diagnóstico y pronóstico por paciente y familia.
- **Motor de cálculo de vulnerabilidad global:**
  - Ponderación aditiva transparente (0 a 6 puntos):
    - Rendimiento funcional ECOG: ECOG 0–1 = 0 pts; ECOG 2 = 1 pt; ECOG 3–4 = 2 pts.
    - Vulnerabilidad socioeconómica: Baja = 0 pts; Media = 1 pt; Alta = 2 pts.
    - Soporte / sobrecarga de cuidador: Sin sobrecarga (Zarit ≤ 46) = 0 pts; Sobrecarga leve (Zarit 47–56) = 1 pt; Sobrecarga severa (Zarit > 56 o sin cuidador) = 2 pts.
    - Clasificación final: 0–2 puntos $\rightarrow$ **Bajo**; 3–4 puntos $\rightarrow$ **Medio**; 5–6 puntos $\rightarrow$ **Alto**.
- **Gestión de sobrecarga severa en cuidador (Zarit > 56):**
  - Generación automática de `AlertaSeguimiento` con `tipo = 'Sobrecarga de cuidador'`, `prioridad = 'Alta'`, `estado = 'Pendiente'`.
  - Exigencia obligatoria de registro de solicitud formal de apoyo / derivación psicosocial (`requiereDerivacion = true`, `especialidadDerivada = 'Servicio Social'`).
- **Inmutabilidad y versionado histórico:**
  - Registro append-only (solo `INSERT` en `evaluacion_multidimensional` y `dominio_valoracion`; nunca `UPDATE` ni `DELETE`).
  - Cada evaluación conserva estampa de tiempo (`fechaEvaluacion`), evaluador responsable y rol.
  - La ficha del caso y el tablero Kanban reflejan la evaluación más reciente, conservando el historial completo para auditoría y transparencia (Ley N° 20.584).
- **Distintivo visual categórico en interfaz:**
  - En el tablero Kanban: reemplazo de «Sin evaluar» por el distintivo visual (`Bajo` en verde, `Medio` en amarillo/ámbar, `Alto` en rojo/púrpura).
  - En la ficha del paciente: sección de evaluación vigente, resumen de hallazgos por dominios, derivaciones sugeridas y tabla cronológica de revaluaciones.
- **Control de rol de demostración:**
  - Registro de evaluaciones habilitado para `Gestor/a UGCO`. Si el usuario tiene rol `Médico tratante`, la interfaz se muestra en modo solo lectura para la pauta.

**Fuera de alcance:**
- HU-03 (Bitácora de contactos y Journey Map) y siguientes.
- Autenticación institucional real y perfiles de seguridad avanzados (RNF-03).
- Integración real con LIS, PACS o plataforma MINSAL.

## Capabilities

### New Capabilities
- `evaluacion-multidimensional`: Registro de valoración inicial por 6 dominios, cálculo automático de índice de vulnerabilidad, detección de sobrecarga de cuidador y sugerencia de derivaciones psicosociales.

### Modified Capabilities
- `seguimiento-oncologico`: La tarjeta del caso en el tablero Kanban y la cabecera de la ficha del caso actualizan su `marcadorRiesgo` con el nivel de vulnerabilidad de la evaluación más reciente (`Bajo`, `Medio`, `Alto`), o «Sin evaluar» si no cuenta con evaluaciones.

## Impact

- **Historia:** HU-02. **Actividad TO-BE:** TB-02 — Evaluación multidimensional estandarizada. **Caso de uso:** CU-10 — Aplicar evaluación multidimensional y estratificar riesgo. **Requisito:** RF-02.
- **Modelo de datos:** Migración `002_evaluacion_multidimensional.sql` con tablas `cuidador_autorizado`, `evaluacion_multidimensional` y `dominio_valoracion`.
- **Código:** Nuevos módulos `src/dominio/evaluacion.ts`, `src/servicios/evaluacion.ts`, `src/rutas/evaluacion.ts`, vista `src/vistas/evaluacion-nueva.ejs`, y actualización de `src/dominio/repositorios.ts`, `src/vistas/caso.ejs`, `src/vistas/tablero.ejs` y `src/db/seed.ts`.
