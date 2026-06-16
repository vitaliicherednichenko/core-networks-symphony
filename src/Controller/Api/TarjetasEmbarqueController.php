<?php

namespace App\Controller\Api;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

class TarjetasEmbarqueController extends BaseApiController
{
    #[Route('/api/tarjetas-embarque', name: 'api_tarjetas_embarque', methods: ['GET'])]
    public function list(): JsonResponse
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

    #[Route('/api/tarjetas-embarque', name: 'api_tarjetas_embarque_create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true) ?? [];

        if (!$this->esAdmin((int) ($data['userId'] ?? 0))) {
            return $this->json(['error' => 'Acceso denegado'], 403);
        }

        $row = [
            'id_reserva'  => (int) ($data['id_reserva'] ?? 0),
            'id_pasajero' => (int) ($data['id_pasajero'] ?? 0),
        ];

        if ($row['id_reserva'] === 0 || $row['id_pasajero'] === 0) {
            return $this->json(['error' => 'id_reserva e id_pasajero son obligatorios'], 400);
        }

        foreach (['embarque', 'nro_vuelo', 'fecha_vuelo', 'clase', 'asiento', 'sala_embarque'] as $f) {
            $v = trim((string) ($data[$f] ?? ''));
            if ($v === '') {
                return $this->json(['error' => "El campo $f es obligatorio"], 400);
            }
            $row[$f] = $v;
        }

        $this->db->insert('tarjeta_de_embarque', $row);
        $row['id_tarjeta'] = (int) $this->db->lastInsertId();
        $row['pasajero']   = null;

        return $this->json($row, 201);
    }

    #[Route('/api/tarjetas-embarque/{id}', name: 'api_tarjetas_embarque_update', methods: ['PUT'])]
    public function update(int $id, Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true) ?? [];

        if (!$this->esAdmin((int) ($data['userId'] ?? 0))) {
            return $this->json(['error' => 'Acceso denegado'], 403);
        }

        $row = [
            'id_reserva'  => (int) ($data['id_reserva'] ?? 0),
            'id_pasajero' => (int) ($data['id_pasajero'] ?? 0),
        ];

        foreach (['embarque', 'nro_vuelo', 'fecha_vuelo', 'clase', 'asiento', 'sala_embarque'] as $f) {
            $v = trim((string) ($data[$f] ?? ''));
            if ($v === '') {
                return $this->json(['error' => "El campo $f es obligatorio"], 400);
            }
            $row[$f] = $v;
        }

        if ($this->db->update('tarjeta_de_embarque', $row, ['id_tarjeta' => $id]) === 0) {
            return $this->json(['error' => 'Tarjeta no encontrada'], 404);
        }

        $row['id_tarjeta'] = $id;
        $row['pasajero']   = null;

        return $this->json($row);
    }

    #[Route('/api/tarjetas-embarque/{id}', name: 'api_tarjetas_embarque_delete', methods: ['DELETE'])]
    public function delete(int $id, Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true) ?? [];

        if (!$this->esAdmin((int) ($data['userId'] ?? 0))) {
            return $this->json(['error' => 'Acceso denegado'], 403);
        }

        if ($this->db->delete('tarjeta_de_embarque', ['id_tarjeta' => $id]) === 0) {
            return $this->json(['error' => 'Tarjeta no encontrada'], 404);
        }

        return $this->json(null, 204);
    }
}
