<?php

namespace App\Domain\Travel\Repository;

use PDO;

class TravelFetchRepository
{
    private $connection;

    public function __construct(
        PDO $connection
    )
    {
        $this->connection = $connection;
    }

    public function getTravelDocs($swingId)
    {
        //dump($swingId);
        
        $sql = "SELECT * FROM travel_docs WHERE td_swing = :td_swing AND td_status <> 'X'";
        $statement = $this->connection->prepare($sql);
        $statement->execute(['td_swing' => $swingId]);

        $travelDocs = $statement->fetchAll(PDO::FETCH_ASSOC);

        //dump($travelDocs);

        return $travelDocs;
    }
}