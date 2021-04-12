import axios from 'axios';
import querystring from 'querystring';//necesario para mandar la data por axios

document.addEventListener('DOMContentLoaded', () => {
    const asistencia = document.querySelector('#confirmar-asistencia');
    if(asistencia) {
        asistencia.addEventListener('submit', confirmarAsistencia)
    }
});

function confirmarAsistencia(e) {
    e.preventDefault();

    const btn = document.querySelector('#confirmar-asistencia input[type="submit"]');
    let accion = document.querySelector('#accion').value;
    const mensaje = document.querySelector('#mensaje');

    while(mensaje.firstChild) //limpiar 
        mensaje.removeChild(mensaje.firstChild);

    const data = {
        accion
    }

    axios.post(this.action, querystring.stringify(data))
        .then(respuesta => {
            //console.log(respuesta)
            if (accion === 'confirmar'){
                //modificar ele de boton
                document.querySelector('#accion').value = 'cancelar';
                btn.value = 'Cancelar';
                btn.classList.remove('btn-azul');
                btn.classList.add('btn-rojo');

            } else {
                document.querySelector('#accion').value = 'confirmar';
                btn.value = 'Si';
                btn.classList.remove('btn-rojo');
                btn.classList.add('btn-azul');
            }

            mensaje.appendChild(document.createTextNode(respuesta.data));
        });
}