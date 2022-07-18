import { v4 as uuidv4 } from 'uuid';
import { Jugador } from './claseJugador';
import meta from "../../meta.json"
import carcel from '../../carcel.json';
import posiciones from '../../posiciones.json';
import { POSICION_CARCEL, POSICION_META } from './constantes';
import { EstadoFichas, ICarcel, IMeta, IPosiciones } from '@/types';

let metaJSON:IMeta = meta
let carcelJSON: ICarcel = carcel;
let posicionesJSON: IPosiciones = posiciones;

/**
 Se define una clase Ficha la cual contiene la posicion (en este caso 3D se usará x,y,z), su estado , posición y el id de la ficha.
El método "actualizarXYZ" se encarga de dos cosas:

1) En caso de que la ficha haya sido encarcelada por otro jugador, se le asignará la posición para x,z,y de carcel, teniendo en cuenta el color
2) Si la ficha se va a mover de posición, se actuliza sus posiciones x,y,z y nada másS

 */
class Ficha {
  posicion:number = -1;
  estado:EstadoFichas = null;
  jugador: Jugador = null;
  id:string = null;
  x:number = null;
  y:number = null;
  z:number = null;
  index:number = null
  constructor(posicion:number, estado:EstadoFichas, jugador: Jugador,index:number) { // Constructor para crear el objeto ficha
    this.posicion = posicion;
    this.estado = estado;
    this.jugador = jugador;
    this.id = uuidv4();
    this.index = index
  }
  actualizarXYZ() {
    if (this.posicion == POSICION_CARCEL) { //Validar si la ficha se encuentra en la posición de carcel
      //Obtener las posiciones de carcel para ese color
      const posicionCarcel = carcelJSON[this.jugador.colorFicha][this.index]; //Obtengo las posiciones x,y,z de carcel para esa ficha y dicho color
      this.x = posicionCarcel.x; // Se asignan valores x,y,z para esa ficha 
      this.y = posicionCarcel.y;
      this.z = posicionCarcel.z;
      return;
    }
    if(this.posicion == POSICION_META){
      const posicionMeta =metaJSON[this.jugador.colorFicha][this.index];
      this.x = posicionMeta.x;
      this.y = posicionMeta.y;
      this.z = posicionMeta.z;
      return
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
