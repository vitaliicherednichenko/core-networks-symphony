// Define una clase abstracta llamada  MetodoPago que declare un método abstracto procesarPago(importe).
// Posteriormente:
// • Crea la subclase concreta PagoTarjeta, cuyo método devuelva: "Pago de [Importe]€ procesado con Tarjeta de Crédito".
// • Crea la subclase concreta PagoBizum , cuyo método devuelva: "Pago de [Importe]€ procesado
//      mediante Bizum de forma instantánea".
// Escribe una función global fuera de las clases llamada ejecutarCobro(MetodoPago pasarela, total) que reciba
// la pasarela abstracta e imprima el resultado del procesamiento, demostrando la flexibilidad de la ligadura dinámica

class MetodoPago {
    constructor() {
        if (new.target === MetodoPago) {
            throw new Error("MetodoPago es abstracta y no se puede instanciar directamente.");
        }
    }

    procesarPago(importe) {
        throw new Error("El método abstracto procesarPago() debe implementarse en la subclase.");
    }
}

class PagoTarjeta extends MetodoPago {
    procesarPago(importe) {
        return "Pago de " + importe + "€ procesado con Tarjeta de Crédito";
    }
}

class PagoBizum extends MetodoPago {
    procesarPago(importe) {
        return "Pago de " + importe + "€ procesado mediante Bizum de forma instantánea";
    }
}

function ejecutarCobro(MetodoPagoPasarela, total) {
    console.log(MetodoPagoPasarela.procesarPago(total));
}

ejecutarCobro(new PagoTarjeta(), 50); // Pago de 50€ procesado con Tarjeta de Crédito
ejecutarCobro(new PagoBizum(), 25);   // Pago de 25€ procesado mediante Bizum de forma instantánea
