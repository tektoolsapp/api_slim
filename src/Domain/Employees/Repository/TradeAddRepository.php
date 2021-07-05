<?php

namespace App\Domain\Employees\Repository;

use PDO;

class TradeAddRepository
{
    private $connection;

    public function __construct(PDO $connection)
    {
        $this->connection = $connection;
    }

    public function insertTrade(array $trade)
    {
        unset($trade['trade_id']);

        $trade['trade_status'] = 'A';

        $tradeColor = $trade['trade_color'];
        $colorHash = substr($tradeColor,0,1); 
        if($colorHash !== '#'){
            $tradeColor = "#".$tradeColor;
        }

        $trade['trade_color'] = $tradeColor;

        $columnsArray = array_keys($trade);
        $columnsString = implode(',', $columnsArray);
        $valuesArray = array_values($trade);
        $valuesCount = count($valuesArray);

        $valuesPlaceholder = '';
        for ($i=0; $i < $valuesCount; $i++) {
            $valuesPlaceholder .= '?,';
        }
        $valuesPlaceholder = rtrim($valuesPlaceholder, ',');

        $query = "INSERT INTO employee_trades ($columnsString) VALUES ($valuesPlaceholder)";
        $this->connection->prepare($query)->execute($valuesArray);

        return (int)$this->connection->lastInsertId();

    }
}
