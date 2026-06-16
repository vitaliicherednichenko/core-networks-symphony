<?php

namespace App\Controller\Api;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

class PasajerosController extends BaseApiController
{
    #[Route('/api/pasajeros', name: 'api_pasajeros', methods: ['GET'])]
    public function list(): JsonResponse
    {
        return $this->json(
            $this->db->fetchAllAssociative('SELECT * FROM pasajeros ORDER BY apellido, nombre')
        );
    }

    #[Route('/api/pasajeros', name: 'api_pasajeros_create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true) ?? [];

        if (!$this->esAdmin((int) ($data['userId'] ?? 0))) {
            return $this->json(['error' => 'Acceso denegado'], 403);
        }

        $fields = ['nro_pasaporte', 'apellido', 'nombre', 'fecha_nacimiento', 'sexo', 'direccion', 'telefono'];
        $row = [];
        foreach ($fields as $f) {
            $v = trim((string) ($data[$f] ?? ''));
            if ($v === '') {
                return $this->json(['error' => "El campo $f es obligatorio"], 400);
            }
            $row[$f] = $v;
        }

        $this->db->insert('pasajeros', $row);
        $row['id_pasajero'] = (int) $this->db->lastInsertId();

        return $this->json($row, 201);
    }

    #[Route('/api/pasajeros/{id}', name: 'api_pasajeros_update', methods: ['PUT'])]
    public function update(int $id, Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true) ?? [];

        if (!$this->esAdmin((int) ($data['userId'] ?? 0))) {
            return $this->json(['error' => 'Acceso denegado'], 403);
        }

        $fields = ['nro_pasaporte', 'apellido', 'nombre', 'fecha_nacimiento', 'sexo', 'direccion', 'telefono'];
        $row = [];
        foreach ($fields as $f) {
            $v = trim((string) ($data[$f] ?? ''));
            if ($v === '') {
                return $this->json(['error' => "El campo $f es obligatorio"], 400);
            }
            $row[$f] = $v;
        }

        if ($this->db->update('pasajeros', $row, ['id_pasajero' => $id]) === 0) {
            return $this->json(['error' => 'Pasajero no encontrado'], 404);
        }

        $row['id_pasajero'] = $id;

        return $this->json($row);
    }

    #[Route('/api/pasajeros/{id}', name: 'api_pasajeros_delete', methods: ['DELETE'])]
    public function delete(int $id, Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true) ?? [];

        if (!$this->esAdmin((int) ($data['userId'] ?? 0))) {
            return $this->json(['error' => 'Acceso denegado'], 403);
        }

        if ($this->db->delete('pasajeros', ['id_pasajero' => $id]) === 0) {
            return $this->json(['error' => 'Pasajero no encontrado'], 404);
        }

        return $this->json(null, 204);
    }
}
