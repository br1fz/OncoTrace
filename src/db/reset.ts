// src/db/reset.ts - Reinicio completo e idempotente de la base de datos a su estado semilla inicial
import { obtenerConexion, cerrarConexion, aplicarMigraciones } from './conexion.js';
import { sembrarDatos } from './seed.js';

export function reiniciarBaseDeDatos(rutaDb?: string): void {
  const db = obtenerConexion(rutaDb);

  // Desactivar temporalmente foreign keys para truncar las tablas en orden
  db.pragma('foreign_keys = OFF');

  const tablas = [
    'estudio_diagnostico',
    'orden_examen',
    'adenda_bitacora',
    'entrada_bitacora',
    'garantia_ges',
    'evaluacion_multidimensional',
    'cuidador_autorizado',
    'alerta_seguimiento',
    'resolucion_comite',
    'hito_asistencial',
    'caso_oncologico',
    'paciente'
  ];

  const vaciar = db.transaction(() => {
    for (const tabla of tablas) {
      try {
        db.prepare(`DELETE FROM ${tabla}`).run();
        try {
          db.prepare('DELETE FROM sqlite_sequence WHERE name = ?').run(tabla);
        } catch {
          // Si no usa autoincrement sequence, ignorar
        }
      } catch (e) {
        // Si la tabla no existiera por alguna razón, ignorar
      }
    }
  });

  vaciar();
  db.pragma('foreign_keys = ON');

  // Asegurar migraciones y sembrar datos iniciales
  aplicarMigraciones(db);
  sembrarDatos(rutaDb);

  console.log('🔄 Base de datos reiniciada con éxito.');
  console.log('📌 CASO-2026-002 (Carlos Araya Pizarro) ha vuelto a Confirmación diagnóstica.');
}

if (process.argv[1] && process.argv[1].endsWith('reset.ts')) {
  try {
    reiniciarBaseDeDatos();
    cerrarConexion();
  } catch (error) {
    console.error('Error al reiniciar base de datos:', error);
    process.exit(1);
  }
}
