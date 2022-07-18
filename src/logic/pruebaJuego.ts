import { Jugador } from './claseJugador';
import { Tablero } from './claseTablero';
import { COLORES } from './constantes';

function Main(numeroPlayers, numFichas) {
  const jugadores = [];
  new Array(numeroPlayers).fill(numeroPlayers).map((_, i) => {
    const nombre = `Jugador ${i + 1}`;
    const player = new Jugador(nombre, numFichas, COLORES[i],i);
    jugadores.push(player);
  });
  const tablero = new Tablero(jugadores);
  return tablero;
}

export { Main };
