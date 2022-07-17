
import { useGameStore } from '@/store';
import {  Main } from '@/logic/pruebaJuego';
import Swal from 'sweetalert2';


 const Page = (props) => {

    const store = useGameStore();

    const crearTablero = () =>{
        let inputJugadores=document.getElementById("numPlayers") as HTMLInputElement
        let numeroJugadores=parseInt(inputJugadores.value)
        let inputFichas=document.getElementById("numFichas") as HTMLInputElement
        let numeroFichas=parseInt(inputFichas.value) 

        if (numeroFichas < 2 || numeroFichas > 4 || numeroJugadores < 2 || numeroJugadores > 6) {
            Swal.close();
            Swal.fire(
            'El numero ingresado de jugadores o fichas no es correcto',
            'Recuerde que debe ser minimo 2 fichas o máximo 4 y mínimo 2 y máximo 6',
            'error'
            );
            return
          }
          
        let tablero=Main(numeroJugadores,numeroFichas)
        store.setInstanciaJuego(tablero)
    }

    const tablero=12
    return <div className={"menu"}>
    <div className='contenido'>


    
    <form action="">
    <label >Ingrese el numero de jugadores:</label>
    <input id="numPlayers"  min="2" max="6"type="number" />
    <label >Ingrese el numero de fichas:</label>
    <input id="numFichas" min="1" max="4" type="number" />
    <input onClick={crearTablero} type="submit" value="Enviar"/>
    </form>
    
    </div>
  </div>;
  };



  export default Page



