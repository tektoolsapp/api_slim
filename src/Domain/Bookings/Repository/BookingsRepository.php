<?php

namespace App\Domain\Bookings\Repository;

use App\Domain\Utility\Service\ConvertValues;
use DomainException;
use PDO;
use MongoDB\Client as Mongo;

class BookingsRepository
{
    private $connection;
    private $mongo;
    private $convert;

    public function __construct(PDO $connection, Mongo $mongo, ConvertValues $convert)
    {
        $this->connection = $connection;
        $this->mongo = $mongo;
        $this->convert = $convert;

    }

    public function getBookings()
    {
        $sql = "SELECT * FROM bookings WHERE BookingStatus <> 'X'";
        $statement = $this->connection->prepare($sql);
        $statement->execute();

        $bookings = $statement->fetchAll(PDO::FETCH_ASSOC);

        $bookings = $this->convert->convertValues($bookings);

        //dump($bookings);

        return $bookings;
    }
}
