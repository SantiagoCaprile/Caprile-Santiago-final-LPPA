window.onload = function() {
    const tabla = document.getElementById("tabla-partidas");
    var partidas = localStorage.getItem("partidas");

    if (partidas) {
        partidas = JSON.parse(partidas);
        var tiempo = new Date();
        for (var i = 0; i < partidas.length; i++) {
            var fila = document.createElement("tr");
            var celdaNombre = document.createElement("td");
            celdaNombre.innerHTML = partidas[i].nombre;
            tiempo = new Date(partidas[i].tiempo);
            console.log(tiempo.getSeconds());
            var celdaTiempo = document.createElement("td");
            celdaTiempo.innerHTML = (tiempo.getMinutes()<10? "0" + tiempo.getMinutes() : tiempo.getMinutes()) 
            + ":" + (tiempo.getSeconds()<10? "0" + tiempo.getSeconds() : tiempo.getSeconds());
            var celdaFlecha = document.createElement("td");
            celdaFlecha.innerHTML = `<button class="botones-cargar" id="${i}">&rightarrowtail;</button>`;
            fila.appendChild(celdaNombre);
            fila.appendChild(celdaTiempo);
            fila.appendChild(celdaFlecha);
            tabla.appendChild(fila);
            document.getElementById(i).onclick = function() {
                localStorage.setItem("partida", this.id);
                localStorage.setItem("nombre", partidas[this.id].nombre);
                location.href = "./tablero.html";
            }
        }
    } else {
        tabla.innerHTML = "<td>No hay partidas guardadas</td>";
    }

}