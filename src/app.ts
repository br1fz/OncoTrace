// src/app.ts - Configuración de la aplicación Express para OncoTrace
import express, { type Express } from 'express';
import cookieParser from 'cookie-parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Database } from 'better-sqlite3';
import { crearRutasSeguimiento } from './rutas/seguimiento.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function crearApp(db: Database): Express {
  const app = express();

  // Configuración de motor de vistas EJS
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, 'vistas'));

  // Middlewares
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, '..', 'public')));

  // Rutas principales
  app.use('/', crearRutasSeguimiento(db));

  // Manejo de error 404
  app.use((req, res) => {
    res.status(404).render('404', {
      mensaje: 'La página solicitada no existe.',
      rolActual: req.cookies?.rol || 'Gestor/a UGCO',
      titulo: 'Página no encontrada'
    });
  });

  return app;
}

