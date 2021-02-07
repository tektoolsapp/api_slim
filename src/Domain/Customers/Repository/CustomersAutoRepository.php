<?php

namespace App\Domain\Customers\Repository;

use App\Domain\Utility\Service\ConvertValues;
use DomainException;
use PDO;
//use MongoDB\Client as Mongo;

class CustomersAutoRepository
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

    public function getCustomers($term)
    {
        $customers = array();

        $sql = "SELECT cust_name FROM customers WHERE cust_name LIKE concat('%', :param, '%')";
        $statement = $this->connection->prepare($sql);
        $statement->bindParam(":param", $term, PDO::PARAM_STR);
        $statement->execute();
        $statement->bindColumn('cust_name', $cust_name);
        while ($statement->fetch (PDO::FETCH_BOUND)) {
            $customers[] = $cust_name;
        }

        return $customers;
    }
}