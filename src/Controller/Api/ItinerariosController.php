<?php

namespace App\Controller\Api;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

class ItinerariosController extends BaseApiController
{
    #[Route('/api/itinerarios', name: 'api_itinerarios', methods: ['GET'])]
    public function list(): JsonResponse
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

    #[Route('/api/itinerarios', name: 'api_itinerarios_create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true) ?? [];

        if (!$this->esAdmin((int) ($data['userId'] ?? 0))) {
            return $this->json(['error' => 'Acceso denegado'], 403);
        }

        $id_reserva  = (int) ($data['id_reserva'] ?? 0);
        $trayecto    = trim((string) ($data['trayecto'] ?? ''));
        $tramo       = trim((string) ($data['tramo'] ?? ''));
        $id_vuelo    = ($data['id_vuelo'] !== null && $data['id_vuelo'] !== '') ? (int) $data['id_vuelo'] : null;
        $fecha_vuelo = trim((string) ($data['fecha_vuelo'] ?? ''));

        if ($id_reserva === 0 || $trayecto === '' || $tramo === '' || $fecha_vuelo === '') {
            return $this->json(['error' => 'id_reserva, trayecto, tramo y fecha_vuelo son obligatorios'], 400);
        }

        $this->db->insert('itinerarios', [
            'id_reserva'  => $id_reserva,
            'trayecto'    => $trayecto,
            'tramo'       => $tramo,
            'id_vuelo'    => $id_vuelo,
            'fecha_vuelo' => $fecha_vuelo,
        ]);

        return $this->json([
            'id_reserva' => $id_reserva, 'trayecto' => $trayecto, 'tramo' => $tramo,
            'id_vuelo' => $id_vuelo, 'fecha_vuelo' => $fecha_vuelo,
            'origen' => null, 'destino' => null, 'aerolinea' => null,
        ], 201);
    }

    #[Route('/api/itinerarios', name: 'api_itinerarios_update', methods: ['PUT'])]
    public function update(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true) ?? [];

        if (!$this->esAdmin((int) ($data['userId'] ?? 0))) {
            return $this->json(['error' => 'Acceso denegado'], 403);
        }

        $id_reserva  = (int) ($data['id_reserva'] ?? 0);
        $trayecto    = trim((string) ($data['trayecto'] ?? ''));
        $tramo       = trim((string) ($data['tramo'] ?? ''));
        $id_vuelo    = ($data['id_vuelo'] !== null && $data['id_vuelo'] !== '') ? (int) $data['id_vuelo'] : null;
        $fecha_vuelo = trim((string) ($data['fecha_vuelo'] ?? ''));

        if ($id_reserva === 0 || $trayecto === '' || $tramo === '' || $fecha_vuelo === '') {
            return $this->json(['error' => 'id_reserva, trayecto, tramo y fecha_vuelo son obligatorios'], 400);
        }

        if ($this->db->update(
            'itinerarios',
            ['id_vuelo' => $id_vuelo, 'fecha_vuelo' => $fecha_vuelo],
            ['id_reserva' => $id_reserva, 'trayecto' => $trayecto, 'tramo' => $tramo]
        ) === 0) {
            return $this->json(['error' => 'Itinerario no encontrado'], 404);
        }

        return $this->json([
            'id_reserva' => $id_reserva, 'trayecto' => $trayecto, 'tramo' => $tramo,
            'id_vuelo' => $id_vuelo, 'fecha_vuelo' => $fecha_vuelo,
            'origen' => null, 'destino' => null, 'aerolinea' => null,
        ]);
    }

    #[Route('/api/itinerarios', name: 'api_itinerarios_delete', methods: ['DELETE'])]
    public function delete(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true) ?? [];

        if (!$this->esAdmin((int) ($data['userId'] ?? 0))) {
            return $this->json(['error' => 'Acceso denegado'], 403);
        }

        $id_reserva = (int) ($data['id_reserva'] ?? 0);
        $trayecto   = trim((string) ($data['trayecto'] ?? ''));
        $tramo      = trim((string) ($data['tramo'] ?? ''));

        if ($this->db->delete('itinerarios', ['id_reserva' => $id_reserva, 'trayecto' => $trayecto, 'tramo' => $tramo]) === 0) {
            return $this->json(['error' => 'Itinerario no encontrado'], 404);
        }

        return $this->json(null, 204);
    }
}
