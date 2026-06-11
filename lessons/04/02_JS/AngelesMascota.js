class Mascota {
    nombre;
    hambre = 10;

    comer() {
        // 'this' representa al muñeco o mascota concreta que llama a la acción
        this.hambre = this.hambre - 2;
    }
}

// Creamos la mascota
const miMascota = new Mascota();
miMascota.nombre = "Yoshi";

// Ejecutamos la acción
miMascota.comer();

// Mostramos el resultado
console.log("El nivel de hambre de " + miMascota.nombre + " ahora es: " + miMascota.hambre); // Muestra 8
