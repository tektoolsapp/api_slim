<?php

namespace App\Domain\Customers\Repository;

use PDO;

class CustomerSiteUpdateRepository
{
    private $connection;

    public function __construct(PDO $connection)
    {
        $this->connection = $connection;
    }

    public function updateCustomerSite(array $customerSite)
    {
        $siteCode = $customerSite['site_code'];
        unset($customerSite['site_code']);
        $customerSite['site_code'] = $siteCode;
        $columnsArray = array_keys($customerSite);
        $columnString = '';

        for ($c=0; $c < sizeof($columnsArray)-1; $c++) {
            $columnString .= $columnsArray[$c]." = ?,";
        }

        $columnString = rtrim($columnString, ',');
        $valuesArray = array_values($customerSite);

        $query = "UPDATE customer_sites SET $columnString WHERE site_code = ?";
        $this->connection->prepare($query)->execute($valuesArray);

        return 'OK';

    }
}
