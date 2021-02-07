<?php

namespace App\Domain\Requests\Repository;

use PDO;
//use MongoDB\Client as Mongo;

class RequestFetchQuotesRepository
{
    private $connection;
    //private $mongo;

    public function __construct(
            PDO $connection 
            //Mongo $mongo
        )
    {
        $this->connection = $connection;
        //$this->mongo = $mongo;
    }

    public function getRequest($wsId)
    {
        //dump($wsId);

        $sql = "SELECT ws_quote_pdfs FROM workspaces WHERE ws_id = :ws_id;";
        $statement = $this->connection->prepare($sql);
        $statement->execute(['ws_id' => $wsId]);

        $request = $statement->fetch();

        return $request;
    }
}
