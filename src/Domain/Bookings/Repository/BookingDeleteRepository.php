<?php

namespace App\Domain\Bookings\Repository;

use PDO;
use App\Domain\Utility\Service\PdoInsert;

class BookingDeleteRepository
{
    private $connection;
    private $pdoInsert;

    public function __construct(PDO $connection, PdoInsert $pdoInsert)
    {
        $this->connection = $connection;
        $this->pdoInsert = $pdoInsert;
    }

    public function deleteBooking(array $booking)
    {
        $bookingId = $booking['BookingId'];

        $sql = "UPDATE bookings SET BookingStatus = 'X' WHERE BookingId = :BookingId";
        $statement = $this->connection->prepare($sql);
        $statement->execute(['BookingId' => $bookingId]);

        return 'DELETED';

    }
}
