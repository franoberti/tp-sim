// Distribución Exponencial Negativa
export function generarExponencialNegativa(lambda: number): number {
  const u = Math.random();
  return -lambda * Math.log(1 - u);
}

// Distribución Uniforme 
export function generarUniforme(a: number, b: number): number {
  const u = Math.random();
  return a + u * (b - a);
}