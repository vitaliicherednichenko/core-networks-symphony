<?php

namespace App\Controller\Api;

use Doctrine\DBAL\Connection;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

class ReservacionesController extends AbstractController
{
    public function __construct(private readonly Connection $db)
    {
    }

    #[Route('/api/vuelos', name: 'api_vuelos', methods: ['GET'])]
    public function vuelos(): JsonResponse
    {
        return $this->json(
            $this->db->fetchAllAssociative('SELECT * FROM vuelos ORDER BY hora_salida')
        );
    }

    #[Route('/api/pasajeros', name: 'api_pasajeros', methods: ['GET'])]
    public function pasajeros(): JsonResponse
    {
        return $this->json(
            $this->db->fetchAllAssociative('SELECT * FROM pasajeros ORDER BY apellido, nombre')
        );
    }

    #[Route('/api/reservas', name: 'api_reservas', methods: ['GET'])]
    public function reservas(): JsonResponse
    {
        return $this->json(
            $this->db->fetchAllAssociative('SELECT * FROM reservas_vuelos ORDER BY fecha_salida')
        );
    }

    #[Route('/api/boletos', name: 'api_boletos', methods: ['GET'])]
    public function boletos(): JsonResponse
    {
        return $this->json(
            $this->db->fetchAllAssociative(
                'SELECT b.id_boleto, b.id_pasajero, b.id_reserva, b.clase, b.precio,
                        CONCAT(p.nombre, " ", p.apellido) AS pasajero
                 FROM boletos b
                 LEFT JOIN pasajeros p ON p.id_pasajero = b.id_pasajero
                 ORDER BY b.id_boleto'
            )
        );
    }

    #[Route('/api/detalles-viajeros', name: 'api_detalles_viajeros', methods: ['GET'])]
    public function detallesViajeros(): JsonResponse
    {
        return $this->json(
            $this->db->fetchAllAssociative(
                'SELECT dv.id_reserva, dv.id_pasajero,
                        CONCAT(p.nombre, " ", p.apellido) AS pasajero
                 FROM detalles_viajeros dv
                 LEFT JOIN pasajeros p ON p.id_pasajero = dv.id_pasajero
                 ORDER BY dv.id_reserva, dv.id_pasajero'
            )
        );
    }

    #[Route('/api/itinerarios', name: 'api_itinerarios', methods: ['GET'])]
    public function itinerarios(): JsonResponse
    {
        return $this->json(
            $this->db->fetchAllAssociative(
                'SELECT i.id_reserva, i.trayecto, i.tramo, i.id_vuelo, i.fecha_vuelo,
                        v.origen, v.destino, v.aerolinea
                 FROM itinerarios i
                 LEFT JOIN vuelos v ON v.id = i.id_vuelo
                 ORDER BY i.id_reserva, i.fecha_vuelo'
            )
        );
    }

    #[Route('/api/listado-pasajeros-vuelos', name: 'api_listado_pasajeros_vuelos', methods: ['GET'])]
    public function listadoPasajerosVuelos(): JsonResponse
    {
        return $this->json(
            $this->db->fetchAllAssociative(
                'SELECT lpv.id_vuelo, lpv.id_pasajero, lpv.fecha,
                        CONCAT(p.nombre, " ", p.apellido) AS pasajero,
                        v.origen, v.destino
                 FROM listado_pasajeros_vuelos lpv
                 LEFT JOIN pasajeros p ON p.id_pasajero = lpv.id_pasajero
                 LEFT JOIN vuelos v ON v.id = lpv.id_vuelo
                 ORDER BY lpv.id_vuelo, lpv.id_pasajero'
            )
        );
    }

    #[Route('/api/tarjetas-embarque', name: 'api_tarjetas_embarque', methods: ['GET'])]
    public function tarjetasEmbarque(): JsonResponse
    {
        return $this->json(
            $this->db->fetchAllAssociative(
                'SELECT te.id_tarjeta, te.id_reserva, te.id_pasajero, te.embarque,
                        te.nro_vuelo, te.fecha_vuelo, te.clase, te.asiento, te.sala_embarque,
                        CONCAT(p.nombre, " ", p.apellido) AS pasajero
                 FROM tarjeta_de_embarque te
                 LEFT JOIN pasajeros p ON p.id_pasajero = te.id_pasajero
                 ORDER BY te.id_tarjeta'
            )
        );
    }
}
