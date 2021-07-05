<?php

namespace App\Domain\Bookings\Repository;

use PDO;

class BookingsShiftDetsFetchRepository
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
        //dump("Shift ID");
        //dump($ShiftId);
       
        $sql = "SELECT * FROM bookings WHERE ShiftId = :ShiftId AND BookingStatus <> 'X';";
        $statement = $this->connection->prepare($sql);
        $statement->execute(['ShiftId' => $ShiftId]);

        $bookingsShifts = $statement->fetchAll(PDO::FETCH_ASSOC);

        $shiftDetails = array();

        for ($s = 0; $s < sizeof($bookingsShifts); $s++) {
            if($s == 0){
                $shiftStart = $bookingsShifts[$s]['StartDay'];
                //$thisMessageSent = $messages[$m]['message_sent'];
                $thisFormattedDate = date('D F j, Y',$shiftStart);
                $shiftStartFormatted = $thisFormattedDate;
                $thisFormattedStartDate = date('d-m-Y',$shiftStart);
            }

            $shiftType = $bookingsShifts[$s]['BookingType'];
            $shiftTradeType = $bookingsShifts[$s]['SwingTradeType'];
            $shiftAmPm = $bookingsShifts[$s]['AmPm'];
            $requestId = $bookingsShifts[$s]['RequestId'];
            $emp = $bookingsShifts[$s]['UserId'];
            $shiftEnd = $bookingsShifts[$s]['EndDay'];
        }

        $shiftDetails['req'] = $requestId;
        $shiftDetails['emp'] = $emp;
        $shiftDetails['start'] = $shiftStart;
        $shiftDetails['start_format'] = $shiftStartFormatted;
        $shiftDetails['start_date'] = $thisFormattedStartDate;
        $shiftDetails['end'] = $shiftEnd;
        $shiftDetails['ampm'] = $shiftAmPm;
        $shiftDetails['days'] = sizeof($bookingsShifts);
        $shiftDetails['type'] = $shiftType;
        $shiftDetails['trade'] = $shiftTradeType;

        return $shiftDetails;
    
    }

    private function compareBookings($a, $b){
        $retval = strnatcmp($a['trade_type'], $b['trade_type']);
        if(!$retval) $retval = strnatcmp($a['emp_name'], $b['emp_name']);
        if(!$retval) $retval = strnatcmp($a['StartDay'], $b['StartDay']);
        return $retval;
    }

}