
import { v4 as uuidv4 } from 'uuid';
class Ficha {
    posicion = null;
    estado = null;
    jugador = null;
    id=null;
    constructor(posicion, estado, jugador) {
      this.posicion = posicion;
      this.estado = estado;
      this.jugador = jugador;
      this.id=uuidv4()
    }
  
  }

  export {Ficha}