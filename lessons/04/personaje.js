class Personaje {
    nombre;
    vidas = 3;
}

const mario = new Personaje();
mario.nombre = "Mario";

const luigi = new Personaje();
luigi.nombre = "Luigi";

mario.vidas = 2;

console.log("Vidas de " + mario.nombre + ": " + mario.vidas); // Muestra 2
console.log("Vidas de " + luigi.nombre + ": " + luigi.vidas); // Muestra 3