// Clase Padre
class Animal {
    nombre;

    dormir() {
        console.log(this.nombre + " dice: Zzz... Estoy durmiendo.");
    }
}

// Clase Hijo (Ahorra código, hereda todo lo del padre automáticamente)
class Perro extends Animal {
    ladrar() {
        console.log(this.nombre + " dice: ¡Guau, guau!");
    }
}

// Probamos en el aula
const unPerro = new Perro();
unPerro.nombre = "Pluto";

// ¡Atención! Puede dormir aunque en la clase Perro no hayamos escrito "dormir"
unPerro.dormir(); // Funciona por herencia
unPerro.ladrar(); // Funciona por especialización
