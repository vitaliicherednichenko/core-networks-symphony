<?php

namespace App\Controller\Api;

use Doctrine\DBAL\Connection;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

abstract class BaseApiController extends AbstractController
{
    public function __construct(protected readonly Connection $db)
    {
    }

    protected function esAdmin(int $userId): bool
    {
        if ($userId === 0) {
            return false;
        }
        $role = $this->db->fetchOne('SELECT role FROM usuarios WHERE id = ?', [$userId]);
        return $role === 'admin';
    }
}
