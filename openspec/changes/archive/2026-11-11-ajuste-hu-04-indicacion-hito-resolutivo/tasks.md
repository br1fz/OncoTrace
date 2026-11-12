# Tasks — Indicación de hito o contacto resolutivo en ficha del caso (Ajuste HU-04)

- [x] 1. Actualizar `RepositorioOncologico.listarAlertasPorCasoId` en `src/dominio/repositorios.ts` con `LEFT JOIN hito_asistencial`.
- [x] 2. Actualizar `src/vistas/caso.ejs` para desplegar el tipo y fecha del hito en la tarjeta de la alerta resuelta.
- [x] 3. Agregar prueba en `tests/hu-04-alertas.test.ts` verificando la presencia observable del hito resolutivo en la ficha del caso.
- [x] 4. Ejecutar suite de pruebas (`npm test`) y verificar compilación TypeScript (`npm run build`).
- [x] 5. Validar y archivar el cambio en OpenSpec.
