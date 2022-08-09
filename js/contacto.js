window.onload = function() {
    const nombre = document.getElementById("nombre");
    const email = document.getElementById("email");
    const mensaje = document.getElementById("mensaje");
    const btnEnviar = document.getElementById("btn-enviar");
    const btnVolver = document.getElementById("btn-volver");


    nombreValido = function() {
        const error = document.getElementById("error-nombre");
        if(nombre.value == ""){
            nombre.classList.add("input-error");
            error.innerHTML = "El nombre no puede estar vacio";
            error.classList.remove("oculto");
            return false;
        } else {
            nombre.classList.remove("input-error");
            error.classList.add("oculto");
        }
        return true;
    }

    emailValido = function() {
        const error = document.getElementById("error-email");
        if(email.value == ""){
            email.classList.add("input-error");
            error.innerHTML = "El email no puede estar vacio";
            error.classList.remove("oculto");
            return false;
        } else if(!email.value.match(/[a-z0-9]+@[a-z]+\.[a-z]/)){
            email.classList.add("input-error");
            error.innerHTML = "El email no es valido";
            error.classList.remove("oculto");
            return false;
        } else {
            email.classList.remove("input-error");
            error.classList.add("oculto");
        }
        return true;
    }

    mensajeValido = function() {
        const error = document.getElementById("error-mensaje");
        if(mensaje.value.length < 5){
            mensaje.classList.add("input-error");
            error.innerHTML = "El mensaje debe tener al menos 5 caracteres";
            error.classList.remove("oculto");
            return false;
        } else {
            mensaje.classList.remove("input-error");
            error.classList.add("oculto");
        }
        return true;
    }

    btnEnviar.onclick = function(e) {
        e.preventDefault();
        nombreValido();
        emailValido();
        mensajeValido();
        if(nombreValido() && emailValido() && mensajeValido()){
           window.location.href = `mailto:santiagocaprile@hotmail.com?body=` + mensaje.value;
        }
    }

    btnVolver.onclick = function(e) {
        e.preventDefault();
        window.location.href = "./index.html";
    }
}