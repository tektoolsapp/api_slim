<?php

namespace App\Domain\Bookings\Repository;

use PDO;
//use MongoDB\Client as Mongo;
use App\Domain\Employees\Repository\EmployeesRepository;
use App\Domain\Employees\Repository\TradesRepository;
use App\Domain\Utility\Service\CommonFunctions;

class BookingsShiftsRequestFetchRepository
{
    private $connection;
    //private $mongo;
    private $employees;
    private $trades;
    private $common;

    public function __construct(
        PDO $connection,
        //Mongo $mongo,
        EmployeesRepository $employees,
        TradesRepository $trades,
        CommonFunctions $common
    )
    {
        $this->connection = $connection;
        //$this->mongo = $mongo;
        $this->employees = $employees;
        $this->trades = $trades;
        $this->common = $common;
    }

    public function getBookingsShiftsRequest($reqId)
    {
        $employees = $this->employees->getEmployees();
        $trades = $this->trades->getTrades();

        $sql = "SELECT * FROM bookings WHERE RequestId = :RequestId AND BookingStatus <> 'X';";
        $statement = $this->connection->prepare($sql);
        $statement->execute(['RequestId' => $reqId]);

        $bookingsRequestShifts = $statement->fetchAll(PDO::FETCH_ASSOC);
        usort($bookingsRequestShifts,array($this,'compareShifts'));

        //dump($bookingsRequestShifts);

        $shiftsDetailsArray = array();
        $shiftsArray = array();
        $start = true;
                
        for ($b=0; $b < sizeof($bookingsRequestShifts); $b++) {
             
            $thisShift = $bookingsRequestShifts[$b]['ShiftId'];
            //dump("SHIFT ID: ");
            //dump($thisShift);
            
            $thisShiftEmployee = $bookingsRequestShifts[$b]['UserId'];
            $employeeLookup = $this->common->searchArray($employees, 'emp_id', $thisShiftEmployee);
            $empFirstName = $employeeLookup[0]['first_name'];
            $empLastName = $employeeLookup[0]['last_name'];
            $empName = $empFirstName." ".$empLastName;   
            
            date_default_timezone_set('Australia/West');

            if($start){
                $thisShiftStart = $bookingsRequestShifts[$b]['StartDay'];
                $startDateFormat = date("d-m-Y", $thisShiftStart);
                //dump("START");
                //dump($startDateFormat);
                $start = false;
            }
            
            $thisAmPm = $bookingsRequestShifts[$b]['AmPm'];
            if($thisAmPm == 'AM'){
                $thisTime = 'Day'; 
            } else {
                $thisTime = 'Night';
            }

            $thisBookingType = $bookingsRequestShifts[$b]['BookingType'];
        
            $thisTradeTypes = $bookingsRequestShifts[$b]['TradeTypes'];
            $thisTradeTypesArray = json_decode($thisTradeTypes);
            $thisTradeTypeStr = $thisTradeTypesArray[0];
            $tradeLookup = $this->common->searchArray($trades, 'trade_code', $thisTradeTypeStr);
            $tradeDesc = $tradeLookup[0]['trade_desc'];

             if($thisShift != $bookingsRequestShifts[$b+1]['ShiftId']) {
                                
                $thisShiftend = $bookingsRequestShifts[$b]['EndDay'];
                $endDateFormat = date("d-m-Y", $thisShiftend);
                //dump("END DATE");
                //dump($endDateFormat);
                
                $shiftsDetailsArray = array(
                    "shift" => $thisShift,
                    "emp" => $empName,
                    "trades" => $tradeDesc,
                    "start" => $startDateFormat,
                    "end" => $endDateFormat,
                    "time" => $thisAmPm,
                    "type" => $thisBookingType,
                );
                
                array_push($shiftsArray, $shiftsDetailsArray);  
                $shiftsDetailsArray = array();
                $start = true;
             }

        } 
        
        return $shiftsArray;
    
    }

    private function compareShifts($a, $b){
        $retval = strnatcmp($a['shiftId'], $b['shiftId']);
        if(!$retval) $retval = strnatcmp($a['StartDay'], $b['StartDay']);
        return $retval;
    }

}