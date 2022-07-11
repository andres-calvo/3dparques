import { createContext, useContext, useState } from 'react';
import styles from 'styles/test.module.scss';
import { v4 as uuidv4 } from 'uuid';
import swal from 'sweetalert2';
const GameContext = createContext(null);
const Page = (props) => {
  const [instanciaJuego] = useState(() => Main(2, 4));
  const [respuesta, setRespuesta] = useState('');
  const [jugadorActual, setJugadorActual] = useState(0);
  const [dados, setDados] = useState<{ valor: number; id: string }[]>([]);
  const [accionesPosibles, setAccionesPosibles] = useState({
    girarDados:true,
    soplar:true,
    matar:true,
    pasarDeTurno:false
  })
  //   console.log(instanciaJuego);
  const instanciaJugador = instanciaJuego.jugadores[jugadorActual];

  const jugar = () => {
    console.log('Es el turno de ', instanciaJugador.nombre);
    console.log('Puede jugar?', instanciaJugador.puedeJugar);
    if (instanciaJugador.puedeJugar == false) {
      instanciaJugador.sacarFichas();
      console.log('Ultimo dadoUno', instanciaJugador.dadoUno);
      console.log('Ultimo dadoDos', instanciaJugador.dadoDos);
      pasarTurno();
      console.log(instanciaJuego);
    } else {
      const jugada = instanciaJugador.girarDados();
      setDados(jugada);
      // Muestre una modal diciendo que saco par
      // Cuando saco

      if (jugada.length == 0) {
        swal.fire(
          'Mala suerte',
          'No sacaste en tus dados 5, 7 , 10 , o 12 , por lo que no te podras mover',
          'error'
        );
        pasarTurno();
        setAccionesPosibles((prev)=> ({...prev,girarDados:true,pasarDeTurno:false}))
        return 
      }
      // De aqui para abajo sabemos que si se puede mover

      //Validacion de Pares Empieza
      const [dado1, dado2, valor3] = jugada;
      if (dado1.valor == dado2.valor) {
        instanciaJugador.cantidadPares += 1;
        instanciaJugador.volverTirar=true
        if (instanciaJugador.fichasEnjauladas > 0 && instanciaJugador.cantidadPares == 3) {
          instanciaJugador.volverTirar=false
          for (let i = 0; i < instanciaJugador.fichas.length; i++) {
            if (instanciaJugador.fichas[i].estado !== 'Gano') {
              instanciaJugador.fichas[i].estado = 'Gano';
              instanciaJugador.fichas[i].posicion = 0;
              // setAccionesPosibles((prev)=> ({...prev,girarDados:false,pasarDeTurno:true}))

              break;
            }
          }
        } else {
          swal.fire(
            'Sacaste par',
            'Si sacas tres pares de seguido, una ficha sera sacada del juego automaticamente. Vuelve a girar los dados',
            'success'
          );
          setAccionesPosibles((prev)=> ({...prev,girarDados:PuedeMoverSegunRobert(dado1.valor,dado2.valor),pasarDeTurno:false}))
        }
      } else {
        
        instanciaJugador.cantidadPares = 0;
        instanciaJugador.volverTirar=false
        
        // setAccionesPosibles((prev)=> ({...prev,girarDados:false,pasarDeTurno:true}))
      }
      //Validacion de Pares Termina

      //
      // Aca debemos bloquear las jugadas, hasta que escoja un dado
      setAccionesPosibles((prev)=>({...prev,girarDados:false,pasarDeTurno:false}))

      console.log(instanciaJuego);

      return;
    }
  };

  function pasarTurno() {
    setJugadorActual((jugadorPrevio) => (jugadorPrevio + 1) % instanciaJuego.numeroJug);
    setAccionesPosibles((prev)=> ({...prev,girarDados:true,pasarDeTurno:false}))
  }

  return (
    <GameContext.Provider
      value={{
        instanciaJuego,
        jugadorActual,
        setJugadorActual,
        dados,
        setDados,
        setAccionesPosibles
      }}
    >
      <div className={styles.page}>
        <section>Jugador actual: Jugador{jugadorActual}</section>
        <section>Fichas afuera: {instanciaJugador.fichasLibres} </section>
        <section>Fichas carcel: {instanciaJugador.fichasEnjauladas} </section>
        <section>{respuesta}</section>
        <section className={styles.dadosWrapper}>
          {dados.map((dado, i) => (
            <Dado valor={dado.valor} key={dado.id} />
          ))}
        </section>
        <section className={styles.sectionWrapper}>
          <button disabled={!accionesPosibles.matar}>Matar</button>
          <button disabled={!accionesPosibles.soplar}>Soplar</button>
          <button onClick={jugar} disabled={!accionesPosibles.girarDados} >Girar dados</button>
          <button onClick={pasarTurno} disabled={!accionesPosibles.pasarDeTurno}>Siguiente Turno</button>
        </section>
      </div>
    </GameContext.Provider>
  );
};

