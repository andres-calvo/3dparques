1. Gira tres veces para sacar fichas
    1.1 Si saca par, todas las fichas quedan en estado libre y puede jugar ==True y pasa turno automaticamente
    1.2 Si no saca par, pasa turno automaticamente
2. Girar Dados
    2.1 Saca par:
        2.1.1 Si los valores no están dentro de [5,7,10,12], puede volver a girar dados y no se puede mover, Pasar turno ==false
        2.1.2 Si los valores están dentro de [5,7,10,12],se tiene que mover primero y luego puede volver a girar dados. Pasar turno==false
    
    2.2 Valores estan dentro
        2.2.1 Si los valores están dentro de [5,7,10,12],se tiene que mover primero y pasar turno. 
    
    2.3 Valores NO estan dentro
        2.3.1 Si los valores no están dentro de [5,7,10,12],  no se puede mover y pasar turno automaticamente., 

3. Mover
    3.1 Se mueve solo una ficha:
        3.1.1 Si el valor de la suma de los 2 dados son las casillas que el jugador se va a mover para una sola ficha, se reasigna la variable
        casilla de la ficha

    3.2 Se mueve en varias fichas:
        3.2.1 Mueve la ficha seleccionada. (Se debe habilitar para que mueva la otra ficha)

4. Matar
    4.1 Ficha está en casilla salida de color contrario:
        Si el oponente saca una ficha de la carcel, está inmediatamente mata las fichas de los colores diferentes a el que esten en la casilla de salida

    4.2 Ficha esta en una posicion distinta a salida de color contrario:
        Si un oponente cae en esa misma casilla, mata las fichas de los colores contrarios que se encuentren en esa casilla (Se activa dando click
        al boton matar)

    4.3 Si le da click a matar y no hay nada para matar: Mostrar modal diciendo que no puede matar a nadie y pasar turno automaticamente


5. Soplar:
        Se deben mostrar los jugadores, luego hacer click al jugador que quiere soplar, si al validar que el jugador que selecciono el estado de
        puedesoplar = True entonces a ese jugador le envia una ficha a la carcel

        Si el jugador que selecciono no tiene activo el campo puedesoplar, entonces mostrar modal que diga "No sea imbecil juegue bien" y pasar turno automaticamente

    

// Descripcion de como debe jugar,despues de haber sacado las fichas

Turno Jugador cero

1. Gira dados
    Deshabilitar botones Girar dado y pasar turno
    1.1 Puede moverse ?
    Aparecen los dados, pero deshabilitados
    Esperar a que el jugador seleccione una ficha. Luego activar dados
    Click en un dado
    Mover la ficha seleccionada x Casillas
    1.1.1 Quedan movimientos por realizar?
        Quitar de la pantalla dado anterior escogido y el dado resultante de la suma
        Deshabilitar dado
        Esperar a que el jugador seleccione una ficha y moverla automaticamente X casillas

    1.1.2 Saco par?
        Habilitar boton de girar dado
        Break
    







[5,5,10]

