<?php

namespace App\Domain\Employees\Repository;

use PDO;

class SkillUpdateRepository
{
    private $connection;

    public function __construct(PDO $connection)
    {
        $this->connection = $connection;
    }

    public function updateSkill(array $skill)
    {
        $skillId = $skill['skill_id'];
        unset($skill['skill_id']);
        $skill['skill_id'] = $skillId;
        $columnsArray = array_keys($skill);
        $columnString = '';

        for ($c=0; $c < sizeof($columnsArray)-1; $c++) {
            $columnString .= $columnsArray[$c]." = ?,";
        }

        $columnString = rtrim($columnString, ',');
        $valuesArray = array_values($skill);

        $query = "UPDATE employee_skills SET $columnString WHERE skill_id = ?";
        $this->connection->prepare($query)->execute($valuesArray);

        return 'OK';

    }
}
