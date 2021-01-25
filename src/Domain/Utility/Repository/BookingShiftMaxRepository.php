<?php

namespace App\Domain\Utility\Repository;

use PDO;
use MongoDB\Client as Mongo;

class BookingShiftMaxRepository
{
    private $connection;
    private $mongo;

    public function __construct(PDO $connection, Mongo $mongo)
    {
        $this->connection = $connection;
        $this->mongo = $mongo;
    }

    public function getMaxShift()
    {
        $sql = "SELECT MAX(ShiftId) as ShiftId FROM bookings";
        $statement = $this->connection->prepare($sql);
        $statement->execute();

        $maxShift = $statement->fetch(PDO::FETCH_NUM);

        return $maxShift;
    }
}