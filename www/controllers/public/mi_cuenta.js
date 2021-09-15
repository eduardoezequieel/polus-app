//Constante para la ruta de la API
const API_CATEGORIA2 = '../../app/api/public/categoria.php?action=';
const API_PEDIDO = '../../app/api/public/pedidos.php?action=';
const ENDPOINT_TALLAS = '../../app/api/public/pedidos.php?action=readTallaProductoCart';
var stock2;

//Cuando se carga la pagina web
document.addEventListener('DOMContentLoaded', function(){
    
});

document.getElementById('dropdownCategorias').addEventListener('click', function(){
    readCategoriesDropdown(API_CATEGORIA2);
}) 

// Función para obtener el registro de pedidos del cliente..
function readClientRecord() {
    fetch(API_PEDIDO + 'readClientRecord', {
        method: 'get'
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje indicando el problema.
        if (request.ok) {
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    let content = ''
                    // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
                    response.dataset.map(function (row) {
                        // Se crean y concatenan las filas de la tabla con los datos de cada registro.
                        content += `
                            <tr>
                                <td>${row.idpedido}</td>
                                <td>${row.fechapedido}</td>
                                <td>${row.estadopedido}</td>
                                <th scope="row">
                                    <div class="row justify-c">
                                        <div class="col-12 d-flex">
                                                            
                                            <a href="#"
                                                class="btn btn-outline-primary" onclick="getProducts(${row.idpedido})" data-bs-toggle="modal" data-bs-dismiss="modal" data-bs-target="#productosPedidoModal"><i class="fas fa-info"></i>
                                            </a>
                                            <h5 class="mx-1">
                                            </h1>

                                            <a href="../../app/reports/public/comprobante_compra.php?id=${row.idpedido}" target="_blank" data-tooltip="Comprabante de compra"
                                                class="btn btn-outline-secondary"><i class="fas fa-book"></i></a>

                                        </div>
                                    </div>
                                </th>
                            </tr>
                            
                        `;
                    });
                    // Se agregan las filas al cuerpo de la tabla mediante su id para mostrar los registros.
                    document.getElementById('tbodyPedidos-rows').innerHTML = content;
                    // Se muestra el total a pagar con dos decimales.
                    //document.getElementById('pago1').textContent = total.toFixed(2);
                } else {
                    //sweetAlert(4, response.exception, 'index.php');
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

function getProducts(id){
    const data = new FormData();
    data.append('idPedido', id);

    fetch(API_PEDIDO + 'getProducts', {
        method: 'post',
        body: data
    }).then(function (request) {
        if (request.ok) {
            request.json().then(function (response) {
                if (response.status) { 
                    console.log(response.dataset); 
                    let data = response.dataset;   
                    let content = '';     
                    data.map(function(row){
                        content += `${row.nombre}: ${row.cantidad}
                        `;
                    })                          
                    document.getElementById('txtProductos').value = content;
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    }).catch(function (error) {
        console.log(error);
    });
}

//Funcion para el llenado de tablas.
function fillCategories(dataset){
    let content = ' ';

    dataset.map(function(row){
        url = `categoria.php?id=${row.idcategoria}&name=${row.categoria}`;

        content += `
        <li><a class="dropdown-item" href="${url}">${row.categoria}</a></li>
        `
    })

    document.getElementById('dropdownCategories-body').innerHTML = content;
}

function readCategoriesDropdown(api) {
    fetch(api + 'readAll', {
        method: 'get'
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje indicando el problema.
        if (request.ok) {
            request.json().then(function (response) {
                let data = [];
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    data = response.dataset;
                    console.log(data);
                    fillCategories(data);
                } else {
                    sweetAlert(4, response.exception, null);
                    console.log('hola')
                }
                // Se envían los datos a la función del controlador para que llenen las categorias en la vista.
                
                console.log(data);
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    }).catch(function (error) {
        console.log(error);
    });
}

// Función para mostrar un mensaje de confirmación al momento de cerrar sesión.
function logOutCliente() {
    swal({
        title: 'Advertencia',
        text: '¿Quiere cerrar la sesión?',
        icon: 'warning',
        buttons: ['No', 'Sí'],
        closeOnClickOutside: false,
        closeOnEsc: false
    }).then(function (value) {
        // Se verifica si fue cliqueado el botón Sí para hacer la petición de cerrar sesión, de lo contrario se muestra un mensaje.
        if (value) {
            fetch('../../app/api/public/clientes.php?action=logOut', {
                method: 'get'
            }).then(function (request) {
                // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje indicando el problema.
                if (request.ok) {
                    request.json().then(function (response) {
                        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                        if (response.status) {
                            sweetAlert(1, response.message, 'index.php');
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
        } else {
            //sweetAlert(4, 'Puede continuar con la sesión', null);
        }
    });
}

// Función para obtener el detalle del pedido (carrito de compras).
function readOrderDetail() {
    document.getElementById('finish').disabled = true;
    fetch(API_PEDIDO + 'readOrderDetail', {
        method: 'get'
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje indicando el problema.
        if (request.ok) {
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    document.getElementById('finish').disabled = false;
                    // Se declara e inicializa una variable para concatenar las filas de la tabla en la vista.
                    let content = '';
                    // Se declara e inicializa una variable para calcular el importe por cada producto.
                    let subtotal = 0;
                    // Se declara e inicializa una variable para ir sumando cada subtotal y obtener el monto final a pagar.
                    let total = 0;
                    // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
                    response.dataset.map(function (row) {
                        subtotal = row.precioproducto * row.cantidad;
                        total += subtotal;
                        // Se crean y concatenan las filas de la tabla con los datos de cada registro.
                        content += `
                            <tr>
                                <td>${row.nombre}</td>
                                <td>${row.precioproducto}</td>
                                <td>${row.cantidad}</td>
                                <td>${subtotal.toFixed(2)}</td>
                                <th scope="row">
                                    <div class="row justify-c">
                                        <div class="col-12 d-flex">
                                            <a href="#" onclick="openUpdateDialog(${row.iddetallepedido},${row.cantidad},${row.idproducto})" 
                                                data-bs-toggle="modal" data-bs-target="#actualizarCantidades"
                                                class="btn btn-outline-secondary"><i class="fas fa-edit tamanoBoton"></i>
                                            </a>   
                                            <h5 class="mx-1">
                                            </h5>       
                                            <a href="#" onclick="openDeleteDialogCart(${row.iddetallepedido})"
                                                class="btn btn-outline-secondary"><i class="fas fa-window-close tamanoBoton"></i>
                                            </a>
                                            

                                        </div>
                                    </div>
                                </th>
                            </tr>
                        `;
                    });
                    // Se agregan las filas al cuerpo de la tabla mediante su id para mostrar los registros.
                    document.getElementById('tbodyCart-rows').innerHTML = content;
                    // Se muestra el total a pagar con dos decimales.
                    document.getElementById('pago').textContent = total.toFixed(2);
                } else {
                    //sweetAlert(4, response.exception, 'index.php');
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    }).catch(function (error) {
        console.log(error);
    });
}

// Función para mostrar un mensaje de confirmación al momento de eliminar un producto del carrito.
function openDeleteDialogCart(id) {
    swal({
        title: 'Advertencia',
        text: '¿Está seguro de remover el producto?',
        icon: 'warning',
        buttons: ['No', 'Sí'],
        closeOnClickOutside: false,
        closeOnEsc: false
    }).then(function (value) {
        // Se verifica si fue cliqueado el botón Sí para realizar la petición respectiva, de lo contrario no se hace nada.
        if (value) {
            // Se define un objeto con los datos del registro seleccionado.
            const data = new FormData();
            data.append('id_detalle', id);

            fetch(API_PEDIDO + 'deleteDetail', {
                method: 'post',
                body: data
            }).then(function (request) {
                // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje indicando el problema.
                if (request.ok) {
                    request.json().then(function (response) {
                        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                        if (response.status) {
                            // Se cargan nuevamente las filas en la tabla de la vista después de borrar un producto del carrito.
                            readOrderDetail();
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
    });
}

//Función para actualizar las cantidades
function openUpdateDialog(detallepedido, cantidad, idproducto){
    //Se ponen las variables en los input correspondientes
    document.getElementById('idDetalle').value = detallepedido;
    document.getElementById('cantidadCart').value = cantidad;
    document.getElementById('idProducto3').value = idproducto;

    //Fetch para verificar si el producto seleccionado es de tipo ropa
    fetch(API_PEDIDO + 'checkClothesCart', {
        method: 'post',
        body: new FormData(document.getElementById('cantidadUpdate-form'))
    }).then(request => {
        //Se verifica si la petición fue correcta
        if (request.ok) {
            request.json().then(response => {
                //Se verifica la respuesta de la api
                if(response.status) {
                    readClothesDetailCart();
                    fillSelectTallasCart(ENDPOINT_TALLAS, 'cbTallas', null);
                } else if (response.error){
                    sweetAlert(2, response.exception,null);
                } else {
                    readNoClothesDetailCart();
                }
            })
        } else {
            console.log(request.status + ' '+ request.statusText)
        }
    }).catch(error => console.log(error));
}


//Función para leer los datos del producto si es de tipo ropa
function readClothesDetailCart() {
    document.getElementById('cbTallas').className = 'form-select personalizacionPolus3';
    document.getElementById('labelTalla2').className = 'text-white text-center my-2';
    //Fetch para leer los datos del producto
    fetch(API_PEDIDO + 'readClothesDetailCart', {
        method: 'post',
        body: new FormData(document.getElementById('cantidadUpdate-form'))
    }).then(request => {
        //Se verifica si la petición fue correcta
        if (request.ok) {
            request.json().then(response => {
                //Se verifica la respuesta de la api
                if (response.status) {
                    document.getElementById('stock2').textContent = 'En Stock: Seleccione una talla';
                    document.getElementById('tipo2').value = 'ropa';
                    document.getElementById('btnplus').disabled = true;
                    document.getElementById('btnminus').disabled = true;
                    document.getElementById('updateCart').disabled = true;
                    document.getElementById('cantidad2').textContent = document.getElementById('cantidadCart').value;
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
function readNoClothesDetailCart() {
    fillSelectTallasCart(ENDPOINT_TALLAS, 'cbTallas', null);
    document.getElementById('cbTallas').className = 'd-none';
    document.getElementById('labelTalla2').className = 'd-none';
    document.getElementById('btnplus').disabled = false;
    document.getElementById('btnminus').disabled = false;
    document.getElementById('updateCart').disabled = true;
    document.getElementById('cantidad2').textContent = document.getElementById('cantidadCart').value;
    //Fetch para leer los datos del producto
    fetch(API_PEDIDO + 'readNoClothesDetailCart', {
        method: 'post',
        body: new FormData(document.getElementById('cantidadUpdate-form'))
    }).then(request => {
        //Se verifica si la petición fue correcta
        if (request.ok) {
            request.json().then(response => {
                //Se verifica la respuesta de la api
                if (response.status) {
                    document.getElementById('stock2').textContent = 'En Stock: ' + response.dataset.cantidad;
                    document.getElementById('tipo2').value = 'no_ropa';
                    stock2 = response.dataset.cantidad;
                    document.getElementById('stockReal').value = response.dataset.cantidad;
                    if (stock2 == 0) {
                        document.getElementById('columnaCantidad2').className = 'd-none';
                        document.getElementById('updateCart').className = 'd-none';
                    }
                } else {
                    sweetAlert(3, response.exception,null);
                    document.getElementById('columnaCantidad2').className = 'd-none';
                    document.getElementById('updateCart').className = 'd-none';
                }
            })
        } else {
            console.log(request.status + ' '+ request.statusText)
        }
    }).catch(error => console.log(error));
}

document.getElementById('btnminus').addEventListener('click', function (event) {
    document.getElementById('updateCart').disabled = false;
    event.preventDefault();
    //Guardo input de tipo
    var tipo = document.getElementById('tipo2').value;
    //Guardando la cantidad seleccionada en una variable
    var cantidad =  document.getElementById('cantidad2').textContent;

    //Verificando si es ropa 
    if (tipo == 'ropa') {
        //Verificando si ya fue seleccionada una talla
        if (document.getElementById('stock2').textContent != 'En Stock: Seleccione una talla') {
            cantidad--;
            //Verificando que la cantidad seleccionada sea mayor a 1
            if (cantidad >= 1) { 
                document.getElementById('cantidad2').textContent = cantidad;
                document.getElementById('txtCantidad4').value = cantidad;
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
            document.getElementById('cantidad2').textContent = cantidad;
            document.getElementById('txtCantidad4').value = cantidad;
        } else {
            sweetAlert(3, 'La cantidad de productos no puede ser menor a 1.',null);
        }
    }
})

//Función para limitar la cantidad ingresada por el cliente cuando aumenta
document.getElementById('btnplus').addEventListener('click', function (event) {
    document.getElementById('updateCart').disabled = false;
    event.preventDefault();
    //Guardo input de tipo
    var tipo = document.getElementById('tipo2').value;
    //Guardando la cantidad seleccionada en una variable
    var cantidad =  document.getElementById('cantidad2').textContent;

    //Verificando si es ropa 
    if (tipo == 'ropa') {
        //Verificando si ya fue seleccionada una talla
        if (document.getElementById('stock2').textContent != 'En Stock: Seleccione una talla') {
            //Verificando que la cantidad seleccionada sea mayor a 1
            if (cantidad == stock2) { 
                document.getElementById('cantidad2').textContent = cantidad;
                document.getElementById('txtCantidad4').value = cantidad;
                sweetAlert(3, 'Has llegado al limite de stock disponible.',null);
            } else {
                cantidad++;
                document.getElementById('cantidad2').textContent = cantidad;
                document.getElementById('txtCantidad4').value = cantidad;
            }
        } else {
            sweetAlert(4, 'Seleccione una talla.',null);
        }
    } else {
        //Verificando que la cantidad seleccionada sea mayor a 1
        if (cantidad == stock2) { 
            document.getElementById('cantidad2').textContent = cantidad;
            document.getElementById('txtCantidad4').value = cantidad;
            sweetAlert(3, 'Has llegado al limite de stock disponible.',null);
        } else {
            cantidad++;
            document.getElementById('cantidad2').textContent = cantidad;
            document.getElementById('txtCantidad4').value = cantidad;
        }
    }
})

//Método para cambiar la cantidad en stock dependiendo de la talla seleccionada
function showClothesStockCart() {
    document.getElementById('btnplus').disabled = false;
    document.getElementById('btnminus').disabled = false;
    //Fecth para capturar el stock para productos de tipo ropa
    fetch(API_PEDIDO + 'showClothesStockCart', {
        method: 'post',
        body: new FormData(document.getElementById('cantidadUpdate-form'))
    }).then(request => {
        //Verificamos si la petición fue correcta
        if (request.ok) {
            request.json().then(response => {
                //Verificamos la respuesta de la api
                if (response.status) {
                    document.getElementById('stock2').textContent = 'Stock: ' + response.dataset.cantidad;
                    stock2 = response.dataset.cantidad;
                    document.getElementById('stockReal').value = response.dataset.cantidad;
                    if (stock2 == 0) {
                        document.getElementById('columnaCantidad2').className = 'd-none';
                        document.getElementById('updateCart').className = 'd-none';
                    }
                    document.getElementById('updateCart').disabled = false;
                } else {
                    sweetAlert(2,response.exception, null);
                }
            })
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    }).catch(error => console.log(error))
}

//Agregando el pedido
document.getElementById('updateCart').addEventListener('click', function (event) {
    //Evento para evitar que recargue la pagina
    event.preventDefault();
    //Fetch para buscar si el cliente tiene algún pedido pendiente, caso contrario agregara uno nuevo
    fetch(API_PEDIDO + 'checkStockCart', {
        method: 'post',
        body: new FormData(document.getElementById('cantidadUpdate-form'))
    }).then(request => {
        //Verificamos si la petición fue correcta
        if (request.ok) {
            request.json().then(response => {
                //Verificamos la respuesta de a la api
                if (response.status) {
                    sweetAlert(1, response.message,null);
                    readOrderDetail();
                } else {
                    sweetAlert(2, response.exception, null);
                }
            })
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    }).catch(error => console.log(error))
})

//Función para llenar las tablas
function fillSelectTallasCart(endpoint, select, selected) {
    fetch(endpoint, {
        method: 'post',
        body: new FormData(document.getElementById('cantidadUpdate-form'))
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

// Función para mostrar un mensaje de confirmación al momento de finalizar el pedido.
function finishOrderCart() {
    swal({
        title: 'Aviso',
        text: '¿Está seguro de finalizar el pedido?',
        icon: 'info',
        buttons: ['No', 'Sí'],
        closeOnClickOutside: false,
        closeOnEsc: false
    }).then(function (value) {
        // Se verifica si fue cliqueado el botón Sí para realizar la petición respectiva, de lo contrario se muestra un mensaje.
        if (value) {
            fetch(API_PEDIDO + 'finishOrder', {
                method: 'get'
            }).then(function (request) {
                // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje indicando el problema.
                if (request.ok) {
                    request.json().then(function (response) {
                        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                        if (response.status) {
                            sweetAlert(1, response.message, 'index.php');
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
        } else {
            sweetAlert(4, 'Puede seguir comprando', null);
        }
    });
}