export default Page;
const Dado = ({ valor }) => {
  const {setAccionesPosibles,setJugadorActual,instanciaJuego} = useContext(GameContext)
  const onClick = ()=>{
    // Mover la ficha
    // mover(valor)
    console.log("Se movio ",valor)
    setAccionesPosibles((prev)=>({...prev,girarDados:true,pasarDeTurno:false}))

  }
  return <button className={styles.dado} disabled={![5,7,10,12].includes(valor)} onClick={onClick}>{valor}</button>;
};
interface IFicha {
  posicion: any[];
  estado: string;
  jugador: string;
}
interface JugadorType {
  dadoUno: null | number;
  dadoDos: null | number;
  colorFicha: null | string;
  fichasLibres: number;
  fichasEnjauladas: number;
  puedeJugar: boolean;
  ronda: number;
  fichas: IFicha[];
  estadoSoplar: boolean;
}

class Jugador {
  dadoUno = null;
  dadoDos = null;
  colorFicha = null;
  nombre = null;
  valorDado = null;
  numeroFichas = null;
  fichasLibres = 0;
  fichasEnjauladas = 0;
  puedeJugar = false;
  volverTirar=false
  ronda = 0;
  cantidadPares = 0;
  fichas:Ficha[] = [];
  estadoSoplar = false;
  constructor(nombre, numeroFichas, color, valorDado) {
    this.nombre = nombre;
    this.fichasEnjauladas = numeroFichas;
    this.numeroFichas = numeroFichas;
    this.colorFicha = color;
    this.valorDado = valorDado;
    // this.colorFicha=this.colores.random()
    this.asignarFichas(numeroFichas);
  }

  asignarFichas(numeroFichas) {
    for (let i = 0; i < numeroFichas; i++) {
      let ficha = new Ficha(null, 'Carcel', this.nombre);
      this.fichas.push(ficha);
    }
  }
  // get nombre(){
  //     return this.nombre
  // }

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

