<?php

namespace App\Controller\Api;

use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

class UsuariosController extends BaseApiController
{
    private const AVATAR_DIR = __DIR__ . '/../../../public/uploads/avatars';
    private const AVATAR_MIME = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp', 'image/gif' => 'gif'];
    private const AVATAR_MAX_BYTES = 2 * 1024 * 1024;

    #[Route('/api/usuarios', name: 'api_usuarios_list', methods: ['GET'])]
    public function list(): JsonResponse
    {
        return $this->json(
            $this->db->fetchAllAssociative('SELECT id, nombre, email, role, telefono, avatar FROM usuarios ORDER BY id')
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

        if (array_key_exists('telefono', $data)) {
            $t = trim((string) ($data['telefono'] ?? ''));
            $row['telefono'] = $t !== '' ? $t : null;
        }

        if ($password !== '') {
            $row['password'] = password_hash($password, PASSWORD_DEFAULT);
        }

        if ($this->db->update('usuarios', $row, ['id' => $id]) === 0) {
            return $this->json(['error' => 'Usuario no encontrado'], 404);
        }

        $telefono = $row['telefono'] ?? null;
        return $this->json(['id' => $id, 'nombre' => $nombre, 'email' => $email, 'role' => $role, 'telefono' => $telefono]);
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

    #[Route('/api/perfil', name: 'api_perfil_update', methods: ['PUT'])]
    public function actualizarPerfil(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true) ?? [];

        $userId = (int) ($data['userId'] ?? 0);

        if ($userId === 0) {
            return $this->json(['error' => 'No autenticado'], 401);
        }

        $usuario = $this->db->fetchAssociative(
            'SELECT id, nombre, email, password, role, telefono, avatar FROM usuarios WHERE id = ?',
            [$userId]
        );

        if ($usuario === false) {
            return $this->json(['error' => 'Usuario no encontrado'], 404);
        }

        $nombre          = trim((string) ($data['nombre'] ?? ''));
        $newPassword     = (string) ($data['newPassword'] ?? '');
        $currentPassword = (string) ($data['currentPassword'] ?? '');

        if ($nombre === '') {
            return $this->json(['error' => 'El nombre es obligatorio'], 400);
        }

        $row = ['nombre' => $nombre];

        if ($newPassword !== '') {
            if ($currentPassword === '' || !password_verify($currentPassword, $usuario['password'])) {
                return $this->json(['error' => 'La contraseña actual es incorrecta'], 400);
            }
            $row['password'] = password_hash($newPassword, PASSWORD_DEFAULT);
        }

        if (array_key_exists('telefono', $data)) {
            $t = trim((string) ($data['telefono'] ?? ''));
            $row['telefono'] = $t !== '' ? $t : null;
        }

        $this->db->update('usuarios', $row, ['id' => $userId]);

        $telefono = $row['telefono'] ?? ($usuario['telefono'] !== null ? (string) $usuario['telefono'] : null);

        return $this->json([
            'id'       => (int) $usuario['id'],
            'nombre'   => $nombre,
            'email'    => $usuario['email'],
            'role'     => $usuario['role'],
            'telefono' => $telefono,
            'avatar'   => $usuario['avatar'],
        ]);
    }

    #[Route('/api/perfil/avatar', name: 'api_perfil_avatar', methods: ['POST'])]
    public function subirAvatar(Request $request): JsonResponse
    {
        $userId = (int) $request->request->get('userId', 0);

        if ($userId === 0) {
            return $this->json(['error' => 'No autenticado'], 401);
        }

        $usuario = $this->db->fetchAssociative('SELECT id, avatar FROM usuarios WHERE id = ?', [$userId]);
        if ($usuario === false) {
            return $this->json(['error' => 'Usuario no encontrado'], 404);
        }

        /** @var UploadedFile|null $file */
        $file = $request->files->get('avatar');
        if ($file === null) {
            return $this->json(['error' => 'No se recibió ninguna imagen'], 400);
        }

        $ext = self::AVATAR_MIME[$file->getMimeType()] ?? null;
        if ($ext === null) {
            return $this->json(['error' => 'Formato no soportado. Usa JPG, PNG, WEBP o GIF'], 400);
        }

        if ($file->getSize() > self::AVATAR_MAX_BYTES) {
            return $this->json(['error' => 'La imagen no puede superar los 2 MB'], 400);
        }

        if (!is_dir(self::AVATAR_DIR)) {
            mkdir(self::AVATAR_DIR, 0775, true);
        }

        $filename = $userId . '-' . bin2hex(random_bytes(8)) . '.' . $ext;
        $file->move(self::AVATAR_DIR, $filename);

        if ($usuario['avatar'] !== null) {
            $previo = self::AVATAR_DIR . '/' . basename((string) $usuario['avatar']);
            if (is_file($previo)) {
                unlink($previo);
            }
        }

        $ruta = '/uploads/avatars/' . $filename;
        $this->db->update('usuarios', ['avatar' => $ruta], ['id' => $userId]);

        return $this->json(['avatar' => $ruta]);
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

        $usuario = $this->db->fetchAssociative(
            'SELECT id, nombre, email, password, role, telefono, avatar FROM usuarios WHERE email = ?',
            [$email]
        );

        if ($usuario === false || !password_verify($password, $usuario['password'])) {
            return $this->json(['error' => 'Credenciales inválidas'], 401);
        }

        return $this->json([
            'id'       => (int) $usuario['id'],
            'nombre'   => $usuario['nombre'],
            'email'    => $usuario['email'],
            'role'     => $usuario['role'],
            'telefono' => $usuario['telefono'] !== null ? (string) $usuario['telefono'] : null,
            'avatar'   => $usuario['avatar'],
        ]);
    }
}
