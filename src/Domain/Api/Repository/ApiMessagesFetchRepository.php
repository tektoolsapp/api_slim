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

        $messageCount = 0;
        
        $sql = "SELECT * FROM messages WHERE message_to = :message_to AND message_status <> 'X'";
        $statement = $this->connection->prepare($sql);
        $statement->execute(['message_to' => $messageTo]);

        $messages = $statement->fetchAll(PDO::FETCH_ASSOC);

        //LOOP THROUGH MESSAGES AND FORMAY SENT DATE
        for ($m=0; $m < sizeof($messages); $m++) {
             
            $thisMessageSent = $messages[$m]['message_sent'];
            $thisFormattedDate = date('d-m-Y',$thisMessageSent);
            $messages[$m]['message_sent'] = $thisFormattedDate;

            $thisMessageStatus = $messages[$m]['message_status'];
            if($thisMessageStatus == 'P'){
                $messageCount++;
            }

        }    

        //return $messages;

        /* $returnArray = array(
            "data" => $messages
        );  */

        $returnArray = array(
            "status" => 201,
            "data" => $messages,
            "num_messages" => $messageCount
        );


        //$returnArray = array(
          //  "data" => $messages
       // ); 

        return $returnArray;
    }
}