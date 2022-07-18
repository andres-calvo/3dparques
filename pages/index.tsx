import Swal from 'sweetalert2';
import styles from '../styles/index.module.scss';
import { useRouter } from 'next/router';
const Page = (props) => {
  const router = useRouter()
  const crearTablero = (e) => {
    e.preventDefault()
    const inputJugadores = document.getElementById('numPlayers') as HTMLInputElement;
    const inputFichas = document.getElementById('numFichas') as HTMLInputElement;
    const numeroJugadores = parseInt(inputJugadores.value);
    const numeroFichas = parseInt(inputFichas.value);
    if(numeroFichas <= 0 || numeroJugadores <=0 || Number.isNaN(numeroFichas) || Number.isNaN(numeroJugadores)) return
    if (numeroFichas < 2 || numeroFichas > 4 || numeroJugadores < 2 || numeroJugadores > 6) {
      Swal.close();
      Swal.fire(
        'El numero ingresado de jugadores o fichas no es correcto',
        'Recuerde que debe ser minimo 2 fichas o máximo 4 y mínimo 2 y máximo 6',
        'error'
      );
      return;
    }
    localStorage.setItem("numeroJugadores",""+numeroJugadores)
    localStorage.setItem("numeroFichas",""+numeroFichas)
    router.push("/juego")
  };

  return (
    <div className={styles.wrapper}>
      <h2>Parques 3D Picapiedra</h2>
      <form >
        <label>
          Ingrese el numero de jugadores:
          <input id='numPlayers' min='2' max='6' type='number' placeholder='Un numero entre 2 y 6' />
        </label>
        <label>
          Ingrese el numero de fichas:
          <input id='numFichas' min='2' max='4' type='number' placeholder='Un numero entre 2 y 4' />
        </label>
        <button onClick={crearTablero} type='submit' >
          Enviar
        </button>
      </form>
    </div>
  );
};

export default Page;
