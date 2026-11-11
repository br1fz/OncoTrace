// src/servicios/evaluacion.ts - Lógica de negocio y casos de uso para CU-10 (HU-02)
import type { Database } from 'better-sqlite3';
import {
  esEcogValido,
  esZaritValido,
  calcularNivelVulnerabilidad,
  type EvaluacionMultidimensional,
  type DominioValoracion,
  type CuidadorAutorizado,
  type NivelVulnerabilidad,
  type ResultadoCalculoVulnerabilidad
} from '../dominio/evaluacion.js';
import { RepositorioOncologico } from '../dominio/repositorios.js';

export interface RegistrarEvaluacionInput {
  ecog?: unknown;
  descripcionFuncional?: string;
  requiereDerivacionFuncional?: boolean;
  especialidadDerivadaFuncional?: string;

  puntajePsicoemocional?: unknown;
  descripcionPsicoemocional?: string;
  requiereDerivacionPsico?: boolean;
  especialidadPsico?: string;

  tieneCuidador?: boolean | string;
  runCuidador?: string;
  nombreCuidador?: string;
  parentescoCuidador?: string;
  telefonoCuidador?: string;
  escalaZarit?: unknown;
  descripcionCuidador?: string;
  requiereDerivacionCuidador?: boolean;
  especialidadDerivadaCuidador?: string;

  nivelSocioeconomico?: 'Bajo' | 'Medio' | 'Alto';
  previsionSalud?: string;
  situacionLaboral?: string;
  descripcionSocioeconomica?: string;
  requiereDerivacionSocial?: boolean;
  especialidadSocial?: string;

  descripcionEspiritual?: string;
  requiereDerivacionEspiritual?: boolean;
  especialidadEspiritual?: string;

  descripcionComprension?: string;
  requiereDerivacionComprension?: boolean;
  especialidadComprension?: string;

  profesionalEvaluador?: string;
}

export interface ResultadoRegistroEvaluacion {
  ok: boolean;
  error?: string;
  evaluacionId?: number;
  nivelVulnerabilidad?: NivelVulnerabilidad;
  calculo?: ResultadoCalculoVulnerabilidad;
}

export class ServicioEvaluacion {
  private repo: RepositorioOncologico;

  constructor(private db: Database) {
    this.repo = new RepositorioOncologico(db);
  }

