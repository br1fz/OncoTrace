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
| HU-02 | pendiente | — | — | Must |
| HU-03 | pendiente | — | — | Must |
| HU-04 | pendiente | — | — | Must |
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

## Cambios posteriores
| Cambio | Historia afectada | Motivo | Fecha |
|--------|-------------------|--------|-------|
| Defecto de generación (sin cambio de especificación) | HU-01 | `npm run build` fallaba por los tipos de `req.params` (@types/express v5 con Express 4); se aplicó `String(...)` en las 5 líneas de `src/rutas/seguimiento.ts`. Comportamiento sin cambios. | 2026-11-10 |
| 2026-11-10-ajuste-hu-01-consistencia-temporal | HU-01 | Implementar consistencia temporal e inmutabilidad de hitos: rechazo de fechas futuras (ESC-04) y anteriores al último hito registrado (ESC-05). 13/13 pruebas pasando. | 2026-11-10 |
