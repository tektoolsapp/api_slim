<?php

namespace App\Domain\Bookings\Repository;

use PDO;
use App\Domain\Employees\Repository\EmployeesRepository;
use App\Domain\Employees\Repository\TradesRepository;
use App\Domain\Customers\Repository\CustomerSiteFetchRepository;
use App\Domain\Requests\Repository\RequestFetchRepository;
use App\Domain\Requests\Repository\RequestUpdateChfRepository;
use App\Domain\Utility\Service\CommonFunctions;

class BookingsNewQuoteFetchRepository
{
    private $connection;
    private $employees;
    private $trades;
    private $site;
    private $reqDets;
    private $chfArray;

    private $common;

    public function __construct(
        PDO $connection,
        EmployeesRepository $employees,
        TradesRepository $trades,
        CustomerSiteFetchRepository $site,
        RequestFetchRepository $reqDets,
        RequestUpdateChfRepository $chfArray,
        CommonFunctions $common
    )
    {
        $this->connection = $connection;
        $this->employees = $employees;
        $this->trades = $trades;
        $this->site = $site;
        $this->reqDets = $reqDets;
        $this->chfArray = $chfArray;
        $this->common = $common;
    }

    public function getBookingsQuote($reqId)
    {
        $employees = $this->employees->getEmployees();
        $request = $this->reqDets->getRequest($reqId);
        $trades = $this->trades->getTrades();
        //$sites = $this->sites->getSites();

        $siteLocation = $request['ws_site_dept'];
        //dump("SITE");
        //dump($siteLocation);
        $siteDetscArray = $this->site->getCustomerSite($siteLocation);
        $siteDesc = $siteDetscArray['site_desc'];
        //dump($siteDesc);

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
            
            //dump("TRADE TYPE 2");
            //dump($tradeType2)   ;
            
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

        $sql = "SELECT * FROM bookings WHERE RequestId = :RequestId AND BookingType = 'On' AND BookingStatus <> 'X';";
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
            //$tradeType = $employeeLookup[0]['trade_type'];

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

            $empEmail = $employeeLookup[0]['emp_email'];
            $bookingsQuote[$b]['emp_email'] = $empEmail;

            $empMobile = $employeeLookup[0]['emp_mobile'];
            $bookingsQuote[$b]['emp_mobile'] = $empMobile;

            $empSap = $employeeLookup[0]['emp_sap'];
            $bookingsQuote[$b]['emp_sap'] = $empSap;
            $bookingsQuote[$b]['emp_name'] = $empName;
            //TRADE TYPE LOOKUP
            
            $tradeType = $bookingsQuote[$b]['SwingTradeType'];
            
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

        //NEW SECTION - SITE ENTRY
        /* $SiteRow = 49;
        $VillageRow = 53;
        $ArrivalDateRow = 57;
        $DepartureDate2Row = 61;
        $SiteContactRow = 65;
        $ShiftTypeRow = 69;
        $PDARow = 73;
        $CostCentreRow = 77; */

        $SiteRow = 53;
        $VillageRow = 57;
        $ArrivalDateRow = 61;
        $DepartureDate2Row = 65;
        $SiteContactRow = 69;
        $ShiftTypeRow = 73;
        $PDARow = 77;
        $CostCentreRow = 81;

        //SITE ROW EMPTY

        $siteRowEmptyDefault = array(
            array(
                "field_id" => 55,
                "field_value" => " ",
            ),
            array(
                "field_id" => 56,
                "field_value" => " ",
            ),
            array(
                "field_id" => 59,
                "field_value" => " ",
            ),
            array(
                "field_id" => 60,
                "field_value" => " ",
            ),
            array(
                "field_id" => 63,
                "field_value" => " ",
            ),
            array(
                "field_id" => 64,
                "field_value" => " ",
            ),
            array(
                "field_id" => 67,
                "field_value" => " ",
            ),
            array(
                "field_id" => 68,
                "field_value" => " ",
            ),
            array(
                "field_id" => 71,
                "field_value" => " ",
            ),
            array(
                "field_id" => 72,
                "field_value" => " ",
            ),
            array(
                "field_id" => 75,
                "field_value" => " ",
            ),
            array(
                "field_id" => 76,
                "field_value" => " ",
            ), 
            array(
                "field_id" => 79,
                "field_value" => " ",
            ),
            array(
                "field_id" => 80,
                "field_value" => " ",
            ),
            array(
                "field_id" => 83,
                "field_value" => " ",
            ), 
            array(
                "field_id" => 84,
                "field_value" => " ",
            ),
            array(
                "field_id" => $ShiftTypeRow + 1,
                "field_value" => " ",
            ),
            array(
                "field_id" => $ShiftTypeRow + 2,
                "field_value" => " ",
            ),
            array(
                "field_id" => $PDARow,
                "field_value" => " ",
            ),
            array(
                "field_id" => $PDARow + 1,
                "field_value" => " ",
            ),
            array(
                "field_id" => $PDARow + 2,
                "field_value" => " ",
            ),
            array(
                "field_id" => $CostCentreRow,
                "field_value" => " ",
            ), 
            array(
                "field_id" => $CostCentreRow + 1,
                "field_value" => " ",
            ),
            array(
                "field_id" => $CostCentreRow + 2,
                "field_value" => " ",
            )   
        );

        //dump("DEFAULT SITES:");
        //dump($siteRowEmptyDefault);

        $sefFieldsMaster = array();

        $sefShiftCounter = 1;
        $sefShiftAllCounter = 1;
        $sefPdfCounter = 0;

        //$numSwings = 2;

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
            
            $empEmail = $bookingsQuote[$q]['emp_email'];
            $empMobile = $bookingsQuote[$q]['emp_mobile'];
            
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
                $flightNum2 = 'PM';
                $shiftType = 'DS';
                //$shiftTypeMarker = $marker. " - ".$q." - ".$tradeType." - ".$empName;
                $dayShiftCount++;
            } else {
                $dayMarker = 'NIGHT: '.$employee." - ".$bookingsQuote[$q]['start_time'];
                //dump($dayMarker);
                $flightNum = 'PM';
                $flightNum2 = 'AM';
                $shiftType = 'NS';

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
                    "shift_rate_code" => $bookingRateCode,
                    "shift_rate" => $bookingRate,
                    "shift_hours" => $shiftHours,
                    "day_shifts" => $dayShiftCount,
                    "night_shifts" => $nightShiftCount,
                    "start_day" => $startDay,
                    "end_day" => $endDay,
                );

