<?php

namespace App\Domain\Messages\Repository;
use PDO;

class MessageUpdateRepository
{
    private $connection;

    public function __construct(
            PDO $connection
        )
    {
        $this->connection = $connection;
    }

    public function updateMessage(array $message)
    {
        //dump($message);

        $messageId = $message['message_id'];
        unset($message['message_id']);
        $message['message_id'] = $messageId;

        $messageTo = $message['message_to'];
        unset($message['message_to']);

        $columnsArray = array_keys($message);
        $columnString = '';

        for ($c=0; $c < sizeof($columnsArray)-1; $c++) {
            $columnString .= $columnsArray[$c]." = ?,";
        }

        $columnString = rtrim($columnString, ',');
        $valuesArray = array_values($message);

        $query = "UPDATE messages SET $columnString WHERE message_id = ?";
        $this->connection->prepare($query)->execute($valuesArray);

        //COUNT
        $sql = "SELECT COUNT(DISTINCT message_id) AS NumMessages FROM messages WHERE 
            message_to = $messageTo AND
            message_type = 'U' AND
            message_status = 'P' 
        ";
        $statement = $this->connection->prepare($sql);
        $statement->execute();

        $numMessages = $statement->fetch();

        $_SESSION['num_messages'] = $numMessages['NumMessages'];

        //dump($numMessages);

        $returnArray = array(
            "update_status" => 'OK',
            "num_messages" => $numMessages['NumMessages']
        );

        return $returnArray;

    }
}

