// Distribución Exponencial Negativa
// lambda: tasa de llegadas por unidad de tiempo
export function generarExponencialNegativa(lambda: number): number {
  const u = Math.random();
  return -lambda * Math.log(1 - u);
}

// Distribución Uniforme Continua
// entre min y max (ambos en minutos por ejemplo)
export function generarUniforme(min: number, max: number): number {
  const u = Math.random();
  return min + u * (max - min);
}

// Distribución Uniforme Entera (para generar montos entre 100 y 400)
export function generarEntero(min: number, max: number): number {
  return Math.floor(min + Math.random() * (max - min + 1));
}
