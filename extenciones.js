document.addEventListener('DOMContentLoaded', () => {
    const botonesAgregar = document.querySelectorAll('.agregar-carrito');
    const carritoItemsDiv = document.getElementById('carrito-items');
    const carritoTotalSpan = document.getElementById('carrito-total');
    const finalizarCompraBtn = document.getElementById('finalizar-compra');
    let carrito = [];

    function actualizarCarrito() {
        carritoItemsDiv.innerHTML = '';
        let total = 0;

        if (carrito.length === 0) {
            carritoItemsDiv.innerHTML = '<p>El carrito está vacío.</p>';
        } else {
            carrito.forEach((item, index) => {
                const itemDiv = document.createElement('div');
                itemDiv.classList.add('carrito-item');
                itemDiv.innerHTML = `
                    <span>${item.nombre} x ${item.cantidad}</span>
                    <span>$${item.precio * item.cantidad}</span>
                    <button class="eliminar-item" data-index="${index}">Eliminar</button>
                `;
                carritoItemsDiv.appendChild(itemDiv);
                total += item.precio * item.cantidad;
            });

            const botonesEliminar = document.querySelectorAll('.eliminar-item');
            botonesEliminar.forEach(boton => {
                boton.addEventListener('click', function() {
                    const indexAEliminar = parseInt(this.dataset.index);
                    carrito.splice(indexAEliminar, 1);
                    actualizarCarrito();
                });
            });
        }

        carritoTotalSpan.textContent = `Total: $${total.toFixed(2)} MXN`;
    }

    botonesAgregar.forEach(boton => {
        boton.addEventListener('click', function() {
            const nombre = this.dataset.nombre;
            const precio = parseFloat(this.dataset.precio);
            const productoExistente = carrito.find(item => item.nombre === nombre);

            if (productoExistente) {
                productoExistente.cantidad++;
            } else {
                carrito.push({ nombre, precio, cantidad: 1 });
            }

            actualizarCarrito();
        });
    });

    finalizarCompraBtn.addEventListener('click', () => {
        if (carrito.length > 0) {
            alert('¡Gracias por tu compra!\n\n' + carrito.map(item => `${item.cantidad} x ${item.nombre}: $${(item.precio * item.cantidad).toFixed(2)}`).join('\n') + `\n\nTotal: $${carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0).toFixed(2)}`);
            carrito = [];
            actualizarCarrito();
        } else {
            alert('El carrito está vacío. Agrega productos para finalizar la compra.');
        }
    });

    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
        actualizarCarrito();
    }

    window.addEventListener('beforeunload', () => {
        localStorage.setItem('carrito', JSON.stringify(carrito));
    });
});