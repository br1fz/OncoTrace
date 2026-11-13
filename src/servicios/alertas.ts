// src/servicios/alertas.ts - Motor de evaluación de alertas preventivas GES e inactividad (HU-04 / RF-04)
import type { Database } from 'better-sqlite3';
import { randomUUID } from 'node:crypto';
import { RepositorioOncologico } from '../dominio/repositorios.js';
import {
  diasHabilesRestantes,
  diasCorridosEntre,
  sumarDiasHabiles
} from '../dominio/calendario-ges.js';
import {
  mapearHitoAPuntoNormado,
  type AlertaConDetalle,
  type ResultadoEvaluacionAlertas,
  type RegistrarGestionInput,
  type RegistrarCumplimientoInput,
  type CerrarAlertaInput
} from '../dominio/alertas.js';

export class ServicioAlertas {
  private repo: RepositorioOncologico;

  constructor(private db: Database) {
    this.repo = new RepositorioOncologico(db);
  }

  validarRolGestora(rol?: string): void {
    if (rol !== 'Gestor/a UGCO') {
      const error: any = new Error('Acceso denegado: solo el rol Gestor/a UGCO está autorizado para esta operación.');
      error.codigo = 'ROL_NO_AUTORIZADO';
      error.status = 403;
      throw error;
    }
  }

  evaluarAlertas(fechaReferencia?: string, rolActual?: string): ResultadoEvaluacionAlertas {
    if (rolActual !== undefined) {
      this.validarRolGestora(rolActual);
    }

    const ref = fechaReferencia ? fechaReferencia.slice(0, 10) : new Date().toISOString().slice(0, 10);
    let totalEvaluadas = 0;
    let alertasGesGeneradas = 0;
    let alertasInactividadGeneradas = 0;
    let alertasPuntoPendienteGeneradas = 0;

    const tx = this.db.transaction(() => {
      // 1. Garantías GES pendientes (HU-04-ESC-01, ESC-02)
      const garantiasPendientes = this.repo.listarGarantiasPendientes();
      for (const g of garantiasPendientes) {
        totalEvaluadas++;
        const diasRestantes = diasHabilesRestantes(g.fechaLimite, ref);
        // Umbral: <= 5 días hábiles
        if (diasRestantes <= 5) {
          if (!this.repo.tieneAlertaActivaGarantia(g.id!)) {
            const fechaGen = `${ref}T08:00:00Z`;
            this.repo.crearAlerta({
              casoId: g.casoId,
              identificador: `ALR-${randomUUID().slice(0, 8).toUpperCase()}`,
              tipo: 'Vencimiento de plazo GES',
              prioridad: 'Alta',
              estado: 'Pendiente',
              fechaGeneracion: fechaGen,
              garantiaId: g.id
            });
            alertasGesGeneradas++;
          }
        }
      }

      // 2. Detección de inactividad asistencial prolongada (HU-04-ESC-03, ESC-04)
      const casos = this.db.prepare('SELECT id, numero_caso as numeroCaso FROM caso_oncologico').all() as any[];
      for (const c of casos) {
        totalEvaluadas++;
        const ultimoRegistro = this.repo.obtenerFechaUltimoRegistroAsistencial(c.id);
        if (ultimoRegistro) {
          const diasInactivo = diasCorridosEntre(ultimoRegistro, ref);
          // Umbral: > 15 días corridos
          if (diasInactivo > 15) {
            if (!this.repo.tieneAlertaActivaInactividad(c.id)) {
              const fechaGen = `${ref}T08:00:00Z`;
              this.repo.crearAlerta({
                casoId: c.id,
                identificador: `ALR-${randomUUID().slice(0, 8).toUpperCase()}`,
                tipo: 'Riesgo de Inactividad/Abandono',
                prioridad: 'Alta',
                estado: 'Pendiente',
                fechaGeneracion: fechaGen
              });
              alertasInactividadGeneradas++;
            }
          }
        }
      }

      // 3. Puntos de contacto normados pendientes > 48h hábiles (HU-03-ESC-02)
      for (const c of casos) {
        const hitos = this.repo.listarHitosPorCasoId(c.id);
        for (const h of hitos) {
          totalEvaluadas++;
          const puntoNormado = mapearHitoAPuntoNormado(h.tipo);
          if (!puntoNormado) continue;

          const umbral = sumarDiasHabiles(h.fechaOcurrencia.slice(0, 10), 2);
          if (ref > umbral) {
            const yaCumplido = this.repo.existeEntradaDelPunto(c.id, puntoNormado, h.fechaOcurrencia);
            if (!yaCumplido) {
              const tieneAlerta = this.repo.existeAlertaActivaPorHitoOrigen(h.id!);
              if (!tieneAlerta) {
                const fechaGen = `${ref}T08:00:00Z`;
                this.repo.crearAlerta({
                  casoId: c.id,
                  identificador: `ALR-${randomUUID().slice(0, 8).toUpperCase()}`,
                  tipo: 'Punto de contacto pendiente',
                  prioridad: 'Alta',
                  estado: 'Pendiente',
                  fechaGeneracion: fechaGen,
                  hitoOrigenId: h.id
                });
                alertasPuntoPendienteGeneradas++;
              }
            }
          }
        }
      }
    });

    tx();

    return {
      totalEvaluadas,
      alertasGeneradas: alertasGesGeneradas + alertasInactividadGeneradas + alertasPuntoPendienteGeneradas,
      alertasGesGeneradas,
      alertasInactividadGeneradas,
      alertasPuntoPendienteGeneradas,
      fechaReferencia: ref
    };
  }

