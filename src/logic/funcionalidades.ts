import { POSICIONES_ESPECIALES } from "./constantes";

export function matarJugador(jugadorKiller,jugadores) {
    let jugadoresPosibles = jugadores.filter((jugador) => jugador != jugadorKiller); // Filtro array con jugadores distintos al que ejecuta la accion de matar
    let fichasKiller = jugadorKiller.fichas; //Obtengo las fichas que tiene el jugador que quiere matar
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
      alert('Juegue bien imbecil');
    }
}



export function mostrarMovimiento(ficha,valores){
let dados=[5,7,10,12] 
let movimientosPosibles=[]
if(dados.includes(valores[0]) || dados.includes(valores[1])|| dados.includes(valores[2])){
    if(POSICIONES_ESPECIALES.includes((ficha.posicion+valores[0])% 101)){
        movimientosPosibles.push(valores[0])
    }
    if(POSICIONES_ESPECIALES.includes((ficha.posicion+valores[1])% 101)){
        movimientosPosibles.push(valores[1])
    }
    if(POSICIONES_ESPECIALES.includes((ficha.posicion+valores[2])% 101)){
        movimientosPosibles.push(valores[2])
    }
}

return movimientosPosibles

} 

export function mover(ficha,valor ){
    ficha.posicion=(ficha.posicion+valor) % 101
}


export function soplarJugada(jugadores,jugadorSoplado){
    const casillasSalida=[4,21,38,54,71,88]
     
    if(jugadorSoplado.estadoSoplar){

    }

}

