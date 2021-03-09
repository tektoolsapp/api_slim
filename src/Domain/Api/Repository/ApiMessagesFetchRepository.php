<?php

namespace App\Domain\Api\Repository;

use PDO;
use Firebase\JWT\JWT;

class ApiMessagesFetchRepository
{
    private $connection;

    public function __construct(
        PDO $connection
    )
    {
        $this->connection = $connection;
    }

    public function getApiMessages($messageTo)
    {

        $sql = "SELECT * FROM messages WHERE message_to = :message_to";
        $statement = $this->connection->prepare($sql);
        $statement->execute(['message_to' => $messageTo]);

        $messages = $statement->fetchAll(PDO::FETCH_ASSOC);

        //return $messages;

        $returnArray = array(
            "data" => $messages
        ); 


        //$returnArray = array(
          //  "data" => $messages
       // ); 

        return $returnArray;
    }
}