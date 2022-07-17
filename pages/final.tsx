import { useGameStore } from '@/store';
import React, { Fragment, Suspense, useEffect, useState } from 'react';
import { Main } from '@/logic/pruebaJuego';
import styles from '../styles/final.module.scss';
import Swal from 'sweetalert2';
import { OrbitControls } from '@react-three/drei';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three-stdlib';
import Ficha from '../src/components/Ficha';
import { useModalStore } from '@/modal-store';

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
  return (
    <div>
      <Header />
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
    <OrbitControls maxDistance={2} minDistance={0.7} maxPolarAngle={Math.PI / 2} />
    <FichasRenderer />
    <Scene />
  </>
);

const FichasRenderer = () => {
  const { instanciaJuego, seleccionarFicha } = useGameStore();
  const cantidadJugadores = instanciaJuego.jugadores;

  return (
    <>
      {cantidadJugadores.map((player) => {
        return (
          <Fragment key={player.colorFicha}>
            {player.fichas.map((f, i) => (
              <Ficha
                x={f.x}
                y={f.z}
                z={f.y * -1} // Al exportar de blender la Y salio invertida
                color={getHexColor[player.colorFicha]}
                key={f.id}
                onClick={() => seleccionarFicha(f)}
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
      <div>El jugador actual es {instanciaJugador?.colorFicha}</div>
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
  const setModal = useModalStore((state) => state.setModal);
  const mostrarSoplarJugador = () => {
    setModal(true, SoplarModalContenido);
  };

  return (
    <div className={styles.buttonsWrapper}>
      <button onClick={mostrarSoplarJugador} disabled={!accionesPosibles.matar}>
        Soplar Jugador
      </button>
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

const SoplarModalContenido = () => {
  const { soplarJugada } = useGameStore();
  const instanciaJuego = useGameStore((state) => state.instanciaJuego);
  const cantidadJugadores = instanciaJuego.jugadores;
  return (
    <>
      {cantidadJugadores.map((player) => {
        return (
          <div className='box' key={player.nombre}>
            <div onClick={() => soplarJugada(player.nombre)} style={{ cursor: 'pointer' }}>
              <div>
                <h2>{player.nombre}</h2>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

const MovimientosPosibles = () => {
  const movimientos = useGameStore((state) => state.movimientosPosibles);
  const moverFicha = useGameStore((state) => state.moverFicha);
  const fichaSeleccionada = useGameStore((state) => state.fichaActual);
  useEffect(() => {
    if (movimientos.length == 0 && fichaSeleccionada) {
      Swal.close();
      Swal.fire('Que mal :(', 'La ficha seleccionada no tiene movimientos posibles', 'error');
    }
  }, [movimientos]);
  const onMovClick = (n: number) => {
    moverFicha(n);
  };
  return (
    <div className={styles.movimientosPosibles}>
      {movimientos.map((el) => (
        <div key={el} onClick={() => onMovClick(el)}>
          {el}
        </div>
      ))}
    </div>
  );
};

const getHexColor = {
  Rojo: 'red',
  Morado: 'purple',
  Amarillo: 'yellow',
  Verde: 'green',
  Azul: 'blue',
  Naranja: 'orange',
};
