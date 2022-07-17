import Swal, { SweetAlertIcon } from 'sweetalert2';
import create from 'zustand';
import { Ficha } from './logic/claseFicha';
import { Jugador } from './logic/claseJugador';
import { Tablero } from './logic/claseTablero';
import { mostrarMovimiento, matarJugador } from './logic/funcionalidades';

const defaultAccionesPosibles = {
  girarDados: true,
  soplar: true,
  matar: true,
  pasarDeTurno: false,
};

interface StoreInterface {
  dados: Array<{ id: string; valor: number }>;
  instanciaJuego: Tablero;
  instanciaJugadorActual: Jugador;
  jugadorActual: number;
  fichaActual: Ficha;
  movimientosPosibles: number[];
  accionesPosibles: typeof defaultAccionesPosibles;
  setAccionPosible: (accion: keyof typeof defaultAccionesPosibles, state: boolean) => void;
  siguienteTurno: () => void;
  setMovimientosPosibles: (ficha: Ficha) => void;
  setInstanciaJuego: (instanciaJuego: Tablero) => void;
  seleccionarFicha: (ficha: Ficha) => void;
  pasarTurno: () => void;
  girarDados: () => void;
  matarJugador: () => void;
  soplarJugada: (jugadorSoplado: Jugador) => void;


}
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
        if (posicionesKiller.includes(ficha.posicion)) {
          //Valido si el jugador en la posicion i tiene alguna ficha en la una misma posicion de alguna ficha del jugador que quiere matar
          ficha.estado = 'Carcel'; //Si existe alguna, luego esa ficha se convierte en el estado de "Carcel" es decir la mata
          banderaError = false;
        }
      });
    });
    if (banderaError) {
      Swal.close();
      Swal.fire(
        'No sea imbecil y juegue bien',
        'No puede matar a nadie , se le pasa turno por pendejo',
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
    get().setMovimientosPosibles(ficha);
  },
  setAccionPosible: (accion, state) => {
    set((prev) => ({ ...prev, accionesPosibles: { ...prev.accionesPosibles, [accion]: state } }));
  },

  soplarJugada: (jugadorSoplado) => {
    if (jugadorSoplado.estadoSoplar) {
      let ficha = jugadorSoplado.fichas.find((ficha) => ficha.estado == 'Libre');
      if (ficha) {
        ficha.estado = 'Carcel';
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
        return;
      }
      //Validacion de pares
      const [dado1, dado2, dado3] = jugada;
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
      fichaEncontrada.posicion = 102;
    }
  }
  return ganoUnaFicha;
}
