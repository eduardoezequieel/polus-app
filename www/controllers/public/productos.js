// Constante para establecer la ruta y parámetros de comunicación con la API.
const API_CATALOGO = 'http://34.125.116.235/app/api/public/productos.php?action=';
const ENDPOINT_SUBCATEGORIA = 'http://34.125.116.235/app/api/public/productos.php?action=readSubcategorias';

//Variable para controlar el stock
var stock;
var idCliente;
var alias;
var foto;
var idPedido;
var api_pedidos;
var endpoint_talla;
// Método manejador de eventos que se ejecuta cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', function () {
    fillSelectProducts(ENDPOINT_SUBCATEGORIA, 'cbSubcategorias', null);
    
    readOrderDetail()
    // Se busca en la URL las variables (parámetros) disponibles.
    let params = new URLSearchParams(location.search);
    // Se obtienen los datos localizados por medio de las variables.
    const id = params.get('idSub');
    const name = params.get('name');

    if (id == 2 || id==3) {
        document.getElementById('search-talla').className='d-none'
    }else{
        
    }
   // Se llama a la función que muestra los productos de la categoría seleccionada previamente.
    readProducts(id, name);

    // Se obtienen los datos localizados por medio de las variables.
    idCliente = params.get('id');
    alias = params.get('alias');
    foto = params.get('foto');
    isLogged(idCliente,alias,foto);

    if (idCliente > 0){
        // Constante para establecer la ruta y parámetros de comunicación con la API.
        api_pedidos = `http://34.125.116.235/app/api/public/pedidos.php?id=${idCliente}&action=`;
        endpoint_talla = `http://34.125.116.235/app/api/public/pedidos.php?id=${idCliente}&action=readTallaProducto`;
        
    } else {
        // Constante para establecer la ruta y parámetros de comunicación con la API.
        api_pedidos = `http://34.125.116.235/app/api/public/clientes.php?action=`;
        endpoint_talla = `http://34.125.116.235/app/api/public/pedidos.php?action=`;
    }
});

document.getElementById('search-subcategoria').addEventListener('submit', function(event){
    event.preventDefault();
    searchProducts(API_CATALOGO, 'search-subcategoria','searchBySubcategory');
})

document.getElementById('search-form').addEventListener('submit', function(event){
    event.preventDefault();
    searchProducts(API_CATALOGO, 'search-form','search');
})

