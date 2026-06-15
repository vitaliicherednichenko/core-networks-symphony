<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260615095955 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Widen usuarios.password to fit a hashed password';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE usuarios MODIFY password VARCHAR(255) NOT NULL');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE usuarios MODIFY password VARCHAR(10) NOT NULL');
    }
}
