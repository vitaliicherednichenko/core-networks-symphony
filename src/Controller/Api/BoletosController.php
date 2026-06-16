<?php

namespace App\Controller\Api;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

class BoletosController extends BaseApiController
{
    #[Route('/api/boletos', name: 'api_boletos', methods: ['GET'])]
    public function list(): JsonResponse
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

    #[Route('/api/boletos', name: 'api_boletos_create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true) ?? [];

        if (!$this->esAdmin((int) ($data['userId'] ?? 0))) {
            return $this->json(['error' => 'Acceso denegado'], 403);
        }

        $id_pasajero = (int) ($data['id_pasajero'] ?? 0);
        $id_reserva  = (int) ($data['id_reserva'] ?? 0);
        $clase       = trim((string) ($data['clase'] ?? ''));
        $precio      = trim((string) ($data['precio'] ?? ''));

        if ($id_pasajero === 0 || $id_reserva === 0 || $clase === '' || $precio === '') {
            return $this->json(['error' => 'Todos los campos son obligatorios'], 400);
        }

        $this->db->insert('boletos', compact('id_pasajero', 'id_reserva', 'clase', 'precio'));
        $id = (int) $this->db->lastInsertId();

        return $this->json(
            ['id_boleto' => $id] + compact('id_pasajero', 'id_reserva', 'clase', 'precio') + ['pasajero' => null],
            201
        );
    }

    #[Route('/api/boletos/{id}', name: 'api_boletos_update', methods: ['PUT'])]
    public function update(int $id, Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true) ?? [];

        if (!$this->esAdmin((int) ($data['userId'] ?? 0))) {
            return $this->json(['error' => 'Acceso denegado'], 403);
        }

        $id_pasajero = (int) ($data['id_pasajero'] ?? 0);
        $id_reserva  = (int) ($data['id_reserva'] ?? 0);
        $clase       = trim((string) ($data['clase'] ?? ''));
        $precio      = trim((string) ($data['precio'] ?? ''));

        if ($id_pasajero === 0 || $id_reserva === 0 || $clase === '' || $precio === '') {
            return $this->json(['error' => 'Todos los campos son obligatorios'], 400);
        }

        if ($this->db->update('boletos', compact('id_pasajero', 'id_reserva', 'clase', 'precio'), ['id_boleto' => $id]) === 0) {
            return $this->json(['error' => 'Boleto no encontrado'], 404);
        }

        return $this->json(
            ['id_boleto' => $id] + compact('id_pasajero', 'id_reserva', 'clase', 'precio') + ['pasajero' => null]
        );
    }

    #[Route('/api/boletos/{id}', name: 'api_boletos_delete', methods: ['DELETE'])]
    public function delete(int $id, Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true) ?? [];

        if (!$this->esAdmin((int) ($data['userId'] ?? 0))) {
            return $this->json(['error' => 'Acceso denegado'], 403);
        }

        if ($this->db->delete('boletos', ['id_boleto' => $id]) === 0) {
            return $this->json(['error' => 'Boleto no encontrado'], 404);
        }

        return $this->json(null, 204);
    }
}