// Función para obtener y mostrar los productos de acuerdo a la categoría seleccionada.
function readProducts(id, name) {
    // Se define un objeto con los datos del registro seleccionado.
    const data = new FormData();
    data.append('idCategoria', id);

    fetch(API_CATALOGO + 'readAll', {
        method: 'post',
        body: data
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje indicando el problema.
        if (request.ok) {
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    // Se recorre el conjunto de registros devuelto por la API (dataset) fila por fila a través del objeto row.
                    fillProducts(response.dataset, name);
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

function searchProducts(api, form, action) {
    let params = new URLSearchParams(location.search);
    // Se obtienen los datos localizados por medio de las variables.
    const id = params.get('idSub');
    const name = params.get('name');
    const data = new FormData(document.getElementById(form));
    data.append('idCategoria', id);
    fetch(api + action, {
        method: 'post',
        body: data
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje indicando el problema.
        if (request.ok) {
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    
                    // Se envían los datos a la función del controlador para que llene la tabla en la vista.
                    fillProducts(response.dataset, name)
                    sweetAlert(1, response.message, null);
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
}

function fillSelectProducts(endpoint, select, selected) {
    let params = new URLSearchParams(location.search);
    // Se obtienen los datos localizados por medio de las variables.
    const id = params.get('idSub');
    const data = new FormData();
    data.append('idCategoria', id);
    fetch(endpoint, {
        method: 'post',
        body: data
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

function fillProducts(dataset, name){
    let content = '';
    dataset.map(function (row) {
        
        // Se crean y concatenan las tarjetas con los datos de cada producto.
        url = `producto.html?id=${idCliente}&alias=${alias}&foto=${foto}&idProducto=${row.idproducto}`;

        content += `
        <div class="dropdown dropend col-xl-4 col-md-6 col-sm-12 col-xs-12 d-flex justify-content-center animate__animated animate__bounceIn">
            <button class="btn btnCategoria" type="button" id="dropdownMenuButton2" data-bs-toggle="dropdown" aria-expanded="false">
                <div class="divFotoproducto">
                    <img src="http://34.125.116.235/resources/img/dashboard_img/producto_fotos/${row.imagenprincipal}" alt="#" class="encajarImagen" height="150px" width="200px">
                </div>
                <div class="row justify-content-center mt-4">
                    <div class="col-7 d-flex justify-content-center">
                        <h1 class="tituloProducto">${row.nombre}</h1>  
                    </div>
                    <div class="col-5">
                        <h1 class="textoPrecio">$${row.precio}</h1>
                    </div>
                </div>
            </button>
            <ul class="dropdown-menu dropdown-menu-dark animate__animated animate__bounceIn mx-5" aria-labelledby="dropdownMenuButton2">
                <li><a class="dropdown-item" href="#" onclick="openCantidadDialog(${row.idproducto})" data-bs-toggle="modal" data-bs-target="#cantidadModal"><span class="fas fa-cart-plus me-2"></span>Agregar al carrito</a></li>
                <li><a class="dropdown-item" href="${url}"><span class="fas fa-info-circle me-2"></span>Ver detalles</a></li>
            </ul>
        </div>
        `;
    });
    // Se asigna como título la categoría de los productos.
    //document.getElementById('title').textContent = 'Categoría: ' + categoria;
    // Se agregan las tarjetas a la etiqueta div mediante su id para mostrar los productos.
    document.getElementById('products-body').innerHTML = content;

    document.getElementById('titulo').textContent = name;
}

//Función para llenar las tablas
function fillSelectTallas(endpoint, select, selected) {
    fetch(endpoint, {
        method: 'post',
        body: new FormData(document.getElementById('cantidad-form'))
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

//Función para abrir el modal de entrar al carrito
function openCantidadDialog(id){
    document.getElementById('idProducto2').value = id;

    //Fetch para verificar si el producto seleccionado es de tipo ropa
    fetch(api_pedidos + 'checkClothes', {
        method: 'post',
        body: new FormData(document.getElementById('cantidad-form'))
    }).then(request => {
        //Se verifica si la petición fue correcta
        if (request.ok) {
            request.json().then(response => {
                //Se verifica la respuesta de la api
                if(response.status) {
                    readClothesDetail();
                    fillSelectTallas(endpoint_talla, 'cbTalla', null);
                } else if (response.error){
                    sweetAlert(2, response.exception,null);
                } else {
                    readNoClothesDetail();
                }
            })
        } else {
            console.log(request.status + ' '+ request.statusText)
        }
    }).catch(error => console.log(error));
}

//Función para leer los datos del producto si es de tipo ropa
function readClothesDetail() {
    //Fetch para leer los datos del producto
    fetch(api_pedidos + 'readClothesDetail', {
        method: 'post',
        body: new FormData(document.getElementById('cantidad-form'))
    }).then(request => {
        //Se verifica si la petición fue correcta
        if (request.ok) {
            request.json().then(response => {
                //Se verifica la respuesta de la api
                if (response.status) {
                    let foto = '';
                    foto = `
                        <img src="http://34.125.116.235/resources/img/dashboard_img/producto_fotos/${response.dataset.imagenprincipal}" class="imagenProducto5 mt-4">
                        `;
                    document.getElementById('columnaFoto').innerHTML = foto;
                    document.getElementById('nombre').textContent = response.dataset.nombre.toUpperCase();
                    document.getElementById('stock').textContent = 'En Stock: Seleccione una talla';
                    document.getElementById('precio').textContent = 'Precio: $' + response.dataset.precio;
                    document.getElementById('marca').textContent = 'Marca: ' + response.dataset.marca;
                    document.getElementById('tipo').value = 'ropa';
                    document.getElementById('agregarCart').disabled = true;
                } else {
                    sweetAlert(2, response.exception,null);
                }
            })
        } else {
            console.log(request.status + ' '+ request.statusText)
        }
    }).catch(error => console.log(error));
}

//Función para leer los datos del producto si no es de tipo ropa
function readNoClothesDetail() {
    fillSelectTallas(endpoint_talla, 'cbTalla', null);
    document.getElementById('cbTalla').className = 'd-none';
    document.getElementById('labelTalla').className = 'd-none';
    document.getElementById('columnaCantidad').className = 'form-group d-flex mt-3 justify-content-center';
    //Fetch para leer los datos del producto
    fetch(api_pedidos + 'readNoClothesDetail', {
        method: 'post',
        body: new FormData(document.getElementById('cantidad-form'))
    }).then(request => {
        //Se verifica si la petición fue correcta
        if (request.ok) {
            request.json().then(response => {
                //Se verifica la respuesta de la api
                if (response.status) {
                    let foto = '';
                    foto = `
                        <img src="http://34.125.116.235/resources/img/dashboard_img/producto_fotos/${response.dataset.imagenprincipal}" class="imagenProducto5 mt-4">
                        `;
                    document.getElementById('columnaFoto').innerHTML = foto;
                    document.getElementById('nombre').textContent = response.dataset.nombre.toUpperCase();
                    document.getElementById('stock').textContent = 'En Stock: ' + response.dataset.cantidad;
                    document.getElementById('precio').textContent = 'Precio: $' + response.dataset.precio;
                    document.getElementById('marca').textContent = 'Marca: ' + response.dataset.marca;
                    document.getElementById('tipo').value = 'no_ropa';
                    stock = response.dataset.cantidad;
                    if (stock == 0) {
                        document.getElementById('columnaCantidad').className = 'd-none';
                        document.getElementById('agregarCart').className = 'd-none';
                    }
                } else {
                    sweetAlert(3, response.exception,null);
                    let foto = '';
                    foto = `
                        <img src="http://34.125.116.235/resources/img/dashboard_img/producto_fotos/null" class="imagenProducto5 mt-4">
                        `;
                    document.getElementById('columnaFoto').innerHTML = foto;
                    document.getElementById('nombre').textContent = 'Información no disponible';
                    document.getElementById('columnaCantidad').className = 'd-none';
                    document.getElementById('agregarCart').className = 'd-none';
                    document.getElementById('stock').textContent = '';
                    document.getElementById('precio').textContent = '';
                    document.getElementById('marca').textContent = '';
                }
            })
        } else {
            console.log(request.status + ' '+ request.statusText)
        }
    }).catch(error => console.log(error));
}

//Método para cambiar la cantidad en stock dependiendo de la talla seleccionada
function showClothesStock() {
    document.getElementById('columnaCantidad').className = 'form-group d-flex mt-3 justify-content-center';
    //Fecth para capturar el stock para productos de tipo ropa
    fetch(api_pedidos + 'showClothesStock', {
        method: 'post',
        body: new FormData(document.getElementById('cantidad-form'))
    }).then(request => {
        //Verificamos si la petición fue correcta
        if (request.ok) {
            request.json().then(response => {
                //Verificamos la respuesta de la api
                if (response.status) {
                    document.getElementById('stock').textContent = 'Stock: ' + response.dataset.cantidad;
                    stock = response.dataset.cantidad;
                    if (stock == 0) {
                        document.getElementById('columnaCantidad').className = 'd-none';
                        document.getElementById('agregarCart').className = 'd-none';
                    }
                    document.getElementById('agregarCart').disabled = false;
                } else {
                    sweetAlert(2,response.exception, null);
                }
            })
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    }).catch(error => console.log(error))
}

document.getElementById('minus').addEventListener('click', function (event) {
    event.preventDefault();
    //Guardo input de tipo
    var tipo = document.getElementById('tipo').value;
    //Guardando la cantidad seleccionada en una variable
    var cantidad =  document.getElementById('cantidad').textContent;

    //Verificando si es ropa 
    if (tipo == 'ropa') {
        //Verificando si ya fue seleccionada una talla
        if (document.getElementById('stock').textContent != 'En Stock: Seleccione una talla') {
            cantidad--;
            //Verificando que la cantidad seleccionada sea mayor a 1
            if (cantidad >= 1) { 
                document.getElementById('cantidad').textContent = cantidad;
                document.getElementById('txtCantidad').value = cantidad;
            } else {
                sweetAlert(3, 'La cantidad de productos no puede ser menor a 1.',null)
            }
        } else {
            sweetAlert(4, 'Seleccione una talla.',null);
        }
    } else {
        cantidad--;
        //Verificando que la cantidad seleccionada sea mayor a 1
        if (cantidad >= 1) { 
            document.getElementById('cantidad').textContent = cantidad;
            document.getElementById('txtCantidad').value = cantidad;
        } else {
            sweetAlert(3, 'La cantidad de productos no puede ser menor a 1.',null);
        }
    }
})

//Función para limitar la cantidad ingresada por el cliente cuando aumenta
document.getElementById('plus').addEventListener('click', function (event) {
    event.preventDefault();
    //Guardo input de tipo
    var tipo = document.getElementById('tipo').value;
    //Guardando la cantidad seleccionada en una variable
    var cantidad =  document.getElementById('cantidad').textContent;

    //Verificando si es ropa 
    if (tipo == 'ropa') {
        //Verificando si ya fue seleccionada una talla
        if (document.getElementById('stock').textContent != 'En Stock: Seleccione una talla') {
            //Verificando que la cantidad seleccionada sea mayor a 1
            if (cantidad == stock) { 
                document.getElementById('cantidad').textContent = cantidad;
                document.getElementById('txtCantidad').value = cantidad;
                sweetAlert(3, 'Has llegado al limite de stock disponible.',null);
            } else {
                cantidad++;
                document.getElementById('cantidad').textContent = cantidad;
                document.getElementById('txtCantidad').value = cantidad;
            }
        } else {
            sweetAlert(4, 'Seleccione una talla.',null);
        }
    } else {
        //Verificando que la cantidad seleccionada sea mayor a 1
        if (cantidad == stock) { 
            document.getElementById('cantidad').textContent = cantidad;
            document.getElementById('txtCantidad').value = cantidad;
            sweetAlert(3, 'Has llegado al limite de stock disponible.',null);
        } else {
            cantidad++;
            document.getElementById('cantidad').textContent = cantidad;
            document.getElementById('txtCantidad').value = cantidad;
        }
    }
})

//Agregando el pedido
document.getElementById('agregarCart').addEventListener('click', function (event) {
    //Evento para evitar que recargue la pagina
    event.preventDefault();
    //Fetch para buscar si el cliente tiene algún pedido pendiente, caso contrario agregara uno nuevo
    fetch(api_pedidos + 'startOrder', {
        method: 'post',
        body: new FormData(document.getElementById('cantidad-form'))
    }).then(request => {
        //Verificamos si la petición fue correcta
        if (request.ok) {
            request.json().then(response => {
                //Verificamos la respuesta de a la api
                if (response.status) {
                    sweetAlert(1, response.message,closeModal('cantidadModal'));
                } else {
                    sweetAlert(2, response.exception, null);
                }
            })
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    }).catch(error => console.log(error))
})
