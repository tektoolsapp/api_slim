<?php

namespace App\Domain\Bookings\Repository;

use PDO;
use App\Domain\Utility\Service\PdoInsert;
use App\Domain\Bookings\Repository\BookingCheckConflictRepository;


class BookingUpdateRepository
{
    private $connection;
    private $pdoInsert;
    private $conflicts;

    public function __construct(PDO $connection, PdoInsert $pdoInsert, BookingCheckConflictRepository $conflicts)
    {
        $this->connection = $connection;
        $this->pdoInsert = $pdoInsert;
        $this->conflicts = $conflicts;
    }

    public function updateBooking(array $booking)
    {

        //dump($booking);

        //$booking['StartDay'] = strtotime($booking['Start']);
        //$booking['EndDay'] = strtotime($booking['End']);

        date_default_timezone_set('Australia/West');

        $startDay = strtotime($booking['Start']);
        $endDay = strtotime($booking['End']);
        
        $booking['StartDay'] = $startDay;
        $booking['EndDay'] = $endDay;

        //SET THE BOOKING SHIFT TIME
        $bookingTime = date("H:i A", $startDay);
        $bookingTimeArray = explode(" ", $bookingTime);
        $bookingTime = $bookingTimeArray[1];

        $booking['AmPm'] = $bookingTime;

        //dump($bookingTime);

        //$bookingId = mt_rand(100000, 999999);
        //$booking['BookingId'] = $bookingId;
        
        $booking['UserId'] = implode(",",$booking['UserId']);

        $bookingId = $booking['BookingId'];

        //dump($bookingId);

        unset($booking['BookingId']);
        //$booking['UserId'] = implode(",", $booking['UserId']);
        
        $booking['BookingId'] = $bookingId;
        
        if ($booking['IsAllDay'] == false) {
            $booking['IsAllDay'] = 0;
        } else {
            $booking['IsAllDay'] = 1;
        }

        $booking['RecurrenceRule'] = '';

        $columnsArray = array_keys($booking);
        $columnString = '';

        for ($c = 0; $c < sizeof($columnsArray) - 1; $c++) {
            $columnString .= $columnsArray[$c] . " = ?,";
        }

        $columnString = rtrim($columnString, ',');
        $valuesArray = array_values($booking);

        $query = "UPDATE bookings SET $columnString WHERE BookingId = ?";
        $this->connection->prepare($query)->execute($valuesArray);

        $booking['UserId'] = explode(",",$booking['UserId']);

        return $booking;

    }
}