                array_push($empShiftArray, $empShiftDetsArray);

                $empShiftDetsArray = array();

                $dayShiftCount = 0;
                $nightShiftCount = 0;
                $shiftHours = 0;
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
                
                //!(value % 2)
                
                if($sefShiftCounter == 1 || $sefShiftCounter % 2 != 0){
                //if($sefShiftCounter == 1 || ($sefShiftAllCounter) % 3 == 0){
                    $sefEmp = $empFirstName . " " . $empLastName;    
                    $sefEmpSap = $empSap;
                    $sefEmpEmail = $empEmail;
                    $sefEmpMobile = $empMobile;
                    $sefRequestMobiliser = $requestMobiliser;
                } else {
                    $sefEmp = ' ';
                    $sefEmpSap = ' ';
                    $sefEmpEmail = ' ';
                    $sefEmpMobile = ' ';
                    $sefRequestMobiliser = ' ';
                }

                ${"sefFieldValuesArray".$sefShiftCounter} = array(
                    array(
                        "field_id" => $TravellerRow,
                        "field_value" => $sefEmp,
                    ),
                    array(
                        "field_id" => $TravellerRow + 1,
                        "field_value" => " ",
                    ),
                    array(
                        "field_id" => $TravellerRow + 2,
                        "field_value" => " ",
                    ),
                    array(
                        "field_id" => $TravellerRow + 3,
                        "field_value" => " ",
                    ),
                    array(
                        "field_id" => $SAP_Row,
                        "field_value" => $sefEmpSap,
                    ),
                    array(
                        "field_id" => $SAP_Row + 1,
                        "field_value" => " ",
                    ),
                    array(
                        "field_id" => $SAP_Row + 2,
                        "field_value" => " ",
                    ),
                    array(
                        "field_id" => $SAP_Row + 3,
                        "field_value" => " ",
                    ),
                    array(
                        "field_id" => $EmailRow,
                        "field_value" => $sefEmpEmail,
                    ),
                    array(
                        "field_id" => $EmailRow + 1,
                        "field_value" => " ",
                    ),
                    array(
                        "field_id" => $EmailRow + 2,
                        "field_value" => " ",
                    ),
                    array(
                        "field_id" => $EmailRow + 3,
                        "field_value" => " ",
                    ),    
                    array(
                        "field_id" => $MobileRow,
                        "field_value" => $sefEmpMobile,
                    ),
                    array(
                        "field_id" => $MobileRow + 1,
                        "field_value" => " ",
                    ),
                    array(
                        "field_id" => $MobileRow + 2,
                        "field_value" => " ",
                    ),
                    array(
                        "field_id" => $MobileRow + 3,
                        "field_value" => " ",
                    ),
                    array(
                        "field_id" => $LeaderRow,
                        "field_value" => $sefRequestMobiliser,
                    ),
                    array(
                        "field_id" => $LeaderRow + 1,
                        "field_value" => " ",
                    ),
                    array(
                        "field_id" => $LeaderRow + 2,
                        "field_value" => " ",
                    ),
                    array(
                        "field_id" => $LeaderRow + 3,
                        "field_value" => " ",
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
                        "field_value" => $siteDesc,
                    ),
                    array(
                        "field_id" => $DepartureDateRow,
                        "field_value" => $startDay,
                    ),

                    //ADDED 12/04
                    
                    array(
                        "field_id" => $FlightRow + 1,
                        "field_value" => $flightNum2,
                    ),
                    array(
                        "field_id" => $AiportOriginRow + 1,
                        "field_value" => $siteDesc,
                    ),
                    array(
                        "field_id" => $AiportDestinationRow + 1,
                        "field_value" => 'Perth',
                    ),
                    array(
                        "field_id" => $DepartureDateRow + 1 ,
                        "field_value" => $endDay,
                    ),

                    //ADDED 6/05
                    array(
                        "field_id" => $SiteRow,
                        "field_value" => $siteDesc,
                    ),
                    array(
                        "field_id" => $VillageRow,
                        "field_value" => " ",
                    ),
                    array(
                        "field_id" => $ArrivalDateRow,
                        "field_value" => $startDay,
                    ),
                    array(
                        "field_id" => $DepartureDate2Row,
                        "field_value" => $endDay,
                    ), 
                    array(
                        "field_id" => $SiteContactRow,
                        "field_value" => " ",
                    ), 
                    array(
                        "field_id" => $ShiftTypeRow,
                        "field_value" => $shiftType,
                    ),
                    array(
                        "field_id" => $PDARow,
                        "field_value" => " ",
                    ),
                    array(
                        "field_id" => $CostCentreRow,
                        "field_value" => " ",
                    ), 

                    /*
                    $SiteRow = 49;
                    $VillageRow = 53;
                    $ArrivalDateRow = 57;
                    $DepartureDate2Row = 61;
                    $SiteContactRow = 65;
                    $ShiftTypeRow = 69;
                    $PDARow = 73;
                    $CostCentreRow = 77;
                    */

                );
                
