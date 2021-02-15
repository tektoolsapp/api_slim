<?php

namespace App\Domain\Bookings\Repository;

use PDO;

class BookingsShiftFetchRepository
{
    private $connection;
    
    public function __construct(
        PDO $connection
    )
    {
        $this->connection = $connection;
    }

    public function getBookingsShift($ShiftId)
    {
        dump("Shift ID");
        dump($ShiftId);
       
        $sql = "SELECT * FROM bookings WHERE ShiftId = :ShiftId AND BookingStatus <> 'X';";
        $statement = $this->connection->prepare($sql);
        $statement->execute(['ShiftId' => $ShiftId]);

        $bookingsShift = $statement->fetchAll(PDO::FETCH_ASSOC);
        return $bookingsShift;
    }

    private function compareBookings($a, $b){
        $retval = strnatcmp($a['trade_type'], $b['trade_type']);
        if(!$retval) $retval = strnatcmp($a['emp_name'], $b['emp_name']);
        if(!$retval) $retval = strnatcmp($a['StartDay'], $b['StartDay']);
        return $retval;
    }

}