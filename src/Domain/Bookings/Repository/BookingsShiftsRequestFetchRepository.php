<?php

namespace App\Domain\Bookings\Repository;

use PDO;
use App\Domain\Employees\Repository\EmployeesRepository;
use App\Domain\Employees\Repository\TradesRepository;
use App\Domain\Utility\Service\CommonFunctions;

class BookingsShiftsRequestFetchRepository
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
            $empTradeType = $employeeLookup[0]['trade_type']; 

            $swingTradeType = $bookingsRequestShifts[$b]['SwingTradeType'];
            if($swingTradeType != null){
                //dump("SWING TRADE TYPE: ", $swingTradeType);
                $swingTradeLookup = $this->common->searchArray($trades, 'trade_code', $swingTradeType);
                $swingTradeDesc = $swingTradeLookup[0]['trade_desc']; 
            } else {
                $swingTradeDesc = 'NA';
            }
            
            $empNotified = $bookingsRequestShifts[$b]['EmployeeNotified'];
            $messageDelivered = $bookingsRequestShifts[$b]['MessageDelivered'];
            $employeeConfirmed = $bookingsRequestShifts[$b]['EmployeeConfirmed'];
            
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
        
            $thisTradeTypesArray = explode(",",$bookingsRequestShifts[$b]['TradeTypes']);
            //$thisTradeTypesArray = json_decode($thisTradeTypes);
            //LOOP THROUGH TRADES ARRAY AND BUILD TRADES DESC

            //if(in_array())
            
            //$thisTradeTypeStr = $thisTradeTypesArray[0];
            $thisTradeTypeStr = $empTradeType;
            $tradeLookup = $this->common->searchArray($trades, 'trade_code', $thisTradeTypeStr);
            $tradeDesc = $tradeLookup[0]['trade_desc'];

             if($thisShift != $bookingsRequestShifts[$b+1]['ShiftId']) {
                                
                $thisShiftend = $bookingsRequestShifts[$b]['EndDay'];
                $endDateFormat = date("d-m-Y", $thisShiftend);
                //dump("END DATE");
                //dump($endDateFormat);
                
                $shiftsDetailsArray = array(
                    "shift" => $thisShift,
                    "emp_id" => $thisShiftEmployee,
                    "emp" => $empName,
                    "trades" => $tradeDesc,
                    "trade_type" => $swingTradeDesc,
                    "start" => $startDateFormat,
                    "end" => $endDateFormat,
                    "time" => $thisAmPm,
                    "type" => $thisBookingType,
                    "notified" => $empNotified,
                    "delivered" => $messageDelivered,
                    "confirmed" => $employeeConfirmed,
                );
                
                array_push($shiftsArray, $shiftsDetailsArray);  
                $shiftsDetailsArray = array();
                $start = true;
             }

        } 
        
        return $shiftsArray;
    
    }

    private function compareShifts($a, $b){
        $retval = strnatcmp($a['UserId'], $b['UserId']);
        if(!$retval) $retval = strnatcmp($a['StartDay'], $b['StartDay']);
        return $retval;
        /* $retval = strnatcmp($a['ShiftId'], $b['ShiftId']);
        if(!$retval) $retval = strnatcmp($a['StartDay'], $b['StartDay']);
        return $retval; */

    }

}