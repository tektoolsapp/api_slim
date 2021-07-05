<?php

namespace App\Domain\Employees\Repository;
use PDO;

class TradesRepository
{
    private $connection;

    public function __construct(
            PDO $connection 
        )
    {
        $this->connection = $connection;
    }

    public function getTrades()
    {
        $sql = "SELECT * FROM employee_trades ORDER BY trade_desc ASC";
        $statement = $this->connection->prepare($sql);
        $statement->execute();

        $trades = $statement->fetchAll(PDO::FETCH_ASSOC);

        return $trades;
    }
}