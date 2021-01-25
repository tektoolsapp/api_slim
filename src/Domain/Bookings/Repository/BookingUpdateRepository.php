<?php

namespace App\Domain\Bookings\Repository;

use PDO;
use App\Domain\Utility\Service\PdoInsert;

class BookingUpdateRepository
{
    private $connection;
    private $pdoInsert;

    public function __construct(PDO $connection, PdoInsert $pdoInsert)
    {
        $this->connection = $connection;
        $this->pdoInsert = $pdoInsert;
    }

    public function updateBooking(array $booking)
    {

        //dump($booking);

        $bookingId = $booking['BookingId'];
        unset($booking['BookingId']);
        $booking['UserId'] = implode(",",$booking['UserId']);
        $booking['BookingId'] = $bookingId;
        if($booking['IsAllDay'] == false){
            $booking['IsAllDay'] = 0;
        } else {
            $booking['IsAllDay'] = 1;
        }

        $booking['RecurrenceRule'] = '';

        $columnsArray = array_keys($booking);
        $columnString = '';

        for ($c=0; $c < sizeof($columnsArray)-1; $c++) {
            $columnString .= $columnsArray[$c]." = ?,";
        }

        $columnString = rtrim($columnString, ',');
        $valuesArray = array_values($booking);

        $query = "UPDATE bookings SET $columnString WHERE BookingId = ?";
        $this->connection->prepare($query)->execute($valuesArray);

        return 'OK';

    }
}
