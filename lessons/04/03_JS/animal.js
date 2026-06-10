// Para entender cómo heredar características, crearemos un molde general llamado
// Animal que solo guarda el nombre y tiene la acción común dormir(). Luego crearemos un molde específico llamado Perro.
// Queremos que el perro tenga todo lo del animal automáticamente, pero además aprenda una acción exclusiva: ladrar()

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

firulais.dormir(); // Firulais está durmiendo... Zzz
firulais.ladrar(); // Firulais dice: ¡Guau guau!
