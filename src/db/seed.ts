// src/db/seed.ts - Carga de datos de ejemplo idempotente (HU-01, HU-02, HU-04)
import { obtenerConexion, cerrarConexion } from './conexion.js';
import { RepositorioOncologico } from '../dominio/repositorios.js';
import { sumarDiasHabiles } from '../dominio/calendario-ges.js';

export function sembrarDatos(dbRuta?: string): void {
  const db = obtenerConexion(dbRuta);
  const repo = new RepositorioOncologico(db);

  const pacientesSemilla = [
    { run: '12.345.678-9', nombreCompleto: 'Rosa Valenzuela Muñoz' },
    { run: '9.876.543-2', nombreCompleto: 'Carlos Araya Pizarro' },
    { run: '15.432.198-7', nombreCompleto: 'María Elena González Silva' },
    { run: '8.765.432-1', nombreCompleto: 'Juan Pablo Morales Castro' }
  ];

  // Insertar pacientes idempotentemente
  const stmtPaciente = db.prepare(`
    INSERT INTO paciente (run, nombre_completo) 
    VALUES (?, ?)
    ON CONFLICT(run) DO NOTHING
  `);

  for (const p of pacientesSemilla) {
    stmtPaciente.run(p.run, p.nombreCompleto);
  }

  // Obtener IDs de pacientes
  const p1 = repo.obtenerPacientePorRun('12.345.678-9')!;
  const p2 = repo.obtenerPacientePorRun('9.876.543-2')!;
  const p3 = repo.obtenerPacientePorRun('15.432.198-7')!;
  const p4 = repo.obtenerPacientePorRun('8.765.432-1')!;

  const casosSemilla = [
    {
      numeroCaso: 'CASO-2026-001',
      pacienteId: p1.id!,
      especialidad: 'Mastología',
      codigoDiagnosticoOSospecha: 'C50.9 — Sospecha Ca. Mama',
      etapaActual: 'Sospecha' as const,
      fechaIngreso: '2026-10-15'
    },
    {
      numeroCaso: 'CASO-2026-002',
      pacienteId: p2.id!,
      especialidad: 'Gastroenterología',
      codigoDiagnosticoOSospecha: 'C18.9 — Confirmación Ca. Colorrectal',
      etapaActual: 'Confirmación diagnóstica' as const,
      fechaIngreso: '2026-10-02'
    },
    {
      numeroCaso: 'CASO-2026-003',
      pacienteId: p3.id!,
      especialidad: 'Ginecología Oncológica',
      codigoDiagnosticoOSospecha: 'C53.9 — Neoplasia cuello uterino',
      etapaActual: 'Etapificación' as const,
      fechaIngreso: '2026-09-18'
    },
    {
      numeroCaso: 'CASO-2026-004',
      pacienteId: p4.id!,
      especialidad: 'Urología',
      codigoDiagnosticoOSospecha: 'C61 — Cáncer de Próstata',
      etapaActual: 'Tratamiento' as const,
      fechaIngreso: '2026-08-20'
    }
  ];

  const stmtCaso = db.prepare(`
    INSERT INTO caso_oncologico (
      numero_caso, paciente_id, especialidad, codigo_diagnostico_o_sospecha, etapa_actual, fecha_ingreso
    ) VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(numero_caso) DO NOTHING
  `);

  for (const c of casosSemilla) {
    stmtCaso.run(
      c.numeroCaso,
      c.pacienteId,
      c.especialidad,
      c.codigoDiagnosticoOSospecha,
      c.etapaActual,
      c.fechaIngreso
    );
  }

  // Cargar hitos solo si el caso no tiene hitos aún
  const c1 = repo.obtenerCasoPorNumero('CASO-2026-001')!;
  const c2 = repo.obtenerCasoPorNumero('CASO-2026-002')!;
  const c3 = repo.obtenerCasoPorNumero('CASO-2026-003')!;
  const c4 = repo.obtenerCasoPorNumero('CASO-2026-004')!;

  const checkHitos = db.prepare('SELECT COUNT(*) as count FROM hito_asistencial WHERE caso_id = ?');

  // Caso 1: Sospecha
  if ((checkHitos.get(c1.id!) as any).count === 0) {
    repo.crearHito({
      casoId: c1.id!,
      tipo: 'Ingreso de sospecha desde APS',
      fechaOcurrencia: '2026-10-15',
      fechaRegistro: '2026-10-15T09:30:00Z',
      responsable: 'Enf. Patricia Soto',
      rolResponsable: 'Gestor/a UGCO'
    });
    repo.crearHito({
      casoId: c1.id!,
      tipo: 'Contacto inicial y orientación al paciente',
      fechaOcurrencia: '2026-10-17',
      fechaRegistro: '2026-10-17T11:00:00Z',
      responsable: 'Enf. Patricia Soto',
      rolResponsable: 'Gestor/a UGCO'
    });
  }

  // Caso 2: Confirmación diagnóstica (con alerta pendiente)
  if ((checkHitos.get(c2.id!) as any).count === 0) {
    repo.crearHito({
      casoId: c2.id!,
      tipo: 'Derivación desde Urgencia con sospecha',
      fechaOcurrencia: '2026-10-02',
      fechaRegistro: '2026-10-02T14:15:00Z',
      responsable: 'Dr. Fernando Bravo',
      rolResponsable: 'Médico tratante'
    });
    repo.crearHito({
      casoId: c2.id!,
      tipo: 'Recepción de informe de biopsia confirmatoria',
      fechaOcurrencia: '2026-10-12',
      fechaRegistro: '2026-10-12T16:45:00Z',
      responsable: 'Dra. Carmen Gloria Loyola',
      rolResponsable: 'Patólogo/a'
    });
    repo.crearHito({
      casoId: c2.id!,
      tipo: 'Notificación diagnóstica y entrega de IPD',
      fechaOcurrencia: '2026-10-16',
      fechaRegistro: '2026-10-16T10:30:00Z',
      responsable: 'Dr. Fernando Bravo',
      rolResponsable: 'Médico tratante'
    });
  }

  // Caso 3: Etapificación con Resolución de Comité
  if ((checkHitos.get(c3.id!) as any).count === 0) {
    repo.crearHito({
      casoId: c3.id!,
      tipo: 'Confirmación histológica e ingreso a UGCO',
      fechaOcurrencia: '2026-09-18',
      fechaRegistro: '2026-09-18T10:00:00Z',
      responsable: 'Enf. Patricia Soto',
      rolResponsable: 'Gestor/a UGCO'
    });
    repo.crearHito({
      casoId: c3.id!,
      tipo: 'TAC de tórax, abdomen y pelvis realizado',
      fechaOcurrencia: '2026-09-28',
      fechaRegistro: '2026-09-28T15:20:00Z',
      responsable: 'Dr. Alejandro Tapia',
      rolResponsable: 'Radiólogo/a'
    });
    repo.crearHito({
      casoId: c3.id!,
      tipo: 'Resolución de comité oncológico',
      fechaOcurrencia: '2026-10-10',
      fechaRegistro: '2026-10-10T12:00:00Z',
      responsable: 'Dr. Marcelo Rivas',
      rolResponsable: 'Médico Comité'
    });

    // Resolución formal registrada
    repo.crearResolucionComite({
      casoId: c3.id!,
      identificador: 'RES-COM-2026-089',
      conductaAcordada: 'Quimiorradioterapia concomitante curativa. Derivación externa a HCVB.',
      fechaResolucion: '2026-10-10',
      fechaFirma: '2026-10-10T12:15:00Z'
    });
  }

  // Caso 4: Tratamiento iniciado
  if ((checkHitos.get(c4.id!) as any).count === 0) {
    repo.crearHito({
      casoId: c4.id!,
      tipo: 'Diagnóstico confirmado en Urología',
      fechaOcurrencia: '2026-08-20',
      fechaRegistro: '2026-08-20T09:00:00Z',
      responsable: 'Dr. Andrés Silva',
      rolResponsable: 'Médico tratante'
    });
    repo.crearHito({
      casoId: c4.id!,
      tipo: 'Resolución de comité oncológico',
      fechaOcurrencia: '2026-09-05',
      fechaRegistro: '2026-09-05T12:30:00Z',
      responsable: 'Dr. Marcelo Rivas',
      rolResponsable: 'Médico Comité'
    });
    repo.crearResolucionComite({
      casoId: c4.id!,
      identificador: 'RES-COM-2026-045',
      conductaAcordada: 'Hormonoterapia y Radioterapia externa',
      fechaResolucion: '2026-09-05',
      fechaFirma: '2026-09-05T12:45:00Z'
    });
    repo.crearHito({
      casoId: c4.id!,
      tipo: 'Inicio efectivo de tratamiento radioterapéutico',
      fechaOcurrencia: '2026-09-25',
      fechaRegistro: '2026-09-25T11:00:00Z',
      responsable: 'Dr. Andrés Silva',
      rolResponsable: 'Médico tratante'
    });
  }

  // Evaluaciones Multidimensionales Iniciales (HU-02)
  const checkEval = db.prepare('SELECT COUNT(*) as count FROM evaluacion_multidimensional WHERE caso_id = ?');

  // Caso 1: Rosa Valenzuela - Nivel Bajo (ECOG 1, Zarit 32, FONASA B)
  if ((checkEval.get(c1.id!) as any).count === 0) {
    repo.crearEvaluacion(
      {
        casoId: c1.id!,
        identificador: 'EVAL-2026-001',
        fechaEvaluacion: '2026-10-18T10:00:00Z',
        puntajeClinicoFuncional: 1,
        puntajePsicoemocional: 0,
        escalaZaritCuidador: 32,
        nivelVulnerabilidad: 'Bajo',
        profesionalEvaluador: 'Enf. Patricia Soto (Gestor/a UGCO)'
      },
      [
        {
          tipoDominio: 'CLINICO_FUNCIONAL',
          descripcionHallazgo: 'ECOG 1 — Paciente ambulatoria con leve astenia pero autónoma.',
          requiereDerivacion: false
        },
        {
          tipoDominio: 'PSICOEMOCIONAL',
          descripcionHallazgo: 'Buena adaptación inicial, contención afectiva presente.',
          requiereDerivacion: false
        },
        {
          tipoDominio: 'CUIDADOR',
          descripcionHallazgo: 'Hija Claudia acompaña a controles. Zarit 32 (sin sobrecarga).',
          requiereDerivacion: false
        },
        {
          tipoDominio: 'SOCIOECONOMICO',
          descripcionHallazgo: 'FONASA Tramo B, jubilada. Red familiar colaborativa.',
          requiereDerivacion: false,
          previsionSalud: 'FONASA B',
          situacionLaboral: 'Jubilado / Pensionado'
        },
        {
          tipoDominio: 'ESPIRITUAL',
          descripcionHallazgo: 'Católica practicante, manifiesta apoyo de comunidad parroquial.',
          requiereDerivacion: false
        },
        {
          tipoDominio: 'COMPRENSION_DIAGNOSTICA',
          descripcionHallazgo: 'Comprende el proceso de sospecha y necesidad de mamografía complementaria.',
          requiereDerivacion: false
        }
      ],
      {
        pacienteId: p1.id!,
        runCuidador: '18.765.432-1',
        nombreCompleto: 'Claudia Valenzuela',
        parentesco: 'Hija',
        telefonoContacto: '+56 9 7654 3210',
        autorizacionVigente: true,
        fechaRegistroAutorizacion: '2026-10-18T10:00:00Z'
      }
    );
  }

  // Caso 2: Carlos Araya - Nivel Alto (ECOG 3, Zarit 62 > 56 con sobrecarga y alerta, FONASA A)
  if ((checkEval.get(c2.id!) as any).count === 0) {
    repo.crearEvaluacion(
      {
        casoId: c2.id!,
        identificador: 'EVAL-2026-002',
        fechaEvaluacion: '2026-10-17T11:30:00Z',
        puntajeClinicoFuncional: 3,
        puntajePsicoemocional: 2,
        escalaZaritCuidador: 62,
        nivelVulnerabilidad: 'Alto',
        profesionalEvaluador: 'Enf. Patricia Soto (Gestor/a UGCO)'
      },
      [
        {
          tipoDominio: 'CLINICO_FUNCIONAL',
          descripcionHallazgo: 'ECOG 3 — Síntomas consuntivos, dolor abdominal persistente y reposo en cama >50% del día.',
          requiereDerivacion: true,
          especialidadDerivada: 'Terapia del Dolor y Cuidados Paliativos'
        },
        {
          tipoDominio: 'PSICOEMOCIONAL',
          descripcionHallazgo: 'Afectación severa: angustia ante el diagnóstico y temor a descompensación.',
          requiereDerivacion: true,
          especialidadDerivada: 'Psicooncología UGCO'
        },
        {
          tipoDominio: 'CUIDADOR',
          descripcionHallazgo: 'Cónyuge Teresa Pizarro asume sola los cuidados. Zarit 62 (sobrecarga severa pesquisada).',
          requiereDerivacion: true,
          especialidadDerivada: 'Servicio Social'
        },
        {
          tipoDominio: 'SOCIOECONOMICO',
          descripcionHallazgo: 'FONASA A, cesante sin subsidios activos. Gastos de traslado críticos.',
          requiereDerivacion: true,
          especialidadDerivada: 'Servicio Social UGCO',
          previsionSalud: 'FONASA A',
          situacionLaboral: 'Cesante / Desempleado'
        },
        {
          tipoDominio: 'ESPIRITUAL',
          descripcionHallazgo: 'Solicita apoyo y contención en sala.',
          requiereDerivacion: false
        },
        {
          tipoDominio: 'COMPRENSION_DIAGNOSTICA',
          descripcionHallazgo: 'Dificultad para asimilar el informe de biopsia; requiere acompañamiento continuado.',
          requiereDerivacion: true,
          especialidadDerivada: 'Enfermería de Navegación UGCO'
        }
      ],
      {
        pacienteId: p2.id!,
        runCuidador: '11.234.567-8',
        nombreCompleto: 'Teresa Pizarro',
        parentesco: 'Cónyuge',
        telefonoContacto: '+56 9 8765 1234',
        autorizacionVigente: true,
        fechaRegistroAutorizacion: '2026-10-17T11:30:00Z'
      }
    );

    // Alerta por sobrecarga severa del cuidador (Zarit > 56 / HU-02-ESC-02)
    repo.crearAlerta({
      casoId: c2.id!,
      tipo: 'Sobrecarga de cuidador',
      prioridad: 'Alta',
      estado: 'Pendiente',
      fechaGeneracion: '2026-10-17T11:30:00Z'
    });
  }

  // Garantías GES (HU-04 / RF-04)
  const fechaHoy = new Date().toISOString().slice(0, 10);
  const garantiasSemilla = [
    {
      casoId: c2.id!,
      identificador: 'GES-2026-002',
      tipoGarantia: 'Etapificación y confirmación diagnóstica',
      fechaInicio: '2026-10-02',
      fechaLimite: sumarDiasHabiles(fechaHoy, 5), // Exactamente 5 días hábiles (ventana de alerta HU-04-ESC-01)
      estadoCumplimiento: 'Pendiente' as const
    },
    {
      casoId: c1.id!,
      identificador: 'GES-2026-001',
      tipoGarantia: 'Confirmación diagnóstica',
      fechaInicio: '2026-10-15',
      fechaLimite: sumarDiasHabiles(fechaHoy, 6), // 6 días hábiles (fuera de ventana de alerta HU-04-ESC-02)
      estadoCumplimiento: 'Pendiente' as const
    },
    {
      casoId: c3.id!,
      identificador: 'GES-2026-003',
      tipoGarantia: 'Resolución de comité y etapificación',
      fechaInicio: '2026-09-18',
      fechaLimite: '2026-10-15',
      estadoCumplimiento: 'Cumplida' as const
    }
  ];

  const stmtGarantia = db.prepare(`
    INSERT INTO garantia_ges (
      caso_id, identificador, tipo_garantia, fecha_inicio, fecha_limite, estado_cumplimiento
    ) VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(identificador) DO UPDATE SET
      fecha_limite = excluded.fecha_limite,
      estado_cumplimiento = excluded.estado_cumplimiento
  `);

  for (const g of garantiasSemilla) {
    stmtGarantia.run(
      g.casoId,
      g.identificador,
      g.tipoGarantia,
      g.fechaInicio,
      g.fechaLimite,
      g.estadoCumplimiento
    );
  }

  console.log('✅ Datos de ejemplo sembrados con éxito (4 casos, valoraciones multidimensionales y garantías GES).');
}

// Ejecución directa por CLI si se invoca con npm run db:seed
if (process.argv[1] && process.argv[1].endsWith('seed.ts')) {
  try {
    sembrarDatos();
    cerrarConexion();
  } catch (error) {
    console.error('Error sembrando datos:', error);
    process.exit(1);
  }
}

