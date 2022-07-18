import { Ficha } from './logic/claseFicha';
import { Jugador } from './logic/claseJugador';
import { Tablero } from './logic/claseTablero';
export const defaultAccionesPosibles = {
  girarDados: true,
  soplar: true,
  matar: true,
  pasarDeTurno: false,
};
export interface ModalInterface {
  show: boolean;
  Componente: () => JSX.Element;
  setModal: (show: boolean, Componente: () => JSX.Element) => void;
  matarModal: (show: boolean) => void;
}
export interface StoreInterface {
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
  moverFicha: (mov: number) => void;
  soplarJugada: (jugadorSoplado: Jugador) => void;
}

export type ColorFichas = 'Rojo' | 'Amarillo' | 'Verde' | 'Azul' | 'Morado' | 'Naranja';
export type EstadoFichas = 'Libre' | 'Carcel' | 'Gano';

export type Coordinate = { x: number; y: number; z: number };
export interface ICarcel {
  [x: string]: Coordinate[];
}
export interface IMeta extends ICarcel{}
export interface IPosiciones {
  [x: number]: Coordinate[];
}