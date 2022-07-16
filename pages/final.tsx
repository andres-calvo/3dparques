import { useGameStore } from '@/store';
import React, { Fragment, Suspense, useEffect, useState } from 'react';
import { Main } from '@/logic/pruebaJuego';
import styles from '../styles/final.module.scss';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { OrbitControls } from '@react-three/drei';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three-stdlib';
import {FichaAmarilla,FichaAzul,FichaMorada,FichaNaranja,FichaRoja,FichaVerde} from '../Ficha';
import carcelJson from '../carcel.json';

const Final = () => {
  const store = useGameStore();
  useEffect(() => {
    store.setInstanciaJuego(Main(4, 3));
    // Swal.close();
    // Swal.fire(
    //   'Bienvenido al juego',
    //   'Presiona girar dados para intentar sacar tus fichas de la carcel',
    //   'info'
    // );
  }, []);
  return (
    <div>
      <Header />
      {/* <Fichas /> */}
      <MovimientosPosibles />
      <Buttons />
      {/* <ModalJugadores /> */}
    </div>
  );
};
const Scene = () => {
  const gltf = useLoader(GLTFLoader, '/parquesv7.glb');
  return (
    <Suspense fallback={null}>
      <primitive object={gltf.scene} />
    </Suspense>
  );
};
Final.r3f = (props) => (
  <>
    <ambientLight />
    <OrbitControls />
    <FichasRenderer />
    <Scene />
  </>
);
const FichasToggle = {
  Rojo: FichaRoja,
  Morado: FichaMorada,
  Amarillo: FichaAmarilla,
  Verde: FichaVerde,
  Azul: FichaAzul,
  Naranja: FichaNaranja,
}
const FichasRenderer = () => {
  const { instanciaJuego } = useGameStore();
  const cantidadJugadores = instanciaJuego.jugadores;
  return (
    <>
      {cantidadJugadores.map((player) => {
        console.log(player.colorFicha);
        const carcel = carcelJson[player.colorFicha];
        const Ficha = FichasToggle[player.colorFicha]
        return (
          <Fragment key={player.nombre}>
            {player.fichas.map((f, i) => (
              <Ficha
                x={carcel[i].x}
                y={carcel[i].z}
                z={carcel[i].y}
                color={getHexColor[player.colorFicha]}
                key={f.id}
              />
            ))}
          </Fragment>
        );
      })}
    </>
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

const MovimientosPosibles = () => {
  const movimientos = useGameStore((state) => state.movimientosPosibles);
  const seleccionarFicha = useGameStore((state) => state.seleccionarFicha);
  // useEffect(() => {
  //   if(movimientos.length == 0){
  //     Swal.close()
  //     Swal.fire("Que mal :(","La ficha seleccionada no tiene movimientos posibles","error")
  //     seleccionarFicha(null)
  //   }

  // }, [movimientos])
  return (
    <div>
      {movimientos.map((el) => (
        <div>{el}</div>
      ))}
    </div>
  );
};

const ModalJugadores = () => {
  const instanciaJugador = useGameStore((state) => state.instanciaJugadorActual);
  // const instanciaJuego = useGameStore((state) => state.instanciaJuego);
  // const cantidadJugadores = instanciaJuego.jugadores;
  const MySwal = withReactContent(Swal);

  useEffect(() => {
    setTimeout(() => {
      Swal.close();
      MySwal.fire({
        title: <p>Hello World</p>,
        didOpen: () => {
          // `MySwal` is a subclass of `Swal` with all the same instance & static methods
          // MySwal.showLoading()
        },
      });
    }, 10000);
  }, []);
  return <></>;

  // .then(() => {
  //   return MySwal.fire(<p>Shorthand works too</p>)
  // })
};
const DisplayPlayers = () => {};
const getHexColor = {
  Rojo: 'red',
  Morado: 'purple',
  Amarillo: 'yellow',
  Verde: 'green',
  Azul: 'blue',
  Naranja: 'orange',
};
