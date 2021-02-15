<?php

namespace App\Domain\Scheduler\Repository;

use App\Domain\Utility\Service\ConvertValues;
use DomainException;
use PDO;

class SchedulerTemplatesRepository
{
    private $connection;
    private $mongo;
    private $convert;

    public function __construct(
            PDO $connection, 
            ConvertValues $convert
        )
    {
        $this->connection = $connection;
        $this->convert = $convert;

    }

    public function getTemplates()
    {
        $sql = "SELECT * FROM swing_templates WHERE template_status <> 'X'";
        $statement = $this->connection->prepare($sql);
        $statement->execute();
        $templates = $statement->fetchAll(PDO::FETCH_ASSOC);
    
        return $templates;
    }
}