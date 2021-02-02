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

        $booking['StartDay'] = strtotime($booking['Start']);
        $booking['EndDay'] = strtotime($booking['End']);

        $bookingId = $booking['BookingId'];

        //CHECK FOR CONFLICTS

        /*
        $conflicts = $this->conflicts->getConflicts(
            $bookingId,
            $booking['UserId'],
            $booking['Start'],
            $booking['End']
        );
        */

        //dump($conflicts);

        //if(empty($conflicts)) {

            unset($booking['BookingId']);
            $booking['UserId'] = implode(",", $booking['UserId']);
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

            //return 'OK';

        return $booking;

        /*
        } else {
                return $conflicts;
            }
        */

    }
}
