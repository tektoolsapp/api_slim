<?php

namespace App\Domain\Employees\Repository;

use DomainException;
use PDO;
use MongoDB\Client as Mongo;

class SkillFetchRepository
{
    private $connection;
    private $mongo;

    public function __construct(PDO $connection, Mongo $mongo)
    {
        $this->connection = $connection;
        $this->mongo = $mongo;

    }

    public function getSkill($skillId)
    {
        $sql = "SELECT * FROM employee_skills WHERE skill_id = :skill_id;";
        $statement = $this->connection->prepare($sql);
        $statement->execute(['skill_id' => $skillId]);

        $skill = $statement->fetch();

        if (!$skill) {
            throw new DomainException(sprintf('Skill not found: %s', $skillId));
        }

        return $skill;
    }
}
