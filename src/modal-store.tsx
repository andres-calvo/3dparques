import create from 'zustand';
import {ReactElement} from "react"
interface ModalInterface{
    show:boolean,
    Componente:()=>JSX.Element
    setModal:(show:boolean,Componente:()=>JSX.Element)=>void
    matarModal:(show:boolean)=>void
}
export const useModalStore = create<ModalInterface>((set,get)=>({
    show:false,
    Componente:()=><></>,
    setModal:(show,Componente)=>{
        set({show,Componente})
    },

    
    
    matarModal: (showModal) => {
        set({show: showModal });
      },
    // siguienteTurno: () => {
    //     set({false,})
    //   }
}))




