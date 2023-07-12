var arrayLetra = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '$a', '-b', '_c', '.d', '+e', '!f', '*g', '(h', ')i', '!j', '*k', '(l', ')m', '$n', '-o', '_p', '.q', '+r', '.s', '+t', '!u', '*v', '(w', ')x', '$y', '-z', '_A', ')B', '(C', '*D', '!E', '+F', '.G', '_H', '-I', '$J', '$K', '-L', '_M', '.N', '+O', '!P', '*Q', '(R', ')S', '(T', ')U', '-W']

function encryptNumber(numero:any){
    let id_inv:any = ""
    let encrypt:any = ""
    //console.log(numero)
    //console.log(numero.length)
    let i:number
    for(i=0;i<numero.length;i++){
      id_inv = numero[i] + id_inv
      //console.log("inv",id_inv)
    }
    //console.log(id_inv)
    for(i=0;i<id_inv.length;i=i+2){
      let numero:string = id_inv.substring(i,i+2)
      if(numero.length == 2){
        encrypt = encrypt + arrayLetra[Number(numero)]
      }else{
        encrypt = encrypt + numero
      }
    }
    //console.log(id_inv)
    return encrypt;
}

function decryptNumber(cadena:any){
    let cadena_inv:string = ""
    let decrypt:string = ""

    let i:number
    for(i=0;i<cadena.length;i++){
      if(Number(cadena.substring(i))){
        cadena_inv = cadena_inv + cadena.substring(i, i+1)
      }else{
        let letra = cadena.substring(i, i+1)
        let index = 0;
        if(letra == "$" || letra == "-" || letra == "_" || letra == "." || letra == "+" || letra == "!" || letra == "*" || letra == "(" || letra == ")"){
          index = arrayLetra.indexOf(cadena.substring(i, i+2));
          i = i + 1;
        }else{
          index = arrayLetra.indexOf(cadena.substring(i, i+1));
        }
        if(index < 10 ){
          cadena_inv = cadena_inv + "0"
        }
        cadena_inv = cadena_inv + index
      }
    }
    for(i=0;i<cadena_inv.length;i++){
        decrypt = cadena_inv[i] + decrypt
    }
    return decrypt;
}

export {
    encryptNumber,
    decryptNumber
}