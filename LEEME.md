# Skills CIN 324: generar y validar la aplicación desde los requisitos

Contenido: cinco skills y cuatro comandos para OpenCode, un agente de programación de código abierto que funciona con modelos gratuitos.

Requisitos previos (ver el tutorial «Instalar OpenCode y usar un modelo gratuito»):
- Node.js 20.19 o superior y Git.
- Visual Studio Code: OpenCode se usa desde su terminal integrada, con tu repositorio abierto.
- OpenCode instalado (`npm install -g opencode-ai`) y un modelo gratuito elegido con `/models`.

Instalación:
1. Copia la carpeta `.opencode` y el archivo `opencode.json` de este paquete en la raíz de tu repositorio. Si ya tienes una carpeta `.opencode` u `opencode.json`, no los sobrescribas: copia solo las carpetas `cin324-*` (en `skills/`), los cuatro archivos de `commands/`, y agrega la clave `permission` de `opencode.json`.
2. Instala OpenSpec una vez: `npm install -g @fission-ai/openspec@latest`.
3. En la carpeta de tu repositorio: `openspec init --tools opencode`.
4. Abre la carpeta en VS Code, abre la terminal integrada (Ctrl+`), ejecuta `opencode` (si ya estaba abierto, ciérralo con `/exit` y ábrelo de nuevo) y escribe `/cin324-generar-app`.

Qué incluye:
- `.opencode/skills/cin324-generar-app`: orquesta el flujo completo, historia por historia.
- `.opencode/skills/cin324-auditar-repositorio`: evalúa si la documentación está completa.
- `.opencode/skills/cin324-validar-historia`: valida una historia contra los demás artefactos.
- `.opencode/skills/cin324-configurar-stack`: define el stack (TypeScript o Python, con SQLite) y el contexto de OpenSpec.
- `.opencode/skills/cin324-validar-sistema`: invita a validar el sistema generado, recoge tu feedback en lenguaje natural y te indica qué artefactos de especificación cambiar y, si quieres, te ayuda a actualizarlos (historias, Gherkin, modelo de dominio, casos de uso, diagramas de secuencia y de estado). Aplica cada cambio solo con tu aprobación explícita y nunca toca el código.
- `.opencode/commands/`: los atajos `/cin324-generar-app`, `/cin324-auditar-repositorio`, `/cin324-validar-historia` y `/cin324-validar-sistema`.
- `opencode.json`: desactiva compartir conversaciones por enlace y pide permiso antes de ejecutar comandos de terminal.

Cómo se invocan:
- Las skills no tienen comando propio en OpenCode: el agente las carga cuando las necesita. Los atajos `/cin324-…` le piden que cargue la skill correspondiente.
- Las skills de OpenSpec se disparan con `/opsx-propose`, `/opsx-apply` y `/opsx-archive` (los crea `openspec init`).

Principio del taller: el sistema se produce exclusivamente desde los artefactos de especificación. Si algo no funciona como esperabas, `/cin324-validar-sistema` te dice qué artefactos cambiar y te propone los cambios uno por uno; tú apruebas cada uno. El código solo cambia regenerando desde los artefactos.
