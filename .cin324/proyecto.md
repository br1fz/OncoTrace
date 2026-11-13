# Estado del proyecto — generación de la aplicación

## Proyecto
- Nombre: OncoTrace (UGCO — Hospital Dr. Gustavo Fricke, CIN 324)
- Repositorio de documentación: esta carpeta (`Documentos/` y `diagramas/` son la fuente de verdad)
- Última auditoría: 2026-11-09 — resultado: completo (todas las dudas de consistencia resueltas)

## Mapa de artefactos (rutas detectadas)
| Artefacto | Ruta(s) | Estado |
|-----------|---------|--------|
| BPMN AS-IS | `Documentos/01-proceso-as-is.md`, `diagramas/as-is.bpmn` | completo |
| BPMN TO-BE | `Documentos/02-rediseno-to-be.md` (tabla TB-01…TB-11), `diagramas/to-be.bpmn` | completo |
| Historias de usuario | `Documentos/04-historias-usuario.md` (HU-01…HU-11) | completo |
| Criterios Gherkin | `Documentos/07-criterios-aceptacion.md` (HU-01…HU-11, escenarios completos nominales, alternativos y de error) | completo |
| Modelo de dominio | `diagramas/modelo-dominio.puml` (MD-01.A…D), `diagramas/modelo-dominio.png`, `Documentos/08-modelo-dominio.md` | completo |
| Casos de uso | `Documentos/09-casos-de-uso.md` (CU-01…CU-16), `diagramas/casos-de-uso.puml/.png` | completo |
| Diagramas de estado | `Documentos/11-diagramas-estado.md`, `diagramas/estados-objetos.puml` (EST-01…EST-04) | completo |
| Diagramas de secuencia | `Documentos/10-diagramas-secuencia.md`, `diagramas/diagramas-secuencia.puml` (DSS-01…DSS-04) | completo |
| Requisitos y atributos de calidad | `Documentos/03-requisitos.md`, `Documentos/06-atributos-calidad.md` | completo |
| Trazabilidad | `Documentos/12-trazabilidad.md` (canónica); `07-matriz-trazabilidad.md` (línea base histórica) | completo |

## Supuestos acordados (por elementos faltantes o dudosos)
- 2026-11-09 — Fuente de verdad: `Documentos/` y `diagramas/`. `_backup/` es archivo histórico y no se usa para generar código.
- 2026-11-09 — Consistencia resuelta para HU-03: los 6 puntos normados del Journey Map, el umbral de alerta preventiva de 48 horas hábiles, los atributos de `interlocutor`, `motivoContacto` y la regla de inmutabilidad (adendas) quedaron 100% alineados entre `04-historias-usuario.md`, `07-criterios-aceptacion.md`, `08-modelo-dominio.md`, `modelo-dominio.puml` y `09-casos-de-uso.md`.
- 2026-11-09 — Las integraciones con LIS, PACS, HCVB y MINSAL se implementarán simuladas (interfaz + versión falsa), según la regla del taller; se avisará en cada historia que las use.
- 2026-11-09 — Consistencia resuelta para HU-09: se alineó el método de verificación de identidad (cédula + serie/factor de autenticación secundario; RUN o cédula solos no bastan), la verificación obligatoria de autorización vigente para cuidadores (`CuidadorAutorizado`), el timeout de 30 segundos (o botón Salir) y los 4 estados macro en `07-criterios-aceptacion.md`, `08-modelo-dominio.md`, `09-casos-de-uso.md` y `12-trazabilidad.md`.
- 2026-11-11 — Resolución de completitud y consistencia global (Auditoría previa a generación):
  1. **Trazabilidad y vigencia:** Ratificada la plena vigencia de DSS-01 a DSS-04 y EST-01 a EST-04. Se sincronizó `12-trazabilidad.md` eliminando observaciones y tablas rezagadas, corrigiendo el conteo a 22 clases del dominio, corrigiendo el render de RNF-03 y REQ-DER-01 (6 columnas exactas) e integrando `AlertaSeguimiento` a HU-03.
  2. **Alcance de Casos de Uso:** Confirmada la vigencia de CU-01 a CU-16 para derivación de código. Se ajustó `09-casos-de-uso.md` a 4 vistas (DCU-01.A a DCU-01.D) y alcance completo HU-01 a HU-11.
  3. **HU-03 (Búsqueda activa):** Formalizado `HU-03-CA7` en `04-historias-usuario.md` y condición de disparo y transiciones en EST-01 (`estados-objetos.puml` y `11-diagramas-estado.md`, vinculando CU-06 y CU-11). El conteo de 3 intentos fallidos consecutivos se calcula sobre `EntradaBitacora` (`estadoContacto = 'No contactable'`) y dispara alerta de búsqueda activa con APS.
  4. **HU-11 (Vocabulario MINSAL y neutralidad de protocolo):** Estandarizado el vocabulario canónico `EstadoSincronizacionMINSAL`: `Pendiente de confirmación`, `Sincronizado` y `Pendiente de reintento` (eliminando cualquier doble etiqueta y normalizando minúsculas en Gherkin). Se eliminó la presuposición de HL7 FHIR en TO-BE, Casos de Uso y Criterios, dejándolo como «mecanismo acordado» conforme a HU-11-CA2 y RNF-04.
  5. **HU-02 (Riesgo y vulnerabilidad):** Estandarizado el concepto como «índice de vulnerabilidad asistencial global» y su clasificación en `nivelVulnerabilidad` (`Bajo`, `Medio`, `Alto`).
  6. **Repositorio y fuente de verdad:** Ratificada la exclusión de `_backup/` y la vigencia absoluta de `Documentos/` y `diagramas/`.
  7. **Vistas, tipos y diagramas visuales:** Agregada `Paciente` a `MD-01.D` y aplicados los tipos `NivelVulnerabilidad`, `EstadoContactoBitacora` y `EstadoSincronizacionMINSAL` en `diagramas/modelo-dominio.puml`. Incorporada previsualización Mermaid del BPMN TO-BE en `02-rediseno-to-be.md`, Mermaid para DSS-03/04 en `10-diagramas-secuencia.md` y Mermaid para EST-03/04 en `11-diagramas-estado.md`.
