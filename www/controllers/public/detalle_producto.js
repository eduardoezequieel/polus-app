// Constante para establecer la ruta y parámetros de comunicación con la API.
const API_CATALOGO = '../../app/api/public/productos.php?action=';
const ENDPOINT_CA = '../../app/api/public/productos.php?action=readpuntuacion';

// Método manejador de eventos que se ejecuta cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', function () {
    // Se busca en la URL las variables (parámetros) disponibles.
    let params = new URLSearchParams(location.search);
    // Se obtienen los datos localizados por medio de las variables.
    const id = params.get('id');    
    console.log(id);
    // Se llama a la función que muestra los productos de la categoría seleccionada previamente.
    readProduct(id);

    //readRows(API_CATALOGO);
    fillSelectdetalle(ENDPOINT_CA,'cbPuntuacion',null);

    document.getElementById('idProduc').value = id;

    showComments(id);
});

function showComments(id){
    // Se define un objeto con los datos del registro seleccionado.
    const data = new FormData();
    data.append('idProducto', id);

    fetch(API_CATALOGO + 'showComments', {
        method: 'post',
        body: data
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje indicando el problema.
        if (request.ok) {
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    fillComments(response.dataset)
                
                } else {
                    // Se presenta un mensaje de error cuando no existen datos para mostrar.
                    //document.getElementById('title').innerHTML = `<i class="material-icons small">cloud_off</i><span class="red-text">${response.exception}</span>`;
                    console.log(response.exception);
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    }).catch(function (error) {
        console.log(error);
    });
}

function fillComments(dataset){
    let content = '';
        dataset.map(function (row) {
    
            content += `
            <div class="row pl-5 fondoComentario mx-1">
                <div class="col-2">
                    <img src="../../resources/img/astronauta.PNG" alt="" class="img-fluid d-block m-auto">
                </div>
                <div class="col-10">
                    <h1 class="usuarioReseña text-white">${row.cliente}</h1>
                    <p class="comentarioReseña">${row.comentario}</p>
                </div>
            </div>
            `;
        });
        // Se asigna como título la categoría de los productos.
        //document.getElementById('title').textContent = 'Categoría: ' + categoria;
        // Se agregan las tarjetas a la etiqueta div mediante su id para mostrar los productos.
        document.getElementById('bodyComments').innerHTML = content;
    
}

function fillSelectdetalle(endpoint, select, selected) {
    fetch(endpoint, {
        method: 'get'
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje indicando el problema.
        if (request.ok) {
            request.json().then(function (response) {
                let content = '';
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    // Si no existe un valor para seleccionar, se muestra una opción para indicarlo.
                    if (!selected) {
                        content += '<option disabled selected>Seleccione una opción</option>';
                    }
                    // Se recorre el conjunto de registros devuelto por la API (dataset) fila por fila a través del objeto row.
                    response.dataset.map(function (row) {
                        // Se obtiene el dato del primer campo de la sentencia SQL (valor para cada opción).
                        value = Object.values(row)[0];
                        // Se obtiene el dato del segundo campo de la sentencia SQL (texto para cada opción).
                        text = Object.values(row)[1];
                        // Se verifica si el valor de la API es diferente al valor seleccionado para enlistar una opción, de lo contrario se establece la opción como seleccionada.
                        if (value != selected) {
                            content += `<option value="${value}">${text}</option>`;
                        } else {
                            content += `<option value="${value}" selected>${text}</option>`;
                        }
                    });
                } else {
                    content += '<option>No hay opciones disponibles</option>';
                }
                // Se agregan las opciones a la etiqueta select mediante su id.
                document.getElementById(select).innerHTML = content;
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    }).catch(function (error) {
        console.log(error);
    });
}

function readProduct(id) {
    // Se define un objeto con los datos del registro seleccionado.
    const data = new FormData();
    data.append('idProducto', id);

    fetch(API_CATALOGO + 'readOne', {
        method: 'post',
        body: data
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje indicando el problema.
        if (request.ok) {
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    let foto = '';
                    console.log(response.dataset);
                    foto = `
                        <img src="../../resources/img/dashboard_img/producto_fotos/${response.dataset.imagenprincipal}" class="imagenProducto mt-4">
                        `;
                    document.getElementById('columnaImagen').innerHTML = foto;
                    document.getElementById('tituloProducto').textContent = response.dataset.nombre;
                    document.getElementById('descripcionProducto').textContent = response.dataset.descripcion;
                    document.getElementById('precioProducto').textContent = response.dataset.precio;

                   
                } else {
                    // Se presenta un mensaje de error cuando no existen datos para mostrar.
                    //document.getElementById('title').innerHTML = `<i class="material-icons small">cloud_off</i><span class="red-text">${response.exception}</span>`;
                    console.log(response.exception);
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    }).catch(function (error) {
        console.log(error);
    });
}
document.getElementById("ingresar").addEventListener("submit",function(event){
    // Se busca en la URL las variables (parámetros) disponibles.
    let params = new URLSearchParams(location.search);
    // Se obtienen los datos localizados por medio de las variables.
    const id = params.get('id'); 
    event.preventDefault()
    fetch(API_CATALOGO + 'createRow', {
        method: 'post',
        body: new FormData(document.getElementById('ingresar'))
    }).then(function(request){
        //Verificando si la petición fue correcta
        if(request.ok){
            request.json().then(function(response){
                //Verificando respuesta satisfactoria
                if(response.status){
                    //cargando de nuevo la tabla
                    //readRows(API_CATALOGO);
                    //Mandando mensaje de exito
                    sweetAlert(1, response.message, null);
                    showComments(id)
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