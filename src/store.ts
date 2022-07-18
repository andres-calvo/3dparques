import Swal from 'sweetalert2';
import create from 'zustand';
import { Jugador } from './logic/claseJugador';
import { POSICIONES_SALIDA, POSICION_CARCEL, POSICION_META } from './logic/constantes';
import { mostrarMovimiento } from './logic/funcionalidades';
import { defaultAccionesPosibles, StoreInterface } from './types';


export const useGameStore = create<StoreInterface>((set, get) => ({
  dados: [],
  instanciaJuego: null,
  instanciaJugadorActual: null,
  jugadorActual: 0,
  fichaActual: null,
  movimientosPosibles: [],
  accionesPosibles: defaultAccionesPosibles,
  matarJugador: () => {
    const instanciaJuego = get().instanciaJuego;
    const jugadorActual = get().jugadorActual;
    const jugadores = instanciaJuego.jugadores;
    const instanciaJugador = instanciaJuego.jugadores[jugadorActual];

    let jugadoresPosibles = jugadores.filter((jugador) => jugador != instanciaJugador); // Filtro array con jugadores distintos al que ejecuta la accion de matar
    let fichasKiller = instanciaJugador.fichas; //Obtengo las fichas que tiene el jugador que quiere matar
    let banderaError = true; // Bandera que enviara mensaja de error en caso de activarse
    let posicionesKiller = fichasKiller.map((el) => el.posicion);

    jugadoresPosibles.forEach((currentPlayer) => {
      currentPlayer.fichas.forEach((ficha) => {
        const estaEnSuSalida = POSICIONES_SALIDA[ficha.jugador.colorFicha] == ficha.posicion;
        if (posicionesKiller.includes(ficha.posicion) && !estaEnSuSalida) {
          //Valido si el jugador en la posicion i tiene alguna ficha en la una misma posicion de alguna ficha del jugador que quiere matar
          ficha.estado = 'Carcel'; //Si existe alguna, luego esa ficha se convierte en el estado de "Carcel" es decir la mata
          banderaError = false;
          ficha.posicion = POSICION_CARCEL;
          ficha.actualizarXYZ();
        }
      });
    });
    if (banderaError) {
      Swal.close();
      Swal.fire(
        'Error',
        'No puede matar a nadie , ha perdido su turno',
        'error'
      );
      get().pasarTurno();
    }
  },
  setInstanciaJuego: (instancia) => {
    set({ instanciaJuego: instancia, instanciaJugadorActual: instancia.jugadores[0] });
  },
  siguienteTurno: () => {
    const { jugadorActual, instanciaJuego } = get();
    const nuevoJugador = (jugadorActual + 1) % instanciaJuego.numeroJug;
    set({
      jugadorActual: nuevoJugador,
      instanciaJugadorActual: instanciaJuego.jugadores[nuevoJugador],
    });
  },
  pasarTurno: () => {
    const posicionSegura = [4, 21, 38, 54, 71, 88];
    const instanciaJuego = get().instanciaJuego;
    const jugadorActual = get().jugadorActual;
    const jugadores = instanciaJuego.jugadores;
    const instanciaJugador = instanciaJuego.jugadores[jugadorActual];
    const posicionesJugador = instanciaJugador.fichas.map((ficha) => ficha.posicion);
    let jugadoresPosibles = jugadores.filter((jugador) => jugador != instanciaJugador);

    jugadoresPosibles.forEach((jugador) => {
      jugador.fichas.forEach((ficha) => {
        if (
          posicionesJugador.includes(ficha.posicion) &&
          !posicionSegura.includes(ficha.posicion)
        ) {
          instanciaJugador.estadoSoplar = true;
        }
      });
    });

    get().siguienteTurno();
    set({
      accionesPosibles: {
        girarDados: true,
        pasarDeTurno: false,
        matar: true,
        soplar: true,
      },
      movimientosPosibles: [],
      dados: [],
      fichaActual: null,
    });
  },
  setMovimientosPosibles: (ficha) => {
    const dados = get().dados.map((el) => el.valor);
    set({
      movimientosPosibles: mostrarMovimiento(ficha, dados),
    });
  },
  seleccionarFicha: (ficha) => {
    set({ fichaActual: ficha });
    if (!ficha) {
      set({ movimientosPosibles: [] });
      return;
    }
    get().setMovimientosPosibles(ficha);
  },
  moverFicha: (mov) => {
    const { dados, fichaActual, setMovimientosPosibles, instanciaJugadorActual, setAccionPosible } =
      get();
    fichaActual.posicion = (fichaActual.posicion + mov) % POSICION_META;
    fichaActual.actualizarXYZ();
    const anteriorDadosFueronPar = dados[0].valor == dados[1].valor;

    set({ fichaActual: null });
    if (mov === dados[2].valor) {
      // dado2 es la suma de dado0 + dado1
      set({ dados: [] });
      setMovimientosPosibles(fichaActual);
      setAccionPosible('pasarDeTurno', !anteriorDadosFueronPar);
      return;
    }
    let encontrado = false; // En caso de que los dados sean 5,5,10 y el movimiento sea 5, modificaremos el primero encontrado
    const newDados = dados.map((dado) => {
      const newDado = { ...dado }; // Creamos una nueva referencia clonando los valores del dado
      if (dado.valor == mov && !encontrado) {
        encontrado = true;
        newDado.valor = 0;
      }
      return newDado;
    });
    newDados[2].valor = newDados[0].valor + newDados[1].valor;
    set({ dados: newDados });
    setMovimientosPosibles(fichaActual);
    const movimientosPosiblesFichas = instanciaJugadorActual.fichas.map((ficha) =>
      mostrarMovimiento(ficha, [newDados[0].valor, newDados[1].valor, newDados[2].valor])
    );
    if (movimientosPosiblesFichas.flat().length == 0) {
      setAccionPosible('pasarDeTurno', !anteriorDadosFueronPar);
      setAccionPosible('girarDados', anteriorDadosFueronPar);
    }
  },
  setAccionPosible: (accion, state) => {
    set((prev) => ({ ...prev, accionesPosibles: { ...prev.accionesPosibles, [accion]: state } }));
  },

  soplarJugada: (jugadorSoplado) => {
    if (jugadorSoplado.estadoSoplar) {
      let ficha = jugadorSoplado.fichas.find((ficha) => ficha.estado == 'Libre');
      if (ficha) {
        ficha.estado = 'Carcel';
        ficha.posicion = -1;
        ficha.actualizarXYZ();
      }
    }
  },

  girarDados: () => {
    const { instanciaJuego, jugadorActual, pasarTurno, setAccionPosible } = get();
    const instanciaJugador = instanciaJuego.jugadores[jugadorActual];
    if (!instanciaJugador.puedeJugar) {
      instanciaJugador.sacarFichas();
      pasarTurno();
      return;
    } else {
      const jugada = instanciaJugador.girarDados();
      set({ dados: jugada });
      setAccionPosible('girarDados', false);
      setAccionPosible('pasarDeTurno', false);
      if (jugada.length == 0) {
        pasarTurno();
        Swal.close();
        Swal.fire('No tuviste suerte', 'Intenta en la siguiente ronda', 'warning');
        return;
      }

      const [dado1, dado2, dado3] = jugada;
      Swal.close();
      Swal.fire(
        'Has tenido suerte',
        `Tu dados son ${dado1.valor} y ${dado2.valor} . Selecciona una de tus ficha para averiguar sus movimientos posibles`,
        'success'
      );
      //Validacion de pares
      const isPar = dado1.valor == dado2.valor;
      if (isPar) {
        instanciaJugador.cantidadPares = instanciaJugador.cantidadPares + 1;
        instanciaJugador.volverTirar = true;
        const ganoUnaFicha = onIsPar(instanciaJugador);
        if (!ganoUnaFicha) {
          Swal.close();
          Swal.fire(
            'Sacaste par',
            'Si sacas tres pares de seguido, una ficha sera sacada del juego automaticamente. Vuelve a girar los dados',
            'success'
          );
        }
        const movimientosPosiblesFichas = instanciaJugador.fichas.map((ficha) =>
          mostrarMovimiento(ficha, [dado1.valor, dado2.valor, dado3.valor])
        );
        if (movimientosPosiblesFichas.flat().length == 0) {
          setAccionPosible('girarDados', true);
        }
      } else {
        instanciaJugador.cantidadPares = 0;
        instanciaJugador.volverTirar = false;
        const movimientosPosiblesFichas = instanciaJugador.fichas.map((ficha) =>
          mostrarMovimiento(ficha, [dado1.valor, dado2.valor, dado3.valor])
        );
        if (movimientosPosiblesFichas.flat().length == 0) {
          setAccionPosible('pasarDeTurno', true);
          setAccionPosible('girarDados', false);
        }
      }
    }
  },
}));

function onIsPar(instanciaJugador: Jugador) {
  let ganoUnaFicha = false;
  if (instanciaJugador.cantidadPares == 3) {
    instanciaJugador.volverTirar = false;
    const fichaEncontrada = instanciaJugador.fichas.find((ficha) => ficha.estado !== 'Gano');
    ganoUnaFicha = fichaEncontrada != null;
    if (fichaEncontrada) {
      fichaEncontrada.estado = 'Gano';
      fichaEncontrada.posicion = POSICION_META;
      Swal.close();
      Swal.fire(
        'Felicidades',
        'Una de tu fichas ha llegado a la meta.',
        'success'
      );
    }
  }
  return ganoUnaFicha;
}
