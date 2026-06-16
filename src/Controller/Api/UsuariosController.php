<?php

namespace App\Controller\Api;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

class UsuariosController extends BaseApiController
{

    #[Route('/api/usuarios', name: 'api_usuarios_list', methods: ['GET'])]
    public function list(): JsonResponse
    {
        return $this->json(
            $this->db->fetchAllAssociative('SELECT id, nombre, email, role FROM usuarios ORDER BY id')
        );
    }

    #[Route('/api/usuarios', name: 'api_usuarios_create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true) ?? [];

        $nombre = trim((string) ($data['nombre'] ?? ''));
        $email = trim((string) ($data['email'] ?? ''));
        $password = (string) ($data['password'] ?? '');

        if ($nombre === '' || $email === '' || $password === '') {
            return $this->json(['error' => 'nombre, email y password son obligatorios'], 400);
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return $this->json(['error' => 'El email no es válido'], 400);
        }

        if (mb_strlen($nombre) > 50 || mb_strlen($email) > 50) {
            return $this->json(['error' => 'nombre y email deben tener como máximo 50 caracteres'], 400);
        }

        if ($this->db->fetchOne('SELECT id FROM usuarios WHERE email = ?', [$email]) !== false) {
            return $this->json(['error' => 'Ya existe un usuario con ese email'], 409);
        }

        $this->db->insert('usuarios', [
            'nombre' => $nombre,
            'email' => $email,
            'password' => password_hash($password, PASSWORD_DEFAULT),
        ]);

        return $this->json([
            'id' => (int) $this->db->lastInsertId(),
            'nombre' => $nombre,
            'email' => $email,
        ], 201);
    }

    #[Route('/api/usuarios/{id}', name: 'api_usuarios_update', methods: ['PUT'])]
    public function update(int $id, Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true) ?? [];

        if (!$this->esAdmin((int) ($data['userId'] ?? 0))) {
            return $this->json(['error' => 'Acceso denegado'], 403);
        }

        $nombre = trim((string) ($data['nombre'] ?? ''));
        $email  = trim((string) ($data['email'] ?? ''));
        $role   = trim((string) ($data['role'] ?? 'user'));
        $password = (string) ($data['password'] ?? '');

        if ($nombre === '' || $email === '') {
            return $this->json(['error' => 'nombre y email son obligatorios'], 400);
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return $this->json(['error' => 'El email no es válido'], 400);
        }

        $row = ['nombre' => $nombre, 'email' => $email, 'role' => $role];

        if ($password !== '') {
            $row['password'] = password_hash($password, PASSWORD_DEFAULT);
        }

        if ($this->db->update('usuarios', $row, ['id' => $id]) === 0) {
            return $this->json(['error' => 'Usuario no encontrado'], 404);
        }

        return $this->json(['id' => $id, 'nombre' => $nombre, 'email' => $email, 'role' => $role]);
    }

    #[Route('/api/usuarios/{id}', name: 'api_usuarios_delete', methods: ['DELETE'])]
    public function delete(int $id, Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true) ?? [];
        $requesterId = (int) ($data['userId'] ?? 0);

        if (!$this->esAdmin($requesterId)) {
            return $this->json(['error' => 'Acceso denegado'], 403);
        }

        if ($requesterId === $id) {
            return $this->json(['error' => 'No puedes eliminar tu propia cuenta'], 400);
        }

        if ($this->db->delete('usuarios', ['id' => $id]) === 0) {
            return $this->json(['error' => 'Usuario no encontrado'], 404);
        }

        return $this->json(null, 204);
    }

    #[Route('/api/login', name: 'api_login', methods: ['POST'])]
    public function login(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true) ?? [];

        $email = trim((string) ($data['email'] ?? ''));
        $password = (string) ($data['password'] ?? '');

        if ($email === '' || $password === '') {
            return $this->json(['error' => 'Email y contraseña son obligatorios'], 400);
        }

        $usuario = $this->db->fetchAssociative('SELECT id, nombre, email, password, role FROM usuarios WHERE email = ?', [$email]);

        if ($usuario === false || !password_verify($password, $usuario['password'])) {
            return $this->json(['error' => 'Credenciales inválidas'], 401);
        }

        return $this->json([
            'id' => (int) $usuario['id'],
            'nombre' => $usuario['nombre'],
            'email' => $usuario['email'],
            'role' => $usuario['role'],
        ]);
    }
}
