<?php

namespace App\Domain\Bookings\Repository;

use PDO;
use App\Domain\Utility\Service\PdoInsert;

class BookingsDeleteRepository
{
    private $connection;
    private $pdoInsert;

    public function __construct(PDO $connection, PdoInsert $pdoInsert)
    {
        $this->connection = $connection;
        $this->pdoInsert = $pdoInsert;
    }

    public function deleteBookings($deleteType, $deleteId)
    {
        //$batchId = $deletionData['delete_batch_id'];
        //sdump($deletionData);

        if($deleteType == 'request'){
            $sql = "UPDATE bookings SET BookingStatus = 'X' WHERE RequestId = :RequestId";
            $statement = $this->connection->prepare($sql);
            $statement->execute(['RequestId' => $deleteId]);
        
        } else if($deleteType == 'batch'){
            $sql = "UPDATE bookings SET BookingStatus = 'X' WHERE BatchId = :BatchId";
            $statement = $this->connection->prepare($sql);
            $statement->execute(['BatchId' => $deleteId]);
        
        } else if($deleteType == 'shift'){
            $sql = "UPDATE bookings SET BookingStatus = 'X' WHERE ShiftId = :ShiftId";
            $statement = $this->connection->prepare($sql);
            $statement->execute(['ShiftId' => $deleteId]);
        }
        
        $returnArray = array(
            "delete_type" => $deleteType,
            "delete_id" => $deleteId,
            "status" => 'DELETED'
        );
 
        return $returnArray;

        //return $batchId;

    }
}
