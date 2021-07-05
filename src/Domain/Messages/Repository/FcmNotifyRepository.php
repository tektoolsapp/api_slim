<?php

namespace App\Domain\Messages\Repository;

use PDO;

class FcmNotifyRepository
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
        
        //dump($message);
        unset($message['emp_fcm_token']);

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

        //return (int)$this->connection->lastInsertId();

        //UPDATE THE SHIFT DETAILS

        //$notifiedDate = $strtotime(date('d-m-Y H:i'));

        $shiftUpdateArray = array(
            "EmployeeNotified" => 'Y',
            "EmployeeNotifiedDate" => $messageSent,
            "ShiftId" => $message['message_shift']
        );

        $columnsArray = array_keys($shiftUpdateArray);
        $columnString = '';

        for ($c=0; $c < sizeof($columnsArray)-1; $c++) {
            $columnString .= $columnsArray[$c]." = ?,";
        }

        $columnString = rtrim($columnString, ',');
        $valuesArray = array_values($shiftUpdateArray);

        /* $query = "UPDATE bookings SET $columnString WHERE ShiftId = ?";
        $this->connection->prepare($query)->execute($valuesArray); */

        //dump($columnString);
        //dump($valuesArray);

        try {
            $query = "UPDATE bookings SET $columnString WHERE ShiftId = ?";
            $this->connection->prepare($query)->execute($valuesArray);
        } catch(\PDOException $e) {
            //die("Oh noes! There's an error in the query!");
        }

        //dump($e);

        return 'OK';
        //return (int)$this->connection->lastInsertId();

    }
}
