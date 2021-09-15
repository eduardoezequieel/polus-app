//Constante para establecer la ruta de la API
const API_CLIENTES = '../../app/api/public/clientes.php?action=';

// Al cargar la pagina
document.addEventListener('DOMContentLoaded', function(){
    // Carga la informacion del cliente
    obtenerInfo();
    // Se registra la sesion
    createSesionHistory();
    // Se cargan las sesiones registradas
    getSesionHistory();
});

//Funcion que registra la sesión
function createSesionHistory(){
    fetch(API_CLIENTES + 'createSesionHistory', {
        method: 'get'
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje indicando el problema.
        if (request.ok) {
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    //console.log(response.message);
                } else {
                    sweetAlert(4, response.exception, null);
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    }).catch(function (error) {
        console.log(error);
    });
}

//Carga el historial de sesiones
function getSesionHistory() {
    fetch(API_CLIENTES + 'getSesionHistory', {
        method: 'get'
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje indicando el problema.
        if (request.ok) {
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    // Variable que contendra el codigo html
                    let content = '';
                    response.dataset.map(function(row){
                        // Se crean y concatenan las filas de la tabla con los datos de cada registro.
                            content += `
                            <div class="col-xl-6 col-md-12 col-sm-12 col-xs-12 mt-3">
                                <div class="tarjetaDispositivo">
                                    <div class="d-flex">
                                        <div class="d-flex justify-content-end align-items-center p-3" style="width: 100px;">
                                            <span style="font-size: 24px;" class="fas fa-desktop text-white"></span>
                                        </div>
                                        <div class="p-3">
                                            <h1 class="lead text-white">${row.phpinfo}</h1>
                                            <h1 class="lead text-white">${row.fechasesion}</h1>
                                        </div>
                                        <div>
                                            <button onclick="deleteSessionHistory(${row.idhistorialsesion_c})" type="button" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Eliminar" class="btn"><span class="fas fa-times text-white"></span></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `;
                    });
                    // Se agregan las filas al cuerpo de la tabla mediante su id para mostrar los registros.
                    document.getElementById('contenedorDispositivos').innerHTML = content;

                } else {
                    //Se muestra el mensaje
                    document.getElementById('mensaje').className = 'lead text-center';
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    }).catch(function (error) {
        console.log(error);
    });
}

//Para eliminar historial de sesiones
function deleteSessionHistory(id) {
    const data = new FormData();
    data.append('idHistorialSesion', id);

    swal({
        title: 'Advertencia',
        text: '¿Desea eliminar este dispositivo?',
        icon: 'warning',
        buttons: ['No', 'Sí'],
        closeOnClickOutside: false,
        closeOnEsc: false
    }).then(function (value) {
        // Se verifica si fue cliqueado el botón Sí para hacer la petición de borrado, de lo contrario no se hace nada.
        if (value) {
            fetch(API_CLIENTES + 'deleteSesionHistory', {
                method: 'post',
                body: data
            }).then(function (request) {
                // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje indicando el problema.
                if (request.ok) {
                    request.json().then(function (response) {
                        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                        if (response.status) {
                            // Se cargan nuevamente las filas en la tabla de la vista después de borrar un registro.
                            sweetAlert(1, response.message, 'mi_cuenta.php');
                        } else {
                            sweetAlert(2, response.exception, null);
                            console.log(response.status + ' ' + response.statusText);
                        }
                    });
                } else {
                    console.log(request.status + ' ' + request.statusText);
                }
            }).catch(function (error) {
                console.log(error);
            });
        }
    });
}

//Cuando se presiona el switch
document.getElementById('switchAuth').addEventListener('change',function(){
    if (document.getElementById('switchValue').value == 'no') {
        document.getElementById('switchValue').value = 'si';
    } else {
        document.getElementById('switchValue').value = 'no';
    }
})

//Al activar el evento submit del formulario updateAuth-form
document.getElementById('updateAuth-form').addEventListener('submit',function(event){
    //Evitamos recargar la pagina
    event.preventDefault();
    //fetch
    fetch(API_CLIENTES + 'updateAuth', {
        method: 'post',
        body: new FormData(document.getElementById('updateAuth-form'))
    }).then(function(request){
        //Verificando si la petición fue correcta
        if(request.ok){
            request.json().then(function(response){
                //Verificando respuesta satisfactoria
                if(response.status){
                    //Mandando mensaje de exito
                    closeModal('cambiarAuth');
                    if (document.getElementById('switchValue').value == 'si') {
                        sweetAlert(1, 'Usted ha habilitado la autenticación en dos pasos, podra ver los cambios la proxima vez que inicie sesión.', 'mi_cuenta.php');
                    } else if(document.getElementById('switchValue').value == 'no') {
                        sweetAlert(1, 'Usted ha deshabilitado la autenticación en dos pasos, podra ver los cambios la proxima vez que inicie sesión.', 'mi_cuenta.php');
                    }
                } else{
                    sweetAlert(4, response.exception, null);
                }
            })
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    }).catch(function(error){
        console.log(error);
    });
})

//Obtener info
function obtenerInfo(){
    fetch(API_CLIENTES + 'readProfile', {
        method: 'get'
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje indicando el problema.
        if (request.ok) {
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    //Se asigna la informacion a los campos correspondientes
                    document.getElementById('txtNombre').value = response.dataset.nombre;
                    document.getElementById('txtTelefono').value = response.dataset.telefono;
                    document.getElementById('txtFechaNacimiento').value = response.dataset.fechanacimiento;
                    document.getElementById('txtGenero').value = response.dataset.genero;
                    document.getElementById('txtApellido').value = response.dataset.apellido;
                    document.getElementById('txtDireccion').value = response.dataset.direccion;
                    document.getElementById('lblUsuario').textContent = response.dataset.usuario;
                    document.getElementById('lblCorreo').textContent = response.dataset.correo;
                    document.getElementById('switchValue').value = response.dataset.dobleautenticacion;
                    if (response.dataset.dobleautenticacion == 'si') {
                        document.getElementById('switchAuth').setAttribute('checked', true);
                    } else {
        
                    }
                    previewSavePicture('divFoto', response.dataset.foto,2);
                } else {
                    sweetAlert(4, response.exception, 'index.php');
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    }).catch(function (error) {
        console.log(error);
    });
}

//Al ejecutar el evento submit del formulario
document.getElementById('micuenta-form').addEventListener('submit',function(event){
    //Evitamos recargar la pagina
    event.preventDefault();
    //fetch
    fetch(API_CLIENTES + 'editProfile', {
        method: 'post',
        body: new FormData(document.getElementById('micuenta-form'))
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje indicando el problema.
        if (request.ok) {
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    // Se cargan nuevamente las filas en la tabla de la vista después de agregar o modificar un registro.
                    sweetAlert(1, response.message, 'mi_cuenta.php');
                } else {
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

//Al ejecutar el evento submit del formulario updateUser-form
document.getElementById('updateUser-form').addEventListener('submit',function(event){
    //Evitamos recargar la pagina
    event.preventDefault();
    //fetch
    fetch(API_CLIENTES + 'updateUser', {
        method: 'post',
        body: new FormData(document.getElementById('updateUser-form'))
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje indicando el problema.
        if (request.ok) {
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    // Se cargan nuevamente las filas en la tabla de la vista después de agregar o modificar un registro.
                    sweetAlert(1, response.message, 'mi_cuenta.php');
                } else {
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

//Al ejecutar el evento submit del formulario updateUser-form
document.getElementById('updateEmail-form').addEventListener('submit',function(event){
    //Evitamos recargar la pagina
    event.preventDefault();
    //fetch
    fetch(API_CLIENTES + 'updateEmail', {
        method: 'post',
        body: new FormData(document.getElementById('updateEmail-form'))
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje indicando el problema.
        if (request.ok) {
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    // Se cargan nuevamente las filas en la tabla de la vista después de agregar o modificar un registro.
                    sweetAlert(1, response.message, 'mi_cuenta.php');
                } else {
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

//Al ejecutar el evento submit del formulario updatePassword-form
document.getElementById('updatePassword-form').addEventListener('submit',function(event){
    //Evitamos recargar la pagina
    event.preventDefault();
    //fetch
    fetch(API_CLIENTES + 'updatePassword', {
        method: 'post',
        body: new FormData(document.getElementById('updatePassword-form'))
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje indicando el problema.
        if (request.ok) {
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    // Se cargan nuevamente las filas en la tabla de la vista después de agregar o modificar un registro.
                    sweetAlert(1, response.message, 'mi_cuenta.php');
                } else {
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

//Función para mostrar contraseña
function showHidePassword3(checkbox, pass1, pass2, pass3) {
    var check = document.getElementById(checkbox);
    var password = document.getElementById(pass1);
    var password2 = document.getElementById(pass2);
    var password3 = document.getElementById(pass3);

    //Verificando el estado del check
    if (check.checked == true) {
        password.type = 'text';
        password2.type = 'text';
        password3.type = 'text';

    } else {
        password.type = 'password';
        password2.type = 'password';
        password3.type = 'password';
    }
}

//Metodo para usar un boton diferente de examinar
botonExaminar('btnAgregarFoto', 'archivo_usuario');

//Metodo para crear una previsualizacion del archivo a cargar en la base de datos
previewPicture('archivo_usuario','divFoto');