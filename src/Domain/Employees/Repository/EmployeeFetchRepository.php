<?php

namespace App\Domain\Employees\Repository;

use PDO;
//use MongoDB\Client as Mongo;
use App\Domain\Employees\Repository\SkillsRepository;
use App\Domain\Employees\Repository\TradesRepository;

class EmployeeFetchRepository
{
    private $connection;
    //private $mongo;
    private $skills;
    private $trades;

    public function __construct(
        PDO $connection,
       // Mongo $mongo,
        SkillsRepository $skills,
        TradesRepository $trades
    )
    {
        $this->connection = $connection;
        //$this->mongo = $mongo;
        $this->skills = $skills;
        $this->trades = $trades;
    }

    public function getEmployee($empId)
    {
        $skills = $this->skills->getSkills();
        $trades = $this->trades->getTrades();

        $sql = "SELECT * FROM employees WHERE emp_id = :emp_id;";
        $statement = $this->connection->prepare($sql);
        $statement->execute(['emp_id' => $empId]);

        $employee = $statement->fetch();

        $returnArray = array(
            "employee" => $employee,
            "trades" => $trades,
            "skills" => $skills
        );

        return $returnArray;
    }
}