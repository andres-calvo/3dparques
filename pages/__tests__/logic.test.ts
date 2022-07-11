let posicionesEspeciales=[4,11,16,21,28,33,38,44,49,54,61,66,71,78,83,88,95,100]

const fichasTest = [
    {id:"nepe1",posicion:4},
    {id:"nepe2",posicion:11},
    {id:"nepe3",posicion:16},
    {id:"nepe4",posicion:21},
]


function fichasQuePuedenMoverse(valor:number){
    return fichasTest.filter(ficha => posicionesEspeciales.includes((ficha.posicion + valor) % 100))
}

export {}