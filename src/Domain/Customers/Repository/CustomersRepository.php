<?php

namespace App\Domain\Customers\Repository;

use App\Domain\Utility\Service\ConvertValues;
use DomainException;
use PDO;
//use MongoDB\Client as Mongo;

class CustomersRepository
{
    private $connection;
    private $mongo;
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

    public function getCustomers()
    {
        $sql = "SELECT * FROM customers";
        $statement = $this->connection->prepare($sql);
        $statement->execute();

        $customers = $statement->fetchAll(PDO::FETCH_ASSOC);

        /*
        if (!$customers) {
            throw new DomainException(sprintf('No Customers found: %s', ""));
        }
        */

        return $customers;
    }
}