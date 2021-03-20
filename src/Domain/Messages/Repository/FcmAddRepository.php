<?php

namespace App\Domain\Messages\Repository;

use PDO;

class FcmAddRepository
{
    private $connection;
    private $trades;
    private $common;

    public function __construct(
            PDO $connection
        )
    {
        $this->connection = $connection;
    }

    public function insertMessage(array $message)
    {
        
        dump($message);

        date_default_timezone_set('Australia/West');

        $now = new \DateTime();
        $messageSent = $now->getTimestamp(); 
        $message['message_sent'] = $messageSent;
        $message['message_status'] = "P";    
        
        $columnsArray = array_keys($message);
        $columnsString = implode(',', $columnsArray);
        $valuesArray = array_values($message);
        $valuesCount = count($valuesArray);

        $valuesPlaceholder = '';
        for ($i=0; $i < $valuesCount; $i++) {
            $valuesPlaceholder .= '?,';
        }
        $valuesPlaceholder = rtrim($valuesPlaceholder, ',');

        $query = "INSERT INTO messages ($columnsString) VALUES ($valuesPlaceholder)";
        $this->connection->prepare($query)->execute($valuesArray);

        return (int)$this->connection->lastInsertId();

    }
}
