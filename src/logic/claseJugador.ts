import Swal from 'sweetalert2';
import { v4 as uuidv4 } from 'uuid';
import { Ficha } from './claseFicha';
import { POSICIONES_GANADORAS, POSICIONES_SALIDA, POSICION_META } from './constantes';

type ColorFichas ='Rojo'| 'Amarillo'| 'Verde'| 'Azul'| 'Morado'| 'Naranja'
class Jugador {
  dadoUno = null;
  dadoDos = null;
  colorFicha:ColorFichas = null;
  nombre = null;
  valorDado = null;
  numeroFichas = null;
  fichasLibres = 0;
  fichasEnjauladas = 0;
  puedeJugar = false;
  volverTirar = false;
  ronda = 0;
  cantidadPares = 0;
  fichas: Ficha[] = [];
  estadoSoplar = false;
  index:number=null
  constructor(nombre, numeroFichas, color, valorDado,index) {
    this.nombre = nombre;
    this.fichasEnjauladas = numeroFichas;
    this.numeroFichas = numeroFichas;
    this.colorFicha = color;
    this.valorDado = valorDado;
    this.index=index
    // this.colorFicha=this.colores.random()
    this.asignarFichas();
  }

  asignarFichas() {
    for (let i = 0; i < this.numeroFichas; i++) {
      let ficha = new Ficha(-1, 'Carcel', this,i);
      ficha.actualizarXYZ()
      this.fichas.push(ficha);
    }
  }

  posicionesFichas() {
    let posicionesJugador = this.fichas.map((ficha) => ficha.posicion);
    return posicionesJugador;
  }

  girarDados(): Array<{ id: string; valor: number }> {
    this.dadoUno = Math.floor(Math.random() * (6 - 1) + 1);
    this.dadoDos = Math.floor(Math.random() * (6 - 1) + 1);
    // this.ronda = this.ronda + 1;
 
    if (this.dadoUno == this.dadoDos) {
      for (let i = 0; i < this.fichas.length; i++) {
        if (this.fichas[i].estado == 'Carcel') {
          this.fichas[i].estado = 'Libre';
          this.fichas[i].posicion = POSICIONES_SALIDA[this.colorFicha];

          break;
        }
      }
    }

    let valor1 = this.dadoUno;
    let valor2 = this.dadoDos;
    let valor3 = this.dadoUno + this.dadoDos;
    let posiciones = this.posicionesFichas();

    if (posiciones.includes(POSICIONES_GANADORAS[this.colorFicha]) && valor3 == 8) {
      Swal.close();
      Swal.fire('Ganaste', 'Una ficha ha llegado a la meta', 'success');
      const fichaEncontrada = this.fichas.find((ficha) => ficha.posicion == POSICIONES_GANADORAS[this.colorFicha]);
      fichaEncontrada.estado="Gano"
      fichaEncontrada.posicion = POSICION_META 
      return []
    }

    if (
      [5, 7, 10, 12].includes(valor1) ||
      [5, 7, 10, 12].includes(valor2) ||
      [5, 7, 10, 12].includes(valor3) ||
      valor1 == valor2
    ) {
      return [
        { valor: valor1, id: uuidv4() },
        { valor: valor2, id: uuidv4() },
        { valor: valor3, id: uuidv4() },
      ];
    } else {
      return [];
    }
  }

  sacarFichas() {
    
    this.ronda = this.ronda + 1;
    let i = 0;
    while (i < 3) {
      this.dadoUno = Math.floor(Math.random() * (6 - 1) + 1);
      this.dadoDos = Math.floor(Math.random() * (6 - 1) + 1);
      console.log(this.dadoUno);
      console.log(this.dadoDos);
      if (this.dadoUno === this.dadoDos) {
        
        this.puedeJugar = true;
        // this.ronda = this.ronda + 1;
        this.fichasLibres = this.numeroFichas;
        this.fichasEnjauladas = 0;
        for (let j = 0; j < this.fichas.length; j++) {
          if (this.fichas[j].estado == 'Carcel') {
            this.fichas[j].estado = 'Libre';

            this.fichas[j].posicion = POSICIONES_SALIDA[this.colorFicha];
            this.fichas[j].actualizarXYZ()
          }
        }
        Swal.close();
        Swal.fire('Has tenido suerte', 'Tus fichas han salido de la carcel, ahora es el turno del siguiente jugador', 'success');
        break;
      }

      if (i == 2) {
        Swal.close();
        Swal.fire('No tuviste suerte', 'Intenta en la siguiente ronda', 'warning');
      }
      i = i + 1;
    }
  }

  jugar() {
    if (this.puedeJugar == false) {
      this.sacarFichas();
    } else {
      this.girarDados();
    }
  }
}

export { Jugador };