  evaluarPuntosPendientes(referencia?: string): number {
    const ref = referencia ? referencia.slice(0, 10) : new Date().toISOString().slice(0, 10);
    let alertasPuntoPendienteGeneradas = 0;

    const tx = this.db.transaction(() => {
      const casos = this.db.prepare('SELECT id, numero_caso as numeroCaso FROM caso_oncologico').all() as any[];
      for (const c of casos) {
        const hitos = this.repo.listarHitosPorCasoId(c.id);
        for (const h of hitos) {
          const puntoNormado = mapearHitoAPuntoNormado(h.tipo);
          if (!puntoNormado) continue;

          const umbral = sumarDiasHabiles(h.fechaOcurrencia.slice(0, 10), 2);
          if (ref > umbral) {
            const yaCumplido = this.repo.existeEntradaDelPunto(c.id, puntoNormado, h.fechaOcurrencia);
            if (!yaCumplido) {
              const tieneAlerta = this.repo.existeAlertaActivaPorHitoOrigen(h.id!);
              if (!tieneAlerta) {
                const fechaGen = `${ref}T08:00:00Z`;
                this.repo.crearAlerta({
                  casoId: c.id,
                  identificador: `ALR-${randomUUID().slice(0, 8).toUpperCase()}`,
                  tipo: 'Punto de contacto pendiente',
                  prioridad: 'Alta',
                  estado: 'Pendiente',
                  fechaGeneracion: fechaGen,
                  hitoOrigenId: h.id
                });
                alertasPuntoPendienteGeneradas++;
              }
            }
          }
        }
      }
    });

    tx();
    return alertasPuntoPendienteGeneradas;
  }

  listarAlertasVigentes(fechaReferencia?: string, soloActivas = false): AlertaConDetalle[] {
    return this.repo.listarAlertasVigentes(fechaReferencia, soloActivas);
  }

  registrarGestion(alertaId: number, input: RegistrarGestionInput, rolActual?: string): void {
    this.validarRolGestora(rolActual);

    const alerta = this.repo.obtenerAlertaPorId(alertaId);
    if (!alerta) {
      throw new Error(`Alerta con ID ${alertaId} no encontrada.`);
    }

    if (alerta.estado !== 'Pendiente' && alerta.estado !== 'En gestión') {
      throw new Error(`Solo se pueden gestionar alertas en estado Pendiente o En gestión. Estado actual: ${alerta.estado}`);
    }

    if (!input.resumenInteraccion || !input.resumenInteraccion.trim()) {
      throw new Error('El resumen de la interacción es obligatorio para registrar la gestión.');
    }

    const tx = this.db.transaction(() => {
      const fechaContacto = new Date().toISOString();
      this.repo.crearEntradaBitacora({
        casoId: alerta.casoId,
        identificador: `BIT-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 900 + 100)}`,
        puntoContactoNormado: null,
        fechaContacto,
        canalContacto: input.canalContacto || 'Telefónico',
        interlocutor: input.interlocutor || 'Paciente / Cuidador',
        motivoContacto: input.motivoContacto || 'Seguimiento de alerta preventiva',
        resumenInteraccion: input.resumenInteraccion.trim(),
        acuerdosEstablecidos: input.acuerdosEstablecidos || null,
        responsableRegistro: input.responsableRegistro || rolActual || 'Gestor/a UGCO',
        estadoContacto: 'Efectivo',
        esAdenda: false
      });

      this.repo.actualizarEstadoAlerta(alertaId, 'En gestión');
    });

    tx();
  }

