<?php

namespace App\Domain\Bookings\Repository;

use PDO;
use App\Domain\Employees\Repository\EmployeesRepository;
use App\Domain\Employees\Repository\TradesRepository;
use App\Domain\Requests\Repository\RequestFetchRepository;
use App\Domain\Requests\Repository\RequestUpdateChfRepository;
use App\Domain\Utility\Service\CommonFunctions;

class BookingsNewQuoteFetchRepository
{
    private $connection;
    private $employees;
    private $trades;
    private $reqDets;
    private $chfArray;

    private $common;

    public function __construct(
        PDO $connection,
        EmployeesRepository $employees,
        TradesRepository $trades,
        RequestFetchRepository $reqDets,
        RequestUpdateChfRepository $chfArray,
        CommonFunctions $common
    )
    {
        $this->connection = $connection;
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

        //UNSET EXISTING RIO PDFS
        $rioPdfsArray = json_decode($request['ws_quote_pdfs'],true);

        for ($d=0; $d < sizeof($rioPdfsArray); $d++) {

            $pdfFile = "pdfs/completed/".$rioPdfsArray[$d];
            //dump("UNSET: ".$pdfFile);

            unlink($pdfFile);
        }

        $updateRioPdfs = array();

        //GET THE QUOTE DETAILS FROM THE REQUEST

        $tradeRatesArray = array();
        $ratesSubArray = array();

        $tradeType1 = $request['ws_trade_type_1'];
        $tradeType2 = $request['ws_trade_type_2'];
        $tradeType3 = $request['ws_trade_type_3'];

        if($tradeType1 != 'N'){
            
            $tradeTypeRateType1 = $request['ws_trade_rate_1'];
            
            $tradesLookup = $this->common->searchArray($trades, 'trade_code', $tradeType1);

            if($tradeTypeRateType1 == 'LT'){

                $rate1 = $tradesLookup[0]['lt_rate'];
            
            } else if($tradeTypeRateType1 == 'ST'){

                $rate1 = $tradesLookup[0]['st_rate'];

            } else if($tradeTypeRateType1 == 'FS'){

                $rate1 = $tradesLookup[0]['fs_rate'];

            }

            //$request['ws_trade_applicable_rate_1'] = $rate1;

            $ratesSubArray = array(
                "trade_type" => $tradeType1,
                "rate_code" => $tradeTypeRateType1,
                "rate" => $rate1
            );

            array_push($tradeRatesArray,$ratesSubArray);

            $ratesSubArray = array();
        }

        if($tradeType2 != 'N'){
            
            $tradeTypeRateType2 = $request['ws_trade_rate_2'];
            
            $tradesLookup = $this->common->searchArray($trades, 'trade_code', $tradeType2);

            if($tradeTypeRateType2 == 'LT'){

                $rate2 = $tradesLookup[0]['lt_rate'];
            
            } else if($tradeTypeRateType2 == 'ST'){

                $rate2 = $tradesLookup[0]['st_rate'];

            } else if($tradeTypeRateType2 == 'FS'){

                $rate2 = $tradesLookup[0]['fs_rate'];

            }

            //$request['ws_trade_applicable_rate_2'] = $rate2;

            $ratesSubArray = array(
                "trade_type" => $tradeType2,
                "rate_code" => $tradeTypeRateType2,
                "rate" => $rate2
            );

            array_push($tradeRatesArray,$ratesSubArray);

            $ratesSubArray = array();
        }

        //dump($tradeRatesArray);

        $sql = "SELECT * FROM bookings WHERE RequestId = :RequestId AND BookingStatus <> 'X';";
        $statement = $this->connection->prepare($sql);
        $statement->execute(['RequestId' => $reqId]);

        $bookingsQuote = $statement->fetchAll(PDO::FETCH_ASSOC);

        //dump($bookingsQuote);

        //ADD/UPDATE EMPLOYEE FIELDS AS REQUIRED
        for ($b=0; $b < sizeof($bookingsQuote); $b++) {

            //EMPLOYEE LOOKUP
            $employee = $bookingsQuote[$b]['UserId'];
            $employeeLookup = $this->common->searchArray($employees, 'emp_id', $employee);
            
            //TRADE TYPE
            $tradeType = $employeeLookup[0]['trade_type'];

            //REF TRADE TYPE TO GET RATE

            //GET THE APPLICABLE RATE FOR THE TRADE TYPE
            
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
            $bookingsQuote[$b]['request_mobiliser'] = $requestMobiliser;
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

            $ratesLookup = $this->common->searchArray($tradeRatesArray, 'trade_type', $tradeType);
            $bookingRateCode = $ratesLookup[0]['rate_code'];
            $bookingRate = $ratesLookup[0]['rate'];

            //dump($bookingRate);
            
            //$bookingRate = 96;
            
            $bookingsQuote[$b]['booking_rate_code'] = $bookingRateCode;
            $bookingsQuote[$b]['booking_rate'] = $bookingRate;
            $bookingHours = ($endDateTimeStr - $startDateTimeStr) / 3600;
            $bookingsQuote[$b]['booking_hours'] = $bookingHours;

            $bookingsQuote[$b]['booking_quote_date'] = $request['ws_quote_date'];

        }

        //ORDER THE ARRAY
        usort($bookingsQuote,array($this,'compareBookings'));

        $quoteBookings = array();
        $bookingSubArray = array();
        $empShiftArray = array();
        $shiftArray = array();
        $dayShiftCount = 0;
        $nightShiftCount = 0;
        $typeCounter = 0;
        $shiftHours = 0;
        $empCounter = 0;
        $empPdfChkArray = array();
        $empChfPdfArray = array();
        $empSefPdfArray = array();
        $chfFieldsSubArray = array();
        $chfFieldsArray = array();
        $sefFieldsSubArray = array();
        $sefFieldsArray = array();

        $TravellerRow = 13;
        $SAP_Row = 17;
        $EmailRow = 21;
        $MobileRow = 25;
        $LeaderRow = 29;
        $FlightRow = 33;
        $AiportOriginRow = 37;
        $AiportDestinationRow = 41;
        $DepartureDateRow = 45;

        $sefFieldsMaster = array();

        $sefShiftCounter = 1;
        $sefShiftAllCounter = 1;
        $sefPdfCounter = 0;

        for ($q=0; $q < sizeof($bookingsQuote); $q++) {

            $tradeType = $bookingsQuote[$q]['trade_type'];
            $employee = $bookingsQuote[$q]['UserId'];
            $empName = $bookingsQuote[$q]['emp_name'];
            $empFirstName = $bookingsQuote[$q]['emp_first_name'];
            $empLastName = $bookingsQuote[$q]['emp_last_name'];
            $empRehire = $bookingsQuote[$q]['emp_rehire'];
            $empPreferredName = $bookingsQuote[$q]['preferred_name'];
            $empMiddleNames = $bookingsQuote[$q]['middle_names'];
            $empTitle = $bookingsQuote[$q]['emp_title'];
            $empGender = $bookingsQuote[$q]['emp_gender'];
            $empBirthDate = $bookingsQuote[$q]['birth_date'];
            $empSap = $bookingsQuote[$q]['emp_sap'];
            $requestMobiliser = $bookingsQuote[$q]['request_mobiliser'];

            $bookingRateCode = $bookingsQuote[$q]['booking_rate_code'];
            $bookingRate = $bookingsQuote[$q]['booking_rate'];
            $bookingHours = $bookingsQuote[$q]['booking_hours'];

            //$marker = $q." - ".$tradeType." - ".$empName;
            $shiftTypeMarker = $q." - ".$tradeType." - ".$empName;
            $empArrayMarker = "EMP ARRAY: ".$typeCounter ." - ".$q." - ".$tradeType." - ".$empName;
            //$tradeArrayMarker = "TRADE ARRAY: ".$typeCounter ." - ".$q." - ".$tradeType." - ".$empName;

            //dump($marker);

            $shiftHours = $shiftHours + $bookingHours;

            //SPLIT STARTTIME
            $startTimeStr = $bookingsQuote[$q]['start_time'];
            $startTimeArray = explode(" ", $startTimeStr);
            $amPm = $startTimeArray[1];

            //dump("AMPM: ".$amPm);

            //if ($bookingsQuote[$q]['start_time'] == '06:01 AM') {

            if($amPm == 'AM'){
                $dayMarker = 'DAY: '.$employee." - ".$bookingsQuote[$q]['start_time'];
                //dump($dayMarker);
                $flightNum = 'AM';
                //$shiftTypeMarker = $marker. " - ".$q." - ".$tradeType." - ".$empName;
                $dayShiftCount++;
            } else {
                $dayMarker = 'NIGHT: '.$employee." - ".$bookingsQuote[$q]['start_time'];
                //dump($dayMarker);
                $flightNum = 'PM';
                //$shiftTypeMarker = $marker. " - ".$q." - ".$tradeType." - ".$empName;
                $nightShiftCount++;
            }

            if($empCounter == 0){
                $startDay = $bookingsQuote[$q]['start_date'];
            }

            //dump("EMP COUNT: ".$employee." - " .$empCounter . " - ". $startDay );

            $endDay = $bookingsQuote[$q]['end_date'];

            $empCounter++;

            if ($bookingsQuote[$q]['ShiftId'] != $bookingsQuote[$q + 1]['ShiftId']) {

                //BUILD EMPLOYEE ARRAY
                //$empChfSubArray = array();

                if(!in_array($employee,$empPdfChkArray)) {

                    $empPdfChkArray[] = $employee;
                    $empChfSubArray[] = $employee;
                }

                //dump($empChfSubArray);

                $empShiftDetsArray = array(
                    "day_shifts" => $dayShiftCount,
                    "night_shifts" => $nightShiftCount,
                    "start_day" => $startDay,
                    "end_day" => $endDay,
                );

                array_push($empShiftArray, $empShiftDetsArray);

                $empShiftDetsArray = array();

                $dayShiftCount = 0;
                $nightShiftCount = 0;
                //$empCounter = 0;

                //BUILD THE SEF FIELDS HERE
                //SINGLE ROW FOR EACH SHIFT

                //BUILD THE FIELD FOR EACH SHIFT THEN
                //array_merge($a, $b);
                //THEN APPEND TO EMP ID ARRAY

                //$numSefFieldsArray = 1;

                //dump($shiftTypeMarker);
                //dump($sefShiftCounter);
                //dump($TravellerRow);

                //dump("SEF COUNT ALL: ".$sefShiftAllCounter);

                //dump("EMP: ".$employee. " - ".$startDay ." - SHIFT COUNT: ".$sefShiftCounter);

                ${"sefFieldValuesArray".$sefShiftCounter} = array(
                    array(
                        "field_id" => $TravellerRow,
                        "field_value" => $empFirstName . " " . $empLastName,
                    ),
                    array(
                        "field_id" => $SAP_Row,
                        "field_value" => $empSap,
                    ),
                    array(
                        "field_id" => $EmailRow,
                        "field_value" => 'allan.hyde@livepages.com.au',
                    ),
                    array(
                        "field_id" => $MobileRow,
                        "field_value" => '0408702047',
                    ),
                    array(
                        "field_id" => $LeaderRow,
                        "field_value" => $requestMobiliser,
                    ),
                    array(
                        "field_id" => $FlightRow,
                        "field_value" => $flightNum,
                    ),
                    array(
                        "field_id" => $AiportOriginRow,
                        "field_value" => 'Perth',
                    ),
                    array(
                        "field_id" => $AiportDestinationRow,
                        "field_value" => 'Brockman 2',
                    ),
                    array(
                        "field_id" => $DepartureDateRow,
                        "field_value" => $startDay,
                    )
                );

                if ($sefShiftCounter == 1) {
                    //dump("MERGE FIRST: ".$sefShiftCounter);
                    $sefFieldsMaster = $sefFieldValuesArray1;
                    //$sefFieldsMaster = $sefFieldValuesArray.$sefShiftAllCounter;
                    //dump(${"sefFieldValuesArray".$sefShiftCounter}[0]);
                } else {
                    //dump("MERGE NEXT: ".$sefShiftCounter);
                    $sefFieldsMaster = array_merge($sefFieldsMaster, ${"sefFieldValuesArray" . $sefShiftCounter});
                    //$sefFieldsMaster = array_merge($sefFieldsMaster, ${"sefFieldValuesArray" . $sefShiftAllCounter});
                    //dump(${"sefFieldValuesArray".$sefShiftCounter}[0]);
                }

                $TravellerRow = $TravellerRow + 1;
                $SAP_Row = $SAP_Row + 1;
                $EmailRow = $EmailRow + 1;
                $MobileRow = $MobileRow + 1;
                $LeaderRow = $LeaderRow + 1;
                $FlightRow = $FlightRow + 1;
                $AiportOriginRow = $AiportOriginRow + 1;
                $AiportDestinationRow = $AiportDestinationRow + 1;
                $DepartureDateRow = $DepartureDateRow + 1;

                $sefShiftCounter++;
                $sefShiftAllCounter++;

                if(($sefShiftAllCounter -1) % 4 == 0) {

                    //END CURRENT ARRAY

                    //dump("END CURRENT ARRAY: ".$sefShiftCounter);

                    $sefFieldValuesArray = array(
                        "emp_id" => $employee,
                        "fields" => array()
                    );

                    //dump($sefFieldsMaster);

                    $sefFieldValuesArray['fields'] = $sefFieldsMaster;

                    //dump($sefFieldValuesArray);

                    $sefFieldsMaster = array();

                    //PUSH EMP SEF TO SEF SUB ARRAY
                    array_push($sefFieldsSubArray, $sefFieldValuesArray);
                    array_push($sefFieldsArray, $sefFieldsSubArray);

                    $sefFieldValuesArray = array();
                    $sefFieldsSubArray = array();

                    $sefPdfCounter++;

                    //START NEW ARRAY

                    //dump("START NEW ARRAY: ".$sefShiftCounter);

                    //dump("NEXT SHIFT: ".$bookingsQuote[$q + 1]['ShiftId']);

                    if($bookingsQuote[$q]['emp_name'] == $bookingsQuote[$q + 1]['emp_name']) {

                        //dump("ADDING NEW ARRAY: ".$sefShiftCounter);

                        $sefFieldValuesArray = array(
                            "emp_id" => $employee,
                            "fields" => array()
                        );

                        $TravellerRow = 13;
                        $SAP_Row = 17;
                        $EmailRow = 21;
                        $MobileRow = 25;
                        $LeaderRow = 29;
                        $FlightRow = 33;
                        $AiportOriginRow = 37;
                        $AiportDestinationRow = 41;
                        $DepartureDateRow = 45;

                    }

                }

                $empCounter = 0;

            }

            if ($bookingsQuote[$q]['emp_name'] != $bookingsQuote[$q + 1]['emp_name']) {

                //SEFS FILL EMPTY ROWS

                //dump("EMPTY COUNT: ".$sefShiftCounter);

                $checkEmptyRows = $sefShiftCounter - 1;

                $emptySefRows = 4 - $checkEmptyRows % 4;

                //dump("EMPTY ROWS: ".$emptySefRows);

                if($emptySefRows < 4) {

                    //dump("FILLING EMPTY ROWS: ".$emptySefRows);

                    for ($e = 0; $e < $emptySefRows; $e++) {

                        ${"sefFieldValuesArray" . $sefShiftCounter} = array(
                            array(
                                "field_id" => $TravellerRow,
                                "field_value" => " ",
                            ),
                            array(
                                "field_id" => $SAP_Row,
                                "field_value" => " ",
                            ),
                            array(
                                "field_id" => $EmailRow,
                                "field_value" => " ",
                            ),
                            array(
                                "field_id" => $MobileRow,
                                "field_value" => " ",
                            ),
                            array(
                                "field_id" => $LeaderRow,
                                "field_value" => " ",
                            ),
                            array(
                                "field_id" => $FlightRow,
                                "field_value" => " ",
                            ),
                            array(
                                "field_id" => $AiportOriginRow,
                                "field_value" => " ",
                            ),
                            array(
                                "field_id" => $AiportDestinationRow,
                                "field_value" => " ",
                            ),
                            array(
                                "field_id" => $DepartureDateRow,
                                "field_value" => " ",
                            )
                        );

                        //dump("MERGE EMPTY: ".$sefShiftCounter);
                        $sefFieldsMaster = array_merge($sefFieldsMaster, ${"sefFieldValuesArray" . $sefShiftCounter});
                        //dump(${"sefFieldValuesArray".$sefShiftCounter}[0]);

                        $TravellerRow = $TravellerRow + 1;
                        $SAP_Row = $SAP_Row + 1;
                        $EmailRow = $EmailRow + 1;
                        $MobileRow = $MobileRow + 1;
                        $LeaderRow = $LeaderRow + 1;
                        $FlightRow = $FlightRow + 1;
                        $AiportOriginRow = $AiportOriginRow + 1;
                        $AiportDestinationRow = $AiportDestinationRow + 1;
                        $DepartureDateRow = $DepartureDateRow + 1;

                    }

                }

                //dump("FINAL SHIFT COUNTER: ".$sefShiftCounter);

                if(($sefShiftCounter -1) % 4 != 0) {

                    $sefFieldValuesArray = array(
                        "emp_id" => $employee,
                        "fields" => array()
                    );

                    //SET MERGED FIELDS ARRAY
                    $sefFieldValuesArray['fields'] = $sefFieldsMaster;

                    //UNSET FIELDS MASTER
                    $sefFieldsMaster = array();

                    //PUSH EMP SEF TO SEF SUB ARRAY
                    array_push($sefFieldsSubArray, $sefFieldValuesArray);
                    array_push($sefFieldsArray, $sefFieldsSubArray);

                    $sefPdfCounter++;

                }

                $sefFieldValuesArray = array();
                $sefFieldsSubArray = array();

                //RESET SEF FIELDS VALUES
                $sefFieldValuesArray['fields'] = array();

                $sefFieldsSubsArray = array();

                $sefShiftCounter = 1;
                $sefShiftAllCounter = 1;

                $TravellerRow = 13;
                $SAP_Row = 17;
                $EmailRow = 21;
                $MobileRow = 25;
                $LeaderRow = 29;
                $FlightRow = 33;
                $AiportOriginRow = 37;
                $AiportDestinationRow = 41;
                $DepartureDateRow = 45;

                ////

                //dump($empArrayMarker);

                //BUILD EMP ARRAY - DRIVES NUMBER OF PDFS FOR EACH EMPLOYEE FOR EACH PDF TYPE

                $empArray = array(
                    "emp_name" => $empName,
                    "emp_shifts" => $empShiftArray
                );

                $empShiftArray = array();

                //TERMINATE EMPLOYEE ARRAY
                array_push($empChfPdfArray,$empChfSubArray);

                $empChfSubArray = array();

                //dump($empChfPdfArray);

                //dump($marker);

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

                //LOOP AND CREATE AN ARRAY FOR EACH FIELD VALUES ARRAY

                $numChfFieldsArray = 1;

                for($f = 0; $f < $numChfFieldsArray; $f++) {

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
                                "field_value" => $empFirstName . " " . $empMiddleNames,
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

                    array_push($chfFieldsSubArray, $chfFieldValuesArray);

                    //dump($chfFieldsSubArray);

                    $chfFieldValuesSubArray = array();

                }

                //dump($fieldValuesArray);

                array_push($chfFieldsArray, $chfFieldsSubArray);

                $chfFieldsSubArray = array();

                //////

                array_push($shiftArray,$empArray);

                $empArray = array();

            }

            if ($bookingsQuote[$q]['trade_type'] != $bookingsQuote[$q + 1]['trade_type']) {

                //dump($tradeArrayMarker);

                //dump($shiftArray);

                $tradeType = $bookingsQuote[$q]['trade_type'];
                $bookingSubArray['trade_type'] = $tradeType;
                $bookingSubArray['hours'] = $shiftHours;
                $bookingSubArray['rate'] = $bookingRate;
                $bookingSubArray['rate_code'] = $bookingRateCode;
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

        //sort($empPdfArray);
        //dump($empPdfArray);

        //dump("SEF: ".$sefPdfCounter);

        $chfUpdate = $this->chfArray->updateRequest(
            $reqId,
            $empChfPdfArray,
            $chfFieldsArray,
            $sefFieldsArray,
            $updateRioPdfs,
            $sefPdfCounter
        );

        return $quoteBookings;
    }

    private function compareBookings($a, $b){
        $retval = strnatcmp($a['trade_type'], $b['trade_type']);
        if(!$retval) $retval = strnatcmp($a['emp_name'], $b['emp_name']);
        if(!$retval) $retval = strnatcmp($a['ShiftId'], $b['ShiftId']);
        if(!$retval) $retval = strnatcmp($a['StartDay'], $b['StartDay']);
        return $retval;
    }

}