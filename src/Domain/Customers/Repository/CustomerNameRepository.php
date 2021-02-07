<?php

namespace App\Domain\Customers\Repository;

use App\Domain\Utility\Service\ConvertValues;
//use DomainException;
use PDO;
//use MongoDB\Client as Mongo;

class CustomerNameRepository
{
    private $connection;
    //private $mongo;
    private $convert;

    public function __construct(
            PDO $connection, 
            //Mongo $mongo, 
            ConvertValues $convert
        )
    {
        $this->connection = $connection;
        //$this->mongo = $mongo;
        $this->convert = $convert;

    }

    public function getCustomer($name)
    {
        $sql = "SELECT * FROM customers WHERE cust_name = :cust_name;";
        $statement = $this->connection->prepare($sql);
        $statement->execute(['cust_name' => $name]);

        $customer = $statement->fetch();

        /*
        if (!$customer) {
            throw new DomainException(sprintf('Customer not found: %s', $customerId));
        }
        */

        return $customer;
    }
}