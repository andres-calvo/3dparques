import { ColorFichas } from '@/types';
import Swal from 'sweetalert2';
import { v4 as uuidv4 } from 'uuid';
import { Ficha } from './claseFicha';
import { POSICIONES_GANADORAS, POSICIONES_SALIDA, POSICION_META } from './constantes';

class Jugador {
  dadoUno = null;
  dadoDos = null;
  colorFicha: ColorFichas = null;
  nombre: string = null;
  numeroFichas = 0;
  fichasLibres = 0;
  fichasEnjauladas = 0;
  puedeJugar = false;
  volverTirar = false;
  ronda = 0;
  cantidadPares = 0;
  fichas: Ficha[] = [];
  estadoSoplar = false;
  index: number = null;
  constructor(nombre, numeroFichas, color, index) {
    this.nombre = nombre;
    this.fichasEnjauladas = numeroFichas;
    this.numeroFichas = numeroFichas;
    this.colorFicha = color;
    this.index = index;
    this.asignarFichas();
  }

  asignarFichas() {
    for (let i = 0; i < this.numeroFichas; i++) {
      let ficha = new Ficha(-1, 'Carcel', this, i);
      ficha.actualizarXYZ();
      this.fichas.push(ficha);
    }
  }

  posicionesFichas() { // Metodo para iterar sobre las fichas  del jugador y guardarlas en un array
    let posicionesJugador = this.fichas.map((ficha) => ficha.posicion);
    return posicionesJugador;
  }

  girarDados(): Array<{ id: string; valor: number }> { //Metodo para girar dados
    this.dadoUno = Math.floor(Math.random() * (6 - 1) + 1);
    this.dadoDos = Math.floor(Math.random() * (6 - 1) + 1);
    
    if (this.dadoUno == this.dadoDos) {  //Valido si los dos dados son pares
      for (let i = 0; i < this.fichas.length; i++) {  //En caso de ser verdadero itero sobre  las fichas 
        if (this.fichas[i].estado == 'Carcel') {  // Busco la primera ficha que tenga estado igual a "Carcel"
          this.fichas[i].estado = 'Libre'; // Actualizo su estado como ficha en estado "Libre"
          this.fichas[i].posicion = POSICIONES_SALIDA[this.colorFicha]; // Busco la posición inicial o de salida para la ficha del color del jugador
          this.fichas[i].actualizarXYZ(); //Actualizo la posición de la ficha   
          break;
        }
      }
    }

    let valor1 = this.dadoUno;
    let valor2 = this.dadoDos;
    let valor3 = this.dadoUno + this.dadoDos;
    let posiciones = this.posicionesFichas();

    if (posiciones.includes(POSICIONES_GANADORAS[this.colorFicha]) && valor3 == 8) { //Valido si alguna de las fichas del jugador se encuentra en la posición  que permite llegar a la meta sacando 8 en los dados . Valido también que en la suma de sus dados, el valor sea 8
      Swal.close(); 
      Swal.fire('Ganaste', 'Una ficha ha llegado a la meta', 'success');
      const fichaEncontrada = this.fichas.find(
        (ficha) => ficha.posicion == POSICIONES_GANADORAS[this.colorFicha]
      );
      fichaEncontrada.estado = 'Gano'; //En caso que haya entrado al if, es decir que haya cumplido la condicion anterior, actuaizo el estado de la ficha como "Gano"
      fichaEncontrada.posicion = POSICION_META; // Ubico la ficha en la posición de meta
      fichaEncontrada.actualizarXYZ()
      return [];
    }

    if (
      [5, 7, 10, 12].includes(valor1) ||
      [5, 7, 10, 12].includes(valor2) ||
      [5, 7, 10, 12].includes(valor3) ||
      valor1 == valor2                  //Valido que el dado 1 o el dado 2 o la suma de los dos dados estén incluidos dentro del numero de casillas que me puedo mover o que el dado 1 y dado 2 sean iguales
    ) {
      return [
        { valor: valor1, id: uuidv4() }, //Si se cumple la condición retorno los movimientos posibles que el jugador puede realizar
        { valor: valor2, id: uuidv4() },
        { valor: valor3, id: uuidv4() },
      ];
    } else {
      return []; // Si no, retorno un array vacio
    }
  }

  sacarFichas() { //Este metodo es el que se llama para sacar las fichas de la carcel en la primera ronda
    this.ronda = this.ronda + 1;  // Aumento la ronda 
    let i = 0;
    while (i < 3) { //Hago loop de 3 veces 
      this.dadoUno = Math.floor(Math.random() * (6 - 1) + 1);
      this.dadoDos = Math.floor(Math.random() * (6 - 1) + 1);
      if (this.dadoUno === this.dadoDos) { // Si los dados son pares asigno estados
        this.puedeJugar = true;
        this.fichasLibres = this.numeroFichas;
        this.fichasEnjauladas = 0;
        this.fichas.forEach((ficha) => { //Itero sobre todas las fichas del jugador y les pongo estado como "Libre", es decir, ya pueden moverse en tablero
          if (ficha.estado == 'Carcel') {
            ficha.estado = 'Libre';
            ficha.posicion = POSICIONES_SALIDA[this.colorFicha];
            ficha.actualizarXYZ();
          }
        });
        Swal.close();
        Swal.fire(
          'Has tenido suerte',
          'Tus fichas han salido de la carcel, ahora es el turno del siguiente jugador',
          'success'
        );
        break;
      }

      if (i == 2) {
        Swal.close();
        Swal.fire('No tuviste suerte', 'Intenta en la siguiente ronda', 'warning');
      }
      i = i + 1;
    }
  }
}

export { Jugador };
