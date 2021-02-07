<?php

namespace App\Domain\Utility\Repository;

use PDO;
//use MongoDB\Client as Mongo;

class RecordCountRepository
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

    public function getRecordCount()
    {
        $sql = "SELECT count(*) FROM workspaces WHERE ws_type = 'request'";
        $statement = $this->connection->prepare($sql);
        $statement->execute();

        $totalRecords = $statement->fetch(PDO::FETCH_NUM);

        return $totalRecords;
    }
}