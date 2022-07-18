import { POSICIONES_ESPECIALES, POSICION_META } from './constantes';
/**
 * Se pasa una ficha actual y se calcula sus movimientos posibles en base
 * a los dados que saco el jugador. Teniendo en cuenta las restricciones del juego
 * @param ficha 
 * @param valores 
 * @returns 
 */
export function mostrarMovimiento(ficha, valores) { 
  let dados = [5, 7, 10, 12]; 
  let movimientosPosibles = [];
  if (
    POSICIONES_ESPECIALES.includes((ficha.posicion + valores[0]) % POSICION_META) && 
    dados.includes(valores[0])
  ) {
    movimientosPosibles.push(valores[0]);
  }
  if (
    POSICIONES_ESPECIALES.includes((ficha.posicion + valores[1]) % POSICION_META) &&
    dados.includes(valores[1])
  ) {
    movimientosPosibles.push(valores[1]);
  }
  if (
    POSICIONES_ESPECIALES.includes((ficha.posicion + valores[2]) % POSICION_META) &&
    dados.includes(valores[2])
  ) {
    movimientosPosibles.push(valores[2]);
  }

  return movimientosPosibles;
}

