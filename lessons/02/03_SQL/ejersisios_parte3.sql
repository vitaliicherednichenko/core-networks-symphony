-- Ejercicios sobre el sistema de reservaciones — Parte 3
-- Reportes con múltiples uniones y filtros.

-- 1. Itinerario de Vuelo: Genere un reporte que muestre el id_reserva, el trayecto
--  y el nombre de la aerolinea correspondiente, uniendo las tablas itinerarios y vuelos.
SELECT i.id_reserva, i.trayecto, v.aerolinea
FROM itinerarios AS i
INNER JOIN vuelos AS v ON v.id = i.id_vuelo;

-- 2. Información de Embarque: Liste el nombre del pasajero, su número de asiento
--  y la sala de embarque para todos los registros en la tabla tarjeta_de_embarque.
SELECT p.nombre, t.asiento, t.sala_embarque
FROM tarjeta_de_embarque AS t
INNER JOIN pasajeros AS p ON p.id_pasajero = t.id_pasajero;

-- 3. Pasajeros con Niños: Seleccione los nombres y apellidos de los pasajeros que están
--  vinculados a reservas donde el campo nro_ninos sea mayor a 0.
SELECT p.nombre, p.apellido
FROM pasajeros AS p
INNER JOIN detalles_viajeros AS d ON d.id_pasajero = p.id_pasajero
INNER JOIN reservas_vuelos AS r ON r.id_reserva = d.id_reserva
WHERE r.nro_ninos > 0;

-- 4. Rutas y Fechas: Escriba una consulta que muestre el origen, destino
--  y la fecha de salida de los vuelos en los que ha viajado el pasajero con id_pasajero = 1.
SELECT v.origen, v.destino, v.hora_salida AS fecha_salida
FROM listado_pasajeros_vuelos AS l
INNER JOIN vuelos AS v ON v.id = l.id_vuelo
WHERE l.id_pasajero = 1;
