El cambio para especificar y generar la funcionalidad para la transición desde
<<confirmación diagnóstica>> a <<etapificación>>,
afecta principalmente a la HU-01, con la necesidad de crear un nuevo escenario Gherkin, basado en el HU-01-ESC-02, del tipo:

HU-01-ESC-06: Cambio de etapa "Confirmación Diagnóstica" a "Etapificación"
    Dado un caso oncológico en etapa de confirmación diagnóstica
    Y una resolución de comité registrada como hito del caso
    Cuando un profesional autorizado registra el cambio de etapa a "etapificación"
    Entonces el caso queda en la etapa de etapificación
    Y la línea de tiempo conserva el hito y el cambio de etapa
    Y el registro identifica la fecha, hora, usuario y rol del responsable.

La HU-03 se ve afectada, pero no necesita un cambio ya que la plataforma ya hace el registro de los cambios

En cuanto a cambios en el *Modelo de Dominio*, no se crea ninguna restricción nueva, no pide guardar ningún tipo de dato nuevo, tampoco un nuevo concepto o registro, tampoco cambia alguna relación.

Para *CU y Estados*, se ven afectadas los siguientes CU:

| **CU-11** | Registrar interacción en bitácora de acompañamiento | Gestor/a UGCO y TENS UGCO | [HU-03](./04-historias-usuario.md#hu-03) | HU-03-ESC-01 a HU-03-ESC-06 |
| **CU-12** | Generar ficha de presentación a comité | Gestor/a UGCO y médico tratante | [HU-06](./04-historias-usuario.md#hu-06) | HU-06-ESC-01 a HU-06-ESC-03 |
| **CU-16** | Monitorear sincronización con plataforma MINSAL | Gestor/a UGCO y Sistema MINSAL | [HU-11](./04-historias-usuario.md#hu-11) | HU-11-ESC-01 a HU-11-ESC-03 |

En el diagrama de secuencia y estados no se ven afectados directamente, dado que es un avance lógico que ya está planteado dentro del timeline de la evolución en el tablero Khanban.