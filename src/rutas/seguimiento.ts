// src/rutas/seguimiento.ts - Rutas HTTP de seguimiento oncológico (DSS-03 / CU-05)
import { Router, type Request, type Response } from 'express';
import type { Database } from 'better-sqlite3';
import { ServicioSeguimiento } from '../servicios/seguimiento.js';

export function crearRutasSeguimiento(db: Database): Router {
  const router = Router();
  const servicio = new ServicioSeguimiento(db);

  // Helper para obtener rol activo de la cookie de demostración
  const obtenerRol = (req: Request): string => {
    return req.cookies?.rol || 'Gestor/a UGCO';
  };

  // GET / - Tablero por las 8 etapas
  router.get('/', (req: Request, res: Response) => {
    const tablero = servicio.obtenerTablero();
    const rolActual = obtenerRol(req);

    res.render('tablero', {
      tablero,
      rolActual,
      titulo: 'Tablero de Trazabilidad Oncológica por Etapas'
    });
  });

  // GET /casos/:numeroCaso - Ficha del caso y línea de tiempo clínica
  router.get('/casos/:numeroCaso', (req: Request, res: Response) => {
    const { numeroCaso } = req.params;
    const caso = servicio.obtenerFichaCaso(String(numeroCaso));

    if (!caso) {
      return res.status(404).render('404', {
        mensaje: `No se encontró el caso oncológico '${numeroCaso}'.`,
        rolActual: obtenerRol(req),
        titulo: 'Caso no encontrado'
      });
    }

    const rolActual = obtenerRol(req);
    res.render('caso', {
      caso,
      rolActual,
      error: req.query.error as string | undefined,
      exito: req.query.exito as string | undefined,
      titulo: `Caso ${caso.numeroCaso} — ${caso.nombreCompleto}`
    });
  });

  // GET /casos/:numeroCaso/hitos/nuevo - Formulario de registro de hito
  router.get('/casos/:numeroCaso/hitos/nuevo', (req: Request, res: Response) => {
    const { numeroCaso } = req.params;
    const caso = servicio.obtenerFichaCaso(String(numeroCaso));

    if (!caso) {
      return res.status(404).render('404', {
        mensaje: `No se encontró el caso oncológico '${numeroCaso}'.`,
        rolActual: obtenerRol(req),
        titulo: 'Caso no encontrado'
      });
    }

    const rolActual = obtenerRol(req);
    const hoy = new Date().toISOString().split('T')[0];

    res.render('hito-nuevo', {
      caso,
      rolActual,
      hoy,
      error: undefined,
      titulo: `Registrar Hito — ${caso.numeroCaso}`
    });
  });

  // POST /casos/:numeroCaso/hitos - Registro de hito con validación y guardas
  router.post('/casos/:numeroCaso/hitos', (req: Request, res: Response) => {
    const { numeroCaso } = req.params;
    const { tipo, fechaOcurrencia, responsable, rolResponsable, conductaAcordada } = req.body;

    const resultado = servicio.registrarHito(String(numeroCaso), {
      tipo,
      fechaOcurrencia,
      responsable,
      rolResponsable,
      conductaAcordada
    });

    if (!resultado.ok) {
      const caso = servicio.obtenerFichaCaso(String(numeroCaso));
      return res.status(400).render('hito-nuevo', {
        caso: caso || { numeroCaso, nombreCompleto: '' },
        rolActual: obtenerRol(req),
        hoy: fechaOcurrencia || new Date().toISOString().split('T')[0],
        error: resultado.error,
        titulo: `Error al registrar hito — ${numeroCaso}`
      });
    }

    res.redirect(`/casos/${encodeURIComponent(String(numeroCaso))}?exito=Hito+registrado+exitosamente`);
  });

  // POST /rol - Selector de rol de demostración (Gestora / Médico)
  router.post('/rol', (req: Request, res: Response) => {
    const nuevoRol = req.body.rol === 'medico' ? 'Médico tratante' : 'Gestor/a UGCO';
    res.cookie('rol', nuevoRol, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
    res.redirect(req.headers.referer || '/');
  });

  return router;
}

