<?php

namespace App\Domain\Bookings\Repository;

//use App\Domain\Utility\Service\ConvertValues;
use DomainException;
use PDO;
use MongoDB\Client as Mongo;

class BookingsAvailabilityRepository
{
    private $connection;
    private $mongo;
    private $convert;

    public function __construct(PDO $connection, Mongo $mongo)
    {
        $this->connection = $connection;
        $this->mongo = $mongo;

    }

    public function getBookings()
    {
        $sql = "SELECT * FROM bookings";
        $statement = $this->connection->prepare($sql);
        $statement->execute();

        $bookings = $statement->fetchAll(PDO::FETCH_ASSOC);

        //dump($bookings);

        if (!$bookings) {
            throw new DomainException(sprintf('No Bookings found: %s', ""));
        }

        return $bookings;
    }
}