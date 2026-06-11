// Definimos una excepción personalizada que equivale a RangeException
class RangeException extends RangeError {
    constructor(mensaje) {
        super(mensaje);
        this.name = "RangeException";
    }
}

// Clase de servicio con método estático
class ValidadorSensor {
    static analizarTemperatura(grados) {
        if (grados < -50 || grados > 100) {
            throw new RangeException("Temperatura fuera del rango crítico operativo del hardware.");
        }
        console.log(`Temperatura de ${grados}°C dentro de la normalidad.`);
    }
}

// --- Captura estructurada del error ---
try {
    ValidadorSensor.analizarTemperatura(150.0);
} catch (e) {
    if (e instanceof RangeException) {
        // En JavaScript se usa .message en lugar de ->getMessage()
        console.log("ERROR CONTROLADO: " + e.message);
    } else {
        // Por si ocurre otro tipo de error inesperado
        throw e;
    }
}

//Métodos Estáticos: Se usa la palabra clave static antes del nombre del método. Esto te permite llamarlo directamente como ValidadorSensor.analizarTemperatura() sin necesidad de hacer un new ValidadorSensor().

//Propiedad .message: En JavaScript, los objetos de error no usan un método getMessage(), sino que acceden directamente a la propiedad pública .message.

//Operador instanceof: En el bloque catch, es una buena práctica verificar si el error capturado es de la clase que esperamos (e instanceof RangeException) para manejarlo correctamente.
