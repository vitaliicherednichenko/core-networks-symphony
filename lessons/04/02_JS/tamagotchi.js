// Vamos a modelar un Tamagotchi o mascota virtual. El molde de la mascota guardará su
// nombre y un nivel de hambre que inicialmente es 10_JS. Además, la mascota sabrá realizar una acción: comer().
// Cada vez que come, su nivel de hambre disminuye en 2 unidades.
// Diseña el molde añadiendo la acción de comer. Recuerda que la acción debe modificar el hambre del
// propio objeto que está comiendo.

class Tamagotchi {
    nombre;
    hambre = 10;
    comer() {
        this.hambre = this.hambre - 2;
    }
}

const picachu = new Tamagotchi();
picachu.nombre = "Picachu";

console.log("Hambre de " + picachu.nombre + ": " + picachu.hambre); // Hambre de Picachu: 10

picachu.comer();
console.log("Hambre de " + picachu.nombre + ": " + picachu.hambre); // Hambre de Picachu: 8

picachu.comer();
console.log("Hambre de " + picachu.nombre + ": " + picachu.hambre); // Hambre de Picachu: 6

picachu.comer();
console.log("Hambre de " + picachu.nombre + ": " + picachu.hambre); // Hambre de Picachu: 4

picachu.comer();
console.log("Hambre de " + picachu.nombre + ": " + picachu.hambre); // Hambre de Picachu: 2

picachu.comer();
console.log("Hambre de " + picachu.nombre + ": " + picachu.hambre); // Hambre de Picachu: 0
