// Tipos de evento que pueden ocurrir
export type TipoEvento = 'INICIO' | 'LLEGADA' | 'FIN_ATENCION';

// Representa un cliente en el sistema
export interface Cliente {
  id: number;
  horaLlegada: number;
  horaInicioAtencion?: number;
  horaFinAtencion?: number;
  tiempoEspera?: number;
  paga?: boolean; // true si paga, false si fue gratis por garantía
}

// Representa un evento en el calendario de eventos
export interface Evento {
  tipo: TipoEvento;
  tiempo: number;
  clienteId?: number;
  servidorId?: number;
}

// Representa un servidor (reparador)
export interface Servidor {
  id: number;
  ocupado: boolean;
  clienteActual?: number; // id del cliente
  finAtencion?: number;
}

// Representa el estado general del sistema en un momento dado. Es el "vector de estado" de la simulación.
export interface EstadoSimulacion {
  reloj: number;
  eventos: Evento[];
  cola: number[]; // ids de clientes esperando
  servidores: Servidor[];
  clientes: Record<number, Cliente>; // todos los clientes por id
  proximoClienteId: number;
}

export interface PasoSimulacion {
  reloj: number;
  evento: string;
  clienteId?: number;
  servidorId?: number;
  cola: number[];
  servidores: { id: number; ocupado: boolean }[];
}

export interface ParametrosSimulacion {
  lambda: number;             // tasa de llegada
  tiempoGarantia: number;     // minutos
  minAtencion: number;        // minutos
  maxAtencion: number;        // minutos
  montoMin: number;           // $
  montoMax: number;           // $
  duracionHoras: number;      // horas
}

export interface ParametrosSimulacionUI {
  duracionHoras: number;
  desde: number;
  hasta: number;
  filasAMostrar: number;
}

export interface Distribucion {
  id: string; // "llegadas" o "atencion"
  nombre: string;
  tipo: "Exponencial" | "Uniforme";
  parametros: Record<string, number>;
}