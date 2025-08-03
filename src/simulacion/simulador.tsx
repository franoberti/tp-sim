
import { type EstadoSimulacion, type ParametrosSimulacion, type Servidor } from "./tipos";
import { obtenerProximoPaso } from "./eventos";

// Inicializa el estado base de la simulación
function crearEstadoInicial(): EstadoSimulacion {
  const servidores: Servidor[] = Array.from({ length: 3 }, (_, i) => ({
    id: i + 1,
    estado: "LIBRE",
    cola: [],
  }));

  const estado: EstadoSimulacion = {
    reloj: 0,
    evento:  "INICIO",
    servidores: servidores,
    cliente: "-",
    proximoClienteId: 1,
    llegada: {
      tiempoEntreLlegadas: 0,
      proximaLlegada: 0,
      servidorAsignado: "-",
    },
  };

  return estado;
}


// Ejecuta la simulación hasta que se cumplan X horas
export function correrSimulacion(
  parametros: ParametrosSimulacion
): {
  estadoFinal: EstadoSimulacion;
  // totalCobrado: number;
  // totalGratis: number;
  pasos: EstadoSimulacion[];
} {
  let estado = crearEstadoInicial();
  const tiempoLimite = parametros.duracionHoras * 60; // minutos

  
  const pasos: EstadoSimulacion[] = [];

  while (estado.reloj <= tiempoLimite) {

    // Capturamos el estado antes de procesar
    pasos.push({
      reloj: estado.reloj,
      evento: estado.evento,
      llegada: estado.llegada,
      cliente: estado.cliente,
      proximoClienteId: estado.proximoClienteId,
      servidores: estado.servidores.map((s) => ({
        id: s.id,
        estado: s.estado,
        cola: [...s.cola],
        clienteActual: s.clienteActual ?? "-",
        tiempoAtencion: s.tiempoAtencion ?? "-",
        ProximoFinAtencion: s.ProximoFinAtencion ?? "-",
      })),
    });

    estado = obtenerProximoPaso(estado, parametros);
  }

  // Cálculo de resultados
//   let totalCobrado = 0;
//   let totalGratis = 0;

//   Object.values(estado.clientes).forEach((cliente: Cliente) => {
//   if (cliente.horaFinAtencion) {
//     const monto = generarEntero(parametros.montoMin, parametros.montoMax);
//     if (cliente.paga) {
//       totalCobrado += monto;
//     } else {
//       totalGratis += monto;
//     }
//   }
// });

  return {
    estadoFinal: estado,
    // totalCobrado,
    // totalGratis,
    pasos,
  };
}
