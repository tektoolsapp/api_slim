<?php

namespace App\Domain\Customers\Repository;

use PDO;
//use MongoDB\Client as Mongo;

class CustomerSitesFetchRepository
{
    private $connection;
    //private $mongo;

    public function __construct(
            PDO $connection
            //Mongo $mongo
        )
    {
        $this->connection = $connection;
        //$this->mongo = $mongo;

    }

    public function getCustomerSites($customerId)
    {
        $sql = "SELECT * FROM customer_sites WHERE site_customer = :site_customer";
        $statement = $this->connection->prepare($sql);
        $statement->execute(['site_customer' => $customerId]);

        $sites = $statement->fetchAll(PDO::FETCH_ASSOC);

        return $sites;
    }
}
