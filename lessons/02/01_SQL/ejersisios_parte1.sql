-- Ejercicios sobre el sistema de reservaciones — Parte 1
-- Consultas básicas y uniones simples.

-- 1. Identificación de Pasajeros: Escriba una consulta que muestre el nombre,
--  apellido y número de pasaporte de todos los pasajeros registrados en la tabla pasajeros.
SELECT nombre, apellido, nro_pasaporte
FROM pasajeros;

-- 2. Relación Pasajero-Reserva: Obtenga un listado que muestre el nombre del pasajero
--  y el id_reserva al que pertenece, uniendo las tablas pasajeros y detalles_viajeros.
SELECT p.nombre, d.id_reserva
FROM pasajeros AS p
INNER JOIN detalles_viajeros AS d ON d.id_pasajero = p.id_pasajero;

-- 3. Detalle de Boletos: Muestre el ID del boleto, la clase y el precio,
--  incluyendo el nombre completo (nombre y apellido) del pasajero asociado a dicho boleto.
SELECT b.id_boleto, b.clase, b.precio, p.nombre, p.apellido
FROM boletos AS b
INNER JOIN pasajeros AS p ON b.id_pasajero = p.id_pasajero;
