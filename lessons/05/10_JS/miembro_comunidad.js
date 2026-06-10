// En un sistema de gestión escolar, diseña una clase base llamada MiembroComunidad que posea
// los atributos protegidos (protected) nombre y email.
// Luego, crea una subclase especializada llamada Profesor que herede de ella e incorpore
// un atributo propio llamado departamento.
// Ambas clases deben implementar un método llamado mostrarPerfil() que devuelva una cadena con su información.

class MiembroComunidad {
    _nombre;
    _email;

    constructor(nombre, email) {
        this._nombre = nombre;
        this._email = email;
    }

    mostrarPerfil() {
        return "Nombre: " + this._nombre + " | Email: " + this._email;
    }
}

class Profesor extends MiembroComunidad {
    departamento;

    constructor(nombre, email, departamento) {
        super(nombre, email);
        this.departamento = departamento;
    }

    mostrarPerfil() {
        return super.mostrarPerfil() + " | Departamento: " + this.departamento;
    }
}

const miembro = new MiembroComunidad("Ana López", "ana@escuela.edu");
const profesor = new Profesor("Carlos Ruiz", "carlos@escuela.edu", "Matemáticas");

console.log(miembro.mostrarPerfil());   // Nombre: Ana López | Email: ana@escuela.edu
console.log(profesor.mostrarPerfil());  // Nombre: Carlos Ruiz | Email: carlos@escuela.edu | Departamento: Matemáticas
