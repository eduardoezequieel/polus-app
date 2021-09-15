//Constante para la ruta API
const API_USUARIO = '../../app/api/public/clientes.php?action=';

//Método para cambiar la contraseña
document.getElementById('primeruso-form').addEventListener('submit', function (event) {
    //Evento para que no recargue la pagina
    event.preventDefault();

    //Verificando las credenciales del usuario
    fetch(API_USUARIO + 'updatePasswordOut', {
        method: 'post',
        body: new FormData(document.getElementById('primeruso-form'))
    }).then(request => {
        //Verificando si la petición fue correcta
        if (request.ok) {
            request.json().then(response => {
                //Verificando si la respuesta es satisfactoria de lo contrario se muestra la excepción
                if (response.status) {
                    sweetAlert(1, response.message, 'iniciar_sesion.php');
                } else {
                    sweetAlert(2, response.exception, null);
                }
            })
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    }).catch(error => console.log(error));
})

//Función para mostrar contraseña
function showHidePassword1(checkbox, pass1, pass2) {
    var check = document.getElementById(checkbox);
    var password1 = document.getElementById(pass1);
    var password2 = document.getElementById(pass2);

    //Verificando el estado del check
    if (check.checked == true) {
        password1.type = 'text';
        password2.type = 'text';
    } else {
        password1.type = 'password';
        password2.type = 'password';
    }
}