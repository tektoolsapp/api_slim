<?php

namespace App\Domain\Requests\Repository;

use PDO;

class RequestShiftFetchRepository
{
    private $connection;
    
    public function __construct(
        PDO $connection
    )
    {
        $this->connection = $connection;
    }

    public function getRequestShifts($reqId)
    {
        
        $sql = "SELECT * FROM bookings WHERE RequestId = :RequestId AND BookingStatus <> 'X';";
        $statement = $this->connection->prepare($sql);
        $statement->execute(['RequestId' => $reqId]);
        $bookingsShifts = $statement->fetchAll(PDO::FETCH_ASSOC);

        usort($bookingsShifts,array($this,'compareBookings'));  
        
        $numNotified = 0;
        $numDelivered = 0;
        $numconfirmed = 0;

        for ($b = 0; $b < sizeof($bookingsShifts); $b++) {

            $shiftId = $bookingsShifts[$b]['ShiftId'];

            if($shiftId != $bookingsShifts[$b+1]['ShiftId']){
                
                $thisNumNotified = $bookingsShifts[$b]['EmployeeNotified'];
                if($thisNumNotified == 'Y'){
                    $numNotified = $numNotified + 1;
                }
                
                $thisNumDelivered = $bookingsShifts[$b]['MessageDelivered'];
                if($thisNumDelivered == 'Y'){
                    $numDelivered = $numDelivered + 1;
                }

                $thisNumConfirmed = $bookingsShifts[$b]['EmployeeConfirmed'];
                if($thisNumConfirmed == 'Y'){
                    $numConfirmed = $numConfirmed + 1;
                }
            }
        }   

        $cumArray = array(
            "num_notified" => $numNotified,
            "num_delivered" => $numDelivered,
            "num_confirmed" => $numConfirmed
        );

        return $cumArray;
    }

    private function compareBookings($a, $b){
        $retval = strnatcmp($a['ShiftId'], $b['ShiftId']);
        if(!$retval) $retval = strnatcmp($a['StartDay'], $b['StartDay']);
        return $retval;
    }

}