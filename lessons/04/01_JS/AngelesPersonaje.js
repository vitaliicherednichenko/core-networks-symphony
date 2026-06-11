// 1. Creamos el plano o molde básico
class Personaje {
    nombre;
    vidas = 3; // Valor por defecto
}

// 2. Usamos el molde para fabricar dos objetos reales en memoria
var mario = new Personaje();
mario.nombre = "Mario";

var luigi = new Personaje();
luigi.nombre = "Luigi";

// 3. Modificamos el estado de uno de ellos
mario.vidas = 2;

// 4. Mostramos el resultado para ver la independencia de datos
console.log("Vidas de " + mario.nombre + ": " + mario.vidas); // Muestra 2
console.log("Vidas de " + luigi.nombre + ": " + luigi.vidas); // Muestra 3
