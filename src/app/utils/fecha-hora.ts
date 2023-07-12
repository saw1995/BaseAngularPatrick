function listaGestion() {
  let gestionActual = Number(new Date().getFullYear());
  let datosGestion = []
  let i:number = 0;
  let j:number = 0;
  for(i=2021 ; i<=gestionActual ; i++){
    datosGestion[j] = { gestion: i + "" }
    j++;
  }
  return datosGestion
}

export {
  listaGestion
}