  registrarEvaluacion(
    numeroCaso: string,
    input: RegistrarEvaluacionInput,
    rolActual: string
  ): ResultadoRegistroEvaluacion {
    // 1. Autorización de rol (CU-10: Gestor/a UGCO)
    if (rolActual !== 'Gestor/a UGCO') {
      return {
        ok: false,
        error: 'Operación no autorizada: Solo la Gestora UGCO puede aplicar y registrar la pauta de valoración multidimensional.'
      };
    }

    // 2. Localizar caso
    const caso = this.repo.obtenerCasoPorNumero(numeroCaso);
    if (!caso || !caso.id) {
      return {
        ok: false,
        error: `No se encontró el caso oncológico '${numeroCaso}'.`
      };
    }

    // 3. Validación obligatoria de ECOG (HU-02-ESC-03 / HU-02-CA1)
    const ecogNum = typeof input.ecog === 'string' && input.ecog.trim() !== ''
      ? Number(input.ecog)
      : input.ecog;

    if (!esEcogValido(ecogNum)) {
      return {
        ok: false,
        error: 'El valor de rendimiento funcional ECOG (0-4) es un campo clínico obligatorio.'
      };
    }

    // 4. Procesar valores de los dominios
    const puntajePsico = typeof input.puntajePsicoemocional === 'string' && input.puntajePsicoemocional.trim() !== ''
      ? Number(input.puntajePsicoemocional)
      : Number(input.puntajePsicoemocional ?? 0);

    const tieneCuidadorBool = input.tieneCuidador === true || input.tieneCuidador === 'true' || input.tieneCuidador === 'on';

    let zaritNum: number | undefined = undefined;
    if (tieneCuidadorBool && input.escalaZarit !== undefined && input.escalaZarit !== null && input.escalaZarit !== '') {
      const z = Number(input.escalaZarit);
      if (!esZaritValido(z)) {
        return {
          ok: false,
          error: 'El puntaje de la escala Zarit debe ser un número entero entre 0 y 88.'
        };
      }
      zaritNum = z;
    }

    const nivelSocio: 'Bajo' | 'Medio' | 'Alto' = input.nivelSocioeconomico === 'Alto'
      ? 'Alto'
      : input.nivelSocioeconomico === 'Medio'
        ? 'Medio'
        : 'Bajo';

    // 5. Cálculo automático de índice de vulnerabilidad global (D1 / HU-02-CA6)
    const calculo = calcularNivelVulnerabilidad(
      ecogNum,
      nivelSocio,
      tieneCuidadorBool,
      zaritNum,
      puntajePsico
    );

    // 6. Tratamiento de Zarit > 56 y sobrecarga severa (D4 / HU-02-ESC-02)
    const haySobrecargaSevera = tieneCuidadorBool && typeof zaritNum === 'number' && zaritNum > 56;

    const requiereDerivacionCuidadorFinal = haySobrecargaSevera
      ? true
      : Boolean(input.requiereDerivacionCuidador);

    const especialidadCuidadorFinal = haySobrecargaSevera
      ? (input.especialidadDerivadaCuidador?.trim() || 'Servicio Social')
      : input.especialidadDerivadaCuidador?.trim();

    // 7. Preparar dominios de valoración normados (D6)
    const dominios: DominioValoracion[] = [
      {
        tipoDominio: 'CLINICO_FUNCIONAL',
        descripcionHallazgo: input.descripcionFuncional?.trim() || `Rendimiento funcional ECOG ${ecogNum}`,
        requiereDerivacion: Boolean(input.requiereDerivacionFuncional),
        especialidadDerivada: input.especialidadDerivadaFuncional?.trim()
      },
      {
        tipoDominio: 'PSICOEMOCIONAL',
        descripcionHallazgo: input.descripcionPsicoemocional?.trim() || (puntajePsico >= 2 ? 'Afectación psicoemocional crítica pesquisada' : 'Sin alteración emocional severa'),
        requiereDerivacion: Boolean(input.requiereDerivacionPsico || puntajePsico >= 2),
        especialidadDerivada: input.especialidadPsico?.trim() || (puntajePsico >= 2 ? 'Psicooncología' : undefined)
      },
      {
        tipoDominio: 'CUIDADOR',
        descripcionHallazgo: input.descripcionCuidador?.trim() || (tieneCuidadorBool
          ? `Cuidador: ${input.nombreCuidador || 'Identificado'}, Zarit: ${zaritNum !== undefined ? zaritNum : 'No evaluado'}`
          : 'Paciente sin cuidador principal / red de soporte primaria'),
        requiereDerivacion: requiereDerivacionCuidadorFinal,
        especialidadDerivada: especialidadCuidadorFinal
      },
      {
        tipoDominio: 'SOCIOECONOMICO',
        descripcionHallazgo: input.descripcionSocioeconomica?.trim() || `Vulnerabilidad socioeconómica: ${nivelSocio}. Previsión: ${input.previsionSalud || 'FONASA'}. Laboral: ${input.situacionLaboral || 'Activo'}`,
        requiereDerivacion: Boolean(input.requiereDerivacionSocial || nivelSocio === 'Alto'),
        especialidadDerivada: input.especialidadSocial?.trim() || (nivelSocio === 'Alto' ? 'Servicio Social' : undefined),
        previsionSalud: input.previsionSalud?.trim() || 'FONASA',
        situacionLaboral: input.situacionLaboral?.trim() || 'Activo'
      },
      {
        tipoDominio: 'ESPIRITUAL',
        descripcionHallazgo: input.descripcionEspiritual?.trim() || 'Creencias y soporte espiritual congruentes con el plan de cuidados',
        requiereDerivacion: Boolean(input.requiereDerivacionEspiritual),
        especialidadDerivada: input.especialidadEspiritual?.trim()
      },
      {
        tipoDominio: 'COMPRENSION_DIAGNOSTICA',
        descripcionHallazgo: input.descripcionComprension?.trim() || 'Comprensión adecuada de la patología y alternativas terapéuticas',
        requiereDerivacion: Boolean(input.requiereDerivacionComprension),
        especialidadDerivada: input.especialidadComprension?.trim()
      }
    ];

    // 8. Preparar CuidadorAutorizado si corresponde (D3)
    let cuidador: CuidadorAutorizado | undefined = undefined;
    if (tieneCuidadorBool && input.nombreCuidador?.trim()) {
      cuidador = {
        pacienteId: caso.pacienteId,
        runCuidador: input.runCuidador?.trim() || 'Sin RUN registrado',
        nombreCompleto: input.nombreCuidador.trim(),
        parentesco: input.parentescoCuidador?.trim() || 'Familiar',
        telefonoContacto: input.telefonoCuidador?.trim() || 'Sin teléfono',
        autorizacionVigente: true,
        fechaRegistroAutorizacion: new Date().toISOString()
      };
    }

    // 9. Persistir evaluación de manera inmutable (D5)
    const fechaEvaluacionIso = new Date().toISOString();
    const identificador = `EVAL-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 900 + 100)}`;

    const evaluacion: EvaluacionMultidimensional = {
      casoId: caso.id,
      identificador,
      fechaEvaluacion: fechaEvaluacionIso,
      puntajeClinicoFuncional: ecogNum,
      puntajePsicoemocional: puntajePsico,
      escalaZaritCuidador: zaritNum,
      nivelVulnerabilidad: calculo.nivelVulnerabilidad,
      profesionalEvaluador: input.profesionalEvaluador?.trim() || 'Gestor/a UGCO'
    };

    let evaluacionId = 0;
    const tx = this.db.transaction(() => {
      evaluacionId = this.repo.crearEvaluacion(evaluacion, dominios, cuidador);

      // Si Zarit > 56, generar automáticamente la AlertaSeguimiento para Servicio Social (D4 / HU-02-ESC-02)
      if (haySobrecargaSevera) {
        this.repo.crearAlerta({
          casoId: caso.id!,
          tipo: 'Sobrecarga de cuidador',
          prioridad: 'Alta',
          estado: 'Pendiente',
          fechaGeneracion: fechaEvaluacionIso
        });
      }
    });

    tx();

    return {
      ok: true,
      evaluacionId,
      nivelVulnerabilidad: calculo.nivelVulnerabilidad,
      calculo
    };
  }
}
