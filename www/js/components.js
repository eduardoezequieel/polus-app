/*
*   Este archivo es de uso general en todas las páginas web. Se importa en las plantillas del pie del documento.
*/

/*
*   Función para obtener todos los registros disponibles en los mantenimientos de tablas (operación read).
*
*   Parámetros: api (ruta del servidor para obtener los datos).
*
*   Retorno: ninguno.
*/

function botonExaminar(idBoton, idInputExaminar){
    document.getElementById(idBoton).addEventListener('click', function(event){
        //Se evita recargar la pagina
        event.preventDefault();
    
        //Se hace click al input invisible
        document.getElementById(idInputExaminar).click();
    });
}

function previewPicture(idInputExaminar, idDivFoto){
    document.getElementById(idInputExaminar).onchange=function(e){

        //variable creada para obtener la URL del archivo a cargar
        let reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
    
        //Se ejecuta al obtener una URL
        reader.onload=function(){
            //Parte de la pagina web en donde se incrustara la imagen
            let preview=document.getElementById(idDivFoto);
    
            //Se crea el elemento IMG que contendra la preview
            image = document.createElement('img');
    
            //Se le asigna la ruta al elemento creado
            image.src = reader.result;
    
            //Se aplican las respectivas clases para que la preview aparezca estilizada
            image.className = 'rounded-circle fotografiaPerfil';
    
            //Se quita lo que este dentro del div (en caso de que exista otra imagen)
            preview.innerHTML = ' ';
    
            //Se agrega el elemento recien creado
            preview.append(image);
        }
    }
}

function previewSavePicture(idDivFoto, name, foto){
    let ruta;
    switch (foto) {
        case 1:
            ruta = '../../resources/img/dashboard_img/admon_fotos/';
            break;
        case 2:
            ruta = '../../resources/img/dashboard_img/cliente_fotos/'
            break;
        case 3:
            ruta = '../../resources/img/dashboard_img/producto_fotos/';
            break;
        default:
            break;
    }
    if(foto == 0){
        //Parte de la pagina web en donde se incrustara la imagen
        let preview=document.getElementById(idDivFoto);
                    
        image = document.createElement('img');

        //Se aplican las respectivas clases para que la preview aparezca estilizada
        image.className = 'rounded-circle fotografiaPerfil';
                
        //Se quita lo que este dentro del div (en caso de que exista otra imagen)
        preview.innerHTML = ' ';
                
        //Se agrega el elemento recien creado
        preview.append(image);
    } else{
        //Parte de la pagina web en donde se incrustara la imagen
        let preview=document.getElementById(idDivFoto);
                    
        image = document.createElement('img');
        //Se le asigna la ruta al elemento creado
        image.src = ruta + name;
                
        //Se aplican las respectivas clases para que la preview aparezca estilizada
        image.className = 'rounded-circle fotografiaPerfil';
                
        //Se quita lo que este dentro del div (en caso de que exista otra imagen)
        preview.innerHTML = ' ';
                
        //Se agrega el elemento recien creado
        preview.append(image);
    }
}

function restartSearch(btn, api){
    document.getElementById(btn).addEventListener('click', function(event){
        event.preventDefault();
        document.getElementById('search').value='';
        readRows(api);
    })
}


function readRows(api) {
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
                } else {
                    sweetAlert(4, response.exception, null);
                }
                // Se envían los datos a la función del controlador para que llene la tabla en la vista.
                fillTable(data);
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    }).catch(function (error) {
        console.log(error);
    });
}

/*
*   Función para obtener los resultados de una búsqueda en los mantenimientos de tablas (operación search).
*
*   Parámetros: api (ruta del servidor para obtener los datos) y form (identificador del formulario de búsqueda).
*
*   Retorno: ninguno.
*/
    function searchRows(api, form) {
        fetch(api + 'search', {
            method: 'post',
            body: new FormData(document.getElementById(form))
        }).then(function (request) {
            // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje indicando el problema.
            if (request.ok) {
                request.json().then(function (response) {
                    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                    if (response.status) {
                        // Se envían los datos a la función del controlador para que llene la tabla en la vista.
                        fillTable(response.dataset);
                        sweetAlert(1, response.message, null);
                    } else {
                        sweetAlert(2, response.exception, null);
                        console.log("error");
                    }
                });
            } else {
                console.log(request.status + ' ' + request.statusText);
            }
        }).catch(function (error) {
            console.log(error);
        });
    }

