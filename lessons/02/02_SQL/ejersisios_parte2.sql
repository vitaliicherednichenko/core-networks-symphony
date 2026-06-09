-- Ejercicios sobre el sistema de reservaciones — Parte 2
-- Filtros y agregaciones (GROUP BY).

-- 1. Filtro por Clase: Elabore una consulta que devuelva todos los vuelos (origen, destino y aerolínea)
--  que han sido asignados a una reserva de clase 'Business' en la tabla boletos.
SELECT v.origen, v.destino, v.aerolinea
FROM boletos AS b
INNER JOIN itinerarios AS i ON i.id_reserva = b.id_reserva
INNER JOIN vuelos AS v ON v.id = i.id_vuelo
WHERE b.clase = 'Business';

-- 2. Cálculo de Ingresos: Calcule el total de ingresos generados (suma de la columna precio)
--  por cada tipo de clase de boleto ('Económica', 'Business', 'Turista').
SELECT clase, SUM(precio) AS total_ingresos
FROM boletos
GROUP BY clase;

-- 3. Conteo de Pasajeros por Vuelo: Muestre el ID del vuelo y la cantidad total de pasajeros
--  inscritos en él, utilizando la tabla listado_pasajeros_vuelos.
SELECT id_vuelo, COUNT(id_pasajero) AS cantidad_total
FROM listado_pasajeros_vuelos
GROUP BY id_vuelo;
