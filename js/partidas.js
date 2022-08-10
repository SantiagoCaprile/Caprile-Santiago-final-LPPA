window.onload = function() {
    const tabla = document.getElementById("tabla-partidas");
    const tablaGanadas = document.getElementById("tabla-ganadas");
    const tbody = document.getElementById("lista-ganadas");
    const btnGanadas = document.getElementById("btn-ganadas");
    const btnVolver = document.getElementById("btn-volver");
    const btnTiempo = document.getElementById("ordena-tiempo");
    const btnFecha = document.getElementById("ordena-fecha");
    var partidas = localStorage.getItem("partidas");
    if (partidas) {
        partidas = JSON.parse(partidas);
    }
    var ganadas = partidas.filter(function(partida) {
        return partida.ganada;
    });
    var hayListadas = false;
    if(partidas.length > 0) {
        var tiempo = new Date();
        for (var i = 0; i < partidas.length; i++) {
            if(!partidas[i].ganada){ //lista solo las partidas no ganadas
                var fila = document.createElement("tr");
                var celdaNombre = document.createElement("td");
                celdaNombre.innerHTML = partidas[i].nombre;
                tiempo = new Date(partidas[i].tiempo);
                var celdaTiempo = document.createElement("td");
                celdaTiempo.innerHTML = (tiempo.getMinutes()<10? "0" + tiempo.getMinutes() : tiempo.getMinutes())
                + ":" + (tiempo.getSeconds()<10? "0" + tiempo.getSeconds() : tiempo.getSeconds());
                var celdaFlecha = document.createElement("td");
                celdaFlecha.innerHTML = `<button class="botones-cargar" id="${i}">&rightarrowtail;</button>`;
                fila.appendChild(celdaNombre);
                fila.appendChild(celdaTiempo);
                fila.appendChild(celdaFlecha);
                tabla.appendChild(fila);
                hayListadas = true;
                document.getElementById(i).onclick = function() {
                    localStorage.setItem("partida", this.id);
                    localStorage.setItem("nombre", partidas[this.id].nombre);
                    location.href = "./tablero.html";
                }
            }
        }
    }
    if(!hayListadas) {
        tabla.innerHTML = "<td>No hay partidas guardadas</td>";
    }

    cargarTablaGanadas = function() {
        if(ganadas.length > 0) {
            for (var i = 0; i < ganadas.length; i++) {
                var fila = document.createElement("tr");
                var celdaNombre = document.createElement("td");
                celdaNombre.innerHTML = ganadas[i].nombre;
                const fecha = new Date(ganadas[i].tiempo);
                var celdaTiempo = document.createElement("td");
                celdaTiempo.innerHTML = (fecha.getMinutes()<10? "0" + fecha.getMinutes() : fecha.getMinutes())
                + ":" + (fecha.getSeconds()<10? "0" + fecha.getSeconds() : fecha.getSeconds());
                var celdaFecha = document.createElement("td");
                celdaFecha.innerHTML = fecha.getDate() + "/" + (fecha.getMonth() + 1) + "/" + fecha.getFullYear();
                fila.appendChild(celdaNombre);
                fila.appendChild(celdaTiempo);
                fila.appendChild(celdaFecha);
                tbody.appendChild(fila);
            }
        } else {
            tablaGanadas.innerHTML = "<td>No hay partidas ganadas</td>";
        }
    }


    btnGanadas.onclick = function(e) {
        e.preventDefault();
        document.getElementById("modal-ganadas").classList.remove("oculto");
        if(tbody.hasChildNodes()) {
            tbody.innerHTML = "";
        }
        cargarTablaGanadas();
    }

    btnVolver.onclick = function(e) {
        e.preventDefault();
        location.href = "./index.html";
    }

    document.getElementById("cerrar-gano").onclick = function(e) {
        e.preventDefault();
        document.getElementById("modal-ganadas").classList.add("oculto");
    }

    //ordena segun funcion que se le pase
    ordenaGanadas = function(funcion) {
        if(tbody.hasChildNodes()) {
            tbody.innerHTML = "";
        }
        ganadas.sort(funcion);
    }

    var contadorFecha = 0;
    var contadorTiempo = 0;
    btnFecha.onclick = function(e) {
        e.preventDefault();
        ordenaGanadas(function(a, b) {
            return new Date(a.tiempo) - new Date(b.tiempo);
        } );
        if(contadorFecha%2 == 0) {
            ganadas.reverse();
        }
        contadorFecha++;
        cargarTablaGanadas();
    }

    btnTiempo.onclick = function(e) {
        e.preventDefault();
        ordenaGanadas(function(a, b) {
            var t1 = new Date(a.tiempo);
            var t2 = new Date(b.tiempo);
            t1 = t1.getMinutes() * 60 + t1.getSeconds();
            t2 = t2.getMinutes() * 60 + t2.getSeconds();
            return t1 - t2;
        } );
        if(contadorTiempo%2) {
            ganadas.reverse();
        }
        contadorTiempo++;
        cargarTablaGanadas();
    }

}