<?php

namespace App\Domain\Requests\Repository;

use PDO;
use App\Domain\Utility\Service\PdoInsert;

class RequestUpdateShiftsRepository
{
    private $connection;
    private $pdoInsert;

    public function __construct(PDO $connection, PdoInsert $pdoInsert)
    {
        $this->connection = $connection;
        $this->pdoInsert = $pdoInsert;
    }

    public function updateRequest($wsId, array $shiftsArray)
    {
        //dump($wsId);
        //dump($shiftsArray);

        $shiftsArray['ws_id'] = $wsId;
        $columnsArray = array_keys($shiftsArray);
        $columnString = '';

        for ($c=0; $c < sizeof($columnsArray)-1; $c++) {
            $columnString .= $columnsArray[$c]." = ?,";
        }

        $columnString = rtrim($columnString, ',');
        $valuesArray = array_values($shiftsArray);

        $query = "UPDATE workspaces SET $columnString WHERE ws_id = ?";
        $this->connection->prepare($query)->execute($valuesArray);

        return 'SHIFTS UPDATED OK';

    }
}
