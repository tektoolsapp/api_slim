<?php

namespace App\Domain\Travel\Repository;

use PDO;
use App\Domain\Utility\Service\CommonFunctions;

class TravelAddRepository
{
    private $connection;
    private $common;

    public function __construct(
            PDO $connection,
            CommonFunctions $common
        )
    {
        $this->connection = $connection;
        $this->common = $common;
    }

    public function createTravelDoc(array $travel)
    {

        $update_datetime = strtotime(date('d-m-Y H:i'));
        $travel['td_uploaded'] = $update_datetime;
        $travel['td_status'] = 'A';
        $columnsArray = array_keys($travel);
        $columnsString = implode(',', $columnsArray);
        $valuesArray = array_values($travel);
        $valuesCount = count($valuesArray);

        $valuesPlaceholder = '';
        for ($i=0; $i < $valuesCount; $i++) {
            $valuesPlaceholder .= '?,';
        }
        $valuesPlaceholder = rtrim($valuesPlaceholder, ',');

        $query = "INSERT INTO travel_docs ($columnsString) VALUES ($valuesPlaceholder)";
        $this->connection->prepare($query)->execute($valuesArray);

        return (int)$this->connection->lastInsertId();

    }
}
