<?php

namespace App\Domain\Employees\Repository;

use PDO;
use App\Domain\Employees\Repository\TradesRepository;
use App\Domain\Utility\Service\CommonFunctions;

class EmployeeAddRepository
{
    private $connection;
    private $trades;
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

    public function insertEmployee(array $employee)
    {

        unset($employee['emp_id']);

        //GET/SET TRADE COLOR
        $trades = $this->trades->getTrades();
        $tradeLookup = $this->common->searchArray($trades, 'trade_code', $employee['trade_type']);
        $tradeColor = $tradeLookup[0]['trade_color'];
        $employee['color'] = $tradeColor;

        $columnsArray = array_keys($employee);
        $columnsString = implode(',', $columnsArray);
        $valuesArray = array_values($employee);
        $valuesCount = count($valuesArray);

        $valuesPlaceholder = '';
        for ($i=0; $i < $valuesCount; $i++) {
            $valuesPlaceholder .= '?,';
        }
        $valuesPlaceholder = rtrim($valuesPlaceholder, ',');

        $query = "INSERT INTO employees ($columnsString) VALUES ($valuesPlaceholder)";
        $this->connection->prepare($query)->execute($valuesArray);

        return (int)$this->connection->lastInsertId();

    }
}
