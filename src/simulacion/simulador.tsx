
import { PasoSimulacion, type EstadoSimulacion, type ParametrosSimulacion, type Servidor } from "./tipos";
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
    clientes: [],
    aceptarLlegadas: true,
    ingresoAcumulado: 0,
    gastoPorGarantiaAcumulado: 0,
  };

  return estado;
}


// Ejecuta la simulación hasta que se cumplan X horas
export function correrSimulacion(
  parametros: ParametrosSimulacion
): {
  estadoFinal: EstadoSimulacion;
  pasos: PasoSimulacion[];
} {
  let estado = crearEstadoInicial();
  const tiempoLimite = parametros.duracionHoras * 60; // minutos

  
  const pasos: PasoSimulacion[] = [];

  // let iteraciones = 0;
  while (estado.aceptarLlegadas || estado.servidores.some(s => s.estado === "OCUPADO" || s.cola.length > 0)) {
    if (estado.aceptarLlegadas && estado.reloj >= tiempoLimite) {
      console.warn("Tiempo límite alcanzado, no se aceptarán más llegadas.");
      console.warn("Reloj actual:", estado.reloj);
      console.warn("Tiempo límite:", tiempoLimite);
      estado = { ...estado, aceptarLlegadas: false };

    }
    //   iteraciones++;
    
    // if (iteraciones > 2000) {
    //   throw new Error("Demasiadas iteraciones, posible bucle infinito");
    // }

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
      clienteSalida: estado.clienteSalida,
      aceptarLlegadas: estado.aceptarLlegadas,
      ingresoAcumulado: estado.ingresoAcumulado,
      gastoPorGarantiaAcumulado: estado.gastoPorGarantiaAcumulado,
    });

    //     console.log(
    //   `Reloj: ${estado.reloj.toFixed(2)} | ` +
    //   estado.servidores.map((s, i) =>
    //     `S${i + 1}(${s.estado}, C:${s.clienteActual ?? "-"}, Cola:[${s.cola.join(",")}], Fin:${s.ProximoFinAtencion ?? "-"})`
    //   ).join(" | ")
    // );

    estado = obtenerProximoPaso(estado, parametros);
  }

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
      clienteSalida: estado.clienteSalida,
      aceptarLlegadas: estado.aceptarLlegadas,
      ingresoAcumulado: estado.ingresoAcumulado,
      gastoPorGarantiaAcumulado: estado.gastoPorGarantiaAcumulado,
    });

  return {
    estadoFinal: estado,
    pasos,
  };
}
