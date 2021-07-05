<?php

namespace App\Domain\Api\Repository;

use PDO;
use App\Domain\Utility\Service\CommonFunctions;
use App\Domain\Requests\Repository\RequestFetchRepository;
//use Firebase\JWT\JWT;

class ApiEmployeeShiftFetchRepository
{
    private $connection;
    private $common;
    private $reqDets;

    public function __construct(
        PDO $connection,
        CommonFunctions $common,
        RequestFetchRepository $reqDets
    )
    {
        $this->connection = $connection;
        $this->common = $common;
        $this->reqDets = $reqDets;
    }

    public function getApiEmployeeShift($shiftId)
    {
        date_default_timezone_set('Australia/West');
        
        $sql = "SELECT * FROM bookings WHERE ShiftId = :ShiftId AND BookingStatus <> 'X'";
        $statement = $this->connection->prepare($sql);
        $statement->execute(['ShiftId' => $shiftId]);

        $bookings = $statement->fetchAll(PDO::FETCH_ASSOC);

        usort($bookings,array($this,'compareBookings'));

        //LOOP THROUGH AT GET THE REQUEST
        //ADD THE REQUIRED FIELDS FROM THE REQUEST
        
        $shiftArray = array();
        $shiftSubArray = array();
        $start = true;
         
        for ($b=0; $b < sizeof($bookings); $b++) {
             
            $shiftId = $bookings[$b]['ShiftId'];
            //$startDay = $bookings[$b]['StartDay'];
            if($start) {
                $startDay = $bookings[$b]['StartDay'];
                $startDayFormat = date("D, M j Y", $startDay);
                //dump("START");
                //dump($startDayFormat);
                $start = false;
            }

            if($shiftId != $bookings[$b + 1]['ShiftId']){

                $thisReq = $bookings[$b]['RequestId'];
                $reqDets = $this->reqDets->getRequest($thisReq);
                $siteDesc = $reqDets['ws_site_desc'];
                $shiftRef = $bookings[$b]['Title'];
                $confirmStatus = $bookings[$b]['EmployeeConfirmed'];
                $endDay = $bookings[$b]['EndDay'];
                $amPm = $bookings[$b]['AmPm'];
                if($amPm == 'AM'){
                    $shiftType = 'DAY';
                    $shiftStartTime = "6:00 AM";
                    $shiftEndTime = "6:00 PM";
                } else {
                    $shiftType = 'NIGHT';
                    $shiftStartTime = "8:00 PM";
                    $shiftEndTime = "6:00 AM";    
                }
                $startDayFormat = date("D, M j Y", $startDay);
                $endDayFormat = date("D, M j Y", $endDay);
                $shiftStatus = $bookings[$b]['BookingStatus'];
                
                $shiftSubArray = array(
                    'shift_id' => $shiftId,
                    'shift_ref' => $shiftRef, 
                    'shift_start' => $startDayFormat,
                    'shift_type' => $shiftType,
                    'shift_time' => $shiftStartTime,
                    'shift_end' => $endDayFormat,
                    'shift_end_time' => $shiftEndTime,
                    'shift_site' => $siteDesc,
                    'shift_status' => $shiftStatus,
                    'shift_confirm' => $confirmStatus
                );

                array_push($shiftArray,$shiftSubArray);
                $shiftSubArray = array();
                $start = true;
            }
        }

        $returnArray = array(
            "data" => $shiftArray
        ); 

        return $returnArray;
    }

    private function compareBookings($a, $b){
        $retval = strnatcmp($a['trade_type'], $b['trade_type']);
        if(!$retval) $retval = strnatcmp($a['emp_name'], $b['emp_name']);
        if(!$retval) $retval = strnatcmp($a['ShiftId'], $b['ShiftId']);
        if(!$retval) $retval = strnatcmp($a['StartDay'], $b['StartDay']);
        return $retval;
    }
}