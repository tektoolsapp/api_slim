<?php

namespace App\Domain\Bookings\Repository;

use PDO;
use App\Domain\Utility\Service\PdoInsert;
use App\Domain\Bookings\Repository\BookingCheckConflictRepository;


class BookingRescheduleRepository
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

    public function rescheduleBooking(array $data)
    {

        dump($data);
        
        $columnsArray = array_keys($data);
        $columnString = '';

        for ($c = 0; $c < sizeof($columnsArray) - 1; $c++) {
            $columnString .= $columnsArray[$c] . " = ?,";
        }

        $columnString = rtrim($columnString, ',');
        $valuesArray = array_values($data);

        $query = "UPDATE bookings SET $columnString WHERE ShiftId = ?";
        $this->connection->prepare($query)->execute($valuesArray);


        return "updated";

    }
}