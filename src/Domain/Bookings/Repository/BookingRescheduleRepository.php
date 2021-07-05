<?php

namespace App\Domain\Bookings\Repository;

use PDO;
use App\Domain\Utility\Service\PdoInsert;
use App\Domain\Bookings\Repository\BookingCheckConflictRepository;
use App\Domain\Requests\Repository\RequestUpdateShiftsRepository;
use App\Domain\Employees\Repository\EmployeesRepository;
use App\Domain\Utility\Service\CommonFunctions;

class BookingRescheduleRepository
{
    private $connection;
    private $pdoInsert;
    private $conflicts;
    private $updateShifts;
    private $employees;
    private $common;

    public function __construct(
            PDO $connection, 
            PdoInsert $pdoInsert, 
            BookingCheckConflictRepository $conflicts,
            RequestUpdateShiftsRepository $updateShifts,
            EmployeesRepository $employees,
            CommonFunctions $common
        )
    {
        $this->connection = $connection;
        $this->pdoInsert = $pdoInsert;
        $this->conflicts = $conflicts;
        $this->updateShifts = $updateShifts;
        $this->employees = $employees;
        $this->common = $common;
    }

    public function rescheduleBooking(array $data)
    {

        dump($data);

        $employeesLookup = $this->employees->getEmployees();
        
        $userId = $data['UserId'];
        $employeeDetails = $this->common->searchArray($employeesLookup, 'emp_id', $userId);
        $empType = $employeeDetails[0]['emp_type'];

        dump($empType);

        $reqId = $data['RequestId'];
        unset($data['RequestId']);

        $shiftId = $data['ShiftId'];
        unset($data['ShiftId']);

        $data['UserType'] = $empType;
        $data['ShiftId'] = $shiftId;

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

        //UPDATE THE SWINGS
        $sql = "SELECT COUNT(DISTINCT ShiftId) AS NumSwings FROM bookings WHERE 
            RequestID = :RequestID AND
            BookingStatus <> 'X'";
        $statement = $this->connection->prepare($sql);
        $statement->execute(['RequestID' => $reqId]);

        $numSwings = $statement->fetch();
 
        dump($numSwings);

        $sql = "SELECT COUNT(DISTINCT ShiftId) AS NumSwingsScheduled FROM bookings WHERE 
            UserType <> 'T' AND
            RequestID = :RequestID AND
            BookingStatus <> 'X'";
        $statement = $this->connection->prepare($sql);
        $statement->execute(['RequestID' => $reqId]);

        $numSwingsScheduled = $statement->fetch();

        dump($numSwingsScheduled);

        $shiftsArray = array(
            "ws_num_swings" => $numSwings['NumSwings'],
            "ws_num_scheduled" => $numSwingsScheduled['NumSwingsScheduled']
        );

        $shiftUpdate = $this->updateShifts->updateRequest($reqId, $shiftsArray);





        return "updated";

    }
}