<?php

namespace App\Domain\Requests\Repository;

//use DomainException;
use PDO;
use MongoDB\Client as Mongo;

class RequestFetchRepository
{
    private $connection;
    private $mongo;

    public function __construct(PDO $connection, Mongo $mongo)
    {
        $this->connection = $connection;
        $this->mongo = $mongo;
    }

    public function getRequest($wsId)
    {
        //dump($wsId);

        $sql = "SELECT * FROM workspaces WHERE ws_id = :ws_id;";
        $statement = $this->connection->prepare($sql);
        $statement->execute(['ws_id' => $wsId]);

        $request = $statement->fetch();

        /*
        if (!$request) {
            throw new DomainException(sprintf('Request not found: %s', $requestId));
        }
        */

        return $request;
    }
}
