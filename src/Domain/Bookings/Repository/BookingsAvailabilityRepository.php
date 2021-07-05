<?php

namespace App\Domain\Bookings\Repository;

use App\Domain\Employees\Repository\EmployeesRepository;
use App\Domain\Employees\Repository\TradesRepository;
use App\Domain\Utility\Service\CommonFunctions;
use PDO;

class BookingsAvailabilityRepository
{
    
    private $employees;
    private $trades;
    private $common;
    private $connection;

    public function __construct(
            EmployeesRepository $employees,  
            TradesRepository $trades,    
            CommonFunctions $common,
            PDO $connection
        )
    {
        $this->employees = $employees;
        $this->trades = $trades;
        $this->common = $common;
        $this->connection = $connection;
    }

    public function getBookings($shift)
    {
        ///GET ALL THE BOOKINGS FOR THE SHIFT

        $employees = $this->employees->getEmployees();
        $trades = $this->trades->getTrades();
        
        date_default_timezone_set('Australia/West');
        
        $sql = "SELECT BookingId, RequestId, StartDay, EndDay FROM bookings WHERE ShiftId = :ShiftId;";
        $statement = $this->connection->prepare($sql);
        $statement->execute(['ShiftId' => $shift]);
        
        $shiftBookings = $statement->fetchAll(PDO::FETCH_ASSOC);

        //dump($shiftBookings);

        $shiftRequest = $shiftBookings[0]['RequestId'];

        $shiftStarts = array_column($shiftBookings, 'StartDay');

        //dump($shiftStarts);

        $shiftStartDate = min($shiftStarts);

        //dump($shiftStartDate);

        //$checkShiftStartFormat = date("d-m-Y h:i:s", $shiftStartDate);
        //dump($checkShiftStartFormat);

        //$shiftStartFormat = date("d-m-Y 00:00:00.0", $shiftStartDate);
        //$periodStartFormat = date("Y-m-d", $shiftStartDate);

        //dump($shiftStartFormat);

        $shiftEnds = array_column($shiftBookings, 'EndDay');

        //dump($shiftEnds);

        $shiftEndDate = max($shiftEnds);
        
        //dump($shiftEndDate);

        //$shiftEndFormat = date("d-m-Y", $shiftEndDate);
        //$periodEndFormat = date("Y-m-d", $shiftEndDate);

        //dump($shiftEndFormat);
        //dump($shiftBookings);

        $period = $this->dateRangeStr($shiftStartDate, $shiftEndDate, $step = '+1 day');

        //dump("PERIOD");
        //dump($period);

        $daysInPeriod = sizeof($period);
        
        $sql = "SELECT * FROM workspaces WHERE ws_id = :ws_id;";
        $statement = $this->connection->prepare($sql);
        $statement->execute(['ws_id' => $shiftRequest]);

        $request = $statement->fetch();

        //dump("REQUEST");
        //dump($request);

        $tradeTypesArray = array();

        foreach ($request as $key => $value){      
            //dump($key);
            if(substr($key,0,13) == 'ws_trade_type'){
                //dump("K");
                //dump($key);
                //dump($value);
                if(!empty($value)){
                    $tradeTypesArray[] = $value;
                }
            }

        }

        //dump("TT ARRAY");
        //dump($tradeTypesArray);

        $sql = "SELECT emp_id, emp_trades FROM employees WHERE emp_status <> 'X'";
        $statement = $this->connection->prepare($sql);
        $statement->execute();

        $allEmployees = $statement->fetchAll(PDO::FETCH_ASSOC);

        //dump("EMPLOYEES");
        //dump($allEmployees);

        $checkEmpExists = array();

        $availabilityArray = array();
        $empAvailArray = array();
        $empAvail = array();
        $countAvailDays = 0;

        //DAYS SUB ARRAY
        $availDaysArray = array();
        $checkAvailDaysArray = array();
        
        for($e = 0; $e < sizeof($allEmployees); $e++) {
            
            $thisEmployee = $allEmployees[$e]['emp_id'];
            //dump("EMP");
            //dump($thisEmployee);

            $employeeTradeTypeArray = json_decode($allEmployees[$e]['emp_trades'], true);
            //dump("EMP TRADE TYPE");
            //dump($employeeTradeTypeArray);

            //LOOP THROUGH TRADE TYPES FOR EACH EMPLOYEE
            for($t = 0; $t < sizeof($employeeTradeTypeArray); $t++) {

                //IF A TRADE MATCH
                $thisTradeType = $employeeTradeTypeArray[$t];

                if(in_array($thisTradeType, $tradeTypesArray)){

                    // LOOP THROUGH THE PERIOD DAYS AND CHECK AVAILABILITY
                    for($d = 0; $d < sizeof($period); $d++) {
                
                        $checkDay = $period[$d];
                        $checkDayFormat = date("d-m-Y", $checkDay);

                        $sql = "SELECT UserId, BookingId, StartDay, Title FROM bookings WHERE
                            UserId = :UserId AND BookingStatus <> 'X' AND
                            StartDay = :StartDay
                        ";
                        $statement = $this->connection->prepare($sql);
                        $statement->bindParam(':UserId', $thisEmployee, PDO::PARAM_STR);
                        $statement->bindParam(':StartDay', $checkDay, PDO::PARAM_STR);
                        $statement->execute();

                        $availability = $statement->fetchAll(PDO::FETCH_ASSOC);

                        //IF NOT ALREADY IN THE DAYS AVAILABLE ARRAY
                        
                            //COUNT THE AVAILABLE DAY

                            //ADD THE AVAILABLE DAY TO THE DAYS SUB-ARRAY
                            
                        if(!in_array($checkDay, $checkAvailDaysArray)){
                        
                            //IF AVAIILABLE
                            if(empty($availability)){
                                $checkAvailDaysArray[] = $checkDay;
                                //dump("AVAILABLE");
                                $availDaysArray[] = $checkDayFormat;
                                $countAvailDays++;
                            } else {
                                //dump("NOT AVAILABLE");
                                $checkAvailDaysArray[] = $checkDay;
                                $availDaysArray[] = $checkDayFormat." - NOT AVAILABLE";
                            }

                        }
                    
                    }//CHECK AVAILABILITY LOOP
                
                }//IF EMP HAS TRADE TYPE

            }

            //BEFORE NEXT EMPLOYEE

            //BUILD THE AVAILABILITY SUB ARRAY
                //EMP
                //RATIO
                //DAYS - ADD THE DAYS ARRAY

            if($thisEmployee != $allEmployees[$e + 1]['emp_id']){
                //dump("END EMP");
                
                $employeeLookup = $this->common->searchArray($employees, 'emp_id', $thisEmployee);
                $empFirstName = $employeeLookup[0]['first_name'];
                $empLastName = $employeeLookup[0]['last_name'];
                $empName = $empFirstName." ".$empLastName; 
                $empTradeTypeArray = json_decode($employeeLookup[0]['emp_trades'],true);

                $tradesDescStr = '';
                
                for($t = 0; $t < sizeof($empTradeTypeArray); $t++) {
                    $thisTrade = $empTradeTypeArray[$t];
                    $tradesLookup = $this->common->searchArray($trades, 'trade_code', $thisTrade);
                    $tradeDesc = $tradesLookup[0]['trade_desc'];
                    $tradesDescStr .= $tradeDesc."/";  
                }

                $tradesDescStr = rtrim($tradesDescStr, '/');
                
                $empAvail['emp'] = $thisEmployee;
                $empAvail['name'] = $empName;
                $empAvail['trades'] = $tradesDescStr;
                $empAvail['days'] = $availDaysArray;
                $availDaysArray = array();
                $checkAvailDaysArray = array();
                
                $periodAvailRatio = $countAvailDays / $daysInPeriod;
                $periodAvailRatio = sprintf('%0.5f', $periodAvailRatio);
                $empAvail['ratio'] = 1 - $periodAvailRatio;
                $empAvail['available'] = sprintf('%0.1f', $periodAvailRatio * 100);
                $countAvailDays = 0;
                
                array_push($availabilityArray, $empAvail);
                $empAvail = array();
        
            }
            
        } //EMPLOYEE LOOP   

        //dump($availabilityArray);

        usort($availabilityArray,array($this,'compareAvailability'));

        //sleep("10");

        return $availabilityArray;
    }

    private function dateRange($first, $last, $step = '+1 day', $output_format = 'd-m-Y' ) {

        $dates = array();
        $current = strtotime($first);
        $last = strtotime($last);
    
        while( $current <= $last ) {
    
            //$dates[] = date($output_format, $current);
            $dates[] = $current;
            $current = strtotime($step, $current);
        }
    
        return $dates;
    }

    private function dateRangeStr($first, $last, $step = '+1 day') {

        $dates = array();
        //$current = strtotime($first);
        //$last = strtotime($last);

        $current = (int) $first;
    
        while( $current <= $last ) {
    
            //$dates[] = date($output_format, $current);
            $dates[] = $current;
            $current = strtotime($step, $current);
        }
    
        return $dates;
    }

    private function compareAvailability($a, $b){
        /* $retval = strnatcmp($a['shiftId'], $b['shiftId']);
        if(!$retval) $retval = strnatcmp($a['StartDay'], $b['StartDay']);
        return $retval; */
        $retval = strnatcmp($a['ratio'], $b['ratio']);
        if(!$retval) $retval = strnatcmp($a['emp'], $b['emp']);
        return $retval;


    }
}