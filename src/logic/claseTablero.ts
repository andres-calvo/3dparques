
import {Jugador} from "./claseJugador"

class Tablero {
    jugadores: Jugador[] = [];
    constructor(jugadores) {
      this.jugadores = jugadores;
    }
  
    get numeroJug() {
      return this.jugadores.length;
    }
  }

export {Tablero}