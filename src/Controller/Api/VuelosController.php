<?php

namespace App\Controller\Api;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

class VuelosController extends BaseApiController
{
    #[Route('/api/vuelos', name: 'api_vuelos', methods: ['GET'])]
    public function list(): JsonResponse
    {
        return $this->json(
            $this->db->fetchAllAssociative('SELECT * FROM vuelos ORDER BY hora_salida')
        );
    }

    #[Route('/api/vuelos', name: 'api_vuelos_create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true) ?? [];

        if (!$this->esAdmin((int) ($data['userId'] ?? 0))) {
            return $this->json(['error' => 'Acceso denegado'], 403);
        }

        $origen    = trim((string) ($data['origen'] ?? ''));
        $destino   = trim((string) ($data['destino'] ?? ''));
        $salida    = trim((string) ($data['hora_salida'] ?? ''));
        $llegada   = trim((string) ($data['hora_llegada'] ?? ''));
        $aerolinea = trim((string) ($data['aerolinea'] ?? ''));

        if ($origen === '' || $destino === '' || $salida === '' || $llegada === '' || $aerolinea === '') {
            return $this->json(['error' => 'Todos los campos son obligatorios'], 400);
        }

        $this->db->insert('vuelos', [
            'origen'       => $origen,
            'destino'      => $destino,
            'hora_salida'  => $salida,
            'hora_llegada' => $llegada,
            'aerolinea'    => $aerolinea,
        ]);

        $id = (int) $this->db->lastInsertId();

        return $this->json([
            'id' => $id, 'origen' => $origen, 'destino' => $destino,
            'hora_salida' => $salida, 'hora_llegada' => $llegada, 'aerolinea' => $aerolinea,
        ], 201);
    }

    #[Route('/api/vuelos/{id}', name: 'api_vuelos_update', methods: ['PUT'])]
    public function update(int $id, Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true) ?? [];

        if (!$this->esAdmin((int) ($data['userId'] ?? 0))) {
            return $this->json(['error' => 'Acceso denegado'], 403);
        }

        $origen    = trim((string) ($data['origen'] ?? ''));
        $destino   = trim((string) ($data['destino'] ?? ''));
        $salida    = trim((string) ($data['hora_salida'] ?? ''));
        $llegada   = trim((string) ($data['hora_llegada'] ?? ''));
        $aerolinea = trim((string) ($data['aerolinea'] ?? ''));

        if ($origen === '' || $destino === '' || $salida === '' || $llegada === '' || $aerolinea === '') {
            return $this->json(['error' => 'Todos los campos son obligatorios'], 400);
        }

        $affected = $this->db->update('vuelos', [
            'origen'       => $origen,
            'destino'      => $destino,
            'hora_salida'  => $salida,
            'hora_llegada' => $llegada,
            'aerolinea'    => $aerolinea,
        ], ['id' => $id]);

        if ($affected === 0) {
            return $this->json(['error' => 'Vuelo no encontrado'], 404);
        }

        return $this->json([
            'id' => $id, 'origen' => $origen, 'destino' => $destino,
            'hora_salida' => $salida, 'hora_llegada' => $llegada, 'aerolinea' => $aerolinea,
        ]);
    }

    #[Route('/api/vuelos/{id}', name: 'api_vuelos_delete', methods: ['DELETE'])]
    public function delete(int $id, Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true) ?? [];

        if (!$this->esAdmin((int) ($data['userId'] ?? 0))) {
            return $this->json(['error' => 'Acceso denegado'], 403);
        }

        if ($this->db->delete('vuelos', ['id' => $id]) === 0) {
            return $this->json(['error' => 'Vuelo no encontrado'], 404);
        }

        return $this->json(null, 204);
    }
}
