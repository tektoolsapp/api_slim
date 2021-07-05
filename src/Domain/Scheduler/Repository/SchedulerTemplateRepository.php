<?php

namespace App\Domain\Scheduler\Repository;
use App\Domain\Requests\Repository\RequestUpdateShiftsRepository;
use App\Domain\Requests\Repository\RequestFetchRepository;
use App\Domain\Employees\Repository\EmployeesRepository;
use App\Domain\Utility\Repository\BookingShiftMaxRepository;
use App\Domain\Utility\Service\CommonFunctions;

use DomainException;
use PDO;

class SchedulerTemplateRepository
{
    private $connection;
    private $updateShifts;
    private $reqDets;
    private $employees;
    private $common;
    private $maxShifts;

    public function __construct(
            PDO $connection,
            RequestUpdateShiftsRepository $updateShifts,
            RequestFetchRepository $reqDets,
            EmployeesRepository $employees,
            CommonFunctions $common,
            BookingShiftMaxRepository $maxShifts
        )
    {
        $this->connection = $connection;
        $this->updateShifts = $updateShifts;
        $this->reqDets = $reqDets;
        $this->employees = $employees;
        $this->common = $common;
        $this->maxShifts = $maxShifts;
    }

    public function bookingsFromTemplate(array $template)
    {
        
        //dump($template);
        
        $employeesLookup = $this->employees->getEmployees(); 
        
        //BUILD TEMPLATES ARRAY FROM FORM DATA
        $templatesArray = array();

        foreach ($template as $key=>$value){
            
            $temps = explode('-', $key);
            $tempkey = $temps[0];
            $tempId = array_pop($temps);

            if($tempkey == 'swing_reference'){
                $refArray = explode('-', $value);
                $siteShort = $refArray[1];
                $templatesArray[$tempId-1][$tempkey] = $value; 
                $templatesArray[$tempId-1]['site_dept'] = $siteShort; 
            } else if($tempkey == 'swing_emps' && $tempId > 1) {
                $empArray = explode(',', $value);
                $templatesArray[$tempId-1][$tempkey] = $empArray;   
            } else {
                $templatesArray[$tempId-1][$tempkey] = $value; 
            }
        }
        
        dump($templatesArray);

        $reqId = $templatesArray[0]['swing_request'];
        //dump($reqId);
        
        $reqDets = $this->reqDets->getRequest($reqId);
        //dump($reqDets);

        $rioRequester = $reqDets['ws_cust_contact'];
        $rioRequesterPhone = $reqDets['ws_cust_contact_phone'];

        $maxShift = $this->maxShifts->getMaxShift();
        $maxShift = $maxShift[0];

        $batchId = mt_rand(100000, 999999);

        for ($t = 0; $t < sizeof($templatesArray); $t++) {
            
            $requestId = $templatesArray[$t]['swing_request'];
            $swingType = $templatesArray[$t]['swing_type'];
            $swingReference = $templatesArray[$t]['swing_reference'];
            $swingTrades = $templatesArray[$t]['swing_trades'];
            $swingShiftTime = $templatesArray[$t]['shift_time'];
            $startDate = $templatesArray[$t]['swing_start_date'];
            $swingEmps = $templatesArray[$t]['swing_emps'];
            $swingRecurrence = (int)$templatesArray[$t]['swing_recurrence'];
            $swingTradeType = $templatesArray[$t]['swing_trade_type'];     
            
            //dump($request);

            //BUILD THE BOOKINGS HERE

            /* "swing_id" => "1"
            "swing_request" => "000001"
            "swing_reference" => "RR0001-BR2"
            "site_dept" => "BR2"
            "swing_emps" => array:2 [
                0 => "1"
                1 => "2"
            ]
            "swing_type" => "On"
            "swing_start_date" => "09-02-2021"
            "shift_time" => "D"
            "swing_recurrence" => "3" */

            date_default_timezone_set('Australia/West');

            $startDateArray = explode("-",$startDate);
            if($swingShiftTime == 'D'){
                $startTimeHour = 6;
            } else {
                $startTimeHour = 18;
            }    

            $startTimeArray = array(
                $startTimeHour,
                0,
            );        

            $st = mktime(
                $startTimeArray[0],
                $startTimeArray[1],
                0,
                $startDateArray[1],
                $startDateArray[0],
                $startDateArray[2]
            );

            date_default_timezone_set('Australia/West');

            $shiftHours = 12;
            $endDateStr = $st + ($shiftHours * 60 * 60);

            $endDate = date("d-m-Y", $endDateStr);
            $endDateArray = explode("-",$endDate);
            $endTime = date("H-i", $endDateStr);
            $endTimeArray = explode("-",$endTime);

            $et = mktime(
                $endTimeArray[0],
                $endTimeArray[1],
                0,
                $endDateArray[1],
                $endDateArray[0],
                $endDateArray[2]
            );

            $theStartDate = gmdate('Y-m-d\TH:i:s\Z', $st);
            //dump($theStartDate);

            $theEndDate = gmdate('Y-m-d\TH:i:s\Z', $et);
            //dump($theEndDate);

            for ($e = 0; $e < sizeof($swingEmps); $e++) {

                $employee = $swingEmps[$e]; 
                $employeeDetails = $this->common->searchArray($employeesLookup, 'emp_id', $employee);
                $empType = $employeeDetails[0]['emp_type']; 

                $shiftId = (int)$maxShift + 1;
                $maxShift++;
                 
                for ($r = 0; $r < $swingRecurrence; $r++) {

                    $bookingId = mt_rand(100000, 999999);
                    
                    $paddedRequestId = str_pad($requestId, 6, '0', STR_PAD_LEFT);
                    $requestDesc = "#" .$paddedRequestId;

                    if($r == 0){
                        $recurrenceStart = $theStartDate; 
                        $recurrenceEnd = $theEndDate;   
                        $recurrenceStartDay = $st;
                        $recurrenceEndDay = $et; 
                    } else {
                        $recurrenceStartDay = $recurrenceStartDay + (24 * 60 * 60);
                        $recurrenceEndDay = $recurrenceEndDay + (24 * 60 * 60);
                        $recurrenceStart = gmdate('Y-m-d\TH:i:s\Z', $recurrenceStartDay); 
                        $recurrenceEnd = gmdate('Y-m-d\TH:i:s\Z', $recurrenceEndDay);    
                    }

                    //SET THE BOOKING SHIFT TIME
                    $bookingTime = date("H:i A", $recurrenceStartDay);
                    $bookingTimeArray = explode(" ", $bookingTime);
                    $bookingTime = $bookingTimeArray[1];

                    $booking = array(
                        "BookingId" => $bookingId,
                        "BatchId" => $batchId,
                        "ShiftId" => $shiftId,
                        "BookingType" => $swingType,
                        "RequestDesc" => $requestDesc,
                        "RequestId" => $requestId,
                        "Title" => $swingReference,
                        "Start" => $recurrenceStart,
                        "StartDay" => $recurrenceStartDay,
                        "End" => $recurrenceEnd,
                        "EndDay" => $recurrenceEndDay,
                        "AmPm" => $bookingTime,
                        "StartTimezone" => "",
                        "EndTimezone" => "",
                        "Description" => "",
                        "TradeTypes" => $swingTrades,
                        "SwingTradeType" => $swingTradeType,
                        "RecurrenceID" => "",
                        "RecurrenceRule" => "",
                        "RecurrenceException" => "",
                        "UserId" => $employee,
                        "UserType" => $empType,
                        "RioRequester" => $rioRequester,
                        "RioRequesterPhone" => $rioRequesterPhone,
                        "IsAllDay" => 0,
                        "BookingStatus" => ""
                    );

                    //dump($booking);

                    $postBooking = $this->postBooking($booking);
                }
            }
        }

        //GET ALL THE SHIFT IDS FOR THE REQUEST

        $sql = "SELECT COUNT(DISTINCT ShiftId) AS NumSwings FROM bookings WHERE 
            RequestID = :RequestID AND
            BookingStatus <> 'X'";
        $statement = $this->connection->prepare($sql);
        $statement->execute(['RequestID' => $requestId]);

        $numSwings = $statement->fetch();

        dump($numSwings);

        $sql = "SELECT COUNT(DISTINCT ShiftId) AS NumSwingsScheduled FROM bookings WHERE 
            UserType <> 'T' AND
            RequestID = :RequestID AND
            BookingStatus <> 'X'";
        $statement = $this->connection->prepare($sql);
        $statement->execute(['RequestID' => $requestId]);

        $numSwingsScheduled = $statement->fetch();

        dump($numSwingsScheduled);

        $shiftsArray = array(
            "ws_num_swings" => $numSwings['NumSwings'],
            "ws_num_scheduled" => $numSwingsScheduled['NumSwingsScheduled']
        );

        $shiftUpdate = $this->updateShifts->updateRequest($requestId, $shiftsArray);

        $returnArray = array(
            "template_array" => json_encode($templatesArray),
            "status" => 'posted'
        );
            
        return $returnArray;
    }

    public function postBooking(array $booking) {

        $columnsArray = array_keys($booking);
        $columnsString = implode(',', $columnsArray);
        $valuesArray = array_values($booking);
        $valuesCount = count($valuesArray);

        $valuesPlaceholder = '';
        for ($i=0; $i < $valuesCount; $i++) {
            $valuesPlaceholder .= '?,';
        }
        $valuesPlaceholder = rtrim($valuesPlaceholder, ',');

        $query = "INSERT INTO bookings ($columnsString) VALUES ($valuesPlaceholder)";
        $this->connection->prepare($query)->execute($valuesArray);
        
        return 'posted';

    }
}