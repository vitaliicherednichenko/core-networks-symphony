<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260616120000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add role column to usuarios';
    }

    public function up(Schema $schema): void
    {
        $this->addSql("ALTER TABLE usuarios ADD COLUMN role VARCHAR(20) NOT NULL DEFAULT 'user'");
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE usuarios DROP COLUMN role');
    }
}
