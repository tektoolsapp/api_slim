<?php

namespace App\Domain\Requests\Repository;

use PDO;
use MongoDB\Client as Mongo;

class RequestsRepository
{
    private $connection;
    private $mongo;
    private $convert;

    public function __construct(PDO $connection, Mongo $mongo)
    {
        $this->connection = $connection;
        $this->mongo = $mongo;
    }

    public function getRequests($page)
    {
        //dump($page);

        $limit = 100;

        if (isset($page)) {
            $page_no = $page;
        }else{
            $page_no = 1;
        }

        $offset = ($page_no-1) * $limit;

        $sql = "SELECT * FROM workspaces WHERE ws_type = 'request'
            LIMIT $offset, $limit";
        $statement = $this->connection->prepare($sql);
        $statement->execute();

        $requests = $statement->fetchAll(PDO::FETCH_ASSOC);

        return $requests;
    }
}