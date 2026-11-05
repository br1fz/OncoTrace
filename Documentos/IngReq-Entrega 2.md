# Ingeniería de Requisitos — Entrega 2

**OncoTrace · CIN324**  
**Hospital Dr. Gustavo Fricke · Unidad de Gestión de Casos Oncológicos (UGCO)**

## Equipo

- Ignacio Jorquera
- Bruno Fernández
- Benjamín Carcamo
- Máximo Torrijo Espinoza

## Proyecto

OncoTrace es una propuesta de plataforma para que gestoras, TENS y médicos de la UGCO puedan seguir a cada paciente a lo largo de su trayectoria oncológica. La Entrega 2 especifica el seguimiento del caso, las alertas GES y de inactividad, la consulta de informes de LIS y PACS y el seguimiento de las derivaciones al Hospital Carlos Van Buren hasta el retorno del paciente. Los artefactos desarrollan las historias HU-01, HU-04, HU-05 y HU-08.

## Responsabilidades individuales

**Ignacio Jorquera lideró la elaboración de los seis artefactos y estuvo a cargo de la integración final de la Entrega 2.** Máximo Torrijo Espinoza contribuyó a la revisión y actualización de los criterios, los diagramas y la matriz de trazabilidad. La columna «Responsable individual declarado» identifica la asignación de cada ítem para efectos de la pauta. Cualquier integrante puede ser consultado sobre la entrega completa.

