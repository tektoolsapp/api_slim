<?php

namespace App\Domain\Scheduler\Repository;

use DomainException;
use PDO;

class SchedulerBookingDeleteTemplateRepository
{
    private $connection;

    public function __construct(
            PDO $connection
        )
    {
        $this->connection = $connection;
    }

    public function deleteTemplate($templateId)
    {
        $postArray = array(
            'template_status' => 'X',
            'template_id' => $templateId
        );

        $columnsArray = array_keys($postArray);
        $columnString = '';

        for ($c=0; $c < sizeof($columnsArray)-1; $c++) {
            $columnString .= $columnsArray[$c]." = ?,";
        }

        $columnString = rtrim($columnString, ',');
        $valuesArray = array_values($postArray);

        $query = "UPDATE swing_templates SET $columnString WHERE template_id = ?";
        $this->connection->prepare($query)->execute($valuesArray);

        $returnArray = array(
            "template_id" => $templateId,
            "status" => 'deleted'
        );
            
        return $returnArray;
    }
}