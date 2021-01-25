<?php

namespace App\Domain\Customers\Repository;

use PDO;
use App\Domain\Utility\Service\PdoInsert;

class CustomerUpdateRepository
{
    private $connection;
    private $pdoInsert;

    public function __construct(PDO $connection, PdoInsert $pdoInsert)
    {
        $this->connection = $connection;
        $this->pdoInsert = $pdoInsert;
    }

    public function updateCustomer(array $customer)
    {
        $customerId = $customer['cust_id'];
        unset($customer['cust_id']);
        $customer['cust_id'] = $customerId;
        $columnsArray = array_keys($customer);
        $columnString = '';

        for ($c=0; $c < sizeof($columnsArray)-1; $c++) {
            $columnString .= $columnsArray[$c]." = ?,";
        }

        $columnString = rtrim($columnString, ',');
        $valuesArray = array_values($customer);

        $query = "UPDATE customers SET $columnString WHERE cust_id = ?";
        $this->connection->prepare($query)->execute($valuesArray);

        return 'OK';

    }
}
