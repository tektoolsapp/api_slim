<?php

namespace App\Domain\Api\Repository;

use PDO;

class ApiBookingUpdateRepository
{
    private $connection;

    public function __construct(PDO $connection)
    {
        $this->connection = $connection;
    }

    public function updateBooking(array $shiftData)
    {
        
        //dump($shiftData);
        
        //'shift_id': _idController.text,
        //'shift_status': shiftUpdate

        $columnsArray = array_keys($shiftData);
        $columnString = '';

        for ($c = 0; $c < sizeof($columnsArray) - 1; $c++) {
            $columnString .= $columnsArray[$c] . " = ?,";
        }

        $columnString = rtrim($columnString, ',');
        $valuesArray = array_values($shiftData);

        $query = "UPDATE bookings SET $columnString WHERE ShiftId = ?";
        $this->connection->prepare($query)->execute($valuesArray);

        return "updated";


        /* $siteCode = $customerSite['site_code'];
        unset($customerSite['site_code']);
        $customerSite['site_code'] = $siteCode;
        $columnsArray = array_keys($customerSite);
        $columnString = '';

        for ($c=0; $c < sizeof($columnsArray)-1; $c++) {
            $columnString .= $columnsArray[$c]." = ?,";
        }

        $columnString = rtrim($columnString, ',');
        $valuesArray = array_values($customerSite);

        $query = "UPDATE customer_sites SET $columnString WHERE site_code = ?";
        $this->connection->prepare($query)->execute($valuesArray); */

        return 'OK';

    }
}
