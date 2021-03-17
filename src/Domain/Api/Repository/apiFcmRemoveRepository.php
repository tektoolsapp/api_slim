<?php

namespace App\Domain\Api\Repository;

use PDO;

class ApiFcmRemoveRepository
{
    private $connection;

    public function __construct(
            PDO $connection
        )
    {
        $this->connection = $connection;
    }

    public function removeMessage(array $message)
    {
        //dump($message);
        
        $messageId = $message['message_id'];
        unset($message['message_id']);
        $message['message_id'] = $messageId;
        
        $columnsArray = array_keys($message);
        $columnString = '';

        for ($c=0; $c < sizeof($columnsArray)-1; $c++) {
            $columnString .= $columnsArray[$c]." = ?,";
        }

        $columnString = rtrim($columnString, ',');
        $valuesArray = array_values($message);

        try {
            $query = "UPDATE messages SET $columnString WHERE message_id = ?";
            $this->connection->prepare($query)->execute($valuesArray);
        } catch(\PDOException $e) {
            //die("Oh noes! There's an error in the query!");
        }

        //dump($e);
        
        if($e){
            $result = $e->getMessage();
            $responseCode = 400;
        } else {
            $result = "ok";
            $responseCode = 201;
        }

        $test = array(
            "status" => $responseCode,
            "payload" => array(
                "result" => $result
            )
        );

        return $test;    
        
    }
}