/*
*   Función para crear o actualizar un registro en los mantenimientos de tablas (operación create y update).
*
*   Parámetros: api (ruta del servidor para enviar los datos), form (identificador del formulario) y modal (identificador de la caja de dialogo).
*
*   Retorno: ninguno.
*/
function saveRow(api, action, form, modal) {
    fetch(api + action, {
        method: 'post',
        body: new FormData(document.getElementById(form))
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje indicando el problema.
        if (request.ok) {
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    // Se cargan nuevamente las filas en la tabla de la vista después de agregar o modificar un registro.
                    readRows(api);
                    sweetAlert(1, response.message, closeModal(modal));
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

/*
*   Función para eliminar un registro seleccionado en los mantenimientos de tablas (operación delete). Requiere el archivo sweetalert.min.js para funcionar.
*
*   Parámetros: api (ruta del servidor para enviar los datos) y data (objeto con los datos del registro a eliminar).
*
*   Retorno: ninguno.
*/
function confirmDelete(api, data) {
    swal({
        title: 'Advertencia',
        text: '¿Desea eliminar el registro?',
        icon: 'warning',
        buttons: ['No', 'Sí'],
        closeOnClickOutside: false,
        closeOnEsc: false
    }).then(function (value) {
        // Se verifica si fue cliqueado el botón Sí para hacer la petición de borrado, de lo contrario no se hace nada.
        if (value) {
            fetch(api + 'delete', {
                method: 'post',
                body: data
            }).then(function (request) {
                // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje indicando el problema.
                if (request.ok) {
                    request.json().then(function (response) {
                        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                        if (response.status) {
                            // Se cargan nuevamente las filas en la tabla de la vista después de borrar un registro.
                            readRows(api);
                            sweetAlert(1, response.message, null);
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

/*
*   Función para manejar los mensajes de notificación al usuario. Requiere el archivo sweetalert.min.js para funcionar.
*
*   Parámetros: type (tipo de mensaje), text (texto a mostrar) y url (ubicación a direccionar al cerrar el mensaje).
*
*   Retorno: ninguno.
*/

function sweetAlert(type, text, url) {
    // Se compara el tipo de mensaje a mostrar.
    switch (type) {
        case 1:
            title = 'Éxito';
            icon = 'success';
            break;
        case 2:
            title = 'Error';
            icon = 'error';
            break;
        case 3:
            title = 'Advertencia';
            icon = 'warning';
            break;
        case 4:
            title = 'Aviso';
            icon = 'info';
    }
    // Si existe una ruta definida, se muestra el mensaje y se direcciona a dicha ubicación, de lo contrario solo se muestra el mensaje.
    if (url) {
        swal({
            title: title,
            text: text,
            icon: icon,
            button: 'Aceptar',
            closeOnClickOutside: false,
            closeOnEsc: false
        }).then(function () {
            location.href = url
        });
    } else {
        swal({
            title: title,
            text: text,
            icon: icon,
            button: 'Aceptar',
            closeOnClickOutside: false,
            closeOnEsc: false
        });
    }
}

/*
*   Función para cargar las opciones en un select de formulario.
*
*   Parámetros: endpoint (ruta del servidor para obtener los datos), select (identificador del select en el formulario) y selected (valor seleccionado).
*
*   Retorno: ninguno.
*/
function fillSelect(endpoint, select, selected) {
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

/*
*   Función para generar una gráfica de barras verticales. Requiere el archivo chart.js para funcionar.
*
*   Parámetros: canvas (identificador de la etiqueta canvas), xAxis (datos para el eje X), yAxis (datos para el eje Y), legend (etiqueta para los datos) y title (título de la gráfica).
*
*   Retorno: ninguno.
*/


/*
*   Función para generar una gráfica de pastel con porcentajes. Requiere el archivo chart.js para funcionar.
*
*   Parámetros: canvas (identificador de la etiqueta canvas), legends (valores para las etiquetas), values (valores de los datos) y title (título de la gráfica).
*
*   Retorno: ninguno.
*/
function pieGraph(canvas, legends, values, title) {
    // Se declara un arreglo para guardar códigos de colores en formato hexadecimal.
    let colors = [];
    // Se declara e inicializa una variable para sumar los valores a graficar.
    let total = 0;
    // Se generan códigos hexadecimales de 6 cifras de acuerdo con el número de datos a mostrar y se van acumulando los valores.
    for (i = 0; i < values.length; i++) {
        colors.push('#' + (Math.random().toString(16)).substring(2, 8));
        total += values[i];
    }
    // Se declara un arreglo para guardar los porcentajes de cada cantidad.
    let percentages = [];
    // Se calcula el porcetaje que corresponde a cada valor.
    for (i = 0; i < values.length; i++) {
        percentages.push((values[i] * 100 / total).toFixed(2));
    }
    // Se establece el contexto donde se mostrará el gráfico, es decir, se define la etiqueta canvas a utilizar.
    const context = document.getElementById(canvas).getContext('2d');
    // Se crea una instancia para generar la gráfica con los datos recibidos.
    const chart = new Chart(context, {
        type: 'pie',
        data: {
            labels: legends,
            datasets: [{
                data: percentages,
                backgroundColor: colors
            }]
        },
        options: {
            responsive: true,
            title: {
                display: true,
                text: title
            }
        }
    });
}


function openModal(form){
    $(document.getElementById(form)).modal('show');
}


function closeModal(form){
    $(document.getElementById(form)).modal('hide');
}

function clearForm(form){
    document.getElementById(form).reset();
}

// Función para mostrar un mensaje de confirmación al momento de cerrar sesión.
function logOut() {
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
            fetch('../../app/api/dashboard/usuarios.php?action=logOut', {
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

function checkInputLetras(input) {
    var field = document.getElementById(input);
    if (field.value.trim() === "") {
        field.classList.remove("success");
        field.classList.add("error");
    } else {
        field.classList.remove("error");
        field.classList.add("success");

        if (/^[a-zA-ZñÑáÁéÉíÍóÓúÚ\s]+$/.test(field.value)) {
            field.classList.remove("error");
            field.classList.add("success");

        } else {
            field.classList.remove("success");
            field.classList.add("error");
        }
    }

}

function checkCorreo(input) {
    document.getElementById(input).classList.remove("success");
    document.getElementById(input).classList.add("error");
    var field = document.getElementById(input);
    if (field.value.trim() === "") {
        field.classList.remove("success");
        field.classList.add("error");
    } else {
        field.classList.remove("error");
        field.classList.add("success");

        if (/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(field.value)) {
            field.classList.remove("error");
            field.classList.add("success");
        } else {
            field.classList.remove("success");
            field.classList.add("error");
        }
    }
}

function checkInput(i){

    if(formulario[i].value.trim() === ""){
        formulario[i].classList.remove("success");
        formulario[i].classList.add("error");
    } else{
        formulario[i].classList.remove("error");
        formulario[i].classList.add("success");   
    }
    
}

//Método para verificar telefono
function checkTelefono(input) {
    var field = document.getElementById(input);
    if (field.value.trim() === "") {
        field.classList.remove("success");
        field.classList.add("error");
    } else {
        field.classList.remove("error");
        field.classList.add("success");

        if (/[0-9-]+$/i.test(field.value)) {
            field.classList.remove("error");
            field.classList.add("success");
        } else {
            field.classList.remove("success");
            field.classList.add("error");
        }
    }

}

function checkDireccion(){
    direccion.classList.add("error");
    if(direccion.value.trim() === ""){
        direccion.classList.remove("success");
        direccion.classList.add("error");
    } else{
        direccion.classList.remove("error");
        direccion.classList.add("success");   
    }
    
}

function checkContrasena(i){
    document.getElementById(i).classList.remove("success");
    document.getElementById(i).classList.add("error");
    var regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])([A-Za-z\d$@$!%*?&]|[^ ]){8,15}$/;

    if (document.getElementById(i).value.match(regex)) {
        document.getElementById(i).classList.remove("error");
        document.getElementById(i).classList.add("success");
    } else {
        document.getElementById(i).classList.remove("sucess");
        document.getElementById(i).classList.add("error");
    }
}

function checkAlfanumerico(i){
    document.getElementById(i).classList.remove("success");
    document.getElementById(i).classList.add("error");
    var regex = /^[a-z0-9.]+$/i;

    if (document.getElementById(i).value.match(regex)) {
        document.getElementById(i).classList.remove("error");
        document.getElementById(i).classList.add("success");
    } else {
        document.getElementById(i).classList.remove("sucess");
        document.getElementById(i).classList.add("error");
    }
}

function checkDireccion(i){
    document.getElementById(i).classList.remove("success");
    document.getElementById(i).classList.add("error");
    var regex = /^[a-z0-9'\.\-\s\,]+$/i;

    if (document.getElementById(i).value.match(regex)) {
        document.getElementById(i).classList.remove("error");
        document.getElementById(i).classList.add("success");
    } else {
        document.getElementById(i).classList.remove("sucess");
        document.getElementById(i).classList.add("error");
    }
}

//Función para mostrar contraseña
function showHidePassword(checkbox, pass) {
    var check = document.getElementById(checkbox);
    var password = document.getElementById(pass);
    //Verificando el estado del check
    if (check.checked == true) {
        password.type = 'text';
    } else {
        password.type = 'password';
    }
}

/*
*   Función para generar una gráfica de barras verticales. Requiere el archivo chart.js para funcionar.
*
*   Parámetros: canvas (identificador de la etiqueta canvas), xAxis (datos para el eje X), yAxis (datos para el eje Y), legend (etiqueta para los datos) y title (título de la gráfica).
*
*   Retorno: ninguno.
*/
//Funcion para hacer un grafico de barras.
function barGraph(datos, id, variables, titulo){
    //Arreglo que almacena colores de forma aleatoria
    let colors = [];
    let values = [];
    //Arreglo que guarda los valores
    values = datos;
    // Se declara e inicializa una variable para sumar los valores a graficar.
    let total = 0;
    // Se generan códigos hexadecimales de 6 cifras de acuerdo con el número de datos a mostrar y se van acumulando los valores.
    for (i = 0; i < values.length; i++) {
        colors.push('#' + (Math.random().toString(16)).substring(2, 8));
        total += values[i];
    }

    //Se crea una variable con el id y el contexto
    var ctx = document.getElementById(id).getContext('2d');
    //Chart
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: variables,
            datasets: [{
                label: titulo,
                data: values,
                backgroundColor: colors,
                hoverOffset: 4
            }]
        },
        options: {
            plugins: {
                tooltip: {
                    displayColors: false,
                    callbacks: {
                        //De tooltipItem obtenemos el index seleccionado al momento de hacer hover para darle formato.
                        label: function(tooltipItem) {
                            var value = myChart.data.datasets[tooltipItem.datasetIndex].data[tooltipItem.dataIndex];
                            return 'Porcentaje: ' + value + '%';    

                            }                        
                    }

                }
            }
        }
    });
}

//Funcion para hacer un grafico de barras.
function barGraph2(datos, id, variables, titulo, mensaje){
    //Arreglo que almacena colores de forma aleatoria
    let colors = [];
    let values = [];
    //Arreglo que guarda los valores
    values = datos;
    // Se declara e inicializa una variable para sumar los valores a graficar.
    let total = 0;
    // Se generan códigos hexadecimales de 6 cifras de acuerdo con el número de datos a mostrar y se van acumulando los valores.
    for (i = 0; i < values.length; i++) {
        colors.push('#' + (Math.random().toString(16)).substring(2, 8));
        total += values[i];
    }

    //Se crea una variable con el id y el contexto
    var ctx = document.getElementById(id).getContext('2d');
    //Chart
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: variables,
            datasets: [{
                label: titulo,
                data: values,
                backgroundColor: colors,
                hoverOffset: 4
            }]
        },
        options: {
            indexAxis: 'y', 
            plugins: {
                tooltip: {
                    displayColors: false,
                    callbacks: {
                        //De tooltipItem obtenemos el index seleccionado al momento de hacer hover para darle formato.
                        label: function(tooltipItem) {
                            var value = myChart.data.datasets[tooltipItem.datasetIndex].data[tooltipItem.dataIndex];
                            return mensaje + value;    

                            }                        
                    }

                }
            }
        }
    });
}

//Funcion para hacer un grafico de pastel.
function pieGraph(datos, id, productos){
    //Arreglo que almacena colores de forma aleatoria
    let colors = [];
    let values = [];
    //Arreglo que guarda los valores
    values = datos;
    // Se declara e inicializa una variable para sumar los valores a graficar.
    let total = 0;
    // Se generan códigos hexadecimales de 6 cifras de acuerdo con el número de datos a mostrar y se van acumulando los valores.
    for (i = 0; i < values.length; i++) {
        colors.push('#' + (Math.random().toString(16)).substring(2, 8));
        total += values[i];
    }

    //Se crea una variable con el id y el contexto
    var ctx = document.getElementById(id).getContext('2d');
    //Chart
    var myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: productos,
            datasets: [{
                label: values, 
                data: values,
                backgroundColor: colors,
                hoverOffset: 4
            }]
        },
        options: {
            plugins: {
                tooltip: {
                    displayColors: false,
                    callbacks: {
                        //De tooltipItem obtenemos el index seleccionado al momento de hacer hover para darle formato.
                        label: function(tooltipItem) {
                            var value = myChart.data.datasets[tooltipItem.datasetIndex].data[tooltipItem.dataIndex];
                            return 'Puntuación: ' + value + ' ★ ';    

                            }
                    }

                }
            }
        }
    });
}

//Función para hacer un gráfico de lineas
function lineGraph(id, xAxis, yAxis, titulo, mensaje){
    //Se obtiene el canvas
    var ctx = document.getElementById(id).getContext('2d');
    //Chart js
    var myChart = new Chart (ctx, {
        type: 'line',
        data: data = {
            labels: xAxis,
            datasets: [{
                label: titulo,
                data: yAxis,
                fill: false,
                borderColor: 'rgb(0, 0, 0)',
                tension: 0.1
              }]
        },
        options:{
            plugins:{
                tooltip:{
                    displayColors: false,
                    callbacks: {
                        //De tooltipItem obtenemos el index seleccionado al momento de hacer hover para darle formato.
                        label: function(tooltipItem) {
                            var value = myChart.data.datasets[tooltipItem.datasetIndex].data[tooltipItem.dataIndex];
                            return mensaje + value;    

                            }
                    }
                }
            }
        }
    });
    
}

/*(function() {
    const idleDurationSecs = 60;
    const redirectUrl = 'index.php';
    let idleTimeout;

    const resetIdleTimeout = function() {
        if(idleTimeout) clearTimeout(idleTimeout);
        idleTimeout = setTimeout(() => location.href = redirectUrl, idleDurationSecs * 1000);
        session_destroy()
    };
	
	// Key events for reset time
    resetIdleTimeout();
    window.onmousemove = resetIdleTimeout;
    window.onkeypress = resetIdleTimeout;
    window.click = resetIdleTimeout;
    window.onclick = resetIdleTimeout;
    window.touchstart = resetIdleTimeout;
    window.onfocus = resetIdleTimeout;
    window.onchange = resetIdleTimeout;
    window.onmouseover = resetIdleTimeout;
    window.onmouseout = resetIdleTimeout;
    window.onmousemove = resetIdleTimeout;
    window.onmousedown = resetIdleTimeout;
    window.onmouseup = resetIdleTimeout;
    window.onkeypress = resetIdleTimeout;
    window.onkeydown = resetIdleTimeout;
    window.onkeyup = resetIdleTimeout;
    window.onsubmit = resetIdleTimeout;
    window.onreset = resetIdleTimeout;
    window.onselect = resetIdleTimeout;
    window.onscroll = resetIdleTimeout;

})();*/