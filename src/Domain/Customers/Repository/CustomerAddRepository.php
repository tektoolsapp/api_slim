<?php

namespace App\Domain\Customers\Repository;

use PDO;

class CustomerAddRepository
{
    private $connection;

    public function __construct(PDO $connection)
    {
        $this->connection = $connection;
    }

    public function insertCustomer(array $customer)
    {
        //unset($customer['cust_id']);

        $customer['cust_status'] = 'A';

        $columnsArray = array_keys($customer);
        $columnsString = implode(',', $columnsArray);
        $valuesArray = array_values($customer);
        $valuesCount = count($valuesArray);

        $valuesPlaceholder = '';
        for ($i=0; $i < $valuesCount; $i++) {
            $valuesPlaceholder .= '?,';
        }
        $valuesPlaceholder = rtrim($valuesPlaceholder, ',');

        $query = "INSERT INTO customers ($columnsString) VALUES ($valuesPlaceholder)";
        $this->connection->prepare($query)->execute($valuesArray);

        //return (int)$this->connection->lastInsertId();

        return 'OK';

    }
}
