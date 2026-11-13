// src/rutas/seguimiento.ts - Rutas HTTP de seguimiento oncológico (DSS-03 / CU-05)
import { Router, type Request, type Response } from 'express';
import type { Database } from 'better-sqlite3';
import { ServicioSeguimiento } from '../servicios/seguimiento.js';

function obtenerFechaLocalHoy(): string {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

export function crearRutasSeguimiento(db: Database): Router {
  const router = Router();
  const servicio = new ServicioSeguimiento(db);

  // Helper para obtener rol activo de la cookie de demostración
  const obtenerRol = (req: Request): string => {
    return req.cookies?.rol || 'Gestor/a UGCO';
  };

  // GET / - Tablero por las 8 etapas
  router.get('/', (req: Request, res: Response) => {
    const fechaRef = (req.query.fechaReferencia as string) || undefined;
    const tablero = servicio.obtenerTablero(fechaRef);
    const rolActual = obtenerRol(req);

    res.render('tablero', {
      tablero,
      rolActual,
      fechaReferencia: fechaRef,
      titulo: 'Tablero de Trazabilidad Oncológica por Etapas'
    });
  });

  // GET /casos/:numeroCaso - Ficha del caso y línea de tiempo clínica
  router.get('/casos/:numeroCaso', (req: Request, res: Response) => {
    const { numeroCaso } = req.params;
    const fechaRef = (req.query.fechaReferencia as string) || undefined;
    const caso = servicio.obtenerFichaCaso(String(numeroCaso), fechaRef);

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
    const hoy = obtenerFechaLocalHoy();

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
        hoy: fechaOcurrencia || obtenerFechaLocalHoy(),
        error: resultado.error,
        titulo: `Error al registrar hito — ${numeroCaso}`
      });
    }

    res.redirect(`/casos/${encodeURIComponent(String(numeroCaso))}?exito=Hito+registrado+exitosamente`);
  });

  // POST /casos/:numeroCaso/bitacora - Registro de interacción en bitácora (HU-03 / CU-11 / RF-03)
  router.post('/casos/:numeroCaso/bitacora', (req: Request, res: Response) => {
    const rolActual = obtenerRol(req);
    if (rolActual !== 'Gestor/a UGCO' && rolActual !== 'TENS UGCO') {
      return res.status(403).send('Operación no autorizada: Solo Gestor/a UGCO y TENS UGCO pueden registrar interacciones en la bitácora.');
    }

    const { numeroCaso } = req.params;
    const {
      puntoContactoNormado,
      fechaContacto,
      canalContacto,
      interlocutor,
      motivoContacto,
      resumenInteraccion,
      acuerdosEstablecidos,
      estadoContacto,
      fechaProximoContacto,
      objetivoProximoContacto
    } = req.body;

    try {
      servicio.registrarInteraccion(
        String(numeroCaso),
        {
          puntoContactoNormado,
          fechaContacto,
          canalContacto,
          interlocutor,
          motivoContacto,
          resumenInteraccion,
          acuerdosEstablecidos,
          estadoContacto,
          fechaProximoContacto,
          objetivoProximoContacto
        },
        rolActual,
        rolActual
      );

      return res.redirect(`/casos/${encodeURIComponent(String(numeroCaso))}?exito=${encodeURIComponent('Interacción registrada exitosamente en la bitácora.')}`);
    } catch (error: any) {
      if (req.headers.accept?.includes('application/json')) {
        return res.status(error.status || 400).json({ error: error.message });
      }
      return res.status(error.status || 400).send(error.message);
    }
  });

  // POST /casos/:numeroCaso/bitacora/:identificador/adenda - Registro de adenda inmutable (HU-03 / HU-03-ESC-04)
  router.post('/casos/:numeroCaso/bitacora/:identificador/adenda', (req: Request, res: Response) => {
    const rolActual = obtenerRol(req);
    if (rolActual !== 'Gestor/a UGCO' && rolActual !== 'TENS UGCO') {
      return res.status(403).send('Operación no autorizada: Solo Gestor/a UGCO y TENS UGCO pueden registrar adendas en la bitácora.');
    }

    const { numeroCaso, identificador } = req.params;
    const { motivoEnmienda, resumenCorreccion, acuerdosEstablecidos } = req.body;

    try {
      servicio.registrarAdenda(
        String(numeroCaso),
        String(identificador),
        {
          motivoEnmienda,
          resumenCorreccion,
          acuerdosEstablecidos
        },
        rolActual,
        rolActual
      );

      return res.redirect(`/casos/${encodeURIComponent(String(numeroCaso))}?exito=${encodeURIComponent('Adenda inmutable registrada exitosamente.')}`);
    } catch (error: any) {
      if (req.headers.accept?.includes('application/json')) {
        return res.status(error.status || 400).json({ error: error.message });
      }
      return res.status(error.status || 400).send(error.message);
    }
  });

  // DELETE /casos/:numeroCaso/bitacora/:identificador - Rechazo de eliminación física (Inmutabilidad HU-03-CA6)
  router.delete('/casos/:numeroCaso/bitacora/:identificador', (_req: Request, res: Response) => {
    return res.status(405).send('Operación no permitida: las entradas de bitácora son inmutables y no admiten eliminación física.');
  });

  // POST /rol - Selector de rol de demostración (Gestora / TENS / Médico)
  router.post('/rol', (req: Request, res: Response) => {
    let nuevoRol = 'Gestor/a UGCO';
    if (req.body.rol === 'medico') {
      nuevoRol = 'Médico tratante';
    } else if (req.body.rol === 'tens') {
      nuevoRol = 'TENS UGCO';
    }
    res.cookie('rol', nuevoRol, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
    res.redirect(req.headers.referer || '/');
  });

  return router;
}

