-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:3306
-- Tiempo de generación: 28-04-2026 a las 08:48:50
-- Versión del servidor: 8.4.7
-- Versión de PHP: 8.3.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `sistema_reservaciones`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `boletos`
--

DROP TABLE IF EXISTS `boletos`;
CREATE TABLE IF NOT EXISTS `boletos` (
  `id_boleto` int NOT NULL AUTO_INCREMENT,
  `id_pasajero` int NOT NULL,
  `id_reserva` int NOT NULL,
  `clase` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `precio` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id_boleto`),
  KEY `id_pasajero` (`id_pasajero`),
  KEY `id_reserva` (`id_reserva`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `boletos`
--

INSERT INTO `boletos` (`id_boleto`, `id_pasajero`, `id_reserva`, `clase`, `precio`) VALUES
(1, 1, 1, 'Económica', 120.50),
(2, 2, 1, 'Económica', 120.50),
(3, 3, 2, 'Business', 450.00),
(4, 4, 3, 'Turista', 890.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalles_viajeros`
--

DROP TABLE IF EXISTS `detalles_viajeros`;
CREATE TABLE IF NOT EXISTS `detalles_viajeros` (
  `id_reserva` int NOT NULL,
  `id_pasajero` int NOT NULL,
  PRIMARY KEY (`id_reserva`,`id_pasajero`),
  KEY `id_pasajero` (`id_pasajero`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `detalles_viajeros`
--

INSERT INTO `detalles_viajeros` (`id_reserva`, `id_pasajero`) VALUES
(1, 1),
(1, 2),
(2, 3),
(3, 4);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `itinerarios`
--

DROP TABLE IF EXISTS `itinerarios`;
CREATE TABLE IF NOT EXISTS `itinerarios` (
  `id_reserva` int NOT NULL,
  `trayecto` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tramo` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_vuelo` int DEFAULT NULL,
  `fecha_vuelo` datetime NOT NULL,
  PRIMARY KEY (`id_reserva`,`trayecto`,`tramo`),
  KEY `id_vuelo` (`id_vuelo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `itinerarios`
--

INSERT INTO `itinerarios` (`id_reserva`, `trayecto`, `tramo`, `id_vuelo`, `fecha_vuelo`) VALUES
(1, 'Ida', 'Tramo Único', 1, '2026-05-10 08:00:00'),
(1, 'Vuelta', 'Tramo Único', 2, '2026-05-15 18:00:00'),
(2, 'Ida', 'Tramo Único', 3, '2026-06-01 10:30:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `listado_pasajeros_vuelos`
--

DROP TABLE IF EXISTS `listado_pasajeros_vuelos`;
CREATE TABLE IF NOT EXISTS `listado_pasajeros_vuelos` (
  `id_vuelo` int NOT NULL,
  `id_pasajero` int NOT NULL,
  `fecha` datetime NOT NULL,
  PRIMARY KEY (`id_vuelo`,`id_pasajero`),
  KEY `id_pasajero` (`id_pasajero`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `listado_pasajeros_vuelos`
--

INSERT INTO `listado_pasajeros_vuelos` (`id_vuelo`, `id_pasajero`, `fecha`) VALUES
(1, 1, '2026-05-10 08:00:00'),
(1, 2, '2026-05-10 08:00:00'),
(3, 3, '2026-06-01 10:30:00'),
(4, 4, '2026-07-20 22:00:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pasajeros`
--

DROP TABLE IF EXISTS `pasajeros`;
CREATE TABLE IF NOT EXISTS `pasajeros` (
  `id_pasajero` int NOT NULL AUTO_INCREMENT,
  `nro_pasaporte` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `apellido` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fecha_nacimiento` date NOT NULL,
  `sexo` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `direccion` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `telefono` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id_pasajero`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `pasajeros`
--

INSERT INTO `pasajeros` (`id_pasajero`, `nro_pasaporte`, `apellido`, `nombre`, `fecha_nacimiento`, `sexo`, `direccion`, `telefono`) VALUES
(1, 'ABC123456', 'García', 'Juan', '1985-04-12', 'Masculino', 'Calle Mayor 1, Madrid', '+34 600111222'),
(2, 'DEF789012', 'Rodríguez', 'María', '1992-11-23', 'Femenino', 'Av. Constitución 45, Sevilla', '+34 600333444'),
(3, 'GHI345678', 'López', 'Carlos', '1960-01-15', 'Masculino', 'Paseo de Gracia 10, Barcelona', '+34 600555666'),
(4, 'JKL901234', 'Smith', 'Jane', '2015-08-30', 'Femenino', '123 Ocean Drive, Miami', '+1 3055550199');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reservas_vuelos`
--

DROP TABLE IF EXISTS `reservas_vuelos`;
CREATE TABLE IF NOT EXISTS `reservas_vuelos` (
  `id_reserva` int NOT NULL AUTO_INCREMENT,
  `fecha_salida` datetime NOT NULL,
  `fecha_retorno` datetime NOT NULL,
  `nro_adultos` int NOT NULL,
  `nro_ninos` int NOT NULL,
  `nro_tercera_edad` int NOT NULL,
  `clase` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id_reserva`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `reservas_vuelos`
--

INSERT INTO `reservas_vuelos` (`id_reserva`, `fecha_salida`, `fecha_retorno`, `nro_adultos`, `nro_ninos`, `nro_tercera_edad`, `clase`) VALUES
(1, '2026-05-10 08:00:00', '2026-05-15 18:00:00', 2, 0, 0, 'Económica'),
(2, '2026-06-01 10:30:00', '2026-06-15 09:00:00', 1, 0, 1, 'Business'),
(3, '2026-07-20 22:00:00', '2026-08-05 14:00:00', 1, 1, 0, 'Turista');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tarjeta_de_embarque`
--

DROP TABLE IF EXISTS `tarjeta_de_embarque`;
CREATE TABLE IF NOT EXISTS `tarjeta_de_embarque` (
  `id_tarjeta` int NOT NULL AUTO_INCREMENT,
  `id_reserva` int NOT NULL,
  `id_pasajero` int NOT NULL,
  `embarque` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nro_vuelo` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fecha_vuelo` datetime NOT NULL,
  `clase` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `asiento` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sala_embarque` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id_tarjeta`),
  KEY `id_reserva` (`id_reserva`),
  KEY `id_pasajero` (`id_pasajero`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `tarjeta_de_embarque`
--

INSERT INTO `tarjeta_de_embarque` (`id_tarjeta`, `id_reserva`, `id_pasajero`, `embarque`, `nro_vuelo`, `fecha_vuelo`, `clase`, `asiento`, `sala_embarque`) VALUES
(1, 1, 1, '07:15:00', 'IB0800', '2026-05-10 08:00:00', 'Económica', '12A', 'Puerta C-10'),
(2, 1, 2, '07:15:00', 'IB0800', '2026-05-10 08:00:00', 'Económica', '12B', 'Puerta C-10'),
(3, 2, 3, '09:30:00', 'BA0102', '2026-06-01 10:30:00', 'Business', '02F', 'VIP Lounge 1');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `vuelos`
--

DROP TABLE IF EXISTS `vuelos`;
CREATE TABLE IF NOT EXISTS `vuelos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `origen` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `destino` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `hora_salida` datetime NOT NULL,
  `hora_llegada` datetime NOT NULL,
  `aerolinea` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `vuelos`
--

INSERT INTO `vuelos` (`id`, `origen`, `destino`, `hora_salida`, `hora_llegada`, `aerolinea`) VALUES
(1, 'Madrid (MAD)', 'Sevilla (SVQ)', '2026-05-10 08:00:00', '2026-05-10 09:15:00', 'Iberia'),
(2, 'Sevilla (SVQ)', 'Madrid (MAD)', '2026-05-15 18:00:00', '2026-05-15 19:15:00', 'Iberia'),
(3, 'Barcelona (BCN)', 'Londres (LHR)', '2026-06-01 10:30:00', '2026-06-01 12:45:00', 'British Airways'),
(4, 'Miami (MIA)', 'Madrid (MAD)', '2026-07-20 22:00:00', '2026-07-21 11:30:00', 'American Airlines');

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `boletos`
--
ALTER TABLE `boletos`
  ADD CONSTRAINT `boletos_ibfk_1` FOREIGN KEY (`id_pasajero`) REFERENCES `pasajeros` (`id_pasajero`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `boletos_ibfk_2` FOREIGN KEY (`id_reserva`) REFERENCES `reservas_vuelos` (`id_reserva`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `detalles_viajeros`
--
ALTER TABLE `detalles_viajeros`
  ADD CONSTRAINT `detalles_viajeros_ibfk_1` FOREIGN KEY (`id_reserva`) REFERENCES `reservas_vuelos` (`id_reserva`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `detalles_viajeros_ibfk_2` FOREIGN KEY (`id_pasajero`) REFERENCES `pasajeros` (`id_pasajero`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `itinerarios`
--
ALTER TABLE `itinerarios`
  ADD CONSTRAINT `itinerarios_ibfk_1` FOREIGN KEY (`id_reserva`) REFERENCES `reservas_vuelos` (`id_reserva`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `itinerarios_ibfk_2` FOREIGN KEY (`id_vuelo`) REFERENCES `vuelos` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Filtros para la tabla `listado_pasajeros_vuelos`
--
ALTER TABLE `listado_pasajeros_vuelos`
  ADD CONSTRAINT `listado_pasajeros_vuelos_ibfk_1` FOREIGN KEY (`id_vuelo`) REFERENCES `vuelos` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `listado_pasajeros_vuelos_ibfk_2` FOREIGN KEY (`id_pasajero`) REFERENCES `pasajeros` (`id_pasajero`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `tarjeta_de_embarque`
--
ALTER TABLE `tarjeta_de_embarque`
  ADD CONSTRAINT `tarjeta_de_embarque_ibfk_1` FOREIGN KEY (`id_reserva`) REFERENCES `reservas_vuelos` (`id_reserva`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tarjeta_de_embarque_ibfk_2` FOREIGN KEY (`id_pasajero`) REFERENCES `pasajeros` (`id_pasajero`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;