<?php

namespace App\Domain\Requests\Repository;

use DomainException;
use PDO;
use MongoDB\Client as Mongo;

class RequestSchedulerRawRepository
{
    private $connection;
    private $mongo;

    public function __construct(PDO $connection, Mongo $mongo)
    {
        $this->connection = $connection;
        $this->mongo = $mongo;
    }

    public function getRequest($request)
    {

        $sql = "SELECT ws_id FROM workspaces WHERE ws_id = :ws_id;";
        $statement = $this->connection->prepare($sql);
        $statement->execute(['ws_id' => $request]);

        $request = $statement->fetch();

        if (!$request) {
            throw new DomainException(sprintf('Customer not found: %s', $customerId));
        }

        return $request;
    }
}