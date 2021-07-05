<?php

namespace App\Domain\Requests\Repository;

use PDO;
use App\Domain\Utility\Service\PdoInsert;

class RequestUpdateRepository
{
    private $connection;
    private $pdoInsert;

    public function __construct(PDO $connection, PdoInsert $pdoInsert)
    {
        $this->connection = $connection;
        $this->pdoInsert = $pdoInsert;
    }

    public function updateRequest(array $request)
    {
        //dump($request);
        
        unset($request['ws_customer_name']);

        //WHEN UPDATING QUOTE EXTRAS
        unset($request['extra_description']);
        unset($request['extra_value']);

        //PLACE ID AT END OF ARRAY
        $wsId = $request['ws_id'];
        unset($request['ws_id']);

        $request['ws_id'] = $wsId;
        $columnsArray = array_keys($request);
        $columnString = '';

        for ($c=0; $c < sizeof($columnsArray)-1; $c++) {
            $columnString .= $columnsArray[$c]." = ?,";
        }

        $columnString = rtrim($columnString, ',');
        $valuesArray = array_values($request);

        $query = "UPDATE workspaces SET $columnString WHERE ws_id = ?";
        $this->connection->prepare($query)->execute($valuesArray);

        return 'OK';

    }
}
