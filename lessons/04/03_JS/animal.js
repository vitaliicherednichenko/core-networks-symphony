class Animal {
    nombre;
    dormir() {
        console.log(this.nombre + " está durmiendo... Zzz");
    }
}

class Perro extends Animal {
    ladrar() {
        console.log(this.nombre + " dice: ¡Guau guau!");
    }
}

const firulais = new Perro();
firulais.nombre = "Firulais";

firulais.dormir(); // Heredado de Animal
firulais.ladrar(); // Propio de Perro
