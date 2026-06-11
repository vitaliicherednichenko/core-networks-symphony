// Definimos la clase base para Pago Tarjeta
class PagoTarjeta {
    procesarPago(total) {
        return `Pagando ${total}€ con Tarjeta de Crédito.`;
    }
}

// Definimos la clase base para Pago Bizum
class PagoBizum {
    procesarPago(total) {
        return `Pagando ${total}€ con Bizum.`;
    }
}

// En JS no hace falta tipar el parámetro 'metodoPago'.
// Mientras el objeto que pases tenga el método 'procesarPago', funcionará.
function ejecutarCobro(metodoPago, total) {
    console.log(metodoPago.procesarPago(total));
}

// Instanciamos los objetos
const tarjeta = new PagoTarjeta();
const bizum = new PagoBizum();

// Ejecutamos el cobro
ejecutarCobro(tarjeta, 45.50); // Imprime: Pagando 45.5€ con Tarjeta de Crédito.
ejecutarCobro(bizum, 12.00);   // Imprime: Pagando 12€ con Bizum.
