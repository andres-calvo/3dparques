import {Ficha} from './claseFicha'
import {Jugador} from './claseJugador'
import {Tablero} from './claseTablero'
import * as funcionalidades from './funcionalidades'


function Main(numeroPlayers, numFichas) {
    var colores = ['Rojo', 'Amarillo', 'Verde', 'Azul', 'Morado', 'Naranja'];
  
    let jugadores = [];
  
    if (numFichas < 2 || numFichas > 4 || numeroPlayers < 2 || numeroPlayers > 6) {
      alert('No sea puto juegue bien');
    } else {
      for (let i = 0; i < numeroPlayers; i++) {
        let nombre = `Jugador ${i + 1}`;
        let valorDado = Math.floor(Math.random() * (6 - 1) + 1);
        let player = new Jugador(nombre, numFichas, colores[i], valorDado);
        jugadores.push(player);
        
      }
    } //FALTA ORDENAR EL ARRAY CON LOS JUGADORES Y QUE NO SE REPITAN NUMEROS AL
    // GENERAR EL NUMERO QUE OBTUVO
  
    let tablero = new Tablero(jugadores);
    return tablero;
  }

const tablero=Main(4,3)

// console.log(tablero)
export{Main}