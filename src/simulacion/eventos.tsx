import {
  Cliente,
  EstadoServidor,
  Llegada,
  type EstadoSimulacion,
  type Evento,
  type ParametrosSimulacion,
  type Servidor,
} from "./tipos";
import { generarEntero, generarExponencialNegativa, generarUniforme } from "./generadores";

export function obtenerProximoPaso(
  estado: EstadoSimulacion,
  parametros: ParametrosSimulacion
): EstadoSimulacion {
  // Obtener el próximo evento a procesar
  const { evento, reloj, cliente, proximoClienteId } = determinarProximoEvento(estado);

  let nuevoEstado: EstadoSimulacion = {
    ...estado,
    evento,
    reloj,
    cliente,
    proximoClienteId,
  };

  const { llegada } = obtenerLlegada(nuevoEstado, parametros);

  nuevoEstado = {
    ...nuevoEstado,
    llegada
  };

  const { servidores } = obtenerServidores(nuevoEstado, parametros);

  nuevoEstado = {
    ...nuevoEstado,
    servidores,
  };

    // Agregar lógica de registro de cliente:
  if (evento === "LLEGADA_CLIENTE") {
    nuevoEstado = registrarClienteLlegada(nuevoEstado);
  } else if (evento.startsWith("FIN_ATENCION")) {
    nuevoEstado = registrarSalidaCliente(nuevoEstado, parametros);
  }

  return nuevoEstado;
}

function determinarProximoEvento(estado: EstadoSimulacion): {
  evento: Evento;
  reloj: number;
  cliente: number | "-";
  proximoClienteId: number;
} {
  const tiempos: { evento: Evento; tiempo: number; servidorId?: number }[] = [];

  // Llegada del próximo cliente
  if (estado.aceptarLlegadas) {
    tiempos.push({ evento: "LLEGADA_CLIENTE", tiempo: estado.llegada.proximaLlegada });
  }
  // Fines de atención
  estado.servidores.forEach((servidor) => {
    if (
      servidor.estado === "OCUPADO" &&
      servidor.ProximoFinAtencion !== undefined &&
      servidor.ProximoFinAtencion !== "-"
    ) {
      const evento: Evento = `FIN_ATENCION_${servidor.id}` as Evento;
      tiempos.push({
        evento,
        tiempo: servidor.ProximoFinAtencion, // ya estamos seguros que es number
        servidorId: servidor.id,
      });
    }
  });

  // console.log("Tiempos detectados para eventos:");
  // console.table(tiempos);
  // Obtener el evento más cercano
  const proximo = tiempos.reduce((min, actual) =>
    actual.tiempo < min.tiempo ? actual : min
  );
//  console.log(`→ Próximo evento: ${proximo.evento} en ${proximo.tiempo}`);
  let cliente: number | "-" = "-";
  let nuevoProximoClienteId = estado.proximoClienteId;

  if (proximo.evento === "LLEGADA_CLIENTE") {
    cliente = estado.proximoClienteId;
    nuevoProximoClienteId += 1;
  } else if (proximo.servidorId !== undefined) {
    const servidor = estado.servidores.find((s) => s.id === proximo.servidorId);
    cliente = servidor?.clienteActual ?? "-";
  }

  return {
    evento: proximo.evento,
    reloj: proximo.tiempo,
    cliente,
    proximoClienteId: nuevoProximoClienteId,
  };
}

export function obtenerLlegada( estado: EstadoSimulacion, parametros: ParametrosSimulacion ): { llegada: Llegada } {
  if (estado.evento === "LLEGADA_CLIENTE" && estado.aceptarLlegadas) {
    const tiempoEntreLlegadas = generarExponencialNegativa(parametros.lambda);
    const proximaLlegada = estado.reloj + tiempoEntreLlegadas;

    // Elegimos un servidor al azar entre 1, 2 o 3
    const servidorAsignado = Math.floor(Math.random() * 3) + 1;

    return {
      llegada: {
        tiempoEntreLlegadas,
        proximaLlegada,
        servidorAsignado,
      },
    };
  }

  // Si no fue una llegada, se arrastran valores
  return {
    llegada: {
      tiempoEntreLlegadas: "-",
      proximaLlegada: estado.llegada.proximaLlegada,
      servidorAsignado: "-",
    },
  };
}

