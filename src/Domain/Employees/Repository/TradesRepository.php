<?php

namespace App\Domain\Employees\Repository;

use PDO;
//use MongoDB\Client as Mongo;

class TradesRepository
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

    public function getTrades()
    {
        $sql = "SELECT * FROM employee_trades";
        $statement = $this->connection->prepare($sql);
        $statement->execute();

        $trades = $statement->fetchAll(PDO::FETCH_ASSOC);

        return $trades;
    }
}