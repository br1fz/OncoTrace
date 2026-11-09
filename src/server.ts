// src/server.ts - Arranque del servidor HTTP en el puerto 3000
import { crearApp } from './app.js';
import { obtenerConexion } from './db/conexion.js';

const PORT = process.env.PORT || 3000;
const db = obtenerConexion();
const app = crearApp(db);

app.listen(PORT, () => {
  console.log(`🚀 OncoTrace activo en http://localhost:${PORT}`);
  console.log(`📋 Entorno: ${process.env.NODE_ENV || 'desarrollo'} | Base de datos: SQLite`);
});

