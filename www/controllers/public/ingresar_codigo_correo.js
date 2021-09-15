// Constante para establecer la ruta y parámetros de comunicación con la API.
const API_CLIENTES = '../../app/api/public/clientes.php?action=';

document.getElementById('codigo-form').addEventListener('submit', function(event){
    event.preventDefault();
    var uno = document.getElementById('1').value;
    var dos = document.getElementById('2').value;
    var tres = document.getElementById('3').value;
    var cuatro = document.getElementById('4').value;
    document.getElementById('tokeningresado').value = uno+dos+tres+cuatro;
    //Obtener datos de la api en el caso logIn
    fetch(API_CLIENTES + 'checkToken', {
        method: 'post',
        body: new FormData(document.getElementById('codigo-form'))
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje indicando el problema.
        if (request.ok) {
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    console.log(response.token)
                    sweetAlert(1, response.message, 'recuperar_clave.php');
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
});