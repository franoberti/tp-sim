import { type EstadoSimulacion, type Evento, type ParametrosSimulacion, type Servidor } from "./tipos";
import { generarExponencial, generarUniforme } from "./generadores";

export function procesarEvento(
  estado: EstadoSimulacion,
  parametros: ParametrosSimulacion
): EstadoSimulacion {
  const evento = obtenerProximoEvento(estado);
  if (!evento) return estado;

  // Avanza el reloj
  estado.reloj = evento.tiempo;

  switch (evento.tipo) {
    case "INICIO":
    case "LLEGADA":
      return procesarLlegada(estado, parametros);
    case "FIN_ATENCION":
      return procesarFinAtencion(estado, parametros, evento);
    default:
      return estado;
  }
}

function obtenerProximoEvento(estado: EstadoSimulacion): Evento | undefined {
  estado.eventos.sort((a, b) => a.tiempo - b.tiempo);
  return estado.eventos.shift();
}

function procesarLlegada(
  estado: EstadoSimulacion,
  parametros: ParametrosSimulacion,
): EstadoSimulacion {
  const clienteId = estado.proximoClienteId++;
  const cliente = {
    id: clienteId,
    horaLlegada: estado.reloj,
  };

  estado.clientes[clienteId] = cliente;

  // Programar próxima llegada
  const tiempoEntreLlegadas = generarExponencial(parametros.lambda / 60); // lambda por minuto
  estado.eventos.push({
    tipo: "LLEGADA",
    tiempo: estado.reloj + tiempoEntreLlegadas,
  });

  // Buscar servidor libre
  const servidorLibre = estado.servidores.find(s => !s.ocupado);
  if (servidorLibre) {
    asignarAServidor(estado, parametros, servidorLibre, clienteId);
  } else {
    estado.cola.push(clienteId);
  }

  return estado;
}

function procesarFinAtencion(
  estado: EstadoSimulacion,
  parametros: ParametrosSimulacion,
  evento: Evento
): EstadoSimulacion {
  const servidor = estado.servidores.find(s => s.id === evento.servidorId);
  if (!servidor) return estado;

  servidor.ocupado = false;
  servidor.clienteActual = undefined;
  servidor.finAtencion = undefined;

  if (estado.cola.length > 0) {
    const siguienteClienteId = estado.cola.shift()!;
    asignarAServidor(estado, parametros, servidor, siguienteClienteId);
  }

  return estado;
}

function asignarAServidor(
  estado: EstadoSimulacion,
  parametros: ParametrosSimulacion,
  servidor: Servidor,
  clienteId: number
) {
  const tiempoAtencion = generarUniforme(parametros.minAtencion, parametros.maxAtencion);
  const cliente = estado.clientes[clienteId];

  cliente.horaInicioAtencion = estado.reloj;
  cliente.horaFinAtencion = estado.reloj + tiempoAtencion;
  cliente.tiempoEspera = cliente.horaInicioAtencion - cliente.horaLlegada;
  cliente.paga = cliente.tiempoEspera <= parametros.tiempoGarantia;

  servidor.ocupado = true;
  servidor.clienteActual = clienteId;
  servidor.finAtencion = cliente.horaFinAtencion;

  estado.eventos.push({
    tipo: "FIN_ATENCION",
    tiempo: cliente.horaFinAtencion,
    clienteId,
    servidorId: servidor.id,
  });
}
