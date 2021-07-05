<?php

namespace App\Domain\Employees\Repository;

use PDO;
use App\Domain\Employees\Repository\TradesRepository;
use App\Domain\Utility\Service\CommonFunctions;

class EmployeeUpdateRepository
{
    private $connection;
    private $trdes;
    private $common;

    public function __construct(
            PDO $connection,
            TradesRepository $trades,
            CommonFunctions $common
        )
    {
        $this->connection = $connection;
        $this->trades = $trades;
        $this->common = $common;
    }

    public function updateEmployee(array $employee)
    {

        //dump($employee);

        $tradesArray = json_decode($employee['emp_trades'], true);

        //dump($tradesArray);

        //GET/SET TRADE COLOR
        if($employee['emp_type'] != 'T'){
        
            $trades = $this->trades->getTrades();
            $tradeLookup = $this->common->searchArray($trades, 'trade_code', $tradesArray[0]);
            $tradeColor = $tradeLookup[0]['trade_color'];
            $employee['color'] = $tradeColor;

        } else {
            $employee['color'] = '#B0B0B0'; 
        }

        $empId = $employee['emp_id'];
        unset($employee['emp_id']);
        $employee['emp_id'] = $empId;

        $columnsArray = array_keys($employee);
        $columnString = '';

        for ($c=0; $c < sizeof($columnsArray)-1; $c++) {
            $columnString .= $columnsArray[$c]." = ?,";
        }

        $columnString = rtrim($columnString, ',');
        $valuesArray = array_values($employee);

        $query = "UPDATE employees SET $columnString WHERE emp_id = ?";
        $this->connection->prepare($query)->execute($valuesArray);

        return 'OK';

    }
}

