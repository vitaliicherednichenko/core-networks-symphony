<?php

namespace App\Controller\Api;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

class ReservasController extends BaseApiController
{
    #[Route('/api/reservas', name: 'api_reservas', methods: ['GET'])]
    public function list(): JsonResponse
    {
        return $this->json(
            $this->db->fetchAllAssociative('SELECT * FROM reservas_vuelos ORDER BY fecha_salida')
        );
    }

    #[Route('/api/reservas', name: 'api_reservas_create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true) ?? [];

        if (!$this->esAdmin((int) ($data['userId'] ?? 0))) {
            return $this->json(['error' => 'Acceso denegado'], 403);
        }

        $fecha_salida     = trim((string) ($data['fecha_salida'] ?? ''));
        $fecha_retorno    = trim((string) ($data['fecha_retorno'] ?? ''));
        $nro_adultos      = (int) ($data['nro_adultos'] ?? 0);
        $nro_ninos        = (int) ($data['nro_ninos'] ?? 0);
        $nro_tercera_edad = (int) ($data['nro_tercera_edad'] ?? 0);
        $clase            = trim((string) ($data['clase'] ?? ''));

        if ($fecha_salida === '' || $fecha_retorno === '' || $clase === '') {
            return $this->json(['error' => 'fecha_salida, fecha_retorno y clase son obligatorios'], 400);
        }

        $this->db->insert('reservas_vuelos', compact(
            'fecha_salida', 'fecha_retorno', 'nro_adultos', 'nro_ninos', 'nro_tercera_edad', 'clase'
        ));
        $id = (int) $this->db->lastInsertId();

        return $this->json(
            ['id_reserva' => $id] + compact('fecha_salida', 'fecha_retorno', 'nro_adultos', 'nro_ninos', 'nro_tercera_edad', 'clase'),
            201
        );
    }

    #[Route('/api/reservas/{id}', name: 'api_reservas_update', methods: ['PUT'])]
    public function update(int $id, Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true) ?? [];

        if (!$this->esAdmin((int) ($data['userId'] ?? 0))) {
            return $this->json(['error' => 'Acceso denegado'], 403);
        }

        $fecha_salida     = trim((string) ($data['fecha_salida'] ?? ''));
        $fecha_retorno    = trim((string) ($data['fecha_retorno'] ?? ''));
        $nro_adultos      = (int) ($data['nro_adultos'] ?? 0);
        $nro_ninos        = (int) ($data['nro_ninos'] ?? 0);
        $nro_tercera_edad = (int) ($data['nro_tercera_edad'] ?? 0);
        $clase            = trim((string) ($data['clase'] ?? ''));

        if ($fecha_salida === '' || $fecha_retorno === '' || $clase === '') {
            return $this->json(['error' => 'fecha_salida, fecha_retorno y clase son obligatorios'], 400);
        }

        if ($this->db->update('reservas_vuelos', compact(
            'fecha_salida', 'fecha_retorno', 'nro_adultos', 'nro_ninos', 'nro_tercera_edad', 'clase'
        ), ['id_reserva' => $id]) === 0) {
            return $this->json(['error' => 'Reserva no encontrada'], 404);
        }

        return $this->json(
            ['id_reserva' => $id] + compact('fecha_salida', 'fecha_retorno', 'nro_adultos', 'nro_ninos', 'nro_tercera_edad', 'clase')
        );
    }

    #[Route('/api/reservas/{id}', name: 'api_reservas_delete', methods: ['DELETE'])]
    public function delete(int $id, Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true) ?? [];

        if (!$this->esAdmin((int) ($data['userId'] ?? 0))) {
            return $this->json(['error' => 'Acceso denegado'], 403);
        }

        if ($this->db->delete('reservas_vuelos', ['id_reserva' => $id]) === 0) {
            return $this->json(['error' => 'Reserva no encontrada'], 404);
        }

        return $this->json(null, 204);
    }
}