  registrarCumplimiento(alertaId: number, input: RegistrarCumplimientoInput, rolActual?: string): void {
    this.validarRolGestora(rolActual);

    const alerta = this.repo.obtenerAlertaPorId(alertaId);
    if (!alerta) {
      throw new Error(`Alerta con ID ${alertaId} no encontrada.`);
    }

    if (alerta.estado !== 'Pendiente' && alerta.estado !== 'En gestión') {
      throw new Error(`Solo se pueden resolver alertas en estado Pendiente o En gestión. Estado actual: ${alerta.estado}`);
    }

    if (!input.tipoHito || !input.tipoHito.trim()) {
      throw new Error('El tipo de hito es obligatorio para acreditar cumplimiento.');
    }
    if (!input.fechaOcurrencia || !input.fechaOcurrencia.trim()) {
      throw new Error('La fecha de ocurrencia del hito es obligatoria.');
    }
    if (!input.responsable || !input.responsable.trim()) {
      throw new Error('El nombre del profesional responsable es obligatorio.');
    }

    const hitoId = this.repo.crearHito({
      casoId: alerta.casoId,
      tipo: input.tipoHito.trim(),
      fechaOcurrencia: input.fechaOcurrencia.trim(),
      fechaRegistro: new Date().toISOString(),
      responsable: input.responsable.trim(),
      rolResponsable: input.rolResponsable?.trim() || rolActual || 'Gestor/a UGCO'
    });

    const ahoraIso = new Date().toISOString();
    this.repo.resolverAlertaConHito(alertaId, hitoId, alerta.garantiaId, ahoraIso);
  }

  cerrarAlerta(alertaId: number, input: CerrarAlertaInput, rolActual?: string): void {
    this.validarRolGestora(rolActual);

    const alerta = this.repo.obtenerAlertaPorId(alertaId);
    if (!alerta) {
      throw new Error(`Alerta con ID ${alertaId} no encontrada.`);
    }

    if (alerta.estado !== 'Pendiente' && alerta.estado !== 'En gestión') {
      throw new Error(`Solo se pueden cerrar alertas en estado Pendiente o En gestión. Estado actual: ${alerta.estado}`);
    }

    if (!input.motivoCierre || !input.motivoCierre.trim()) {
      throw new Error('El motivo de cierre por causa documentada es obligatorio.');
    }
    if (!input.fechaCierre || !input.fechaCierre.trim()) {
      throw new Error('La fecha de cierre es obligatoria.');
    }
    if (!input.responsableCierre || !input.responsableCierre.trim()) {
      throw new Error('El profesional responsable del cierre es obligatorio.');
    }

    this.repo.cerrarAlertaPorCausa(
      alertaId,
      input.motivoCierre.trim(),
      input.fechaCierre.trim(),
      input.responsableCierre.trim(),
      alerta.garantiaId
    );
  }

  exportarCsv(fechaReferencia?: string, rolActual?: string): string {
    this.validarRolGestora(rolActual);

    const ref = fechaReferencia ? fechaReferencia.slice(0, 10) : new Date().toISOString().slice(0, 10);
    // HU-04-ESC-08: Excluye alertas Resuelta y No aplica (soloActivas = true)
    const alertas = this.repo.listarAlertasVigentes(ref, true);

    const BOM = '\uFEFF';
    const header = 'Caso;Paciente;Tipo de alerta;Tipo de garantía;Días restantes;Estado;Prioridad;Fecha de generación';

    const escapar = (val: string | number | undefined | null): string => {
      if (val === undefined || val === null) return '';
      const str = String(val);
      if (str.includes(';') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const filas = alertas.map((a) => {
      const dias = a.diasRestantes !== undefined ? a.diasRestantes : (a.diasInactividad !== undefined ? a.diasInactividad : '');
      const fechaGen = a.fechaGeneracion ? a.fechaGeneracion.slice(0, 10) : '';

      return [
        escapar(a.numeroCaso),
        escapar(a.pacienteNombre),
        escapar(a.tipo),
        escapar(a.tipoGarantia || ''),
        escapar(dias),
        escapar(a.estado),
        escapar(a.prioridad),
        escapar(fechaGen)
      ].join(';');
    });

    return [BOM + header, ...filas].join('\r\n');
  }
}
