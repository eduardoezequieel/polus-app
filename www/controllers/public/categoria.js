var idCliente;
var alia2;
var foto2;
//Constante para la ruta de la API
const API_CATEGORIA = 'http://34.125.116.235/app/api/public/categoria.php?action=';

//Cuando se carga la pagina web
document.addEventListener('DOMContentLoaded', function(){
    readCategories(API_CATEGORIA);
    let params = new URLSearchParams(location.search)
    // Se obtienen los datos localizados por medio de las variables.
    idCliente = params.get('id');
    alias2 = params.get('alias');
    foto2 = params.get('foto');
    isLogged(idCliente,alias2,foto2);
});
//Funcion para el llenado de tablas.
function fillCategories(dataset){
    let content = ' ';

    dataset.map(function(row){
        url = `categoria.html?id=${idCliente}&alias=${alias2}&foto=${foto2}&idSub=${row.idcategoria}&name=${row.categoria}`;

        content += `
        <div class="col d-flex justify-content-center">
            <a href="${url}" class="btn botonCategoria animate__animated animate__fadeInDown d-flex flex-column justify-content-center align-items-center">
                <img src="http://34.125.116.235/resources/img/dashboard_img/admon_fotos/${row.imagen}" alt="#" class="img-fluid w-25 mb-2"> 
                ${row.categoria}
            </a>
        </div>
        `
    })

    document.getElementById('categories-body').innerHTML = content;
}

function readCategories(api) {
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
                // Se envían los datos a la función del controlador para que llenen las categorias en la vista.
                fillCategories(data);
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    }).catch(function (error) {
        console.log(error);
    });
}