// Constante para establecer la ruta y parámetros de comunicación con la API.
const API_CLIENTES = '../../app/api/public/clientes.php?action=';

// Método manejador de eventos que se ejecuta cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', function () {
    //Llamando función para activar registros bloqueados
    checkBlockUsers();
});

// Método manejador de eventos que se ejecuta cuando se envía el formulario de cambiar cantidad de producto.
document.getElementById('login-form').addEventListener('submit', function (event) {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();

    //Obtener datos de la api en el caso logIn
    fetch(API_CLIENTES + 'logIn', {
        method: 'post',
        body: new FormData(document.getElementById('login-form'))
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje indicando el problema.
        if (request.ok) {
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    if (response.auth == 'si') {
                        sendVerificationCode();
                        openModal('validarCodigo');
                    } else if (response.auth == 'no') {
                        sweetAlert(1, response.message, 'index.php');
                    }
                } else if (response.error) {
                    sweetAlert(3,response.message, 'cambiar_clave.php');
                }
                else {
                    sweetAlert(2, response.exception, null);
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    }).catch(function (error) {
        console.log(error);
    });
});

//Enviar correo
function sendVerificationCode(){
    fetch(API_CLIENTES + 'sendVerificationCode', {
        method: 'get'
    }).then(function(request){
        //Verificando si la petición fue correcta
        if(request.ok){
            request.json().then(function(response){
                //Verificando respuesta satisfactoria
                if(response.status){
                    console.log(response.message);
                } else {
                    sweetAlert(2, response.exception, null);
                }
            })
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    })
}

//Al activar el evento submit del formulario validar codigo:
document.getElementById('validarCodigo-form').addEventListener('submit', function(event){
    //Desactivar el recargar página
    event.preventDefault();
    //Capturando datos 
    fetch(API_CLIENTES + 'validateCode', {
        method: 'post',
        body: new FormData(document.getElementById('validarCodigo-form'))
    }).then(function(request){
        //Verificando si la petición fue correcta
        if(request.ok){
            request.json().then(function(response){
                //Verificando respuesta satisfactoria
                if(response.status){
                    closeModal('validarCodigo');
                    sweetAlert(1, response.message, 'index.php');
                } else {
                    sweetAlert(2, response.exception, null);
                }
            })
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    })

});

//Función para verificar si hay usuarios bloqueados que ya han cumplido con las 24 horas
function checkBlockUsers() {
    // Petición para verificar si usuarios ya cumplidos con su penalización
    fetch(API_CLIENTES + 'checkBlockUsers')
    .then(function (request) {
        // Se verifica si la petición es correcta.
        if (request.ok) {
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción
                if (response.status) {
                    // Se recorre el conjunto de registros devuelto por la API (dataset) fila por fila a través del objeto row.
                    response.dataset.map(function (row) {
                        document.getElementById('idCliente').value = row.idcliente;
                        fetch(API_CLIENTES + 'activar', {
                            method: 'post',
                            body: new FormData(document.getElementById('login-form'))
                        }).then(function (request){
                            if(request.ok) {
                                request.json().then(function (response) {
                                    //Verificando respuesta satisfactoria
                                    if(response.status){
                                        /*sweetAlert(1, response.message, null);*/
                                    } 
                                })
                            } else {
                                console.log(request.status + ' ' + request.statusText);
                            }
                        })
                    });
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    }).catch(function (error) {
        console.log(error);
    });
}

