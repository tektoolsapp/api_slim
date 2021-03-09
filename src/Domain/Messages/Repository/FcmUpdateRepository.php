<?php

namespace App\Domain\Messages\Repository;

use PDO;

class FcmUpdateRepository
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
        dump($message);

        $messageId = $employee['message_id'];
        unset($message['message_id']);
        $message['message_id'] = $messageId;

        $columnsArray = array_keys($message);
        $columnString = '';

        for ($c=0; $c < sizeof($columnsArray)-1; $c++) {
            $columnString .= $columnsArray[$c]." = ?,";
        }

        $columnString = rtrim($columnString, ',');
        $valuesArray = array_values($employee);

        $query = "UPDATE messages SET $columnString WHERE message_id = ?";
        $this->connection->prepare($query)->execute($valuesArray);

        return 'OK';

    }
}

