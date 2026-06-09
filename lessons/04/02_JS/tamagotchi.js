class Tamagotchi {
    nombre;
    hambre = 10;
    comer() {
        this.hambre = this.hambre - 2;
    }
}

const picachu = new Tamagotchi();
picachu.nombre = "Picachu";

console.log("Hambre de " + picachu.nombre + ": " + picachu.hambre); // Muestra 10

picachu.comer();
console.log("Hambre de " + picachu.nombre + ": " + picachu.hambre); // Muestra 8

picachu.comer();
console.log("Hambre de " + picachu.nombre + ": " + picachu.hambre); // Muestra 6

picachu.comer();
console.log("Hambre de " + picachu.nombre + ": " + picachu.hambre); // Muestra 4

picachu.comer();
console.log("Hambre de " + picachu.nombre + ": " + picachu.hambre); // Muestra 2

picachu.comer();
console.log("Hambre de " + picachu.nombre + ": " + picachu.hambre); // Muestra 0
