class Tarea {
    // Propiedades privadas
    #titulo;
    #completada;

    constructor(titulo, completada = false) {
        this.#titulo = titulo;
        this.#completada = completada;
    }

    // Métodos Getter para poder acceder a las propiedades privadas desde fuera
    get _titulo() {
        return this.#titulo;
    }

    get _completada() {
        return this.#completada;
    }
}

class GestorTareas {
    // Propiedad privada: Colección lineal estructurada (Array)
    #lista = [];

    agregarTarea(tarea) {
        this.#lista.push(tarea);
    }

    listarPendientes() {
        console.log("=== TAREAS PENDIENTES ===");
        for (const tarea of this.#lista) {
            // Usamos los getters para verificar el estado
            if (!tarea._completada) {
                console.log(`- ${tarea._titulo}`);
            }
        }
    }
}

// === Caso de prueba en el aula ===
const gestor = new GestorTareas();

// Creamos un par de tareas de prueba
const tarea1 = new Tarea("Estudiar para el examen", false);
const tarea2 = new Tarea("Hacer la tarea de matemáticas", true);
const tarea3 = new Tarea("Entregar el proyecto de POO", false);

// Las agregamos al gestor
gestor.agregarTarea(tarea1);
gestor.agregarTarea(tarea2);
gestor.agregarTarea(tarea3);

// Listamos solo las pendientes
gestor.listarPendientes();
