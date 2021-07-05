<?php

namespace App\Domain\Bookings\Repository;

use PDO;

class BookingSwingDeleteRepository
{
    private $connection;

    public function __construct(PDO $connection)
    {
        $this->connection = $connection;
    }

    public function deleteSwing($swingId)
    {

        //dump($swingId);
        
        $sql = "UPDATE bookings SET BookingStatus = 'X' WHERE ShiftId = :ShiftId";
        $statement = $this->connection->prepare($sql);
        $statement->execute(['ShiftId' => $swingId]);

        return 'SHIFT SDELETED';

    }
}
