<?php

namespace App\Domain\Customers\Repository;

use PDO;
//use MongoDB\Client as Mongo;

class CustomerSiteFetchRepository
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

    public function getCustomerSite($customerSiteId)
    {
        $sql = "SELECT * FROM customer_sites WHERE site_code = :site_code;";
        $statement = $this->connection->prepare($sql);
        $statement->execute(['site_code' => $customerSiteId]);

        $customerSite = $statement->fetch();

        return $customerSite;
    }
}
