// src/rutas/examenes.ts - Rutas HTTP para consolidación de exámenes diagnósticos y compra externa (HU-05 / RF-05)
import { Router, type Request, type Response } from 'express';
import type { Database } from 'better-sqlite3';
import multer from 'multer';
import { ServicioExamenes } from '../servicios/examenes.js';
import { RepositorioOncologico } from '../dominio/repositorios.js';

export function crearRutasExamenes(db: Database, servicioPersonalizado?: ServicioExamenes): Router {
  const router = Router();
  const servicio = servicioPersonalizado || new ServicioExamenes(db);
  const repo = new RepositorioOncologico(db);

  // Configuración de multer en memoria para validar y delegar persistencia al servicio
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: process.env.LIMITE_ADJUNTO_MB
        ? Number(process.env.LIMITE_ADJUNTO_MB) * 1024 * 1024
        : undefined
    }
  });

  const obtenerRol = (req: Request): string => {
    return req.cookies?.rol || 'Gestor/a UGCO';
  };

  // POST /casos/:numeroCaso/examenes/consultar - Sincronizar e indexar exámenes de LIS y PACS (DSS-01)
  router.post('/casos/:numeroCaso/examenes/consultar', (req: Request, res: Response) => {
    const rolActual = obtenerRol(req);
    const numeroCaso = String(req.params.numeroCaso);

    try {
      const resultado = servicio.consultarEIncorporarExamenes(numeroCaso);
      let mensaje = `Consulta completada: ${resultado.incorporados} examen(es) incorporado(s).`;
      if (resultado.hallazgosCriticos > 0) {
        mensaje += ` ¡Se detectaron ${resultado.hallazgosCriticos} hallazgo(s) crítico(s) con alerta prioritaria!`;
      }
      if (resultado.discrepanciasIdentidad > 0) {
        mensaje += ` Se derivaron ${resultado.discrepanciasIdentidad} informe(s) a la bandeja de excepciones por discrepancia de RUN.`;
      }
      if (resultado.pendientesEnOrigen > 0) {
        mensaje += ` ${resultado.pendientesEnOrigen} informe(s) permanecen pendientes de validación en el origen.`;
      }

      if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.json({ ok: true, resultado, mensaje });
      }

      return res.redirect(`/casos/${encodeURIComponent(numeroCaso)}?exito=${encodeURIComponent(mensaje)}`);
    } catch (error: any) {
      if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.status(400).json({ ok: false, error: error.message });
      }
      return res.redirect(`/casos/${encodeURIComponent(numeroCaso)}?error=${encodeURIComponent(error.message)}`);
    }
  });

  // GET /casos/:numeroCaso/examenes/:id/informe.pdf - Descarga/visualización de copia PDF (DSS-01 / CA4)
  router.get('/casos/:numeroCaso/examenes/:id/informe.pdf', (req: Request, res: Response) => {
    const estudioId = parseInt(String(req.params.id), 10);

    try {
      const { rutaAbsoluta, nombreDescarga } = servicio.obtenerRutaPdfEstudio(estudioId);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="${nombreDescarga}"`);
      return res.sendFile(rutaAbsoluta);
    } catch (error: any) {
      return res.status(404).send(error.message);
    }
  });

  // POST /casos/:numeroCaso/examenes/:id/adjunto - Adjunto manual de informe de compra externa (HU-05-ESC-05)
  router.post(
    '/casos/:numeroCaso/examenes/:id/adjunto',
    upload.single('archivo'),
    (req: Request, res: Response) => {
      const rolActual = obtenerRol(req);
      if (rolActual !== 'Gestor/a UGCO') {
        return res.status(403).send('Operación no autorizada: Solo el rol Gestor/a UGCO puede adjuntar informes externos.');
      }

      const numeroCaso = String(req.params.numeroCaso);
      const ordenId = parseInt(String(req.params.id), 10);

      if (!req.file) {
        return res.redirect(
          `/casos/${encodeURIComponent(numeroCaso)}?error=${encodeURIComponent('Debe seleccionar un archivo PDF para adjuntar.')}`
        );
      }

      try {
        servicio.adjuntarInformeExterno(numeroCaso, ordenId, {
          buffer: req.file.buffer,
          originalname: req.file.originalname,
          mimetype: req.file.mimetype,
          size: req.file.size
        });

        const exitoMsg = 'Informe de compra externa incorporado con éxito en formato PDF.';
        if (req.headers.accept && req.headers.accept.includes('application/json')) {
          return res.json({ ok: true, mensaje: exitoMsg });
        }

        return res.redirect(`/casos/${encodeURIComponent(numeroCaso)}?exito=${encodeURIComponent(exitoMsg)}`);
      } catch (error: any) {
        if (req.headers.accept && req.headers.accept.includes('application/json')) {
          return res.status(400).json({ ok: false, error: error.message });
        }
        return res.redirect(`/casos/${encodeURIComponent(numeroCaso)}?error=${encodeURIComponent(error.message)}`);
      }
    }
  );

  // GET /excepciones - Bandeja de excepciones por discrepancias de RUN (HU-05-ESC-03 / D1)
  router.get('/excepciones', (req: Request, res: Response) => {
    const rolActual = obtenerRol(req);
    const excepciones = repo.listarBandejaExcepciones();

    res.render('excepciones', {
      excepciones,
      rolActual,
      titulo: 'Bandeja de Excepciones de Identificación'
    });
  });

  return router;
}
