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

lista.reproducirTodo();
