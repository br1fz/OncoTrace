// src/rutas/evaluacion.ts - Rutas HTTP para valoración multidimensional (CU-10 / HU-02)
import { Router, type Request, type Response } from 'express';
import type { Database } from 'better-sqlite3';
import { ServicioSeguimiento } from '../servicios/seguimiento.js';
import { ServicioEvaluacion } from '../servicios/evaluacion.js';

export function crearRutasEvaluacion(db: Database): Router {
  const router = Router();
  const servicioSeguimiento = new ServicioSeguimiento(db);
  const servicioEvaluacion = new ServicioEvaluacion(db);

  const obtenerRol = (req: Request): string => {
    return req.cookies?.rol || 'Gestor/a UGCO';
  };

  // GET /casos/:numeroCaso/evaluaciones/nueva - Formulario de valoración por 6 dominios
  router.get('/casos/:numeroCaso/evaluaciones/nueva', (req: Request, res: Response) => {
    const { numeroCaso } = req.params;
    const caso = servicioSeguimiento.obtenerFichaCaso(String(numeroCaso));

    if (!caso) {
      return res.status(404).render('404', {
        mensaje: `No se encontró el caso oncológico '${numeroCaso}'.`,
        rolActual: obtenerRol(req),
        titulo: 'Caso no encontrado'
      });
    }

    const rolActual = obtenerRol(req);

    res.render('evaluacion-nueva', {
      caso,
      rolActual,
      error: undefined,
      datos: {},
      titulo: `Pauta de Valoración Multidimensional — ${caso.numeroCaso}`
    });
  });

  // POST /casos/:numeroCaso/evaluaciones - Registro de evaluación y cálculo de vulnerabilidad
  router.post('/casos/:numeroCaso/evaluaciones', (req: Request, res: Response) => {
    const { numeroCaso } = req.params;
    const rolActual = obtenerRol(req);

    // Verificación de rol: Médico tratante no puede registrar pauta de valoración (CU-10)
    if (rolActual !== 'Gestor/a UGCO') {
      return res.status(403).render('evaluacion-nueva', {
        caso: servicioSeguimiento.obtenerFichaCaso(String(numeroCaso)) || { numeroCaso, nombreCompleto: '', run: '' },
        rolActual,
        error: 'Operación no autorizada: Solo la Gestora UGCO puede aplicar y registrar la pauta de valoración multidimensional.',
        datos: req.body,
        titulo: `Error de Autorización — ${numeroCaso}`
      });
    }

    const {
      ecog,
      descripcionFuncional,
      requiereDerivacionFuncional,
      especialidadDerivadaFuncional,
      puntajePsicoemocional,
      descripcionPsicoemocional,
      requiereDerivacionPsico,
      especialidadPsico,
      tieneCuidador,
      runCuidador,
      nombreCuidador,
      parentescoCuidador,
      telefonoCuidador,
      escalaZarit,
      descripcionCuidador,
      requiereDerivacionCuidador,
      especialidadDerivadaCuidador,
      nivelSocioeconomico,
      previsionSalud,
      situacionLaboral,
      descripcionSocioeconomica,
      requiereDerivacionSocial,
      especialidadSocial,
      descripcionEspiritual,
      requiereDerivacionEspiritual,
      especialidadEspiritual,
      descripcionComprension,
      requiereDerivacionComprension,
      especialidadComprension,
      profesionalEvaluador
    } = req.body;

    const resultado = servicioEvaluacion.registrarEvaluacion(
      String(numeroCaso),
      {
        ecog: ecog !== undefined && ecog !== '' ? Number(ecog) : undefined,
        descripcionFuncional,
        requiereDerivacionFuncional: requiereDerivacionFuncional === 'on' || requiereDerivacionFuncional === true,
        especialidadDerivadaFuncional,
        puntajePsicoemocional: puntajePsicoemocional !== undefined && puntajePsicoemocional !== '' ? Number(puntajePsicoemocional) : 0,
        descripcionPsicoemocional,
        requiereDerivacionPsico: requiereDerivacionPsico === 'on' || requiereDerivacionPsico === true,
        especialidadPsico,
        tieneCuidador: tieneCuidador === 'true' || tieneCuidador === 'on' || tieneCuidador === true,
        runCuidador,
        nombreCuidador,
        parentescoCuidador,
        telefonoCuidador,
        escalaZarit: escalaZarit !== undefined && escalaZarit !== '' ? Number(escalaZarit) : undefined,
        descripcionCuidador,
        requiereDerivacionCuidador: requiereDerivacionCuidador === 'on' || requiereDerivacionCuidador === true,
        especialidadDerivadaCuidador,
        nivelSocioeconomico,
        previsionSalud,
        situacionLaboral,
        descripcionSocioeconomica,
        requiereDerivacionSocial: requiereDerivacionSocial === 'on' || requiereDerivacionSocial === true,
        especialidadSocial,
        descripcionEspiritual,
        requiereDerivacionEspiritual: requiereDerivacionEspiritual === 'on' || requiereDerivacionEspiritual === true,
        especialidadEspiritual,
        descripcionComprension,
        requiereDerivacionComprension: requiereDerivacionComprension === 'on' || requiereDerivacionComprension === true,
        especialidadComprension,
        profesionalEvaluador: profesionalEvaluador || rolActual
      },
      rolActual
    );

    if (!resultado.ok) {
      const caso = servicioSeguimiento.obtenerFichaCaso(String(numeroCaso));
      return res.status(400).render('evaluacion-nueva', {
        caso: caso || { numeroCaso, nombreCompleto: '', run: '' },
        rolActual,
        error: resultado.error,
        datos: req.body,
        titulo: `Error en Evaluación — ${numeroCaso}`
      });
    }

    res.redirect(`/casos/${encodeURIComponent(String(numeroCaso))}?exito=Evaluaci%C3%B3n+multidimensional+registrada+exitosamente.+Nivel+de+vulnerabilidad:+${resultado.nivelVulnerabilidad}`);
  });

  return router;
}