                //IF SITE ROW = 52 THE NEXT 2 ROWS ARE BLANK
                //APPRN THE BLANK ROWS

                

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
                $FlightRow = $FlightRow + 2;
                $AiportOriginRow = $AiportOriginRow + 2;
                $AiportDestinationRow = $AiportDestinationRow + 2;
                $DepartureDateRow = $DepartureDateRow + 2;
                //ADDED 6/5
                $SiteRow = $SiteRow + 1;
                $VillageRow = $VillageRow + 1;  
                $ArrivalDateRow = $ArrivalDateRow + 1;
                $DepartureDate2Row = $DepartureDate2Row + 1;
                $SiteContactRow = $SiteContactRow + 1;
                $ShiftTypeRow = $ShiftTypeRow + 1;
                $PDARow = $PDARow + 1;
                $CostCentreRow = $CostCentreRow + 1;
                
                $sefShiftCounter++;
                $sefShiftAllCounter++;

                //dump("SHIFT COUNTER: ", $sefShiftCounter);
                //dump("NUM SWINGS: ", $numSwings);

                //if(($sefShiftAllCounter -1) % 4 == 0) {
                if(($sefShiftAllCounter -1) % 2 == 0) {

                    //dump("CHECKING HERE");

                    //COUNT THE NUMBER OF SHIFTS
                        //UPDATE THE SWINGS
                        $sql = "SELECT COUNT(DISTINCT ShiftId) AS NumSwings FROM bookings WHERE 
                        RequestID = :RequestID AND
                        UserId = :UserId AND
                        BookingStatus <> 'X'";
                    $statement = $this->connection->prepare($sql);
                    $statement->execute(['RequestID' => $reqId,'UserId' => $employee]);

                    $numSwingsArray = $statement->fetch();

                    //dump("NUM EMP SWINGS: ",$numSwings);

                    $numSwings = $numSwingsArray['NumSwings'];
                    //dump("NUM EMP SWINGS: ",$numSwings);

                    //dump("SHIFT COUNTER:", $sefShiftCounter);

                    //dump("SITEROW CHECK: ",$SiteRow);

                    if($numSwings > 1 && $sefShiftCounter > 2){ 
                        //dump("MERGE SITE EMPTY");
                        //$sefFieldsMaster = array_merge($sefFieldsMaster, $siteRowEmptyDefault);  
                        $sefFieldsMaster = array_merge($sefFieldsMaster, $siteRowEmptyDefault);  
                    }
                    
                    //END CURRENT ARRAY

                    //FILL THE EMPTY FIELDS
                    /* if($sefShiftCounter > 1) {
                        ${"sefFieldValuesArray" . $sefShiftCounter}['14'] = " ";
                        ${"sefFieldValuesArray" . $sefShiftCounter}['15'] = " ";
                        ${"sefFieldValuesArray" . $sefShiftCounter}['16'] = " ";
                    } */

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

                        //NEW SECTION - SITE ENTRY
                        /* $SiteRow = 49;
                        $VillageRow = 53;
                        $ArrivalDateRow = 57;
                        $DepartureDate2Row = 61;
                        $SiteContactRow = 65;
                        $ShiftTypeRow = 69;
                        $PDARow = 73;
                        $CostCentreRow = 77; */

                        $SiteRow = 53;
                        $VillageRow = 57;
                        $ArrivalDateRow = 61;
                        $DepartureDate2Row = 65;
                        $SiteContactRow = 69;
                        $ShiftTypeRow = 73;
                        $PDARow = 77;
                        $CostCentreRow = 81;

                    }

                }

                $empCounter = 0;

            }

            if ($bookingsQuote[$q]['emp_name'] != $bookingsQuote[$q + 1]['emp_name']) {

                //dump("NUM SHIFTS: ", $numSwingss);
                
                //SEFS FILL EMPTY ROWS

                //dump("EMPTY COUNT: ".$sefShiftCounter);

                $checkEmptyRows = ($sefShiftCounter - 1) * 3;

                //2 -1 = 1

                $emptySefRows = 4 - $checkEmptyRows % 4;

                //dump("EMPTY ROWS: ".$emptySefRows);

                if($emptySefRows < 4) {

                    //dump("FILLING EMPTY ROWS: ".$emptySefRows);

                    //dump("EMP:");
                    //dump($bookingsQuote[$q]['emp_name']);
                    //dump("XX SITEROW:");
                    //dump($SiteRow);

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
                            ),
                            array(
                                "field_id" => $FlightRow + 1,
                                "field_value" => " ",
                            ),
                            array(
                                "field_id" => $AiportOriginRow + 1,
                                "field_value" => " ",
                            ),
                            array(
                                "field_id" => $AiportDestinationRow + 1,
                                "field_value" => " ",
                            ),
                            array(
                                "field_id" => $DepartureDateRow + 1,
                                "field_value" => " ",
                            )

                            //ADDED 6/5
                            /* array(
                                "field_id" => $SiteRow,
                                "field_value" => " ",
                            ),
                            array(
                                "field_id" => $VillageRow,
                                "field_value" => " ",
                            ),
                            array(
                                "field_id" => $ArrivalDateRow,
                                "field_value" => " ",
                            ),
                            array(
                                "field_id" => $DepartureDate2Row,
                                "field_value" => " ",
                            ), 
                            array(
                                "field_id" => $SiteContactRow,
                                "field_value" => " ",
                            ), 
                            array(
                                "field_id" => $ShiftTypeRow,
                                "field_value" => " ",
                            ),
                            array(
                                "field_id" => $PDARow,
                                "field_value" => " ",
                            ),
                            array(
                                "field_id" => $CostCentreRow,
                                "field_value" => " ",
                            )  */
                        );

                        if($e == ($emptySefRows - 1)){
                        
                            if($SiteRow == 54){

                                //dump("APPENDING: 54");
                                //dump("EMP:");
                                //dump($bookingsQuote[$q]['emp_name']);
                                //dump("SITEROW:");
                                //dump($SiteRow); 
                                
                                $siteRowEmpty = array(
                                    array(
                                        "field_id" => $SiteRow,
                                        "field_value" => " ",
                                    ),
                                    array(
                                        "field_id" => $SiteRow + 1,
                                        "field_value" => " ",
                                    ),
                                    array(
                                        "field_id" => $SiteRow + 2  ,
                                        "field_value" => " ",
                                    ),
                                    array(
                                        "field_id" => $VillageRow,
                                        "field_value" => " ",
                                    ),
                                    array(
                                        "field_id" => $VillageRow + 1,
                                        "field_value" => " ",
                                    ),
                                    array(
                                        "field_id" => $VillageRow + 2,
                                        "field_value" => " ",
                                    ),
                                    array(
                                        "field_id" => $ArrivalDateRow,
                                        "field_value" => " ",
                                    ),
                                    array(
                                        "field_id" => $ArrivalDateRow + 1,
                                        "field_value" => " ",
                                    ),
                                    array(
                                        "field_id" => $ArrivalDateRow + 2,
                                        "field_value" => " ",
                                    ),
                                    array(
                                        "field_id" => $DepartureDate2Row,
                                        "field_value" => " ",
                                    ),
                                    array(
                                        "field_id" => $DepartureDate2Row + 1,
                                        "field_value" => " ",
                                    ),
                                    array(
                                        "field_id" => $DepartureDate2Row + 2,
                                        "field_value" => " ",
                                    ), 
                                    array(
                                        "field_id" => $SiteContactRow,
                                        "field_value" => " ",
                                    ),
                                    array(
                                        "field_id" => $SiteContactRow + 1,
                                        "field_value" => " ",
                                    ),
                                    array(
                                        "field_id" => $SiteContactRow + 2,
                                        "field_value" => " ",
                                    ), 
                                    array(
                                        "field_id" => $ShiftTypeRow,
                                        "field_value" => " ",
                                    ),
                                    array(
                                        "field_id" => $ShiftTypeRow + 1,
                                        "field_value" => " ",
                                    ),
                                    array(
                                        "field_id" => $ShiftTypeRow + 2,
                                        "field_value" => " ",
                                    ),
                                    array(
                                        "field_id" => $PDARow,
                                        "field_value" => " ",
                                    ),
                                    array(
                                        "field_id" => $PDARow + 1,
                                        "field_value" => " ",
                                    ),
                                    array(
                                        "field_id" => $PDARow + 2,
                                        "field_value" => " ",
                                    ),
                                    array(
                                        "field_id" => $CostCentreRow,
                                        "field_value" => " ",
                                    ), 
                                    array(
                                        "field_id" => $CostCentreRow + 1,
                                        "field_value" => " ",
                                    ),
                                    array(
                                        "field_id" => $CostCentreRow + 2,
                                        "field_value" => " ",
                                    )   
                                );

                                //dump($siteRowEmpty);

                                ${"sefFieldValuesArray" . $sefShiftCounter} = array_merge(${"sefFieldValuesArray" . $sefShiftCounter}, $siteRowEmpty);

                                //dump("AFTER APPEND");
                                //dump(${"sefFieldValuesArray" . $sefShiftCounter});

                            } elseif($SiteRow == 55){

                                //dump("APPENDING: 55");

                                //dump("EMP:");
                                //dump($bookingsQuote[$q]['emp_name']);
                                //dump("SITEROW:");
                                //dump($SiteRow);    
                                     
                                $siteRowEmpty = array(
                                    array(
                                        "field_id" => $SiteRow,
                                        "field_value" => " ",
                                    ),  
                                    array(
                                        "field_id" => $SiteRow + 1,
                                        "field_value" => " ",
                                    ),
                                    array(
                                        "field_id" => $VillageRow,
                                        "field_value" => " ",
                                    ),
                                    array(
                                        "field_id" => $VillageRow + 1,
                                        "field_value" => " ",
                                    ),
                                    array(
                                        "field_id" => $ArrivalDateRow,
                                        "field_value" => " ",
                                    ),
                                    array(
                                        "field_id" => $ArrivalDateRow + 1,
                                        "field_value" => " ",
                                    ),
                                    array(
                                        "field_id" => $DepartureDate2Row,
                                        "field_value" => " ",
                                    ),
                                    array(
                                        "field_id" => $DepartureDate2Row + 1,
                                        "field_value" => " ",
                                    ), 
                                    array(
                                        "field_id" => $SiteContactRow,
                                        "field_value" => " ",
                                    ),
                                    array(
                                        "field_id" => $SiteContactRow + 1,
                                        "field_value" => " ",
                                    ), 
                                    array(
                                        "field_id" => $ShiftTypeRow,
                                        "field_value" => " ",
                                    ),
                                    array(
                                        "field_id" => $ShiftTypeRow + 1,
                                        "field_value" => " ",
                                    ),
                                    array(
                                        "field_id" => $PDARow,
                                        "field_value" => " ",
                                    ),
                                    array(
                                        "field_id" => $PDARow + 1,
                                        "field_value" => " ",
                                    ),
                                    array(
                                        "field_id" => $CostCentreRow,
                                        "field_value" => " ",
                                    ), 
                                    array(
                                        "field_id" => $CostCentreRow + 1,
                                        "field_value" => " ",
                                    )   
                                );
        
                                //dump($siteRowEmpty); 
                                
                                //dump("BEFORE APPEND");
                                //dump(${"sefFieldValuesArray" . $sefShiftCounter});
                                        
                                ${"sefFieldValuesArray" . $sefShiftCounter} = array_merge(${"sefFieldValuesArray" . $sefShiftCounter}, $siteRowEmpty);
        
                                //dump("AFTER APPEND");
                                //dump(${"sefFieldValuesArray" . $sefShiftCounter});
                                
                            }
                        }

                        //${"sefFieldValuesArray" . $sefShiftCounter} = array_merge(${"sefFieldValuesArray" . $sefShiftCounter}, $siteRowEmpty);
                
                        //dump("MERGE EMPTY: ".$sefShiftCounter);
                        $sefFieldsMaster = array_merge($sefFieldsMaster, ${"sefFieldValuesArray" . $sefShiftCounter});
                        //dump(${"sefFieldValuesArray".$sefShiftCounter}[0]);

                        $TravellerRow = $TravellerRow + 1;
                        $SAP_Row = $SAP_Row + 1;
                        $EmailRow = $EmailRow + 1;
                        $MobileRow = $MobileRow + 1;
                        $LeaderRow = $LeaderRow + 1;
                        $FlightRow = $FlightRow + 2;
                        $AiportOriginRow = $AiportOriginRow + 2;
                        $AiportDestinationRow = $AiportDestinationRow + 2;
                        $DepartureDateRow = $DepartureDateRow + 2;

                        //ADDED 6/5
                        /* $SiteRow = $SiteRow + 1;
                        $VillageRow = $VillageRow + 1;
                        $ArrivalDateRow = $ArrivalDateRow + 1;
                        $DepartureDate2Row = $DepartureDate2Row + 1;
                        $SiteContactRow = $SiteContactRow + 1;
                        $ShiftTypeRow = $ShiftTypeRow + 1;
                        $PDARow = $PDARow + 1;
                        $CostCentreRow = $CostCentreRow + 1; */

                    }
                }

                //dump("FIN SITEROW:", $SiteRow);
                
                //dump("FINAL SHIFT COUNTER: ".$sefShiftCounter);

                //dump($sefFieldsMaster);

                //dump("NUMSWINGS: ", $numSwings);

                $checkStage = ($sefShiftCounter -1) % 2;

                //dump("CHECK STAGE: ", $checkStage);

                //if(($sefShiftCounter -1) % 4 != 0) {
                if(($sefShiftCounter -1) % 2 != 0) {

                    if($numSwings > 1){
                        //dump("MERGE SITE EMPTY");
                        //$sefFieldsMaster = array_merge($sefFieldsMaster, $siteRowEmptyDefault);  
                        $sefFieldsMaster = array_merge($sefFieldsMaster, $siteRowEmptyDefault);  
                    }
                    
                    
                    //dump("APPENDING LATEST");
                    
                    $sefFieldValuesArray = array(
                        "emp_id" => $employee,
                        "fields" => array()
                    );

                    //dump("SET FIELD MASTER");
                    //dump($sefFieldsMaster);

                    //SET MERGED FIELDS ARRAY
                    $sefFieldValuesArray['fields'] = $sefFieldsMaster;

                    //dump("FIELDS:");
                    //dump($sefFieldValuesArray['fields']);

                    //UNSET FIELDS MASTER
                    $sefFieldsMaster = array();

                    //PUSH EMP SEF TO SEF SUB ARRAY
                    array_push($sefFieldsSubArray, $sefFieldValuesArray);
                    array_push($sefFieldsArray, $sefFieldsSubArray);

                    $sefPdfCounter++;

                    //  dump("COUNTER", $sefPdfCounter);

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

                //NEW SECTION - SITE ENTRY
                /* $SiteRow = 49;
                $VillageRow = 53;
                $ArrivalDateRow = 57;
                $DepartureDate2Row = 61;
                $SiteContactRow = 65;
                $ShiftTypeRow = 69;
                $PDARow = 73;
                $CostCentreRow = 77; */

                $SiteRow = 53;
                $VillageRow = 57;
                $ArrivalDateRow = 61;
                $DepartureDate2Row = 65;
                $SiteContactRow = 69;
                $ShiftTypeRow = 73;
                $PDARow = 77;
                $CostCentreRow = 81;

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