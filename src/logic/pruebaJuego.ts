import { Jugador } from './claseJugador';
import { Tablero } from './claseTablero';

function Main(numeroPlayers, numFichas) {
  var colores = ['Rojo', 'Amarillo', 'Verde', 'Azul', 'Morado', 'Naranja'];

  let jugadores = [];

  if (numFichas < 2 || numFichas > 4 || numeroPlayers < 2 || numeroPlayers > 6) {
    alert('No sea puto juegue bien');
  } else {
    for (let i = 0; i < numeroPlayers; i++) {
      let nombre = `Jugador ${i + 1}`;
      let valorDado = Math.floor(Math.random() * (6 - 1) + 1);
      let player = new Jugador(nombre, numFichas, colores[i], valorDado, i);
      jugadores.push(player);
    }
  }

  let tablero = new Tablero(jugadores);
  return tablero;
}

// console.log(tablero)
export { Main };
