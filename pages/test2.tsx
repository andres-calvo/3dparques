import React, { useEffect, useState } from 'react';
import { Main } from '@/logic/pruebaJuego';
import { mostrarMovimiento } from '@/logic/funcionalidades';
const test2 = () => {
  const [tablero, setTablero] = useState(Main(4, 3));
  const [jugadorUno, setJugadorUno] = useState(tablero.jugadores[0])
  const [isReady, setIsReady] = useState(false)
  useEffect(() => {

    while (jugadorUno.puedeJugar == false) {
      jugadorUno.sacarFichas();
    }
    console.log(jugadorUno)
    //A partir de aqui puede jugar
    setIsReady(true)
  }, []);
  let valores=[5,7,12]
  if(!isReady) return null
  return (
    <div>
        {jugadorUno.fichas.map((fichita)=> <div key={fichita.id} onClick={()=>console.log(mostrarMovimiento(fichita,valores))} >
            <h3>
                {fichita.id}
            </h3>
            <h3>
                {fichita.posicion}
            </h3>
        </div>)}
      
      <div>
        
      </div>

      <button></button>
      <button></button>
      <button></button>
    </div>
  );
};

export default test2;
