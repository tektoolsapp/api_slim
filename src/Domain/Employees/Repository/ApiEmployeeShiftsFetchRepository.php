<?php

namespace App\Domain\Employees\Repository;

use PDO;
use App\Domain\Utility\Service\CommonFunctions;
use App\Domain\Requests\Repository\RequestFetchRepository;
use Firebase\JWT\JWT;

class ApiEmployeeShiftsFetchRepository
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

    public function getApiEmployeeShifts($jwt)
    {
        date_default_timezone_set('Australia/West');
        
        //dump($jwt);
        
        $secretKey = $_SERVER['JWT_SECRET'];
        $decoded_array = (array) JWT::decode($jwt, $secretKey, array('HS256'));

        $empId = $decoded_array['jti'];

        //$empId = 1;
        //dump($empId);

        $sql = "SELECT * FROM bookings WHERE UserId = :UserId;";
        $statement = $this->connection->prepare($sql);
        $statement->execute(['UserId' => $empId]);

        $bookings = $statement->fetchAll(PDO::FETCH_ASSOC);

        usort($bookings,array($this,'compareBookings'));

        //LOOP THROUGH AT GET THE REQUEST
        //ADD THE REQUIRED FIELDS FROM THE REQUEST
        
        $shiftArray = array();
        $shiftSubArray = array();
         
        for ($b=0; $b < sizeof($bookings); $b++) {
             
            $shiftId = $bookings[$b]['ShiftId'];
            $startDay = $bookings[$b]['StartDay'];

            if($shiftId != $bookings[$b + 1]['ShiftId']){

                $thisReq = $bookings[$b]['RequestId'];
                $reqDets = $this->reqDets->getRequest($thisReq);
                $siteDesc = $reqDets['ws_site_desc'];
                $shiftRef = $bookings[$b]['Title'];
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
                    'shift_status' => $shiftStatus
                );

                array_push($shiftArray,$shiftSubArray);
                $shiftSubArray = array();
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