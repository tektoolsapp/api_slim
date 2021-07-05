<?php

namespace App\Domain\Bookings\Repository;

use PDO;
use App\Domain\Employees\Repository\EmployeesRepository;
use App\Domain\Employees\Repository\TradesRepository;
use App\Domain\Utility\Service\CommonFunctions;

class BookingsBatchFetchRepository
{
    private $connection;
    private $employees;
    private $trades;
    private $common;

    public function __construct(
        PDO $connection,
        EmployeesRepository $employees,
        TradesRepository $trades,
        CommonFunctions $common
    )
    {
        $this->connection = $connection;
        $this->employees = $employees;
        $this->trades = $trades;
        $this->common = $common;
    }

    public function getBookingsBatch($batchId)
    {
        $employees = $this->employees->getEmployees();
        $trades = $this->trades->getTrades();

        //dump("BATCH ID");
        //dump($batchId);
       
        $sql = "SELECT * FROM bookings WHERE BatchId = :BatchId AND BookingStatus <> 'X';";
        $statement = $this->connection->prepare($sql);
        $statement->execute(['BatchId' => $batchId]);

        $bookingsBatch = $statement->fetchAll(PDO::FETCH_ASSOC);

        //ADD/UPDATE EMPLOYEE FIELDS AS REQUIRED
        for ($b=0; $b < sizeof($bookingsBatch); $b++) {

            //EMPLOYEE LOOKUP
            $employee = $bookingsBatch[$b]['UserId'];
            $employeeLookup = $this->common->searchArray($employees, 'emp_id', $employee);
            $tradeType = $employeeLookup[0]['trade_type'];
            $empFirstName = $employeeLookup[0]['first_name'];
            $empLastName = $employeeLookup[0]['last_name'];
            $empName = $empFirstName." ".$empLastName;
            $bookingsBatch[$b]['emp_name'] = $empName;
            //TRADE TYPE LOOKUP
            $tradeLookup = $this->common->searchArray($trades, 'trade_code', $tradeType);
            $tradeDesc = $tradeLookup[0]['trade_desc'];
            $bookingsBatch[$b]['trade_type'] = $tradeDesc;

            date_default_timezone_set('Australia/West');

            $startDateTime = $bookingsBatch[$b]['Start'];
            $startDateTimeStr = strtotime($startDateTime);
            $startDateFormat = date("d-m-Y", $startDateTimeStr);
            $startTimeFormat = date("h:m A", $startDateTimeStr);

            $bookingsBatch[$b]['start_date'] = $startDateFormat;
            $bookingsBatch[$b]['start_time'] = $startTimeFormat;

            $endDateTime = $bookingsBatch[$b]['End'];
            $endDateTimeStr = strtotime($endDateTime);
            $endDateFormat = date("d-m-Y", $endDateTimeStr);
            $endTimeFormat = date("h:m A", $endDateTimeStr);

            $bookingsBatch[$b]['end_date'] = $endDateFormat;
            $bookingsBatch[$b]['end_time'] = $endTimeFormat;

        }
        
        //ORDER THE ARRAY
        usort($bookingsBatch,array($this,'compareBookings'));

        return $bookingsBatch;
    }

    private function compareBookings($a, $b){
        $retval = strnatcmp($a['trade_type'], $b['trade_type']);
        if(!$retval) $retval = strnatcmp($a['emp_name'], $b['emp_name']);
        if(!$retval) $retval = strnatcmp($a['StartDay'], $b['StartDay']);
        return $retval;
    }

}