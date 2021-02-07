<?php

namespace App\Domain\Customers\Repository;

use PDO;
//use MongoDB\Client as Mongo;

class CustomerSitesAllFetchRepository
{
    private $connection;
    //private $mongo;

    public function __construct(
            PDO $connection
            //Mongo $mongo`
        )
    {
        $this->connection = $connection;
        //$this->mongo = $mongo;

    }

    public function getAllCustomerSites()
    {
        $sql = "SELECT * FROM customer_sites WHERE site_status <> 'X'";
        $statement = $this->connection->prepare($sql);
        $statement->execute();

        $sites = $statement->fetchAll(PDO::FETCH_ASSOC);

        return $sites;
    }
}
