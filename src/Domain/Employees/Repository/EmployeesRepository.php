<?php

namespace App\Domain\Employees\Repository;

//use DomainException;
use PDO;
//use MongoDB\Client as Mongo;

class EmployeesRepository
{
    private $connection;
    //private $mongo;

    public function __construct(
            PDO $connection 
            //Mongo $mongo
        )
    {
        $this->connection = $connection;
        $this->mongo = $mongo;
    }

    public function getEmployees()
    {

        $sql = "SELECT * FROM employees";
        $statement = $this->connection->prepare($sql);
        $statement->execute();

        $employees = $statement->fetchAll(PDO::FETCH_ASSOC);

        /*
        if (!$employees) {
            throw new DomainException(sprintf('No Employees found: %s', ""));
        }
        */

        return $employees;
    }
}
