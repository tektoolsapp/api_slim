<?php

namespace App\Domain\Bookings\Repository;

use PDO;

class BookingsEmpFetchRepository
{
    private $connection;
    
    public function __construct(
        PDO $connection
    )
    {
        $this->connection = $connection;
    }

    public function getBookingsEmp($EmpId)
    {
        dump("Emp ID");
        dump($EmpId);
       
        $sql = "SELECT * FROM bookings WHERE EmpId = :UserId AND BookingStatus <> 'X';";
        $statement = $this->connection->prepare($sql);
        $statement->execute(['UserId' => $EmpId]);

        $bookingsEmp = $statement->fetchAll(PDO::FETCH_ASSOC);
        return $bookingsEmp;
    }

    private function compareBookings($a, $b){
        $retval = strnatcmp($a['trade_type'], $b['trade_type']);
        if(!$retval) $retval = strnatcmp($a['emp_name'], $b['emp_name']);
        if(!$retval) $retval = strnatcmp($a['StartDay'], $b['StartDay']);
        return $retval;
    }

}