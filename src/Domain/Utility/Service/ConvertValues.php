<?php

namespace App\Domain\Utility\Service;

class ConvertValues
{
    public function convertValues($bookings)
    {
        for ($b=0; $b < sizeof($bookings); $b++) {

            $bookings[$b]['UserId'] = explode(",", $bookings[$b]['UserId']);

            if(!$bookings[$b]['IsAllDay']){
                $bookings[$b]['IsAllDay'] = false;
            } else {
                $bookings[$b]['IsAllDay'] = true;
            }

            $booking['RecurrenceRule'] = '';

        }

        return $bookings;
    }
}