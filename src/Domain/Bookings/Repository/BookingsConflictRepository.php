<?php

namespace App\Domain\Bookings\Repository;

use PDO;
use MongoDB\Client as Mongo;
use App\Domain\Employees\Repository\EmployeesRepository;
//use App\Domain\Employees\Repository\TradesRepository;
use App\Domain\Utility\Service\CommonFunctions;

class BookingsConflictRepository
{
    private $connection;
    private $mongo;
    private $employees;
    //private $trades;
    private $common;

    public function __construct(
        PDO $connection,
        Mongo $mongo,
        EmployeesRepository $employees,
        //TradesRepository $trades,
        CommonFunctions $common
    )
    {
        $this->connection = $connection;
        $this->mongo = $mongo;
        $this->employees = $employees;
        //$this->trades = $trades;
        $this->common = $common;
    }

    public function getBookingConflicts(
            $bookingDetails
        )
    {
        $employees = $this->employees->getEmployees();
        //$trades = $this->trades->getTrades();

        $bookingId = $bookingDetails['booking_id'];
        $userId = $bookingDetails['user_id'];
        $Start = $bookingDetails['start'];
        $End = $bookingDetails['end'];

        //date_default_timezone_set('Australia/West');

        $StartDay = strtotime($Start);
        $EndDay = strtotime($End);
        //$userId = $userId;

        //dump("BOOKING ID: ".$bookingId);
        //dump("USER ID: ".$userId);
        //dump("START DAY: ".$StartDay);
        //dump("END DAY: ".$EndDay);

        $sql = "SELECT UserId, BookingId, StartDay, Title FROM bookings WHERE BookingId <> :BookingId AND UserId = :UserId AND BookingStatus <> 'X' AND
          (
            (StartDay > :StartDay AND EndDay > :EndDay AND EndDay > :EndDay AND StartDay <  :EndDay)
            OR (StartDay < :StartDay AND EndDay < :EndDay AND EndDay >  :StartDay)
            OR (StartDay <= :StartDay AND EndDay > :EndDay)
            OR (StartDay < :StartDay AND EndDay >= :EndDay)
            OR (StartDay > :StartDay AND EndDay <= :EndDay)
            OR (StartDay >= :StartDay AND EndDay < :EndDay)
            OR (StartDay = :StartDay AND EndDay = :EndDay)
         )
         ";
        $statement = $this->connection->prepare($sql);
        $statement->bindParam(':BookingId', $bookingId, PDO::PARAM_STR);
        $statement->bindParam(':UserId', $userId, PDO::PARAM_STR);
        $statement->bindParam(':StartDay', $StartDay, PDO::PARAM_STR);
        $statement->bindParam(':EndDay', $EndDay, PDO::PARAM_STR);
        $statement->execute();

        $conflicts = $statement->fetchAll(PDO::FETCH_ASSOC);

        for ($c = 0; $c < sizeof($conflicts); $c++) {
            $startDay = $conflicts[$c]['StartDay'];
            $startDayFormat = date("d-m-Y", $startDay);
            $conflicts[$c]['StartDay'] = $startDayFormat;

            $userId = $conflicts[$c]['UserId'];
            $employeeLookup = $this->common->searchArray($employees, 'emp_id', $userId);
            $empName = $employeeLookup[0]['first_name']." ".$employeeLookup[0]['last_name'];
            $conflicts[$c]['UserId'] = $empName;
        }

        return $conflicts;

    }

}