export function obtenerServidores(
  estado: EstadoSimulacion,
  parametros: ParametrosSimulacion
): { servidores: Servidor[] } {
  const nuevosServidores = estado.servidores.map((s) => {
    const evento = estado.evento;
    const clienteId = estado.cliente !== "-" ? estado.cliente : undefined;
    const anterior = estado.servidores.find((prev) => prev.id === s.id)!;
    const colaAnterior = [...anterior.cola];
    const esFinAtencionActual = evento === `FIN_ATENCION_${s.id}`;
    const esLlegadaAsignada = evento === "LLEGADA_CLIENTE" && estado.llegada.servidorAsignado === s.id;

    let nuevoEstado: EstadoServidor = anterior.estado;
    let nuevoClienteActual: number | "-" = anterior.clienteActual ?? "-";
    const nuevaCola = [...colaAnterior];
    let tiempoAtencion: number | "-" = anterior.tiempoAtencion ?? "-";
    let proximoFin: number | "-" = anterior.ProximoFinAtencion ?? "-";

    if (esLlegadaAsignada) {
      if (anterior.estado === "LIBRE") {
        tiempoAtencion = generarUniforme(parametros.minAtencion, parametros.maxAtencion);
        proximoFin = estado.reloj + tiempoAtencion;
        nuevoClienteActual = clienteId!;
        nuevoEstado = "OCUPADO";
      } else {
        nuevaCola.push(clienteId!);
      }
    } else if (esFinAtencionActual) {
      if (colaAnterior.length > 0) {
        const siguienteCliente = nuevaCola.shift()!;
        tiempoAtencion = generarUniforme(parametros.minAtencion, parametros.maxAtencion);
        proximoFin = estado.reloj + tiempoAtencion;
        nuevoClienteActual = siguienteCliente;
        nuevoEstado = "OCUPADO";
      } else {
        nuevoEstado = "LIBRE";
        nuevoClienteActual = "-";
        tiempoAtencion = "-";
        proximoFin = "-";
      }
    }

    // Si el evento no afecta al servidor, se conserva su estado
    // if (!esLlegadaAsignada && !esFinAtencionActual) {
    //   nuevoEstado = anterior.estado;
    //   nuevoClienteActual = anterior.clienteActual ?? "-";
    // }

    return {
      ...s,
      estado: nuevoEstado,
      clienteActual: nuevoClienteActual,
      tiempoAtencion,
      ProximoFinAtencion: proximoFin,
      cola: nuevaCola,
    };
  });

  return { servidores: nuevosServidores };
}

export function registrarClienteLlegada(
  estado: EstadoSimulacion
): EstadoSimulacion {
  if (estado.cliente === "-") return estado;


  const nuevoCliente: Cliente = {
    id: estado.cliente,
    llegada: estado.reloj,
  };

  return {
    ...estado,
    clientes: [...estado.clientes, nuevoCliente],
    clienteSalida: nuevoCliente
  };
}

export function registrarSalidaCliente(
  estado: EstadoSimulacion,
  parametros: ParametrosSimulacion
): EstadoSimulacion {
  const clienteId = estado.cliente;
  if (clienteId === "-") return estado;

  const clienteIndex = estado.clientes.findIndex((c) => c.id === clienteId);
  if (clienteIndex === -1) return estado;

  const cliente = estado.clientes[clienteIndex];
  const tiempoSistema = estado.reloj - cliente.llegada;
  const garantia = tiempoSistema > parametros.tiempoGarantia;
  const monto = generarEntero(parametros.montoMin, parametros.montoMax);
  const ingresoNeto = garantia ? -monto : monto * 0.75;

  // Actualizar el ingreso acumulado y el gasto por garantía
  const ingresoAcumulado = (estado.ingresoAcumulado ?? 0) + ingresoNeto;
  const gastoPorGarantiaAcumulado = garantia
    ? (estado.gastoPorGarantiaAcumulado ?? 0) + monto
    : estado.gastoPorGarantiaAcumulado;

  // Actualizar el estado del cliente
  estado = {
    ...estado,
    ingresoAcumulado,
    gastoPorGarantiaAcumulado,
  };

  const actualizado: Cliente = {
    ...cliente,
    salida: estado.reloj,
    tiempoSistema,
    garantia,
    monto,
    ingresoNeto,
  };

  const clientesActualizados = [...estado.clientes];
  clientesActualizados.splice(clienteIndex, 1);

  return { ...estado, clientes: clientesActualizados, clienteSalida: actualizado };
}