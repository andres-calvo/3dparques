import { v4 as uuidv4 } from 'uuid';
import { Jugador } from './claseJugador';
import carcel from '../../public/carcel.json';
import posiciones from '../../public/posiciones.json';
import { POSICION_CARCEL } from './constantes';
import { EstadoFichas } from '@/types';
type Coordinate = { x: number; y: number; z: number };
interface ICarcel {
  [x: string]: Coordinate[];
}
interface IPosiciones {
  [x: number]: Coordinate[];
}
let carcelJSON: ICarcel = carcel;
let posicionesJSON: IPosiciones = posiciones;
class Ficha {
  posicion:number = -1;
  estado:EstadoFichas = null;
  jugador: Jugador = null;
  id:string = null;
  x:number = null;
  y:number = null;
  z:number = null;
  index:number = null
  constructor(posicion:number, estado:EstadoFichas, jugador: Jugador,index:number) {
    this.posicion = posicion;
    this.estado = estado;
    this.jugador = jugador;
    this.id = uuidv4();
    this.index = index
  }
  actualizarXYZ() {
    if (this.posicion == POSICION_CARCEL) {
      //Obtener las posiciones de carcel para ese color
      const posicionCarcel = carcelJSON[this.jugador.colorFicha][this.index];
      this.x = posicionCarcel.x;
      this.y = posicionCarcel.y;
      this.z = posicionCarcel.z;
      return;
    }
    const casilla = posicionesJSON[this.posicion][this.jugador.index];
    for (const ficha of this.jugador.fichas) {
      if (ficha.id != this.id) {
        if (ficha.x == casilla.x && ficha.y == casilla.y && ficha.z == casilla.z) {
          casilla.z += 0.06; // Es para poner la ficha encima
        }
      }
    }
    this.x = casilla.x;
    this.y = casilla.y;
    this.z = casilla.z;
    return;
  }
}

export { Ficha };
