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
    llenarTablero();
    var colores = {
        VERDE: 1,
        AMARILLO: 2,
        GRIS: 3,
        BLANCO: 0
    }
    var colorTablero = [
        [1,2,3,0,0],
        [0,0,2,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
    ]

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
    pintarTablero();
    document.onkeydown = function(e){
        e.preventDefault();
        if(e.keyCode > 64 && e.keyCode < 91) {
            document.activeElement.value = e.key.toUpperCase();
        }
    }
    document.onkeyup = function(e){
        if(e.key != "Enter"){
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
        respuestas = [6];
        for(var i = 0; i < CANT_FILAS; i++){
            respuestas[i] = obtenerValoresFila(i); 
        }
        return respuestas;
    }
    revisarResultado = function(respuestas, indice){
    var ganadora = PALABRA_GANADORA.split("");
    
    
    }

    revisarLinea = function(respuesta){
        var ganadora = PALABRA_GANADORA.split("");
        respuesta.forEach(function(elem,i) {
        if(elem == ganadora[i]){
            colorTablero[0,i];
        }
        pintarTablero();
       });
    }
    inicio = function() {
        for(let i = 0; i<CANT_FILAS; i++){
            var fieldset = document.getElementById(`row${i}`);
            fieldset.onkeydown = function (event){
                if(event.key === "Enter"){
                    var respuestas = guardarRespuesta();
                    console.log(respuestas);
                    console.log(colorTablero); 
                    revisarLinea(respuestas[0]);
                    if(document.activeElement.parentElement.nextElementSibling != null && document.activeElement.value != "")
                        document.activeElement.parentElement.nextElementSibling.firstChild.focus();
                }
            }
        }
    }   
    inicio();
}