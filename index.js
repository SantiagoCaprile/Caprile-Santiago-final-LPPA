window.onload = function() {
    const btnJugar = document.getElementById("btn-jugar");
    const btnInicio = document.getElementById("btn-inicio");
    const inputNombre = document.getElementById("input-nombre");

    btnJugar.onclick = function() {
        document.getElementsByClassName("inicio")[0].classList.add("oculto");
        document.getElementsByClassName("carga")[0].classList.add("oculto");
        document.getElementsByClassName("form-nombre")[0].classList.remove("oculto");
        inputNombre.focus();
    }

    //guarda el nombre en el localstorage y redirecciona a la pagina del tablero
    arrancarJuego = function(){
        var nombre = inputNombre.value;
        localStorage.setItem("nombre", nombre);
        location.href = "./tablero.html";
    }

    document.addEventListener("keydown", function(e){
        if(e.key == "Enter" && inputNombre.value != ""){
            arrancarJuego();
        }
    });

    btnInicio.onclick = function(e) {
        e.preventDefault();
        if(inputNombre.value != ""){
            arrancarJuego();
        } else {
            inputNombre.classList.add("input-error");
            inputNombre.focus();
        }
    }
}

