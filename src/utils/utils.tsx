
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

export function formatearMinutosASegundos(valor: number): string {
  const minutos = Math.floor(valor);
  const segundos = Math.round((valor - minutos) * 60);

  const minutosStr = minutos.toString().padStart(2, "0");
  const segundosStr = segundos.toString().padStart(2, "0");

  return `${minutosStr}:${segundosStr}`;
}
