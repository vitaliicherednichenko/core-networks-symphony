<?php

namespace App\Controller\Api;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

class VuelosController extends BaseApiController
{
    #[Route('/api/vuelos', name: 'api_vuelos', methods: ['GET'])]
    public function list(Request $request): JsonResponse
    {
        $userId = (int) $request->query->get('userId', 0);

        if ($userId > 0) {
            $u = $this->db->fetchAssociative(
                'SELECT role, telefono FROM usuarios WHERE id = ?',
                [$userId]
            );

            if ($u !== false && $u['role'] !== 'admin') {
                if ($u['telefono'] === null || $u['telefono'] === '') {
                    return $this->json([]);
                }

                $idPasajero = $this->db->fetchOne(
                    'SELECT id_pasajero FROM pasajeros WHERE telefono = ?',
                    [$u['telefono']]
                );

                if ($idPasajero === false) {
                    return $this->json([]);
                }

                return $this->json(
                    $this->db->fetchAllAssociative(
                        'SELECT DISTINCT v.* FROM vuelos v
                         INNER JOIN listado_pasajeros_vuelos lpv ON lpv.id_vuelo = v.id
                         WHERE lpv.id_pasajero = ?
                         ORDER BY v.hora_salida',
                        [(int) $idPasajero]
                    )
                );
            }
        }

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

    #[Route('/api/mis-vuelos', name: 'api_mis_vuelos_create', methods: ['POST'])]
    public function crearMiVuelo(Request $request): JsonResponse
    {
        $data   = json_decode($request->getContent(), true) ?? [];
        $userId = (int) ($data['userId'] ?? 0);

        if ($userId === 0) {
            return $this->json(['error' => 'No autenticado'], 401);
        }

        $idPasajero = $this->resolverPasajero($userId);
        if ($idPasajero === null) {
            return $this->json(['error' => 'No tienes un teléfono vinculado o perfil de pasajero. Configúralo en Mi perfil'], 400);
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

        $idVuelo = (int) $this->db->lastInsertId();

        $this->db->insert('listado_pasajeros_vuelos', [
            'id_vuelo'    => $idVuelo,
            'id_pasajero' => $idPasajero,
            'fecha'       => $salida,
        ]);

        return $this->json([
            'id' => $idVuelo, 'origen' => $origen, 'destino' => $destino,
            'hora_salida' => $salida, 'hora_llegada' => $llegada, 'aerolinea' => $aerolinea,
        ], 201);
    }

    #[Route('/api/mis-vuelos/{id}', name: 'api_mis_vuelos_update', methods: ['PUT'])]
    public function actualizarMiVuelo(int $id, Request $request): JsonResponse
    {
        $data   = json_decode($request->getContent(), true) ?? [];
        $userId = (int) ($data['userId'] ?? 0);

        if ($userId === 0) {
            return $this->json(['error' => 'No autenticado'], 401);
        }

        $idPasajero = $this->resolverPasajero($userId);
        if ($idPasajero === null) {
            return $this->json(['error' => 'No tienes un teléfono vinculado o perfil de pasajero'], 400);
        }

        if ($this->db->fetchOne(
            'SELECT id_vuelo FROM listado_pasajeros_vuelos WHERE id_vuelo = ? AND id_pasajero = ?',
            [$id, $idPasajero]
        ) === false) {
            return $this->json(['error' => 'No tienes permiso para editar este vuelo'], 403);
        }

        $origen    = trim((string) ($data['origen'] ?? ''));
        $destino   = trim((string) ($data['destino'] ?? ''));
        $salida    = trim((string) ($data['hora_salida'] ?? ''));
        $llegada   = trim((string) ($data['hora_llegada'] ?? ''));
        $aerolinea = trim((string) ($data['aerolinea'] ?? ''));

        if ($origen === '' || $destino === '' || $salida === '' || $llegada === '' || $aerolinea === '') {
            return $this->json(['error' => 'Todos los campos son obligatorios'], 400);
        }

        if ($this->db->update('vuelos', [
            'origen'       => $origen,
            'destino'      => $destino,
            'hora_salida'  => $salida,
            'hora_llegada' => $llegada,
            'aerolinea'    => $aerolinea,
        ], ['id' => $id]) === 0) {
            return $this->json(['error' => 'Vuelo no encontrado'], 404);
        }

        return $this->json([
            'id' => $id, 'origen' => $origen, 'destino' => $destino,
            'hora_salida' => $salida, 'hora_llegada' => $llegada, 'aerolinea' => $aerolinea,
        ]);
    }

    #[Route('/api/mis-vuelos/{id}', name: 'api_mis_vuelos_delete', methods: ['DELETE'])]
    public function eliminarMiVuelo(int $id, Request $request): JsonResponse
    {
        $data   = json_decode($request->getContent(), true) ?? [];
        $userId = (int) ($data['userId'] ?? 0);

        if ($userId === 0) {
            return $this->json(['error' => 'No autenticado'], 401);
        }

        $idPasajero = $this->resolverPasajero($userId);
        if ($idPasajero === null) {
            return $this->json(['error' => 'No tienes un teléfono vinculado o perfil de pasajero'], 400);
        }

        if ($this->db->fetchOne(
            'SELECT id_vuelo FROM listado_pasajeros_vuelos WHERE id_vuelo = ? AND id_pasajero = ?',
            [$id, $idPasajero]
        ) === false) {
            return $this->json(['error' => 'No tienes permiso para eliminar este vuelo'], 403);
        }

        $this->db->delete('listado_pasajeros_vuelos', ['id_vuelo' => $id]);
        $this->db->delete('vuelos', ['id' => $id]);

        return $this->json(null, 204);
    }

    private function resolverPasajero(int $userId): ?int
    {
        $u = $this->db->fetchAssociative('SELECT telefono FROM usuarios WHERE id = ?', [$userId]);
        if ($u === false || ($u['telefono'] ?? '') === '') {
            return null;
        }
        $id = $this->db->fetchOne('SELECT id_pasajero FROM pasajeros WHERE telefono = ?', [$u['telefono']]);
        return $id !== false ? (int) $id : null;
    }
}
