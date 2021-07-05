<?php

namespace App\Domain\Travel\Repository;

use PDO;

class TravelDeleteRepository
{
    private $connection;

    public function __construct(
        PDO $connection
    )
    {
        $this->connection = $connection;
    }

    public function deleteTravelDoc($docId)
    {
        //dump($docId);
        
        //GET THE DOC DETAILS
        
        $sql = "SELECT * FROM travel_docs WHERE td_id = :td_id";
        $statement = $this->connection->prepare($sql);
        $statement->execute(['td_id' => $docId]);

        $travelDoc = $statement->fetch();

        dump($travelDoc);

        //REMOVE THE DOC

        $newDocId = $travelDoc['td_id'];
        unset($travelDoc['td_id']);
        unset($travelDoc['td_swing']);
        unset($travelDoc['td_uploaded']);
        $travelDoc['td_status'] = 'X';
        $travelDoc['td_id'] = $newDocId;
        $columnsArray = array_keys($travelDoc);
        $columnString = '';

        for ($c=0; $c < sizeof($columnsArray)-1; $c++) {
            $columnString .= $columnsArray[$c]." = ?,";
        }

        $columnString = rtrim($columnString, ',');
        $valuesArray = array_values($travelDoc);

        $query = "UPDATE travel_docs SET $columnString WHERE td_id = ?";
        $this->connection->prepare($query)->execute($valuesArray);

        $fileToUnset = $travelDoc['td_filename'];

        $pathToUnset = "travel_docs/".$fileToUnset;

        dump($pathToUnset);

        unlink($pathToUnset);


        return 'DELETED';

    }
}