- 2026-11-11 — Validación HU-02: se mantiene el historial de evaluaciones inmutable (append-only); se descarta la corrección con log de responsables. La protección contra modificaciones del paciente queda en el control de acceso de CU-10 (solo Gestor/a UGCO registra; Médico tratante, solo lectura).

## Stack (se define una sola vez)
- Lenguaje y framework: TypeScript estricto + Express + EJS
- Base de datos: SQLite con `better-sqlite3` — archivo `data/app.db`; migraciones SQL numeradas en `src/db/migrations/` (tabla `schema_migrations`)
- Pruebas: Vitest + supertest (una prueba por escenario Gherkin)
- Cómo instalar: `npm install`
- Cómo ejecutar: `npm run db:seed` y `npm run dev` — URL: `http://localhost:3000`
- Cómo probar: `npm test`
- Decisión confirmada por el estudiante: 2026-11-09 (Opción A)

## Historias
| Historia | Estado | Cambio de OpenSpec | Fecha | Observaciones |
|----------|--------|--------------------|-------|----------------|
| HU-01 | hecha | hu-01-tablero-trazabilidad + ajuste-hu-01-consistencia-temporal | 2026-11-10 | Must. 13/13 pruebas pasando y `npm run build` sin errores. Archivado como `2026-11-10-ajuste-hu-01-consistencia-temporal`. Ficha: `.cin324/historias/HU-01.md`. Validación cerrada el 2026-11-10 (`VAL-HU-01-3`). |
| HU-02 | hecha | hu-02-evaluacion-multidimensional | 2026-11-11 | Must. 10/10 pruebas de HU-02 (23/23 totales) y `npm run build` sin errores. Validación cerrada el 2026-11-11 (`VAL-HU-02-1`): 3 escenarios Gherkin, cálculo Bajo/Medio/Alto, inmutabilidad, permisos y distintivos verificados sin errores. OBS-1 (corrección con log de responsables) descartada: se mantiene el historial inmutable. Ficha: `.cin324/historias/HU-02.md`. |
| HU-03 | en curso, pendiente de validación | hu-03-bitacora-acompanamiento | 2026-11-13 | Must. Implementación completada con 19/19 pruebas de HU-03 (72/72 suite completa) y compilación TypeScript sin errores. Cubre TB-03, CU-11, RF-03, 6 escenarios Gherkin (HU-03-ESC-01 a HU-03-ESC-06), puntos normados P1–P6, alerta preventiva > 48h hábiles, racha de 3 fallos y alerta de búsqueda activa con APS, adendas inmutables, programación de próximo contacto, roles Gestora/TENS autorizados y Médico tratante solo lectura. Ficha: `.cin324/historias/HU-03.md`. |
| HU-04 | hecha | hu-04-motor-alertas-ges-inactividad + ajuste-hu-04-indicacion-hito-resolutivo | 2026-11-11 | Must. 30/30 pruebas de HU-04 (53/53 totales) y `npm run build` sin errores. Cubre TB-04, CU-06, RF-04, 9 escenarios Gherkin (HU-04-ESC-01 a HU-04-ESC-09), regla de visibilidad de 14h para alertas resueltas, indicación observable de hito resolutivo en ficha del caso (OBS-1), confirmación de evaluación en panel, calendario de días hábiles 2026, detección de inactividad > 15 días corridos, gestión y cierre por causa documentada. Ficha: `.cin324/historias/HU-04.md`. Archivado como `2026-11-11-ajuste-hu-04-indicacion-hito-resolutivo`. |
| HU-05 | pendiente | — | — | Must |
| HU-06 | pendiente | — | — | Must |
| HU-07 | pendiente | — | — | Must |
| HU-08 | pendiente | — | — | Must |
| HU-09 | pendiente | — | — | Should |
| HU-10 | pendiente | — | — | Should |
| HU-11 | pendiente | — | — | Prioridad por acordar con HGF y MINSAL |

