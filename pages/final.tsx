import { useGameStore } from '@/store';
import React, { useEffect } from 'react';
import { Main } from '@/logic/pruebaJuego';
import styles from '../styles/final.module.scss';
import Swal from 'sweetalert2';

const Final = () => {
  const store = useGameStore();
  useEffect(() => {
    store.setInstanciaJuego(Main(4, 3));
    Swal.close();
    Swal.fire(
      'Bienvenido al juego',
      'Presiona girar dados para intentar sacar tus fichas de la carcel',
      'info'
    );
  }, []);
  console.log(store);
  return (
    <div>
      <Header />
      <Fichas />
      <MovimientosPosibles/>
      <Buttons />
    </div>
  );
};

export default Final;

const Header = () => {
  const instanciaJugador = useGameStore((state) => state.instanciaJugadorActual);
  return (
    <section className={styles.header}>
      <div>El jugador actual es {instanciaJugador?.nombre}</div>
      <div>Cantidad de fichas {instanciaJugador?.fichas.length}</div>
      <div>Cantidad de fichas fichasEnjauladas {instanciaJugador?.fichasEnjauladas}</div>
    </section>
  );
};
/**
 * Se encarga de renderizar las acciones del juego
 *
 * Como Girar Dados, Pasar Turno, Matar , Soplar
 */
const Buttons = () => {
  const { pasarTurno, matarJugador, accionesPosibles, girarDados } = useGameStore();

  return (
    <div className={styles.buttonsWrapper}>
      <button onClick={matarJugador} disabled={!accionesPosibles.matar}>
        Matar Jugador
      </button>
      <button onClick={girarDados} disabled={!accionesPosibles.girarDados}>
        Girar dados
      </button>
      <button onClick={pasarTurno} disabled={!accionesPosibles.pasarDeTurno}>
        Pasar Turno
      </button>
    </div>
  );
};

const Fichas = () => {
  const getHexColor = {
    Rojo: 'red',
    Morado: 'purple',
    Amarillo: 'yellow',
    Verde: 'green',
    Azul: 'blue',
    Naranja: 'orange',
  };
  const { seleccionarFicha, instanciaJugadorActual, fichaActual } = useGameStore();
  return (
    <div className={styles.fichasWrapper}>
      {instanciaJugadorActual?.fichas.map((ficha) => (
        <div
          key={ficha.id}
          onClick={() => seleccionarFicha(ficha)}
          style={{ background: getHexColor[instanciaJugadorActual.colorFicha] }}
          data-selected={fichaActual == ficha}
        >
          <p>Id : {ficha.id}</p>
          <p>Posicion : {ficha.posicion}</p>
        </div>
      ))}
    </div>
  );
};


const MovimientosPosibles = ()=>{
  const movimientos = useGameStore((state)=>state.movimientosPosibles)
  const seleccionarFicha = useGameStore((state)=>state.seleccionarFicha)
  // useEffect(() => {
  //   if(movimientos.length == 0){
  //     Swal.close()
  //     Swal.fire("Que mal :(","La ficha seleccionada no tiene movimientos posibles","error")
  //     seleccionarFicha(null)
  //   }
   
    
  // }, [movimientos])
  return <div>
    {movimientos.map(el => <div>{el}</div>)}
  </div>
}