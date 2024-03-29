const CANT_FILAS = 6;
const CANT_COLUMNAS = 5;
const listaAuxiliares = ["ARCOS","BANCO", "BARCO", "CARRO", "CANTO", "RONCA", "MOSCA",
"POSTA", "PLATO", "LAICO", "FLACO", "GORDO", "ENTRE", "QUIEN", "JUGAR", "MESSI", "HARRY",
"TRIGO", "LIRIO", "RENGO", "GANZO", "CABRA", "MANTO", "MARCO", "PALOS", "PALMA", "LOROS",
"JARRA", "TALCO", "FALSO", "HACER", "HORNO", "HORCA", "DADOS", "DEDOS", "VALLA", "RAYAS",
"JERGA", "POLLO", "LLORO", "GORRO", "ARBOL", "KILOS", "TRAER", "VILLA", "PIZZA", "PAPEL",
"ATEOS", "OCASO", "QUESO", "ARMAS", "CARNE", "CASAS", "ARAÑA", "AFANO", "ARROZ", "ARENA"];
var PALABRA_GANADORA = "";

window.onload = function() {
    const tablero = document.getElementById("tablero");
    const btnGuardar = document.getElementById("btn-guardar");
    const btnVolver = document.getElementById("btn-volver");
    var cronometro = document.getElementById("cronometro");
    cronometro.innerHTML = "00:00";
    var cronometro_segundos = 0;
    var cronometro_minutos = 0;
    var ultimoInput = "";

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

    // Crea el tablero de juego desde cero
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
                letra.onfocus = function(e) {
                    ultimoInput = e.target;
                }
                fila.appendChild(letra);
            }
        }
        document.getElementById("f0c0").focus();
    }

    // Selecciona la palabra ganadora de la api
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
    //Maneja la escritura en el tablero
    document.onkeydown = function(e){
        e.preventDefault();
        if(e.keyCode > 64 && e.keyCode <= 91 || e.key === "ñ" || e.key === "Ñ") {
            document.activeElement.value = e.key.valueOf().toUpperCase();
            const input_letra = document.activeElement;
            if(input_letra.nextSibling != null && input_letra.value != ""){
                input_letra.nextSibling.focus();
            }
        }
    }
    //retorna un arreglo con todos valores de los inputs de la fila indicada
    obtenerValoresFila = function (indice){
        resultado = [CANT_COLUMNAS];
        for(var i = 0; i<CANT_COLUMNAS;i++){
            resultado[i] = document.getElementById(`f${indice}c${i}`).value.toUpperCase();
        }
        return resultado;
    }
    //guarda la palabra ingresada en ese renglón
    guardarRespuesta = function(){
        respuestas = [CANT_FILAS];
        for(var i = 0; i < CANT_FILAS; i++){
            respuestas[i] = obtenerValoresFila(i);
        }
        return respuestas;
    }
    //verica si el renglon es correcto y lo pinta segun la palabra ganadora
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
    //la i es el indice del renglon
    logicaJuego = function(i,intervalo) {
        var fieldset = document.getElementById(`row${i}`);
        fieldset.onkeydown = function (event){
            if(event.key === "Enter" && lineaEstaCompleta(i) && PALABRA_GANADORA.length != 0){
                var respuestas = guardarRespuesta();
                var gano = revisarLinea(respuestas[i], i);
                pintarTablero();
                if(gano){
                    clearInterval(intervalo);
                    document.getElementById("btn-guardar").classList.add("oculto");
                    document.getElementById("btn-volver").classList.remove("oculto");
                    document.activeElement.parentElement.disabled = true;
                    document.getElementById("modal-gano").classList.remove("oculto");
                    guardarPartida(true);//mando true porque gano
                } else if (i === CANT_FILAS - 1){
                    clearInterval(intervalo);
                    document.getElementById("btn-guardar").classList.add("oculto");
                    document.getElementById("btn-volver").classList.remove("oculto");
                    document.activeElement.parentElement.disabled = true;
                    document.activeElement.blur();
                    document.getElementById("solucion").innerHTML = "La palabra ganadora era: " + PALABRA_GANADORA;
                    document.getElementById("modal-perdio").classList.remove("oculto");
                    borrarPartida();
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

    //iniciar el juego desde cero
    inicio = function() {
        var intervalo = iniciarContador();
        if(localStorage.getItem("partidas") == []){
            localStorage.setItem("partidas",[]);
        }
        prepararPalabras();
        if(PALABRA_GANADORA == ""){
            PALABRA_GANADORA = listaAuxiliares[Math.floor(Math.random() * listaAuxiliares.length)];
        }
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

    reanudarJuego = function(fila) {
        var intervalo = iniciarContador();
        for(let i = fila; i<CANT_FILAS; i++){
            logicaJuego(i,intervalo);
        }
    }

    //carga la partida guardada
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
                letra.onfocus = function(e) {
                    ultimoInput = e.target;
                }
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
            if(window.innerWidth < 768){ //para que no aparezca el teclado en celulares
                ultimoInput.blur();
            }
        }
    }

    function guardarPartida(gano){
        var nombre = localStorage.getItem("nombre");
        var codPartida = localStorage.getItem("partida");
        var respuestas = guardarRespuesta();
        var crono = new Date();
        crono.setSeconds(cronometro_segundos);
        crono.setMinutes(cronometro_minutos);
        var partida = {
            nombre: nombre,
            respuestas: respuestas,
            PALABRA_GANADORA: PALABRA_GANADORA,
            tiempo: crono,
            ganada: gano
        }
        var partidas = JSON.parse(localStorage.getItem("partidas"));
        if(partidas == null){
            partidas = [];
            partidas.push(partida);
        } else if (partidas[codPartida]){ //la partida ya estaba guardada, se actualiza
            partidas[codPartida] = partida;
        } else { //la partida no estaba guardada, se agrega
            partidas.push(partida);
        }
        localStorage.setItem("partidas", JSON.stringify(partidas));
    }

    //si la partida existe, se borra
    function borrarPartida(){
        var codPartida = localStorage.getItem("partida");
        if(codPartida != ""){
        var partidas = JSON.parse(localStorage.getItem("partidas"));
        partidas.splice(codPartida,1);
        localStorage.setItem("partidas", JSON.stringify(partidas));
        }
    }

    btnGuardar.onclick = function(e) {
        e.preventDefault();
        guardarPartida(false);//mando false pq no gano
        btnGuardar.classList.add("oculto");
        window.location.href = "index.html";
    }

    btnVolver.onclick = function(e) {
        e.preventDefault();
        window.location.href = "index.html";
    }

    //teclado virtual
    var teclado = document.getElementsByClassName("teclado-btn");
    for(var i = 0; i < teclado.length; i++){
        teclado[i].onclick = function(e) {
            e.preventDefault();
            if(e.target.id != "btn-borrar" || e.target.id != "btn-enter") {
                const input_letra = obtenerPrimerVacio();
                if(input_letra.parentElement.disabled == false){
                    input_letra.value = e.target.id[4].toUpperCase();
                    if(input_letra.nextSibling != null && input_letra.value != "" ){
                        input_letra.nextSibling.focus();
                        input_letra.nextElementSibling.blur();
                    }
                }
            }
        }
    }
    var teclaEnter = document.getElementById("btn-enter");
    teclaEnter.onclick = function(e) {
        e.preventDefault();
        ultimoInput.focus();
        //simula que se presiono la tecla enter
        var event = new KeyboardEvent("keydown", {
            "key": "Enter",
            "keyCode": 13,
            "which": 13
        });
        ultimoInput.parentElement.dispatchEvent(event);
        ultimoInput.blur();
    }
    var teclaBorrar = document.getElementById("btn-borrar");
    teclaBorrar.onclick = function(e) {
        e.preventDefault();
        ultimoInput.focus();
        var event = new KeyboardEvent("keydown", {
            "key": "Backspace",
            "keyCode": 8,
            "which": 8
        });
        if(ultimoInput.value == ""){
           ultimoInput.parentElement.dispatchEvent(event);
        }
        ultimoInput.parentElement.dispatchEvent(event);
        ultimoInput.blur();
    }

    if(localStorage.getItem("nombre") == ""){
        location.href = "index.html";
    }
    var partidaExistente = localStorage.getItem("partida");
    if(partidaExistente != "" && localStorage.getItem("nombre") != ""){
        cargarPartida(); //carga partida guardada->carga tablero->reanuda juego
    } else {
        inicio();
    }
}