class Playlist {
    nombre;
    canciones = []; // Lista vacía de textos (Array)

    agregarCancion(titulo) {
        this.canciones.push(titulo); // Añade el texto al final de la lista
    }

    reproducirTodo() {
        console.log("Reproduciendo la lista: " + this.nombre);

        // Recorremos la lista de una en una usando un bucle for...of
        for (cancion of this.canciones) {
            console.log("- Sonando ahora: " + cancion);
        }
    }
}

// Probamos el objeto en ejecución
const miMusica = new Playlist();
miMusica.nombre = "Favoritas de Clase";

miMusica.agregarCancion("Symfony Theme");
miMusica.agregarCancion("Ollama Rock");

miMusica.reproducirTodo();
