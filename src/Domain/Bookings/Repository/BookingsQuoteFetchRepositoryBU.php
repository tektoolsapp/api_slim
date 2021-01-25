<?php

namespace App\Domain\Bookings\Repository;

use PDO;
use MongoDB\Client as Mongo;
use App\Domain\Employees\Repository\EmployeesRepository;
use App\Domain\Employees\Repository\TradesRepository;
use App\Domain\Requests\Repository\RequestFetchRepository;
use App\Domain\Requests\Repository\RequestUpdateChfRepository;
use App\Domain\Utility\Service\CommonFunctions;

class BookingsQuoteFetchRepository
{
    private $connection;
    private $mongo;
    private $employees;
    private $trades;
    private $reqDets;
    private $chfArray;
    private $common;

    public function __construct(
        PDO $connection,
        Mongo $mongo,
        EmployeesRepository $employees,
        TradesRepository $trades,
        RequestFetchRepository $reqDets,
        RequestUpdateChfRepository $chfArray,
        CommonFunctions $common
    )
    {
        $this->connection = $connection;
        $this->mongo = $mongo;
        $this->employees = $employees;
        $this->trades = $trades;
        $this->reqDets = $reqDets;
        $this->chfArray = $chfArray;
        $this->common = $common;
    }

    public function getBookingsQuote($reqId)
    {
        $employees = $this->employees->getEmployees();
        $request = $this->reqDets->getRequest($reqId);
        $trades = $this->trades->getTrades();

        $sql = "SELECT * FROM bookings WHERE RequestId = :RequestId AND BookingStatus <> 'X';";
        $statement = $this->connection->prepare($sql);
        $statement->execute(['RequestId' => $reqId]);

        $bookingsQuote = $statement->fetchAll(PDO::FETCH_ASSOC);

        //ADD/UPDATE EMPLOYEE FIELDS AS REQUIRED
        for ($b=0; $b < sizeof($bookingsQuote); $b++) {

            //EMPLOYEE LOOKUP
            $employee = $bookingsQuote[$b]['UserId'];
            $employeeLookup = $this->common->searchArray($employees, 'emp_id', $employee);
            $tradeType = $employeeLookup[0]['trade_type'];
            $empFirstName = $employeeLookup[0]['first_name'];
            $bookingsQuote[$b]['emp_first_name'] = $empFirstName;
            $empLastName = $employeeLookup[0]['last_name'];
            $bookingsQuote[$b]['emp_last_name'] = $empLastName;
            $empRehire = $employeeLookup[0]['emp_rehire'];
            $bookingsQuote[$b]['emp_rehire'] = $empRehire;
            $empName = $empFirstName." ".$empLastName;
            $empPreferredName = $employeeLookup[0]['preferred_name'];
            $bookingsQuote[$b]['preferred_name'] = $empPreferredName;
            $empMiddleNames = $employeeLookup[0]['middle_names'];
            $bookingsQuote[$b]['middle_names'] = $empMiddleNames;
            $empTitle = $employeeLookup[0]['emp_title'];
            $bookingsQuote[$b]['emp_title'] = $empTitle;
            $empGender = $employeeLookup[0]['emp_gender'];
            $bookingsQuote[$b]['emp_gender'] = $empGender;
            $empBirthDate = $employeeLookup[0]['birth_date'];
            $bookingsQuote[$b]['birth_date'] = $empBirthDate;
            $empSap = $employeeLookup[0]['emp_sap'];
            $bookingsQuote[$b]['emp_sap'] = $empSap;
            $bookingsQuote[$b]['emp_name'] = $empName;
            //TRADE TYPE LOOKUP
            $tradeLookup = $this->common->searchArray($trades, 'trade_code', $tradeType);
            $tradeDesc = $tradeLookup[0]['trade_desc'];
            $requestMobiliser = $request['ws_mobiliser'];
            $bookingsQuote[$b]['trade_type'] = $tradeDesc;

            date_default_timezone_set('Australia/West');

            $startDateTime = $bookingsQuote[$b]['Start'];
            $startDateTimeStr = strtotime($startDateTime);
            $startDateFormat = date("d-m-Y", $startDateTimeStr);
            $startTimeFormat = date("h:m A", $startDateTimeStr);

            $bookingsQuote[$b]['start_date'] = $startDateFormat;
            $bookingsQuote[$b]['start_time'] = $startTimeFormat;

            $endDateTime = $bookingsQuote[$b]['End'];
            $endDateTimeStr = strtotime($endDateTime);
            $endDateFormat = date("d-m-Y", $endDateTimeStr);
            $endTimeFormat = date("h:m A", $endDateTimeStr);

            $bookingsQuote[$b]['end_date'] = $endDateFormat;
            $bookingsQuote[$b]['end_time'] = $endTimeFormat;

            $bookingRate = 96;
            $bookingsQuote[$b]['booking_rate'] = $bookingRate;
            $bookingHours = ($endDateTimeStr - $startDateTimeStr) / 3600;
            $bookingsQuote[$b]['booking_hours'] = $bookingHours;

        }

        //dump($bookingsQuote[1]);

        //ORDER THE ARRAY
        usort($bookingsQuote,array($this,'compareBookings'));

        $quoteBookings = array();
        $bookingSubArray = array();
        $shiftArray = array();
        $dayShiftCount = 0;
        $nightShiftCount = 0;
        $typeCounter = 0;
        $shiftHours = 0;
        $empCounter = 0;
        $empPdfArray = array();
        //$typeFieldsArray = array();
        $chfFieldsArray = array();

        for ($q=0; $q < sizeof($bookingsQuote); $q++) {

            $tradeType = $bookingsQuote[$q]['trade_type'];
            $employee = $bookingsQuote[$q]['UserId'];
            $empName = $bookingsQuote[$q]['emp_name'];

            ///
            $empFirstName = $bookingsQuote[$q]['emp_first_name'];
            $empLastName = $bookingsQuote[$q]['emp_last_name'];
            $empRehire = $bookingsQuote[$q]['emp_rehire'];
            $empPreferredName = $bookingsQuote[$q]['preferred_name'];
            $empMiddleNames = $bookingsQuote[$q]['middle_names'];
            $empTitle = $bookingsQuote[$q]['emp_title'];
            $empGender = $bookingsQuote[$q]['emp_gender'];
            $empBirthDate = $bookingsQuote[$q]['birth_date'];
            $empSap = $bookingsQuote[$q]['emp_sap'];
            ////

            $bookingRate = $bookingsQuote[$q]['booking_rate'];
            $bookingHours = $bookingsQuote[$q]['booking_hours'];

            //dump($bookingsQuote[$q]['start_time']);

            $marker = $q." - ".$tradeType." - ".$empName;
            $shiftTypeMarker = $q." - ".$tradeType." - ".$empName;
            $empArrayMarker = "EMP ARRAY: ".$typeCounter ." - ".$q." - ".$tradeType." - ".$empName;
            $tradeArrayMarker = "TRADE ARRAY: ".$typeCounter ." - ".$q." - ".$tradeType." - ".$empName;

            //dump($marker);

            $shiftHours = $shiftHours + $bookingHours;

            if ($bookingsQuote[$q]['start_time'] == '06:01 AM') {
                //$marker = 'DAY';
                $shiftTypeMarker = $marker. " - ".$q." - ".$tradeType." - ".$empName;
                //dump($shiftTypeMarker);
                $dayShiftCount++;
            } else {
                //$marker = 'NIGHT';
                $shiftTypeMarker = $marker. " - ".$q." - ".$tradeType." - ".$empName;
                //dump($shiftTypeMarker);
                $nightShiftCount++;
            }

            if($empCounter == 0){
                $startDay = $bookingsQuote[$q]['start_date'];
            }

            $endDay = $bookingsQuote[$q]['end_date'];

            $empCounter++;

            if ($bookingsQuote[$q]['emp_name'] != $bookingsQuote[$q + 1]['emp_name']) {

                //dump($empArrayMarker);

                $empArray = array(
                    "emp_name" => $empName,
                    "day_shifts" => $dayShiftCount,
                    "night_shifts" => $nightShiftCount,
                    "start_day" => $startDay,
                    "end_day" => $endDay,
                );

                if(!in_array($employee,$empPdfArray)){
                    $empPdfArray[] = $employee;
                }

                //dump($marker);

                //SET SEF FIELDS

                //CREATE AN ARRAY OF


                //SET CHF FIELDS

                if($empRehire == 'Y'){
                    $rehireField = 2;
                    $rehireValue = 'Yes';
                } else {
                    $rehireField = 1;
                    $rehireValue = 'Yes';
                }

                //SAP NUM
                if(!empty($empSap)){
                    $sapField = 3;
                    $sapValue = $empSap;
                } else {
                    $sapField = 3;
                    $sapValue = "";
                }

                if($empGender == 'M'){
                    $GenderMaleValue = 'Yes';
                    $GenderFemaleValue = '';                }
                if($empGender == 'F'){
                    $GenderFemaleValue = 'Yes';
                    $GenderMaleValue = '';
                }

                //MOBILISER

                $mobiliserNameArray = explode(" ",$requestMobiliser,2);
                $mobiliserFirstnameValue = $mobiliserNameArray[0];
                $mobiliserSurnameValue = $mobiliserNameArray[1];

                $chfFieldValuesArray = array(
                    "emp_id" => $employee,
                    "fields" => array(
                        array(
                            "field_id" => $rehireField,
                            "field_value" => $rehireValue,
                        ),
                        array(
                            "field_id" => $sapField,
                            "field_value" => $sapValue,
                        ),
                        array(
                            "field_id" => 4,
                            "field_value" => $empFirstName." ".$empMiddleNames,
                        ),
                        array(
                            "field_id" => 5,
                            "field_value" => $empLastName,
                        ),
                        array(
                            "field_id" => 6,
                            "field_value" => $empPreferredName,
                        ),
                        array(
                            "field_id" => 7,
                            "field_value" => $empTitle,
                        ),
                        array(
                            "field_id" => 8,
                            "field_value" => $GenderMaleValue,
                        ),
                        array(
                            "field_id" => 9,
                            "field_value" => $GenderFemaleValue,
                        ),

                        array(
                            "field_id" => 10,
                            "field_value" => $mobiliserFirstnameValue,
                        ),
                        array(
                            "field_id" => 11,
                            "field_value" => $mobiliserSurnameValue,
                        ),
                        array(
                            "field_id" => 12,
                            "field_value" => $empBirthDate,
                        )
                    )
                );

                //dump($fieldValuesArray);

                array_push($chfFieldsArray, $chfFieldValuesArray);

                $chfFieldValuesArray = array();

                //dump($empArray);

                array_push($shiftArray,$empArray);

                $dayShiftCount = 0;
                $nightShiftCount = 0;
                $empCounter = 0;

                $empArray = array();

            }

            if ($bookingsQuote[$q]['trade_type'] != $bookingsQuote[$q + 1]['trade_type']) {

                //dump($tradeArrayMarker);

                //dump($shiftArray);

                $tradeType = $bookingsQuote[$q]['trade_type'];
                $bookingSubArray['trade_type'] = $tradeType;
                $bookingSubArray['hours'] = $shiftHours;
                $bookingSubArray['rate'] = $bookingRate;
                $bookingSubArray['units'] = 'Hour';
                $bookingSubArray['extension'] = $shiftHours * $bookingRate;
                $bookingSubArray['shifts'] = $shiftArray;

                $shiftArray = array();
                $shiftHours = 0;

                //dump($bookingSubArray);

                array_push($quoteBookings, $bookingSubArray);

                $typeCounter++;

            }

        }

        //dump($quoteBookings);

        //BUILD THE EMPLOYEES ARRAY FOR CHF PDF GENERATION AND STORE IN REQUEST

        sort($empPdfArray);

        //dump($empPdfArray);

        $chfUpdate = $this->chfArray->updateRequest($reqId, $empPdfArray, $chfFieldsArray);

        //dump($chfUpdate);

        return $quoteBookings;
    }

    private function compareBookings($a, $b){
        $retval = strnatcmp($a['trade_type'], $b['trade_type']);
        if(!$retval) $retval = strnatcmp($a['emp_name'], $b['emp_name']);
        if(!$retval) $retval = strnatcmp($a['StartDay'], $b['StartDay']);
        return $retval;
    }

}