<?php

namespace App\Domain\Employees\Repository;

use PDO;

class EmployeeSkillAddRepository
{
    private $connection;

    public function __construct(PDO $connection)
    {
        $this->connection = $connection;
    }

    public function insertSkill(array $skill)
    {
        unset($skill['id']);

        $columnsArray = array_keys($skill);
        $columnsString = implode(',', $columnsArray);
        $valuesArray = array_values($skill);
        $valuesCount = count($valuesArray);

        $valuesPlaceholder = '';
        for ($i=0; $i < $valuesCount; $i++) {
            $valuesPlaceholder .= '?,';
        }
        $valuesPlaceholder = rtrim($valuesPlaceholder, ',');

        $query = "INSERT INTO employee_skills ($columnsString) VALUES ($valuesPlaceholder)";
        $this->connection->prepare($query)->execute($valuesArray);

        return (int)$this->connection->lastInsertId();

    }
}
