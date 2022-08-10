window.onload = function() {
    const tabla = document.getElementById("tabla-partidas");
    const tablaGanadas = document.getElementById("tabla-ganadas");
    const tbody = document.getElementById("lista-ganadas");
    const btnGanadas = document.getElementById("btn-ganadas");
    const btnVolver = document.getElementById("btn-volver");
    var partidas = localStorage.getItem("partidas");
    var hayListadas = false;
    if (partidas) {
        partidas = JSON.parse(partidas);
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
    }
    if(!hayListadas) {
        tabla.innerHTML = "<td>No hay partidas guardadas</td>";
    }

    cargarTablaGanadas = function() {
        var ganadas = partidas.filter(function(partida) {
            return partida.ganada;
        });
        if(ganadas.length > 0) {
            for (var i = 0; i < ganadas.length; i++) {
                var fila = document.createElement("tr");
                var celdaNombre = document.createElement("td");
                celdaNombre.innerHTML = ganadas[i].nombre;
                var fecha = new Date(ganadas[i].tiempo);
                var celdaTiempo = document.createElement("td");
                celdaTiempo.innerHTML = (fecha.getMinutes()<10? "0" + fecha.getMinutes() : fecha.getMinutes())
                + ":" + (fecha.getSeconds()<10? "0" + fecha.getSeconds() : fecha.getSeconds());
                var celdaFecha = document.createElement("td");
                celdaFecha.innerHTML = fecha.getDay() + "/" + fecha.getMonth() + "/" + fecha.getFullYear();
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
}