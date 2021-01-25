<?php

namespace App\Domain\Employees\Repository;

use PDO;

class EmployeeAddRepository
{
    private $connection;

    public function __construct(PDO $connection)
    {
        $this->connection = $connection;
    }

    public function insertEmployee(array $employee)
    {
        unset($employee['emp_id']);

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
