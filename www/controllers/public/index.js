//Constante para la ruta de la API
const API_CLIENTE = 'http://34.125.116.235/app/api/public/clientes.php?action=';
var stock2;

//Cuando se carga la pagina web
document.addEventListener('DOMContentLoaded', function(){
   //Función para verificar si hay una sesión iniciada
    /*fetch(API_CLIENTES + 'isLogged').then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje indicando el problema.
        if (request.ok) {
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    let content = '';
                    content += `
                    <a class="navbar-brand" href="../../views/public/index.html">
                                <img src="../../resources/img/p icono.png" alt="img-fluid" height="40px" width="40px">
                            </a>
                            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
                                aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                                <ion-icon name="grid"></ion-icon>
                            </button>
                            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                                <li class="nav-item dropdown" id="dropdownCategorias">
                                    <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown"
                                    aria-expanded="false">
                                    Categorías
                                    </a>
                                    <ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="navbarDropdown" id="dropdownCategories-body">
                                    
                                    </ul>
                                </li>

                                <li class="nav-item">
                                    <a class="nav-link" href="index.html#AcercaNosotros">Acerca de Nosotros</a>
                                </li>

                                <li class="nav-item">
                                    <a class="nav-link" href="index.html#Soporte">Soporte</a>
                                </li>

                                </ul>
                                <form id="controlesNavbar">
                                    <button id="btnCarrito" data-bs-toggle="modal" data-bs-target="#carritoModal" class="btn text-white" onclick="readOrderDetail()"><i class="fas fa-shopping-cart mx-2"></i></button>
                                    
                                </form>
                                <div class="dropdown">
                                    <button class="btn d-flex" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                            <img src="../../resources/img/dashboard_img/cliente_fotos/foto.jpg" id="fotoPerfil" alt="" class="rounded-circle fotografiaPerfil2" width="40px">
                                            <h5 class="text-center mx-3 paddingUsername">KathPrueba</h5>
                                            <i class="fas fa-caret-down paddingFlecha"></i>
                                    </button>
                                    <ul class="dropdown-menu dropdown-menu-dark  animate__animated animate__bounceIn" aria-labelledby="dropdownMenuButton1">
                                        <li><a id="btnMisPedidos" onclick="readClientRecord()" class="dropdown-item" data-bs-toggle="modal" data-bs-target="#pedidosClienteModal" href="#">Mis Pedidos</a></li>
                                        <li><a id="btnMiCuenta" class="dropdown-item" href="mi_cuenta.html">Mi Cuenta</a></li>
                                        <li><a class="dropdown-item" href="#" onclick="logOutCliente()">Cerrar Sesión</a></li>
                                    </ul>
                                </div>  
                            </div>
                        
                    `;
                    // Se agregan las filas al cuerpo de la tabla mediante su id para mostrar los registros.
                    document.getElementById('nav').innerHTML = content;
                } else if (response.error) {
                   let content = '';
                   content += `
                        <a class="navbar-brand" href="../../views/public/index.html">
                                <img src="../../resources/img/p icono.png" alt="img-fluid" height="40px" width="40px">
                            </a>
                            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
                                aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                                <ion-icon name="grid"></ion-icon>
                            </button>
                            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                                <li class="nav-item dropdown" id="dropdownCategorias">
                                    <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown"
                                    aria-expanded="false">
                                    Categorías
                                    </a>
                                    <ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="navbarDropdown" id="dropdownCategories-body">

                                    </ul>
                                </li>

                                <li class="nav-item">
                                    <a class="nav-link" href="index.html#AcercaNosotros">Acerca de Nosotros</a>
                                </li>

                                <li class="nav-item">
                                    <a class="nav-link" href="index.html#Soporte">Soporte</a>
                                </li>

                                </ul>
                                <form id="controlesNavbar">
                                    
                                    <a href="../../views/public/iniciar_sesion.html" class="btn btn-outline-light">Acceder</a>
                                    <a href="../../views/public/crear_cuenta.html" class="btn btn-outline-secondary">Registrarse</a>
                                    
                                </form>
                            </div>
                    `;
                    // Se agregan las filas al cuerpo de la tabla mediante su id para mostrar los registros.
                    document.getElementById('nav').innerHTML = content;
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
    });*/
});
