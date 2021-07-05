<?php

namespace App\Domain\Employees\Repository;
use PDO;

class TradeFetchRepository
{
    private $connection;

    public function __construct(
            PDO $connection 
        )
    {
        $this->connection = $connection;
    }

    public function getTrade($tradeId)
    {
        $sql = "SELECT * FROM employee_trades WHERE trade_id = :trade_id";
        $statement = $this->connection->prepare($sql);
        $statement->execute(['trade_id' => $tradeId]);

        $trade = $statement->fetch();

        return $trade;
    }
}
