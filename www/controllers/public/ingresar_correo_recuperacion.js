// Constante para establecer la ruta y parámetros de comunicación con la API.
const API_CLIENTES = '../../app/api/public/clientes.php?action=';

document.getElementById('correo-form').addEventListener('submit', function (event) {
    //Evento para prevenir que recargue la pagina
    event.preventDefault();
    //Fetch para verificar la existencia del correo
    fetch(API_CLIENTES + 'checkEmail', {
        method: 'post',
        body: new FormData(document.getElementById('correo-form'))
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje indicando el problema.
        if (request.ok) {
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    //Fetch para verificar la existencia del correo
                    fetch(API_CLIENTES + 'sendEmail', {
                        method: 'post',
                        body: new FormData(document.getElementById('correo-form'))
                    }).then(function (request) {
                        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje indicando el problema.
                        if (request.ok) {
                            request.json().then(function (response) {
                                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                                if (response.status) {
                                    window.location.replace("ingresar_codigo_correo.php");
                                } else if (response.error) {
                                    sweetAlert(3,response.message, null);
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
                } else if (response.error) {
                    sweetAlert(3,response.message, null);
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
})