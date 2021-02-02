<?php

namespace App\Domain\Utility\Repository;

use PDO;
use MongoDB\Client as Mongo;

class RequestRefMaxRepository
{
    private $connection;
    private $mongo;

    public function __construct(PDO $connection, Mongo $mongo)
    {
        $this->connection = $connection;
        $this->mongo = $mongo;
    }

    public function getMaxRef()
    {
        $sql = "SELECT MAX(ws_ref) as wsRef FROM workspaces";
        $statement = $this->connection->prepare($sql);
        $statement->execute();

        $maxRef = $statement->fetch(PDO::FETCH_NUM);

        return $maxRef;
    }
}