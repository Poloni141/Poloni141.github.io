const traerProductos = async () => {
    const response = await fetch('./database/db.json')
    const productos = await response.json()

    productos.forEach((producto) => {
        divItems.innerHTML += `
        <div class="items__itemCard">
            <img class="items__imagen" src="${producto.imagen}">

            <div class="items__info">
                <div class="items__text">
                    <h2 class="items__title">${producto.name}</h2>
                    <p class="items__description">${producto.description}</p>
                </div>

                <div class="items__btn">
                    <a class="items__price" href="#">$${producto.price}</a>
                    <a id="btn${producto.id}" class="items__buy" href="#"><i class="fa-solid fa-cart-shopping"></i></a>
                </div>
            </div>
        </div>`
    });

    productos.forEach((teclado) => {
        document.querySelector(`#btn${teclado.id}`).addEventListener('click', () => {
            carrito.push(teclado)
            console.log(teclado)
            console.log(carrito)
            imprimir();
            imprimirTotal(carrito)
        })
    });
}


traerProductos()

let carrito = []

const divItems = document.getElementById('items')
const divCarrito = document.getElementById('seccion__items')


//Funcion para mostrar en el carrito los obejetos del array
function imprimir() {
    divCarrito.innerHTML = '';
    carrito.forEach((objeto) => {
        divCarrito.innerHTML += `
        <div class="seccion__item">
            <div class="seccion__info">
                <img src="${objeto.imagen}" >
                <div class="seccion__datos">
                    <h3>${objeto.name}</h3>
                    <p>Precio: $${objeto.price}</p>
                </div>
            </div>

            <div>
                <button id="eliminar${objeto.id}"><i class="fa-solid fa-xmark"></i></button>
            </div>
        </div>`
    });
    eliminar();
};

//Funcion para mostrar el precio total que lleva el carrito
function imprimirTotal(array) {
    let subTotal = array.reduce((sum, valor) => (typeof valor.price == "number" ? sum + valor.price : sum), 0)
    let total = 1.21 * subTotal
    document.getElementById("seccion__valor").innerHTML = `$${total}`;
}

const btnRestore = document.getElementById('btnRestore')
const btnFinalizar = document.getElementById('btnFinalizar')

//Guardar carrito en JSON
const guardarCarrito = (clave, valor) => {sessionStorage.setItem (clave, valor)}

//Boton para restaurar la compra anterior
btnRestore.onclick = function backup() {
    Swal.fire({
        title: 'Carrito',
        text: "Deseas recuperar tu carrito ?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#38b000',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Si!'
    }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire(
            'Carrito recuperado',
            'Se ha recuperado tu carrito.',
            'success'
        )
        divCarrito.innerHTML = '';
        const compraAnterior = JSON.parse(sessionStorage.getItem('backupCompra'))
        compraAnterior.forEach((objeto) => {
        divCarrito.innerHTML += `
        <div class="seccion__item">
            <div class="seccion__info">
                <img src="${objeto.imagen}" >
                <div class="seccion__datos">
                    <h3>${objeto.name}</h3>
                    <p>Precio: $${objeto.price}</p>
                </div>
            </div>

            <div>
                <button id="eliminar${objeto.id}"><i class="fa-solid fa-xmark"></i></button>
            </div>
        </div>`
        });
        console.log(compraAnterior)
        imprimirTotal(compraAnterior)
        } else {
            divCarrito.innerHTML = '';
        }
    })
}


//Boton para finalizar la compra
btnFinalizar.onclick = () => {
    Swal.fire({
        title: 'Finalizar compra',
        text: "Desea finalizar su compra ?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#38b000',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Si!'
    }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire(
            'Compra finalizada',
            'Se ha completado exitosamente su compra.',
            'success'
        )
        guardarCarrito('backupCompra', JSON.stringify(carrito))
        window.location.reload()}
    });
}

//Boton para eliminar un producto del carrito
function eliminar () {
    carrito.forEach((producto) => {
        document.querySelector(`#eliminar${producto.id}`).addEventListener('click', () => {
            Swal.fire({
                title: 'Estas seguro que desas eliminarlo ?',
                text: "No se podra deshacer el cambio luego",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si',
                cancelButtonText: 'Cancelar'
              }).then((result) => {
                if (result.isConfirmed) {
                  Swal.fire(
                    'Eliminado',
                    'Item eliminado del carrito',
                    'success'
                    )
                  carrito = carrito.filter((objeto) => objeto.id !== producto.id);
                  imprimir()
                  imprimirTotal(carrito)
                }
              });
        });
    });
}