| Ítem | Artefacto y alcance | Responsable principal de elaboración e integración final | Responsable individual declarado | Aportes y revisiones documentadas |
| :---: | :--- | :--- | :--- | :--- |
| 1 | 07 · Criterios de aceptación | Ignacio Jorquera | Ignacio Jorquera | **Ignacio** elaboró y publicó los criterios de aceptación en Gherkin para las cuatro historias seleccionadas. **Máximo** ajustó los encabezados de HU-04, HU-05 y HU-08. [Criterios en Gherkin](https://github.com/br1fz/OncoTrace/commit/b6d5e1913ba26b456ca708e457ee09ce67f6f0e6) · [Ajuste de encabezados](https://github.com/br1fz/OncoTrace/commit/aaed0ec3d9b277196d4505af51618ad5055371cb). |
| 2 | 08 · Modelo de dominio | Ignacio Jorquera | Ignacio Jorquera | **Ignacio** elaboró el documento del modelo de dominio y publicó el diagrama UML con su fuente editable. Bruno preparó una versión UML intermedia basada en manuales y evidencias de la UGCO. [Documento](https://github.com/br1fz/OncoTrace/commit/2c2dfaa7d76d4e2488be72c712ee8ab1d9aad865) · [Diagrama y fuente](https://github.com/br1fz/OncoTrace/commit/1be124d6ba817eb480b6e3f324576512a99baed8) · [Versión intermedia](https://github.com/br1fz/OncoTrace/commit/1f2dacca27fab68bcc4762559ba08295fb0de2b1). |
| 3 | 09 · Casos de uso | Ignacio Jorquera | Benjamín Carcamo | **Ignacio** elaboró el documento y el diagrama de casos de uso y alineó los casos con los criterios de aceptación. **Máximo** actualizó la imagen de DCU-01. Benjamín realizó ajustes de presentación en el documento. [Documento](https://github.com/br1fz/OncoTrace/commit/215c77697947d23efbe4d1b460b19387cae1c817) · [Diagrama y fuente](https://github.com/br1fz/OncoTrace/commit/2b99038903d56950ae73664507c980992c4b9211) · [Alineación con criterios](https://github.com/br1fz/OncoTrace/commit/548aa4f5c6fcac5e057e207bbaec92af98ab837e) · [Actualización de la imagen](https://github.com/br1fz/OncoTrace/commit/c9a81553abd0ce72547da56609166fdbe48a98c5). |
| 4 | 10 · Diagramas de secuencia | Ignacio Jorquera | Benjamín Carcamo | **Ignacio** documentó las secuencias, publicó DSS-01 y DSS-02 con su fuente editable y corrigió el flujo de derivación externa. **Máximo** hizo explícita la validación previa de UGAA y publicó la actualización de DSS-02. Benjamín editó el texto descriptivo. [Diagramas y fuente](https://github.com/br1fz/OncoTrace/commit/65c8fba51c599eb4cf0d975bd4c650014df9d3e4) · [Corrección de la derivación](https://github.com/br1fz/OncoTrace/commit/301b7f5f1b97219e4d52d2359beb7f1129b3d4d4) · [Validación de UGAA](https://github.com/br1fz/OncoTrace/commit/1823464d6f4952996bf930fc2d2e0f27f3affc08). |
| 5 | 11 · Diagramas de estado | Ignacio Jorquera | Bruno Fernández | **Ignacio** elaboró el documento y realizó la revisión final de EST-01 y EST-02. Corrigió la notación de las transiciones iniciales, ordenó los diagramas y alineó las tablas con las imágenes y la fuente PlantUML. **Máximo** ajustó la tabla de EST-02 y publicó una revisión intermedia de los diagramas. Benjamín reorganizó secciones y tablas. [Documento inicial](https://github.com/br1fz/OncoTrace/commit/32b3265bfb77b725174c7971e427fda712635122) · [Ajuste de EST-02](https://github.com/br1fz/OncoTrace/commit/1823464d6f4952996bf930fc2d2e0f27f3affc08) · [Diagramas finales](https://github.com/br1fz/OncoTrace/commit/3d2109c8b4efc4e1aea1185a0e56e1b9edcdc860) · [Documento final](https://github.com/br1fz/OncoTrace/commit/bd12380f99ae627be7e94b20ba76dc3bad012c0c). |
| 6 | 12 · Matriz de trazabilidad | Ignacio Jorquera | Máximo Torrijo Espinoza | **Ignacio** elaboró la base de la matriz, documentó la trazabilidad de los requisitos de proyecto e integró la revisión final que precisó la correspondencia entre EST-02 y DSS-02. **Máximo** amplió la matriz para cubrir todos los requisitos de la Entrega 1. Benjamín incorporó una tabla consolidada en una revisión intermedia. [Matriz inicial](https://github.com/br1fz/OncoTrace/commit/53d5dc604482f987a6fbe6bd87ac31bd01bbe19e) · [Requisitos de proyecto](https://github.com/br1fz/OncoTrace/commit/2a91bb96b821f7648da2f0e4ce4dab01d1849dde) · [Ampliación de cobertura](https://github.com/br1fz/OncoTrace/commit/4aad7e71705e6a7ea8f9777732000bc8dee76c1e) · [Revisión final](https://github.com/br1fz/OncoTrace/commit/567ee11e7bc60baa68b71db1c91600e957a47229). |

## Uso de IA generativa

### Herramientas de apoyo

Se utilizó ChatGPT, un modelo de lenguaje (LLM), como apoyo para organizar el contenido y preparar y revisar borradores de texto y diagramas de los artefactos 07–12. Claude también fue de ayuda en una segunda revisión, en la que aportó observaciones sobre la coherencia entre los documentos y los diagramas y su ajuste a la rúbrica.

Las sugerencias se contrastaron con la Entrega 1 y la pauta. Ignacio decidió qué cambios incorporar a la versión final, con aportes de revisión y ajuste de Máximo. Se ajustaron referencias, se corrigió la notación de las transiciones iniciales de EST-01 y EST-02 y se precisó la correspondencia entre EST-02 y DSS-02. Se descartaron propuestas de cierre automático de alertas que los requisitos no definían y sugerencias que suponían acuerdos o integraciones institucionales sin confirmar.

## Entrega anterior

[Documento integrador de la Entrega 1](./IngReq-Entrega%201.md)

## Índice de documentos

1. [07 · Criterios de aceptación](./07-criterios-aceptacion.md)
2. [08 · Modelo de dominio](./08-modelo-dominio.md)
3. [09 · Casos de uso](./09-casos-de-uso.md)
4. [10 · Diagramas de secuencia](./10-diagramas-secuencia.md)
5. [11 · Diagramas de estado](./11-diagramas-estado.md)
6. [12 · Matriz de trazabilidad](./12-trazabilidad.md)