## Validaciones
| Historia | Informe | Estado | Fecha |
|----------|---------|--------|-------|
| HU-01 | `.cin324/validaciones/VAL-HU-01-1.md` | verificado en el sistema (observaciones resueltas en la vuelta 2) | 2026-11-10 |
| HU-01 | `.cin324/validaciones/VAL-HU-01-2.md` | verificado en el sistema (ajuste implementado y probado con 13/13 tests) | 2026-11-10 |
| HU-01 | `.cin324/validaciones/VAL-HU-01-3.md` | **verificado en el sistema — HU-01 cerrada** (ESC-04 y ESC-05 comprobados; queda 1 mejora menor pendiente: «hoy» en UTC) | 2026-11-10 |
| HU-02 | `.cin324/validaciones/VAL-HU-02-1.md` | **verificado en el sistema — HU-02 cerrada** (sin observaciones; OBS-1 descartada: historial inmutable) | 2026-11-11 |
| HU-04 | `.cin324/validaciones/VAL-HU-04-1.md` | verificado en el sistema (ajustes OBS-1 a OBS-4 implementados; 29/29 tests) | 2026-11-11 |
| HU-04 | `.cin324/validaciones/VAL-HU-04-2.md` | verificado en el sistema (ajuste OBS-1 en ficha implementado y probado; 30/30 tests) | 2026-11-11 |

## Cambios posteriores
| Cambio | Historia afectada | Motivo | Fecha |
|--------|-------------------|--------|-------|
| Defecto de generación (sin cambio de especificación) | HU-01 | `npm run build` fallaba por los tipos de `req.params` (@types/express v5 con Express 4); se aplicó `String(...)` en las 5 líneas de `src/rutas/seguimiento.ts`. Comportamiento sin cambios. | 2026-11-10 |
| 2026-11-10-ajuste-hu-01-consistencia-temporal | HU-01 | Implementar consistencia temporal e inmutabilidad de hitos: rechazo de fechas futuras (ESC-04) y anteriores al último hito registrado (ESC-05). 13/13 pruebas pasando. | 2026-11-10 |
| 2026-11-11-hu-04-motor-alertas-ges-inactividad | HU-04 | Implementar motor de alertas GES e inactividad, feedback de evaluación (ESC-09) y visibilidad de 14h en alertas resueltas (ESC-06). 52/52 pruebas totales pasando. | 2026-11-11 |
| 2026-11-11-ajuste-hu-04-indicacion-hito-resolutivo | HU-04 | Mostrar en la ficha del caso el hito o contacto que resolvió la alerta (tipo y fecha) según HU-04-ESC-06 (OBS-1). 53/53 pruebas totales pasando. | 2026-11-11 |
