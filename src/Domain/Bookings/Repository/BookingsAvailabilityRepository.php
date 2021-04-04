<?php

namespace App\Domain\Bookings\Repository;

use PDO;

class BookingsAvailabilityRepository
{
    private $connection;

    public function __construct(PDO $connection)
    {
        $this->connection = $connection;

    }

    public function getBookings($shift)
    {
        ///GET ALL THE BOOKINGS FOR THE SHIFT

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
                $tradeTypesArray[] = $value;
            }

        }

        //dump("TT ARRAY");
        //dump($tradeTypesArray);

        $sql = "SELECT emp_id, trade_type FROM employees WHERE emp_status <> 'X'";
        $statement = $this->connection->prepare($sql);
        $statement->execute();

        $employees = $statement->fetchAll(PDO::FETCH_ASSOC);

        //dump("EMPLOYEES");
        //dump($employees);

        $checkEmpExists = array();

        $availabilityArray = array();
        $empAvailArray = array();
        $empAvail = array();
        $countAvailDays = 0;
        
        for($e = 0; $e < sizeof($employees); $e++) {
            
            $thisEmployee = $employees[$e]['emp_id'];
            $thisTradeType = $employees[$e]['trade_type'];

            //dump("TRADE TYPE");
            //dump($thisTradeType);

            if(in_array($thisTradeType, $tradeTypesArray)){
                
                //dump("IN ARRAY");
                
                //dump($thisEmployee);

                $empAvail['emp'] = $thisEmployee;
                
                //LOOP EMPLOYEES BUILD AVAILABILITY

                //if(!in_array($checkEmpExists, $thisEmployee)){
                
                    //dump("SELECTING");

                    for($d = 0; $d < sizeof($period); $d++) {
                   
                        $checkDay = $period[$d];

                        //dump($checkDay);

                        $checkDayFormat = date("d-m-Y", $checkDay);

                        //dump($checkDayFormat);

                        $sql = "SELECT UserId, BookingId, StartDay, Title FROM bookings WHERE
                            UserId = :UserId AND BookingStatus <> 'X' AND
                            StartDay = :StartDay
                        ";
                        $statement = $this->connection->prepare($sql);
                        $statement->bindParam(':UserId', $thisEmployee, PDO::PARAM_STR);
                        $statement->bindParam(':StartDay', $checkDay, PDO::PARAM_STR);
                        $statement->execute();

                        $availability = $statement->fetchAll(PDO::FETCH_ASSOC);

                        //dump($availability);

                        if(empty($availability)){
                            //dump("AVAILABLE");
                            $empAvail['days'][] = $checkDayFormat;
                            $countAvailDays++;
                        } else {
                            //dump("NOT AVAILABLE");
                            $empAvail['days'][] = "NOT AVAILABLE";
                        }
                        
                        $availability = array();
                        
                    }

                    $checkEmpExists[] = $thisEmployee;

                //}

                if($thisEmployee != $employees[$e + 1]['emp_id']){
                    //dump("END EMP");
                    $periodAvailRatio = $countAvailDays / $daysInPeriod;
                    $periodAvailRatio = sprintf('%0.5f', $periodAvailRatio);
                    $empAvail['ratio'] = $periodAvailRatio;
                    $countAvailDays = 0;
                    
                    array_push($availabilityArray, $empAvail);
                    $empAvail = array();
            
                }
            
            }

        }

        //dump($availabilityArray);

        /* try {
            $qgj = "SELECT
              last_name
            FROM employees WHERE
              trade_type = ? AND
              emp_status <> 'X'
            ";
            $gjd = $dbh->prepare($qgj, array(PDO::ATTR_CURSOR => PDO::CURSOR_SCROLL));
            foreach($jobSelection as $result) {
                $gjd->execute(array(
                    $result['trade_type'],
                ));
                $row = $gjd->fetchAll(PDO::FETCH_ASSOC);
                $jobDetails[] = $row[0];
                if($gjd->errorCode() != 0 ) {
                    $log->error($gjd->errorCode());
                }
            }
        }
        catch(PDOException $e) {
            $log->error($e->getMessage());
        } */


        /* $sql = "SELECT * FROM bookings WHERE BookingStatus <> 'X'";
        $statement = $this->connection->prepare($sql);
        $statement->execute();

        $bookings = $statement->fetchAll(PDO::FETCH_ASSOC); */

        

        //dump($bookings);

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
}