          switch (this.colorFicha) {
            case 'Rojo':
              this.fichas[i].posicion =  54
              break;
            case 'Azul':
              this.fichas[i].posicion =  71
              break;
            case 'Verde':
              this.fichas[i].posicion =  38
              break;
      
            case 'Naranja':
              this.fichas[i].posicion =  21
              break;
      
            case 'Morado':
              this.fichas[i].posicion =  4
              break;
      
            case 'Amarillo':
              this.fichas[i].posicion =  88
              break;
          }

          
          break;
        }
      }
    }

    
    let valor1 = this.dadoUno;
    let valor2 = this.dadoDos;
    let valor3 = this.dadoUno + this.dadoDos;

    let posiciones = this.posicionesFichas();
    switch (this.colorFicha) {
      case 'Rojo':
        if (posiciones.includes(49) && valor3 == 8) {
          alert('Ganaste!');
        }
        break;
      case 'Azul':
        if (posiciones.includes(66) && valor3 == 8) {
          alert('Ganaste!');
        }
        break;
      case 'Verde':
        if (posiciones.includes(33) && valor3 == 8) {
          alert('Ganaste!');
        }
        break;

      case 'Naranja':
        if (posiciones.includes(16) && valor3 == 8) {
          alert('Ganaste!');
        }
        break;

      case 'Morado':
        if (posiciones.includes(100) && valor3 == 8) {
          alert('Ganaste!');
        }
        break;

      case 'Amarillo':
        if (posiciones.includes(83) && valor3 == 8) {
          alert('Ganaste!');
        }
        break;
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
      ]; //VALIDAR PARA RETORNAR EN UN DICCIONARIO
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
        this.asignarFichas(this.numeroFichas);
        this.puedeJugar = true;
        // this.ronda = this.ronda + 1;
        this.fichasLibres = 4;
        this.fichasEnjauladas = 0;
        for (let j = 0; j < this.fichas.length; j++) {
          if (this.fichas[j].estado == 'Carcel') {
            this.fichas[j].estado = 'Libre';
            this.fichas[j].posicion = 0;
          }
        }
        break;
      }

      if (i == 2) {
        alert('No tuviste suerte, intenta en la siguiente ronda');
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


// function Mover(ficha,valor){

// }


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


  // mover (valor) {
  //   this.posicion= (this.posicion+valor ) % 100

  //   return this.posicion


  // }





  // set posicion(posicionFicha){

  //     this.posicion=posicionFicha
  // }

  // get posicion(){
  //     return this.posicion
  // }
  // get estado(){
  //     return this.estado
  // }
}

class Tablero {
  jugadores: Jugador[] = [];
  constructor(jugadores) {
    this.jugadores = jugadores;
  }

  get numeroJug() {
    return this.jugadores.length;
  }
}

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
      console.log(player);
      console.log(player.colorFicha);
    }
  } //FALTA ORDENAR EL ARRAY CON LOS JUGADORES Y QUE NO SE REPITAN NUMEROS AL
  // GENERAR EL NUMERO QUE OBTUVO

  let tablero = new Tablero(jugadores);
  return tablero;
}

// Main(6,4)

function matarJugadora(jugadorKiller: JugadorType, jugadores: Array<JugadorType>) {
  let jugadoresPosibles = jugadores.filter((jugador) => jugador != jugadorKiller); // Filtro array con jugadores distintos al que ejecuta la accion de matar
  let fichasKiller = jugadorKiller.fichas; //Obtengo las fichas que tiene el jugador que quiere matar
  let banderaError = true; // Bandera que enviara mensaja de error en caso de activarse
  let posicionesKiller = fichasKiller.map((el) => el.posicion);

  jugadoresPosibles.forEach((currentPlayer) => {
    currentPlayer.fichas.forEach((ficha) => {
      if (posicionesKiller.includes(ficha.posicion)) {
        //Valido si el jugador en la posicion i tiene alguna ficha en la una misma posicion de alguna ficha del jugador que quiere matar
        ficha.estado = 'Carcel'; //Si existe alguna, luego esa ficha se convierte en el estado de "Carcel" es decir la mata
        banderaError = false;
      }
    });
  });
  if (banderaError) {
    alert('Juegue bien imbecil');
  }

  // for (let i = 0; i < jugadoresPosibles.length; i++) { // Itero sobre los jugadores diferentes al que quiere matar
  //     for (let j = 0; j < jugadoresPosibles[i].fichas.length; j++) { //Itero sobre las fichas del jugador en la posicion i
  //         if(posicionesKiller.includes(j.posicion)){  //Valido si el jugador en la posicion i tiene alguna ficha en la una misma posicion de alguna ficha del jugador que quiere matar
  //             j.estado="Carcel"   //Si existe alguna, luego esa ficha se convierte en el estado de "Carcel" es decir la mata
  //         }

  //     }
  // }
}


function PuedeMoverSegunRobert(valor1:number,valor2:number){
  const jugadasPosibles = [5,7,10,12]
  
  return (jugadasPosibles.includes(valor1) || 
         jugadasPosibles.includes(valor2) ||
         jugadasPosibles.includes(valor1+valor2))

}
