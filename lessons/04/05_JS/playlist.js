// Crea una clase llamada Playlist. Tendrá un atributo llamado nombre y un atributo
// llamado canciones, que será una lista vacía.
// Añade una acción llamada agregarCancion(titulo) para meter textos en la lista, y una acción llamada
// reproducirTodo() que use un bucle para mostrar todas las canciones de la lista una por una.

class Playlist {
    nombre;
    canciones = [];

    agregarCancion(titulo) {
        this.canciones.push(titulo);
    }

    reproducirTodo() {
        console.log("Reproduciendo la playlist: " + this.nombre);
        for (let i = 0; i < this.canciones.length; i++) {
            console.log((i + 1) + ". " + this.canciones[i]);
        }
    }
}

const lista = new Playlist();
lista.nombre = "Mis favoritas";

lista.agregarCancion("Bohemian Rhapsody");
lista.agregarCancion("Stairway to Heaven");
lista.agregarCancion("Hotel California");

lista.reproducirTodo(); // Reproduciendo la playlist: Mis favoritas
                        // 1. Bohemian Rhapsody
                        // 2. Stairway to Heaven
                        // 3. Hotel California
