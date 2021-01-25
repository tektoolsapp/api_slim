<?php

namespace App\Domain\Customers\Repository;

use DomainException;
use PDO;
use MongoDB\Client as Mongo;

class CustomerFetchRepository
{
    private $connection;
    private $mongo;

    public function __construct(PDO $connection, Mongo $mongo)
    {
        $this->connection = $connection;
        $this->mongo = $mongo;

    }

    public function getCustomer($customerId)
    {
        $sql = "SELECT * FROM customers WHERE cust_id = :cust_id;";
        $statement = $this->connection->prepare($sql);
        $statement->execute(['cust_id' => $customerId]);

        $customer = $statement->fetch();

        if (!$customer) {
            throw new DomainException(sprintf('Customer not found: %s', $customerId));
        }

        return $customer;
    }
}
