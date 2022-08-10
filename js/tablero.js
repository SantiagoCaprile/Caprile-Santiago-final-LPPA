const CANT_FILAS = 6;
const CANT_COLUMNAS = 5;
var PALABRA_GANADORA = "";

window.onload = function() {
    const tablero = document.getElementById("tablero");
    const btnGuardar = document.getElementById("btn-guardar");
    const btnVolver = document.getElementById("btn-volver");
    var cronometro = document.getElementById("cronometro");
    cronometro.innerHTML = "00:00";
    var cronometro_segundos = 0;
    var cronometro_minutos = 0;

    llenarTablero = function() {
        for(var i=0; i<CANT_FILAS; i++){
            var fila = document.createElement("fieldset");
            fila.setAttribute("id",`row${i}`);
            tablero.appendChild(fila);
            if(i>0){
                fila.disabled = true;
            }
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

    function iniciarContador(){
        return setInterval(function(){
            cronometro_segundos++;
            if(cronometro_segundos === 60){
                cronometro_segundos = 0;
                cronometro_minutos++;
            }
            cronometro.innerHTML = (cronometro_minutos < 10 ? "0" + cronometro_minutos : cronometro_minutos) 
            + ":" + (cronometro_segundos < 10 ? "0" + cronometro_segundos : cronometro_segundos);
        },1000);
    };

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

    logicaJuego = function(i,intervalo) {
        var fieldset = document.getElementById(`row${i}`);
            fieldset.onkeydown = function (event){
                if(event.key === "Enter" && lineaEstaCompleta(i)){
                    var respuestas = guardarRespuesta();
                    var gano = revisarLinea(respuestas[i], i);
                    pintarTablero();
                    if(gano){
                        clearInterval(intervalo);
                        document.getElementById("btn-guardar").classList.add("oculto");
                        document.getElementById("btn-volver").classList.remove("oculto");
                        document.activeElement.parentElement.disabled = true;
                        document.getElementById("modal-gano").classList.remove("oculto");
                    } else if (i === CANT_FILAS - 1){
                        clearInterval(intervalo);
                        document.getElementById("btn-guardar").classList.add("oculto");
                        document.getElementById("btn-volver").classList.remove("oculto");
                        document.activeElement.parentElement.disabled = true;
                        document.activeElement.blur();
                        document.getElementById("solucion").innerHTML = "La palabra ganadora era: " + PALABRA_GANADORA;
                        document.getElementById("modal-perdio").classList.remove("oculto");
                    }
                    if(document.activeElement.parentElement.nextElementSibling != null){
                        document.activeElement.parentElement.nextElementSibling.disabled = false;
                        document.activeElement.parentElement.nextElementSibling.firstChild.focus();
                        document.activeElement.parentElement.previousElementSibling.disabled = true;
                    }
                }
                if(event.key === "Backspace"){
                    document.activeElement.value = "";
                    if(document.activeElement.previousSibling != null){
                        document.activeElement.previousSibling.focus();
                    }
                }
            }
    }

    inicio = function() {
        var intervalo = iniciarContador();
        if(localStorage.getItem("partidas") == []){
            localStorage.setItem("partidas",[]);
        }
        prepararPalabras();
        llenarTablero();
        for(let i = 0; i<CANT_FILAS; i++){
            logicaJuego(i,intervalo);
        }
    }

    document.getElementById("cerrar-gano").onclick = function() {
        document.getElementById("modal-gano").classList.add("oculto");
    }

    document.getElementById("cerrar-perdio").onclick = function() {
        document.getElementById("modal-perdio").classList.add("oculto");
    }

    //retorna el id del primer input vacio
    obtenerPrimerVacio = function(){
        var inputs = document.getElementsByTagName("input");
        for(var i = 0; i < inputs.length; i++){
            if(inputs[i].value === ""){
                return inputs[i];
            }
        }
        return inputs[0];
    }

    cargarTablero = function(respuestas) {
        for(var i=0; i<CANT_FILAS; i++){
            var fila = document.createElement("fieldset");
            fila.setAttribute("id",`row${i}`);
            tablero.appendChild(fila);
            fila.disabled = true;
            for(let j=0; j<CANT_COLUMNAS; j++){
                var letra = document.createElement("input");
                letra.setAttribute("id",`f${i}c${j}`);
                letra.setAttribute("maxlength","1");
                letra.value = respuestas[i][j];
                fila.appendChild(letra);
            }
        }
        var cursor = obtenerPrimerVacio();
        cursor.parentElement.disabled = false;
        cursor.focus();
        var fila = cursor.id[1];
        if(fila != 0){
            for(var i = 0; i < fila; i++){
                revisarLinea(respuestas[i], i);
            }
        }
        pintarTablero();
        reanudarJuego(fila);
    }

    reanudarJuego = function(fila) {
        var intervalo = iniciarContador();
        for(let i = fila; i<CANT_FILAS; i++){
            logicaJuego(i,intervalo);
        }
    }

    //carga la partida guardada en el localStorage
    function cargarPartida(){
        var partidas = JSON.parse(localStorage.getItem("partidas"));
        var partida = partidas[localStorage.getItem("partida")];
        if(partida != null){
            PALABRA_GANADORA = partida.PALABRA_GANADORA;
            var tiempo = new Date(partida.tiempo);
            cronometro_segundos = tiempo.getSeconds();
            cronometro_minutos = tiempo.getMinutes();
            cargarTablero(partida.respuestas);
        }
    }

    function guardarPartida(){
        var nombre = localStorage.getItem("nombre");
        var respuestas = guardarRespuesta();
        var crono = new Date();
        crono.setSeconds(cronometro_segundos);
        crono.setMinutes(cronometro_minutos);
        var partida = {
            nombre: nombre,
            respuestas: respuestas,
            PALABRA_GANADORA: PALABRA_GANADORA,
            tiempo: crono
        }
        var partidas = JSON.parse(localStorage.getItem("partidas"));
        if(partidas == null){
            partidas = [];
        }
        partidas.push(partida);
        localStorage.setItem("partidas", JSON.stringify(partidas));
    }

    btnGuardar.onclick = function(e) {
        e.preventDefault();
        guardarPartida();
        btnGuardar.classList.add("oculto");
        setTimeout(function(){
            window.location.href = "index.html";
        } ,1000);
    }

    btnVolver.onclick = function(e) {
        e.preventDefault();
        window.location.href = "index.html";
    }

    if(partidaExistente == "" || localStorage.getItem("nombre") == ""){
        location.href = "index.html";
    }

    var partidaExistente = localStorage.getItem("partida");
    if(partidaExistente != "" && localStorage.getItem("nombre") != ""){
        console.log("partida existente");
        console.log(partidaExistente);
        cargarPartida();
    } else {
        console.log("partida nueva");
        inicio();
    }

}