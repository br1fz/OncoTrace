// src/rutas/alertas.ts - Rutas HTTP para gestión y seguimiento de alertas (CU-06 / HU-04)
import { Router, type Request, type Response } from 'express';
import type { Database } from 'better-sqlite3';
import { ServicioAlertas } from '../servicios/alertas.js';

export function crearRutasAlertas(db: Database): Router {
  const router = Router();
  const servicioAlertas = new ServicioAlertas(db);

  const obtenerRol = (req: Request): string => {
    return req.cookies?.rol || 'Gestor/a UGCO';
  };

  // GET /alertas/exportar.csv - Descarga de reporte consolidado CSV (HU-04-ESC-08)
  router.get('/alertas/exportar.csv', (req: Request, res: Response) => {
    const rolActual = obtenerRol(req);
    if (rolActual !== 'Gestor/a UGCO') {
      return res.status(403).send('Operación no autorizada: Solo el rol Gestor/a UGCO puede exportar el reporte consolidado.');
    }

    const fechaRef = (req.query.fechaReferencia as string) || undefined;
    const ref = fechaRef ? fechaRef.slice(0, 10) : new Date().toISOString().slice(0, 10);

    try {
      const csv = servicioAlertas.exportarCsv(ref, rolActual);
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="alertas-vigentes-${ref}.csv"`);
      return res.status(200).send(csv);
    } catch (error: any) {
      return res.status(error.status || 500).send(error.message);
    }
  });

  // GET /alertas - Panel general de alertas vigentes
  router.get('/alertas', (req: Request, res: Response) => {
    const rolActual = obtenerRol(req);
    const fechaRef = (req.query.fechaReferencia as string) || undefined;
    const mensaje = (req.query.mensaje as string) || undefined;
    const exito = (req.query.exito as string) || undefined;
    const alertas = servicioAlertas.listarAlertasVigentes(fechaRef);

    res.render('alertas', {
      alertas,
      rolActual,
      fechaReferencia: fechaRef || new Date().toISOString().slice(0, 10),
      mensaje,
      exito,
      titulo: 'Panel de Alertas de Seguimiento'
    });
  });

  // POST /alertas/evaluar - Evaluación explícita de umbrales preventivos e inactividad (HU-04-ESC-09)
  router.post('/alertas/evaluar', (req: Request, res: Response) => {
    const rolActual = obtenerRol(req);
    if (rolActual !== 'Gestor/a UGCO') {
      return res.status(403).send('Operación no autorizada: Solo el rol Gestor/a UGCO puede evaluar alertas.');
    }

    const fechaRef = (req.body.fechaReferencia as string) || (req.query.fechaReferencia as string) || undefined;

    try {
      const resultado = servicioAlertas.evaluarAlertas(fechaRef, rolActual);
      const msg = `Evaluación completada: ${resultado.alertasGeneradas} alertas nuevas.`;
      if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.json({ ok: true, resultado, mensaje: msg });
      }
      const refParam = fechaRef ? `&fechaReferencia=${encodeURIComponent(fechaRef)}` : '';
      return res.redirect(`/alertas?mensaje=${encodeURIComponent(msg)}${refParam}`);
    } catch (error: any) {
      return res.status(error.status || 500).send(error.message);
    }
  });

  // POST /alertas/:id/gestion - Registrar gestión en bitácora (HU-04-ESC-05)
  router.post('/alertas/:id/gestion', (req: Request, res: Response) => {
    const rolActual = obtenerRol(req);
    if (rolActual !== 'Gestor/a UGCO') {
      return res.status(403).send('Operación no autorizada: Solo el rol Gestor/a UGCO puede registrar gestión de alertas.');
    }

    const id = parseInt(String(req.params.id), 10);
    const { resumenInteraccion, canalContacto, interlocutor, motivoContacto, acuerdosEstablecidos } = req.body;

    if (!resumenInteraccion || !resumenInteraccion.trim()) {
      return res.status(400).send('El resumen de la interacción es obligatorio.');
    }

    try {
      servicioAlertas.registrarGestion(id, {
        resumenInteraccion,
        canalContacto,
        interlocutor,
        motivoContacto,
        acuerdosEstablecidos,
        responsableRegistro: rolActual
      }, rolActual);

      return res.redirect(`/alertas?exito=${encodeURIComponent('Alerta quedó En gestión y permanece disponible para seguimiento.')}`);
    } catch (error: any) {
      return res.status(error.status || 500).send(error.message);
    }
  });

  // POST /alertas/:id/cumplimiento - Registrar hito de cumplimiento o resolución (HU-04-ESC-06)
  router.post('/alertas/:id/cumplimiento', (req: Request, res: Response) => {
    const rolActual = obtenerRol(req);
    if (rolActual !== 'Gestor/a UGCO') {
      return res.status(403).send('Operación no autorizada: Solo el rol Gestor/a UGCO puede acreditar cumplimiento o resolver alertas.');
    }

    const id = parseInt(String(req.params.id), 10);
    const { tipoHito, fechaOcurrencia, responsable, rolResponsable } = req.body;

    if (!tipoHito || !tipoHito.trim() || !fechaOcurrencia || !fechaOcurrencia.trim() || !responsable || !responsable.trim()) {
      return res.status(400).send('Faltan datos obligatorios para acreditar el cumplimiento.');
    }

    try {
      servicioAlertas.registrarCumplimiento(id, {
        tipoHito,
        fechaOcurrencia,
        responsable,
        rolResponsable: rolResponsable || rolActual
      }, rolActual);

      return res.redirect(`/alertas?exito=${encodeURIComponent('Alerta resuelta exitosamente. Permanecerá visible en el panel general durante 14 horas.')}`);
    } catch (error: any) {
      return res.status(error.status || 500).send(error.message);
    }
  });

  // POST /alertas/:id/cierre - Cierre de alerta por causa documentada (HU-04-ESC-07)
  router.post('/alertas/:id/cierre', (req: Request, res: Response) => {
    const rolActual = obtenerRol(req);
    if (rolActual !== 'Gestor/a UGCO') {
      return res.status(403).send('Operación no autorizada: Solo el rol Gestor/a UGCO puede cerrar alertas por causa documentada.');
    }

    const id = parseInt(String(req.params.id), 10);
    const { motivoCierre, fechaCierre, responsableCierre } = req.body;

    if (!motivoCierre || !motivoCierre.trim() || !fechaCierre || !fechaCierre.trim() || !responsableCierre || !responsableCierre.trim()) {
      return res.status(400).send('El motivo, la fecha y el responsable del cierre son obligatorios.');
    }

    try {
      servicioAlertas.cerrarAlerta(id, {
        motivoCierre,
        fechaCierre,
        responsableCierre
      }, rolActual);

      return res.redirect(`/alertas?exito=${encodeURIComponent('Alerta cerrada por causa documentada (No aplica).')}`);
    } catch (error: any) {
      return res.status(error.status || 500).send(error.message);
    }
  });

  return router;
}
