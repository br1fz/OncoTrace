# Ingeniería de Requisitos — Entrega 2

**Proyecto:** OncoTrace  
**Asignatura:** CIN324 — Ingeniería de Requisitos  
**Unidad de referencia:** Unidad de Gestión de Casos Oncológicos (UGCO), Hospital Dr. Gustavo Fricke

## Equipo

- Ignacio Jorquera
- Bruno Fernández
- Benjamín Carcamo
- Máximo Torrijo Espinoza

## Proyecto

**OncoTrace** es una plataforma propuesta para apoyar a la UGCO del Hospital Dr. Gustavo Fricke en el seguimiento de las ocho etapas de la trayectoria oncológica. Busca reunir los informes de LIS y PACS, facilitar el seguimiento de los plazos GES y la detección de inactividad, y mantener la trazabilidad de las derivaciones al Hospital Carlos Van Buren hasta el retorno del paciente.

La Entrega 2 especifica los criterios de aceptación, los modelos y los diagramas de HU-01, HU-04, HU-05 y HU-08.

## Responsabilidades individuales

Ignacio Jorquera lideró la elaboración y la integración final de los seis artefactos. La columna «Responsable individual declarado» identifica la asignación de cada ítem para efectos de la pauta. Los aportes de elaboración, revisión y ajuste se registran en la última columna. Cualquier integrante puede ser consultado sobre la entrega completa.

| Ítem | Artefacto y alcance | Responsable principal de elaboración e integración final | Responsable individual declarado | Aportes y revisiones documentadas |
| :---: | :--- | :--- | :--- | :--- |
| 1 | 07 · Criterios de aceptación. Escenarios y reglas de aceptación. | Ignacio Jorquera | Ignacio Jorquera | Ignacio elaboró y consolidó los criterios. Máximo ajustó los encabezados de HU-04, HU-05 y HU-08. [Ajuste de encabezados](https://github.com/br1fz/OncoTrace/commit/aaed0ec3d9b277196d4505af51618ad5055371cb). |
| 2 | 08 · Modelo de dominio. Conceptos, clases y relaciones del dominio. | Ignacio Jorquera | Ignacio Jorquera | Bruno preparó una versión UML intermedia basada en los manuales y las evidencias de la UGCO. Esa versión se retiró antes de la entrega final. [Incorporación](https://github.com/br1fz/OncoTrace/commit/1f2dacca27fab68bcc4762559ba08295fb0de2b1) · [Retiro](https://github.com/br1fz/OncoTrace/commit/bd5b07dd730e960b0e9a8baa254252853da10a4e). |
| 3 | 09 · Casos de uso. Actores, objetivos y relaciones entre casos. | Ignacio Jorquera | Benjamín Carcamo | Benjamín ajustó encabezados y referencias. Máximo publicó la imagen revisada de los casos de uso. [Ajustes del documento](https://github.com/br1fz/OncoTrace/commit/1a4431ce4f5b500222688361b5815a0142505ac6) · [Imagen revisada](https://github.com/br1fz/OncoTrace/commit/c9a81553abd0ce72547da56609166fdbe48a98c5). |
| 4 | 10 · Diagramas de secuencia. Interacciones DSS para HU-05 y HU-08. | Ignacio Jorquera | Benjamín Carcamo | Benjamín editó y reestructuró el documento descriptivo. Máximo hizo explícita la validación previa de UGAA y publicó una revisión de DSS-02. [Edición](https://github.com/br1fz/OncoTrace/commit/9ed8be38d85c7e0b97b6c2b501ecc3e8da986d41) · [Reestructuración](https://github.com/br1fz/OncoTrace/commit/96f769eeba41c69bcffb43bd165999b8047f2ad9) · [Validación de UGAA](https://github.com/br1fz/OncoTrace/commit/1823464d6f4952996bf930fc2d2e0f27f3affc08) · [Revisión de DSS-02](https://github.com/br1fz/OncoTrace/commit/c9a81553abd0ce72547da56609166fdbe48a98c5). |
| 5 | 11 · Diagramas de estado. Estados y transiciones de alertas y derivaciones. | Ignacio Jorquera | Bruno Fernández | Benjamín reorganizó secciones y tablas de transición. Máximo ajustó la tabla de EST-02. Ignacio ordenó los diagramas finales y alineó el documento con las imágenes y la fuente PlantUML. [Reorganización](https://github.com/br1fz/OncoTrace/commit/3c5de5ea2ba6feea2a1eb98885e8e243af45c78d) · [Ajustes en EST-02](https://github.com/br1fz/OncoTrace/commit/1823464d6f4952996bf930fc2d2e0f27f3affc08) · [Diagramas finales](https://github.com/br1fz/OncoTrace/commit/3d2109c8b4efc4e1aea1185a0e56e1b9edcdc860) · [Documento final](https://github.com/br1fz/OncoTrace/commit/bd12380f99ae627be7e94b20ba76dc3bad012c0c). |
| 6 | 12 · Matriz de trazabilidad. Relaciones entre requisitos, historias y artefactos. | Ignacio Jorquera | Máximo Torrijo Espinoza | Benjamín incorporó una matriz consolidada inicial. Máximo amplió la cobertura de los requisitos de la Entrega 1. Ignacio precisó en la revisión final la correspondencia entre EST-02 y DSS-02. [Matriz inicial](https://github.com/br1fz/OncoTrace/commit/2474b05f99e8291e0bcc5cb704dbdf32b8cbec9c) · [Ampliación de cobertura](https://github.com/br1fz/OncoTrace/commit/4aad7e71705e6a7ea8f9777732000bc8dee76c1e) · [Revisión final](https://github.com/br1fz/OncoTrace/commit/567ee11e7bc60baa68b71db1c91600e957a47229). |

## Uso de IA generativa

Se utilizó ChatGPT como apoyo para organizar y revisar la redacción y los diagramas de los artefactos 07–12. También se consultó Claude en una revisión complementaria de la coherencia entre los documentos y su ajuste a la rúbrica.

Se contrastaron las propuestas con la Entrega 1 y la pauta. Se corrigió la notación de las transiciones iniciales en EST-01 y EST-02, se precisó la correspondencia entre EST-02 y DSS-02 y se descartaron propuestas de cierre automático de alertas que los requisitos no especificaban.

## Entrega anterior

[Documento integrador de la Entrega 1](./IngReq-Entrega%201.md)

## Índice de documentos

1. [07 · Criterios de aceptación en Gherkin](./07-criterios-aceptacion.md)
2. [08 · Modelo de dominio](./08-modelo-dominio.md)
3. [09 · Casos de uso](./09-casos-de-uso.md)
4. [10 · Diagramas de secuencia del sistema](./10-diagramas-secuencia.md)
5. [11 · Diagramas de estado](./11-diagramas-estado.md)
6. [12 · Matriz de trazabilidad](./12-trazabilidad.md)
