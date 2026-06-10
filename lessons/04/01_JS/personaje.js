// Imagina que estamos diseñando un juego sencillo como Mario Bros. Todos los personajes
// que aparezcan en la pantalla se crean a partir de un mismo molde. Ese molde define que cada
// personaje tiene un nombre y empieza siempre con 3 vidas.
// Escribe en lenguaje natural cómo sería el molde de nuestro personaje y luego simula la creación de
// dos héroes llamados "Mario" y "Luigi".

class Personaje {
    nombre;
    vidas = 3;
}

const mario = new Personaje();
mario.nombre = "Mario";

const luigi = new Personaje();
luigi.nombre = "Luigi";

mario.vidas = 2;

console.log("Vidas de " + mario.nombre + ": " + mario.vidas); // Vidas de Mario: 2
console.log("Vidas de " + luigi.nombre + ": " + luigi.vidas); // Vidas de Mario: 3
