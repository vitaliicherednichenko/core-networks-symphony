// Diseña una clase Tarea con un atributo público o accesible completada (booleano).
// A continuación, crea la clase contenedora titulo y GestorTareas que posea un atributo privado
//   • Método lista inicializado como un array vacío. AgregarTarea(Tarea t) : Añade el objeto al array de la lista.
//   • Método(listarPendientes() : Recorre el array empleando una estructura de repetición
//     foreach ) e imprime en pantalla únicamente el título de aquellas tareas cuyo atributo completada sea falso.

class Tarea {
    titulo;
    completada;

    constructor(titulo, completada) {
        this.titulo = titulo;
        this.completada = completada;
    }
}

class GestorTareas {
    #lista = [];

    agregarTarea(t) {
        this.#lista.push(t);
    }

    listarPendientes() {
        console.log("Tareas pendientes:");
        for (const tarea of this.#lista) {
            if (!tarea.completada) {
                console.log("- " + tarea.titulo);
            }
        }
    }
}

const gestor = new GestorTareas();                             // Tareas pendientes:
gestor.agregarTarea(new Tarea("Comprar leche", false));     // - Comprar leche
gestor.agregarTarea(new Tarea("Enviar informe", true));
gestor.agregarTarea(new Tarea("Llamar al cliente", false)); // - Llamar al cliente

gestor.listarPendientes();
