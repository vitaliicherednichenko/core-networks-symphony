<?php

namespace App\Controller\Api;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

class DetallesViajerosController extends BaseApiController
{
    #[Route('/api/detalles-viajeros', name: 'api_detalles_viajeros', methods: ['GET'])]
    public function list(): JsonResponse
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

    #[Route('/api/detalles-viajeros', name: 'api_detalles_viajeros_create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true) ?? [];

        if (!$this->esAdmin((int) ($data['userId'] ?? 0))) {
            return $this->json(['error' => 'Acceso denegado'], 403);
        }

        $id_reserva  = (int) ($data['id_reserva'] ?? 0);
        $id_pasajero = (int) ($data['id_pasajero'] ?? 0);

        if ($id_reserva === 0 || $id_pasajero === 0) {
            return $this->json(['error' => 'id_reserva e id_pasajero son obligatorios'], 400);
        }

        $this->db->insert('detalles_viajeros', compact('id_reserva', 'id_pasajero'));

        return $this->json(['id_reserva' => $id_reserva, 'id_pasajero' => $id_pasajero, 'pasajero' => null], 201);
    }

    #[Route('/api/detalles-viajeros', name: 'api_detalles_viajeros_delete', methods: ['DELETE'])]
    public function delete(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true) ?? [];

        if (!$this->esAdmin((int) ($data['userId'] ?? 0))) {
            return $this->json(['error' => 'Acceso denegado'], 403);
        }

        $id_reserva  = (int) ($data['id_reserva'] ?? 0);
        $id_pasajero = (int) ($data['id_pasajero'] ?? 0);

        if ($this->db->delete('detalles_viajeros', ['id_reserva' => $id_reserva, 'id_pasajero' => $id_pasajero]) === 0) {
            return $this->json(['error' => 'Registro no encontrado'], 404);
        }

        return $this->json(null, 204);
    }
}
