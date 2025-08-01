
import { type EstadoSimulacion, type ParametrosSimulacion, type Servidor, type Cliente, type PasoSimulacion } from "./tipos";
import { procesarEvento } from "./eventos";
import { generarEntero } from "./generadores";

// Inicializa el estado base de la simulación
function crearEstadoInicial(): EstadoSimulacion {
  const servidores: Servidor[] = Array.from({ length: 3 }, (_, i) => ({
    id: i + 1,
    ocupado: false,
  }));

  const estado: EstadoSimulacion = {
    reloj: 0,
    eventos: [
      {
        tipo: "INICIO",
        tiempo: 0,
      },
    ],
    cola: [],
    servidores,
    clientes: {},
    proximoClienteId: 1,
  };

  return estado;
}

export function formatearTiempoConDias(minutos: number): string {
  const totalSegundos = Math.floor(minutos * 60);

  const segundosPorDia = 24 * 60 * 60;
  const dia = Math.floor(totalSegundos / segundosPorDia) + 1;

  const segundosRestantes = totalSegundos % segundosPorDia;
  const horas = Math.floor(segundosRestantes / 3600);
  const minutosRestantes = Math.floor((segundosRestantes % 3600) / 60);
  const segundos = segundosRestantes % 60;

  const pad = (n: number) => n.toString().padStart(2, "0");
  return `Día ${dia} - ${pad(horas)}:${pad(minutosRestantes)}:${pad(segundos)}`;
}


// Ejecuta la simulación hasta que se cumplan X horas
export function correrSimulacion(
  parametros: ParametrosSimulacion
): {
  estadoFinal: EstadoSimulacion;
  totalCobrado: number;
  totalGratis: number;
  pasos: PasoSimulacion[];
} {
  const estado = crearEstadoInicial();
  const tiempoLimite = parametros.duracionHoras * 60; // minutos

  
  const pasos: PasoSimulacion[] = [];

  while (estado.reloj <= tiempoLimite && estado.eventos.length > 0) {
    const eventoActual = estado.eventos[0];

    // 👉 Capturamos un snapshot del estado antes de procesar
    pasos.push({
      reloj: eventoActual.tiempo,
      evento: eventoActual.tipo,
      clienteId: eventoActual.clienteId,
      servidorId: eventoActual.servidorId,
      cola: [...estado.cola],
      servidores: estado.servidores.map((s) => ({
        id: s.id,
        ocupado: s.ocupado,
      })),
    });

    procesarEvento(estado, parametros);
  }

  // Cálculo de resultados
  let totalCobrado = 0;
  let totalGratis = 0;

  Object.values(estado.clientes).forEach((cliente: Cliente) => {
  if (cliente.horaFinAtencion) {
    const monto = generarEntero(parametros.montoMin, parametros.montoMax);
    if (cliente.paga) {
      totalCobrado += monto;
    } else {
      totalGratis += monto;
    }
  }
});

  return {
    estadoFinal: estado,
    totalCobrado,
    totalGratis,
    pasos,
  };
}
