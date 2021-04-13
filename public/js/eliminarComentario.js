import axios from 'axios';
import Swal from 'sweetalert2';
import querystring from 'querystring';

document.addEventListener('DOMContentLoaded', () => {
    const formsEliminar = document.querySelectorAll('.eliminar-comentario');

    if(formsEliminar.length > 0 ) {
        formsEliminar.forEach(form => {
            form.addEventListener('submit',eliminarComentario)
        })
    }
})

function eliminarComentario(e) {
    e.preventDefault();

    Swal.fire({
        title: 'Eliminar este comentario?',
        text: "Un comentario eliminado no se podra recuperar!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, Elimar!',
        cancelButtonText: 'No, Cancelar'
    }).then((result) => {

        if (result.isConfirmed) {
            //tomar id comentario
            const comentarioId = this.children[0].value;
            const datos = {
                comentarioId
            }
            axios.post(this.action, querystring.stringify(datos)).then(respuesta => {
                Swal.fire(
                    'Eliminado!',
                    respuesta.data,
                    'success'
                );
                //eliminar del DOM
                this.parentElement.parentElement.remove();
                
            }).catch(error => {
                if(error.response.status === 403 || error.response.status === 404) { // validar solo dos errores
                    Swal.fire(
                        'Oops..!',
                        error.response.data,
                        'error'
                    );
                }
            });

            
        }
    });

    
}