var CANT_FILAS = 6;
var CANT_COLUMNAS = 5;
var PALABRA_GANADORA = "BIRRA";

window.onload = function() {
    const tablero = document.getElementById("tablero");
    llenarTablero = function() {
        for(let i=0; i<CANT_FILAS; i++){
            var fila = document.createElement("fieldset");
            fila.setAttribute("id",`row${i}`);
            tablero.appendChild(fila);
            for(let j=0; j<CANT_COLUMNAS; j++){
                var letra = document.createElement("input");
                letra.setAttribute("id",`f${i}c${j}`);
                letra.setAttribute("maxlength","1");
                fila.appendChild(letra);
            }
        }
        document.getElementById("f0c0").focus();
    }

    var colores = {
        VERDE: 1,
        AMARILLO: 2,
        GRIS: 3,
        BLANCO: 0
    }

    var colorTablero = [
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
    ]

    function prepararPalabras(){
        setTimeout(5000);
        fetch('https://palabras-aleatorias-public-api.herokuapp.com/random-by-length?length=5')
        .then(response => response.json())
        .then(data => {
            PALABRA_GANADORA = data.body.Word.toUpperCase();
            if(PALABRA_GANADORA.indexOf("Á") != -1
            || PALABRA_GANADORA.indexOf("É") != -1
            || PALABRA_GANADORA.indexOf("Í") != -1
            || PALABRA_GANADORA.indexOf("Ó") != -1
            || PALABRA_GANADORA.indexOf("Ú") != -1){
                location.reload();
            } //consultar si está bien refrescar la página para que haga un refetch
        }).catch(error => {
            console.log(error);
        });
    }

    pintarTablero = function(){
        for(let i = 0; i<CANT_FILAS; i++){
            for(let j = 0; j<CANT_COLUMNAS; j++){
                var input = document.getElementById(`f${i}c${j}`);
                switch(colorTablero[i][j]){
                    case 1: input.classList.add("verde"); break;
                    case 2: input.classList.add("amarillo"); break;
                    case 3: input.classList.add("gris"); break;
                    case 0: break;
                }
            }
        }
    }

    document.onkeydown = function(e){
        e.preventDefault();
        if(e.keyCode > 64 && e.keyCode < 91 || e.keyCode === 192) {
            document.activeElement.value = e.key.toUpperCase();
        }
        if(e.key != "Enter" && e.key != "Backspace"){
            const input_letra = document.activeElement;
            if(input_letra.nextSibling != null && input_letra.value != ""){
                input_letra.nextSibling.focus();
            }
        }
    }

    obtenerValoresFila = function (indice){
        resultado = [CANT_COLUMNAS];
        for(var i = 0; i<CANT_COLUMNAS;i++){
            resultado[i] = document.getElementById(`f${indice}c${i}`).value.toUpperCase();
        }
        return resultado;
    }

    guardarRespuesta = function(){
        respuestas = [CANT_FILAS];
        for(var i = 0; i < CANT_FILAS; i++){
            respuestas[i] = obtenerValoresFila(i);
        }
        return respuestas;
    }
    //verica si el renglon es correcto
    revisarLinea = function(lineaRespuesta, indice){
        var ganadora = PALABRA_GANADORA.split("");
        var gano = 0;
        lineaRespuesta.forEach(function(letra,i) {
        if(ganadora.indexOf(letra) != -1){
            colorTablero[indice][i] = colores.AMARILLO;
        } else {
            colorTablero[indice][i] = colores.GRIS;
        }
        if(letra === ganadora[i]){
            colorTablero[indice][i] = colores.VERDE;
            gano++;
        }
       });
       return gano === ganadora.length;
    }

    //verifica si el renglon tiene todas las letras
    lineaEstaCompleta = function(indice){
        var linea = obtenerValoresFila(indice);
        var completa = true;
        linea.forEach(function(letra){
            if(letra === ""){
                completa = false;
            }
        });
        return completa;
    }

    inicio = function() {
        prepararPalabras();
        llenarTablero();
        for(let i = 0; i<CANT_FILAS; i++){
            var fieldset = document.getElementById(`row${i}`);
            fieldset.onkeydown = function (event){
                if(event.key === "Enter" && lineaEstaCompleta(i)){
                    var respuestas = guardarRespuesta();
                    var gano = revisarLinea(respuestas[i], i);
                    pintarTablero();
                    if(gano){
                        alert("Ganaste");
                    } else if (i === CANT_FILAS - 1){
                        alert("Perdiste, la palabra era: " + PALABRA_GANADORA);
                    }
                    if(document.activeElement.parentElement.nextElementSibling != null && document.activeElement.value != "")
                        document.activeElement.parentElement.nextElementSibling.firstChild.focus();
                }
                if(event.key === "Backspace"){
                    document.activeElement.value = "";
                    if(document.activeElement.previousSibling != null){
                        document.activeElement.previousSibling.focus();
                    }
                }
            }
        }
    }

    inicio();
}