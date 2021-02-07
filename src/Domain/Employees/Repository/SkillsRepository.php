<?php

namespace App\Domain\Employees\Repository;

use PDO;
//use MongoDB\Client as Mongo;

class SkillsRepository
{
    private $connection;
    //private $mongo;

    public function __construct(
        PDO $connection 
        //Mongo $mongo
        )
    {
        $this->connection = $connection;
        //$this->mongo = $mongo;
    }

    public function getSkills()
    {
        $sql = "SELECT * FROM employee_skills";
        $statement = $this->connection->prepare($sql);
        $statement->execute();

        $skills = $statement->fetchAll(PDO::FETCH_ASSOC);

        return $skills;
    }
}