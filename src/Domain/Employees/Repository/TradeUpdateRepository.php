<?php

namespace App\Domain\Employees\Repository;

use PDO;

class TradeUpdateRepository
{
    private $connection;

    public function __construct(PDO $connection)
    {
        $this->connection = $connection;
    }

    public function updateTrade(array $trade)
    {
        
        $tradeColor = $trade['trade_color'];
        $colorHash = substr($tradeColor,0,1); 
        if($colorHash !== '#'){
            $tradeColor = "#".$tradeColor;
        } 
    
        $trade['trade_color'] = $tradeColor;
        
        $tradeId = $trade['trade_id'];
        unset($trade['trade_id']);
        $trade['trade_id'] = $tradeId;
        
        $columnsArray = array_keys($trade);
        $columnString = '';

        for ($c=0; $c < sizeof($columnsArray)-1; $c++) {
            $columnString .= $columnsArray[$c]." = ?,";
        }

        $columnString = rtrim($columnString, ',');
        $valuesArray = array_values($trade);

        $query = "UPDATE employee_trades SET $columnString WHERE trade_id = ?";
        $this->connection->prepare($query)->execute($valuesArray);

        return 'OK';

    }
}
