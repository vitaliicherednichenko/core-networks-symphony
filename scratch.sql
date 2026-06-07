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

-- 4.Filtro por Clase: Elabore una consulta que devuelva todos los vuelos (origen, destino y aerolínea)
--  que han sido asignados a una reserva de clase 'Business' en la tabla boletos.
FROM boletos AS b
INNER JOIN itinerarios AS i ON i.id_reserva = b.id_reserva
INNER JOIN vuelos AS v ON v.id = i.id_vuelo
WHERE b.clase = 'Business';

-- 5.Cálculo de Ingresos: Calcule el total de ingresos generados (suma de la columna precio)
--  por cada tipo de clase de boleto ('Económica', 'Business', 'Turista').
SELECT clase, SUM(precio) AS total_ingresos
FROM boletos
GROUP BY clase;

-- 6.Conteo de Pasajeros por Vuelo: Muestre el ID del vuelo y la cantidad total de pasajeros
--  inscritos en él, utilizando la tabla listado_pasajeros_vuelos.
SELECT id_vuelo, COUNT(id_pasajero) AS cantidad_total
FROM listado_pasajeros_vuelos
GROUP BY id_vuelo;

-- 7.Itinerario de Vuelo: Genere un reporte que muestre el id_reserva, el trayecto
--  y el nombre de la aerolinea correspondiente, uniendo las tablas itinerarios y vuelos.
SELECT i.id_reserva, i.trayecto, v.aerolinea
FROM itinerarios AS i
INNER JOIN vuelos AS v ON v.id = i.id_vuelo;

-- 8.Información de Embarque: Liste el nombre del pasajero, su número de asiento
--  y la sala de embarque para todos los registros en la tabla tarjeta_de_embarque.
SELECT p.nombre, t.asiento, t.sala_embarque
FROM tarjeta_de_embarque AS t
INNER JOIN pasajeros AS p ON p.id_pasajero = t.id_pasajero;

-- 9.Pasajeros con Niños: Seleccione los nombres y apellidos de los pasajeros que están
--  vinculados a reservas donde el campo nro_ninos sea mayor a 0.
SELECT p.nombre, p.apellido
FROM pasajeros AS p
INNER JOIN detalles_viajeros AS d ON d.id_pasajero = p.id_pasajero
INNER JOIN reservas_vuelos AS r ON r.id_reserva = d.id_reserva
WHERE r.nro_ninos > 0;

-- 10.Rutas y Fechas: Escriba una consulta que muestre el origen, destino
--  y la fecha de salida de los vuelos en los que ha viajado el pasajero con id_pasajero = 1.
SELECT v.origen, v.destino, v.hora_salida AS fecha_salida
FROM listado_pasajeros_vuelos AS l
INNER JOIN vuelos AS v ON v.id = l.id_vuelo
WHERE l.id_pasajero = 1;
