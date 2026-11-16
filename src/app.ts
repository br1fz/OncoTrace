// src/app.ts - Configuración de la aplicación Express para OncoTrace
import express, { type Express } from 'express';
import cookieParser from 'cookie-parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Database } from 'better-sqlite3';
import { crearRutasSeguimiento } from './rutas/seguimiento.js';
import { crearRutasEvaluacion } from './rutas/evaluacion.js';
import { crearRutasAlertas } from './rutas/alertas.js';
import { crearRutasExamenes } from './rutas/examenes.js';
import { ServicioAlertas } from './servicios/alertas.js';
import { ServicioExamenes } from './servicios/examenes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function crearApp(db: Database, servicioExamenesPersonalizado?: ServicioExamenes): Express {
  const app = express();
  const servicioAlertas = new ServicioAlertas(db);

  // Configuración de motor de vistas EJS
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, 'vistas'));

  // Middlewares
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, '..', 'public')));

  // Middleware para avisos emergentes internos de hallazgos críticos (HU-05 / D8 / 7.4)
  app.use((req, res, next) => {
    const rolActual = req.cookies?.rol || 'Gestor/a UGCO';
    if (req.method === 'GET' && (rolActual === 'Médico tratante' || rolActual === 'Gestor/a UGCO')) {
      try {
        res.locals.alertasCriticas = servicioAlertas.listarAlertasCriticasActivas();
      } catch {
        res.locals.alertasCriticas = [];
      }
    } else {
      res.locals.alertasCriticas = [];
    }
    next();
  });

  // Rutas principales
  app.use('/', crearRutasSeguimiento(db));
  app.use('/', crearRutasEvaluacion(db));
  app.use('/', crearRutasAlertas(db));
  app.use('/', crearRutasExamenes(db, servicioExamenesPersonalizado));

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

