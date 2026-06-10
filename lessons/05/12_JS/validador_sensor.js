// Crea una clase estática o de servicio llamada método ValidadorSensor.
// Implementa un analizarTemperatura(grados). Si la temperatura enviada está fuera del rango operativo racional
// (entre -50°C y 100°C), el método debe lanzar una excepción de tipo RangeException indicando el fallo.
// Implementa el bloque try / catch para llamar al método con un valor erróneo (como 150°C) y
// captura el objeto excepción imprimiendo exclusivamente su mensaje de error mediante e->getMessage()

class RangeException extends Error {
    getMessage() {
        return this.message;
    }
}

class ValidadorSensor {
    static analizarTemperatura(grados) {
        if (grados < -50 || grados > 100) {
            throw new RangeException(
                "Temperatura fuera del rango operativo (-50°C a 100°C): " + grados + "°C"
            );
        }
        return "Temperatura " + grados + "°C dentro del rango operativo.";
    }
}

try {
    ValidadorSensor.analizarTemperatura(150);
} catch (e) {
    console.log(e.getMessage()); // Temperatura fuera del rango operativo (-50°C a 100°C): 150°C
}
