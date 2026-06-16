<?php

namespace App\Controller\Api;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

class ListadoPasajerosVuelosController extends BaseApiController
{
    #[Route('/api/listado-pasajeros-vuelos', name: 'api_listado_pasajeros_vuelos', methods: ['GET'])]
    public function list(): JsonResponse
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

    #[Route('/api/listado-pasajeros-vuelos', name: 'api_listado_pasajeros_vuelos_create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true) ?? [];

        if (!$this->esAdmin((int) ($data['userId'] ?? 0))) {
            return $this->json(['error' => 'Acceso denegado'], 403);
        }

        $id_vuelo    = (int) ($data['id_vuelo'] ?? 0);
        $id_pasajero = (int) ($data['id_pasajero'] ?? 0);
        $fecha       = trim((string) ($data['fecha'] ?? ''));

        if ($id_vuelo === 0 || $id_pasajero === 0 || $fecha === '') {
            return $this->json(['error' => 'id_vuelo, id_pasajero y fecha son obligatorios'], 400);
        }

        $this->db->insert('listado_pasajeros_vuelos', compact('id_vuelo', 'id_pasajero', 'fecha'));

        return $this->json([
            'id_vuelo' => $id_vuelo, 'id_pasajero' => $id_pasajero, 'fecha' => $fecha,
            'pasajero' => null, 'origen' => null, 'destino' => null,
        ], 201);
    }

    #[Route('/api/listado-pasajeros-vuelos', name: 'api_listado_pasajeros_vuelos_update', methods: ['PUT'])]
    public function update(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true) ?? [];

        if (!$this->esAdmin((int) ($data['userId'] ?? 0))) {
            return $this->json(['error' => 'Acceso denegado'], 403);
        }

        $id_vuelo    = (int) ($data['id_vuelo'] ?? 0);
        $id_pasajero = (int) ($data['id_pasajero'] ?? 0);
        $fecha       = trim((string) ($data['fecha'] ?? ''));

        if ($id_vuelo === 0 || $id_pasajero === 0 || $fecha === '') {
            return $this->json(['error' => 'id_vuelo, id_pasajero y fecha son obligatorios'], 400);
        }

        if ($this->db->update(
            'listado_pasajeros_vuelos',
            ['fecha' => $fecha],
            ['id_vuelo' => $id_vuelo, 'id_pasajero' => $id_pasajero]
        ) === 0) {
            return $this->json(['error' => 'Registro no encontrado'], 404);
        }

        return $this->json([
            'id_vuelo' => $id_vuelo, 'id_pasajero' => $id_pasajero, 'fecha' => $fecha,
            'pasajero' => null, 'origen' => null, 'destino' => null,
        ]);
    }

    #[Route('/api/listado-pasajeros-vuelos', name: 'api_listado_pasajeros_vuelos_delete', methods: ['DELETE'])]
    public function delete(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true) ?? [];

        if (!$this->esAdmin((int) ($data['userId'] ?? 0))) {
            return $this->json(['error' => 'Acceso denegado'], 403);
        }

        $id_vuelo    = (int) ($data['id_vuelo'] ?? 0);
        $id_pasajero = (int) ($data['id_pasajero'] ?? 0);

        if ($this->db->delete('listado_pasajeros_vuelos', ['id_vuelo' => $id_vuelo, 'id_pasajero' => $id_pasajero]) === 0) {
            return $this->json(['error' => 'Registro no encontrado'], 404);
        }

        return $this->json(null, 204);
    }
}
