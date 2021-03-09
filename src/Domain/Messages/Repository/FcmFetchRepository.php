<?php

namespace App\Domain\Messages\Repository;

use PDO;

class FcmFetchRepository
{
    private $connection;
    private $skills;
    private $trades;

    public function __construct(
        PDO $connection
    )
    {
        $this->connection = $connection;
    }

    public function getMessages($messageTo)
    {

        $sql = "SELECT * FROM messages WHERE message_to = :message_to";
        $statement = $this->connection->prepare($sql);
        $statement->execute(['message_to' => $messageTo]);

        $messages = $statement->fetchAll(PDO::FETCH_ASSOC);

        return $messages;
    }
}