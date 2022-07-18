import create from 'zustand';
import { ModalInterface } from './types';

export const useModalStore = create<ModalInterface>((set, get) => ({
  show: false,
  Componente: () => <></>,
  setModal: (show, Componente) => {
    set({ show, Componente });
  },

  matarModal: (showModal) => {
    set({ show: showModal });
  },

}));
