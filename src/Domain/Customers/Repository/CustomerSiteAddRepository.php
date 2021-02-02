<?php

namespace App\Domain\Customers\Repository;

use PDO;

class CustomerSiteAddRepository
{
    private $connection;

    public function __construct(PDO $connection)
    {
        $this->connection = $connection;
    }

    public function insertCustomerSite(array $site)
    {
        unset($site['site_id']);

        $site['site_status'] = 'A';

        $columnsArray = array_keys($site);
        $columnsString = implode(',', $columnsArray);
        $valuesArray = array_values($site);
        $valuesCount = count($valuesArray);

        $valuesPlaceholder = '';
        for ($i=0; $i < $valuesCount; $i++) {
            $valuesPlaceholder .= '?,';
        }
        $valuesPlaceholder = rtrim($valuesPlaceholder, ',');

        $query = "INSERT INTO customer_sites ($columnsString) VALUES ($valuesPlaceholder)";
        $this->connection->prepare($query)->execute($valuesArray);

        return (int)$this->connection->lastInsertId();

    }
}
