<?php

namespace App\Domain\Employees\Repository;

use PDO;

class EmployeeUpdateRepository
{
    private $connection;

    public function __construct(PDO $connection)
    {
        $this->connection = $connection;
    }

    public function updateEmployee(array $employee)
    {

        dump($employee);

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

