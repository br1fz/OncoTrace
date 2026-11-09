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
| HU-01 | hecha | hu-01-tablero-trazabilidad | 2026-11-09 | Must. 11/11 pruebas pasando. Archivado como `2026-11-09-hu-01-tablero-trazabilidad`. Ficha: `.cin324/historias/HU-01.md` |
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
| — | — | — | — |

## Cambios posteriores
| Cambio | Historia afectada | Motivo | Fecha |
|--------|-------------------|--------|-------|
| — | — | — | — |
