<?php

namespace App\Domain\Scheduler\Repository;

use DomainException;
use PDO;

class SchedulerFetchTemplateRepository
{
    private $connection;
    private $mongo;

    public function __construct(
            PDO $connection
        )
    {
        $this->connection = $connection;
    }

    public function getTemplate($templateId)
    {
        $sql = "SELECT * FROM swing_templates WHERE template_id = :template_id";
        $statement = $this->connection->prepare($sql);
        $statement->execute(['template_id' => $templateId]);

        $template = $statement->fetchAll(PDO::FETCH_ASSOC);
    
        return $template;
    }
}