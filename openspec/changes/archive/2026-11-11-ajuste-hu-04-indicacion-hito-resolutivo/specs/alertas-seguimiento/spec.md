# Spec Delta — Alertas de seguimiento

## MODIFIED Requirements

### Requirement: Resolución por cumplimiento o restablecimiento del contacto

Cuando se registra el hito asistencial que cumple la garantía GES o el contacto que restablece la actividad del caso, el sistema SHALL vincularlo a la alerta, cambiar su estado a Resuelta, confirmar la acción al usuario, indicar en la ficha del caso el hito o contacto que la resolvió (con su tipo y fecha), y mantener la alerta visible en el panel general durante 14 horas desde su resolución. Transcurrido ese plazo, SHALL excluirla de las alertas vigentes y mantenerla consultable en la ficha del caso.

#### Scenario: HU-04-ESC-06 Resolución por cumplimiento o restablecimiento del contacto

- **GIVEN** un caso con una alerta de seguimiento activa, por una garantía GES pendiente o por inactividad
- **WHEN** se registra el hito que acredita el cumplimiento de esa garantía o el contacto que restablece la actividad del caso
- **THEN** la alerta queda en estado Resuelta
- **AND** el sistema confirma la resolución de la alerta
- **AND** se conserva la relación entre la alerta y el hito o contacto que la resolvió
- **AND** la ficha del caso indica el hito o contacto que resolvió la alerta, con su tipo y fecha
- **AND** la alerta Resuelta permanece visible en el panel general durante 14 horas desde su resolución
- **AND** transcurridas las 14 horas deja de listarse entre las alertas vigentes y queda consultable en la ficha del caso
