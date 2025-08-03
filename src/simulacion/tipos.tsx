// Tipos de evento que pueden ocurrir
export type Evento = 'INICIO' | 'LLEGADA_CLIENTE' | 'FIN_ATENCION_1' | 'FIN_ATENCION_2' | 'FIN_ATENCION_3';
export type EstadoServidor = 'LIBRE' | 'OCUPADO';

// Representa un cliente en el sistema
export interface Cliente {
  id: number;
  horaLlegada: number;
  horaInicioAtencion?: number;
  horaFinAtencion?: number;
  tiempoEspera?: number;
  paga?: boolean; // true si paga, false si fue gratis por garantía
}

// Representa un servidor (reparador)
export interface Servidor {
  id: number;
  estado: EstadoServidor;
  clienteActual?: number | "-"; // id del cliente
  tiempoAtencion?: number | "-"; // tiempo que tarda en atender
  ProximoFinAtencion?: number | "-";
  cola: number[]; // clientes en espera
}
export interface Llegada {
  tiempoEntreLlegadas: number | "-"; // tiempo entre llegadas de clientes
  proximaLlegada: number; // tiempo de la próxima llegada
  servidorAsignado?: number | "-"; // id del servidor asignado
}

// Representa el estado general del sistema en un momento dado. Es el "vector de estado" de la simulación.
export interface EstadoSimulacion {
  reloj: number;
  evento: Evento;
  llegada: Llegada;
  servidores: Servidor[];
  cliente: number | "-"; // id del cliente actual
  proximoClienteId: number; // id del próximo cliente a llegar
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
  id: string; // "llegadas" o "atencion" o "tiempoGarantia"
  nombre: string;
  tipo: "Exponencial" | "Uniforme" | "Constante";
  parametros: Record<string, number>;
}