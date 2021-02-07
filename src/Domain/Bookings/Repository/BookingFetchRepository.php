<?php

namespace App\Domain\Bookings\Repository;

use PDO;
//use MongoDB\Client as Mongo;
//use App\Domain\Employees\Repository\EmployeesRepository;
//use App\Domain\Employees\Repository\TradesRepository;
//use App\Domain\Utility\Service\CommonFunctions;

class BookingFetchRepository
{
    private $connection;
    //private $mongo;
    //private $employees;
    //private $trades;
    //private $common;

    public function __construct(
        PDO $connection
        //Mongo $mongo
        //EmployeesRepository $employees,
        //TradesRepository $trades,
        //CommonFunctions $common
    )
    {
        $this->connection = $connection;
        //$this->mongo = $mongo;
        //$this->employees = $employees;
        //$this->trades = $trades;
        //$this->common = $common;
    }

    public function getBooking($bookingId)
    {
        //$employees = $this->employees->getEmployees();
        //$trades = $this->trades->getTrades();

        $sql = "SELECT * FROM bookings WHERE BookingId = :BookingId AND BookingStatus <> 'X';";
        $statement = $this->connection->prepare($sql);
        $statement->execute(['BookingId' => $bookingId]);

        $booking = $statement->fetch();

        //ADD/UPDATE EMPLOYEE FIELDS AS REQUIRED
        /*
        for ($b=0; $b < sizeof($bookingsRequest); $b++) {

            //EMPLOYEE LOOKUP
            $employee = $bookingsRequest[$b]['UserId'];
            $employeeLookup = $this->common->searchArray($employees, 'emp_id', $employee);
            $tradeType = $employeeLookup[0]['trade_type'];
            $empFirstName = $employeeLookup[0]['first_name'];
            $empLastName = $employeeLookup[0]['last_name'];
            $empName = $empFirstName." ".$empLastName;
            $bookingsRequest[$b]['emp_name'] = $empName;
            //TRADE TYPE LOOKUP
            $tradeLookup = $this->common->searchArray($trades, 'trade_code', $tradeType);
            $tradeDesc = $tradeLookup[0]['trade_desc'];
            $bookingsRequest[$b]['trade_type'] = $tradeDesc;

            date_default_timezone_set('Australia/West');

            $startDateTime = $bookingsRequest[$b]['Start'];
            $startDateTimeStr = strtotime($startDateTime);
            $startDateFormat = date("d-m-Y", $startDateTimeStr);
            $startTimeFormat = date("h:m A", $startDateTimeStr);

            $bookingsRequest[$b]['start_date'] = $startDateFormat;
            $bookingsRequest[$b]['start_time'] = $startTimeFormat;

            $endDateTime = $bookingsRequest[$b]['End'];
            $endDateTimeStr = strtotime($endDateTime);
            $endDateFormat = date("d-m-Y", $endDateTimeStr);
            $endTimeFormat = date("h:m A", $endDateTimeStr);

            $bookingsRequest[$b]['end_date'] = $endDateFormat;
            $bookingsRequest[$b]['end_time'] = $endTimeFormat;

        }
        
        //ORDER THE ARRAY
        usort($bookingsRequest,array($this,'compareBookings'));

        */

        return $booking;
    }

    private function compareBookings($a, $b){
        $retval = strnatcmp($a['trade_type'], $b['trade_type']);
        if(!$retval) $retval = strnatcmp($a['emp_name'], $b['emp_name']);
        if(!$retval) $retval = strnatcmp($a['StartDay'], $b['StartDay']);
        return $retval;
    }

}