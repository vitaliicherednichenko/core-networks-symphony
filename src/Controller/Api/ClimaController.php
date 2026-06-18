<?php

namespace App\Controller\Api;

use Doctrine\DBAL\Connection;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class ClimaController extends BaseApiController
{
    public function __construct(
        Connection $db,
        private readonly HttpClientInterface $httpClient,
    ) {
        parent::__construct($db);
    }

    #[Route('/api/clima', name: 'api_clima', methods: ['GET'])]
    public function temperaturaActual(Request $request): JsonResponse
    {
        $lat = $request->query->get('lat');
        $lon = $request->query->get('lon');

        if ($lat === null || $lon === null || !is_numeric($lat) || !is_numeric($lon)) {
            return $this->json(['error' => 'lat y lon son obligatorios'], 400);
        }

        try {
            $response = $this->httpClient->request('GET', 'https://api.open-meteo.com/v1/forecast', [
                'query' => [
                    'latitude'  => $lat,
                    'longitude' => $lon,
                    'current'   => 'temperature_2m',
                ],
            ]);

            $data = $response->toArray(false);
        } catch (\Throwable) {
            return $this->json(['error' => 'No se pudo obtener el clima'], 502);
        }

        return $this->json([
            'temperatura' => $data['current']['temperature_2m'] ?? null,
            'unidad'      => $data['current_units']['temperature_2m'] ?? null,
        ]);
    }
}
