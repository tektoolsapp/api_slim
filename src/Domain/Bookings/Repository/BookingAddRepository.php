<?php

namespace App\Domain\Bookings\Repository;

use PDO;
use App\Domain\Utility\Service\SchedulerRecurrence;
use App\Domain\Utility\Repository\BookingShiftMaxRepository;

class BookingAddRepository
{
    private $connection;
    private $recurrence;
    private $maxShifts;

    public function __construct(PDO $connection, SchedulerRecurrence $recurrence, BookingShiftMaxRepository $maxShifts)
    {
        $this->connection = $connection;
        $this->recurrence = $recurrence;
        $this->maxShifts = $maxShifts;

    }

    public function insertBooking(array $booking)
    {
        $maxShift = $this->maxShifts->getMaxShift();
        $maxShift = $maxShift[0];

        $recurrenceChk = explode(";",rtrim($booking['RecurrenceRule'], ';'));

        //dump(sizeof($recurrenceChk));

        date_default_timezone_set('Australia/West');

        $startDate = date("m-d-Y", strtotime($booking['Start']));
        $startDateArray = explode("-",$startDate);

        $startTime = date("H-i", strtotime($booking['Start']));
        $startTimeArray = explode("-",$startTime);

        //dump($booking['Start']);
        //dump($startTimeArray);

        $st = mktime(
            $startTimeArray[0],
            $startTimeArray[1],
            0,
            $startDateArray[0],
            $startDateArray[1],
            $startDateArray[2]
        );

        date_default_timezone_set('Australia/West');

        $endDate = date("m-d-Y", strtotime($booking['End']));
        $endDateArray = explode("-",$endDate);

        $endTime = date("H-i", strtotime($booking['End']));
        $endTimeArray = explode("-",$endTime);

        //dump($booking['End']);
        //dump($endTimeArray);

        $et = mktime(
            $endTimeArray[0],
            $endTimeArray[1],
            0,
            $endDateArray[0],
            $endDateArray[1],
            $endDateArray[2]
        );

        $durationRaw = $et - $st;

        //dump("DURATION");
        //dump($durationHrs);

        $usersArray = $booking['UserId'];

        //dump($usersArray);

        //dump(sizeof($usersArray));

        $thisUserArray = array();

        if (sizeof($recurrenceChk) > 1) {

            $ruleDates = $this->recurrence->getRuleDates($booking['RecurrenceRule']);

            //dump($ruleDates);

            $batchId = mt_rand(100000, 999999);

            $models = array();

            for ($u = 0; $u < sizeof($usersArray); $u++) {

                $thisUser = $usersArray[$u];

                $shiftId = (int)$maxShift + 1;
                $maxShift++;

                //dump($shiftId);
                //dump($maxShift);


                //$userMsg = "U" . $u . " :" . $thisUser;
                //dump($userMsg);

                //CREATE A UNIQUE USERID ARRAY FOR EACH USER AND ASSIGN TO BOOKING[USERID]

                $thisUserArray[] = $thisUser;

                $booking['UserId'] = $thisUserArray;

                $thisUserArray = array();

                for ($b = 0; $b < sizeof($ruleDates); $b++) {

                    $thisDate = $ruleDates[$b];
                    $thisDateArray = explode("-", $thisDate);

                    $thisStartDate = mktime(
                        $startTimeArray[0],
                        $startTimeArray[1],
                        0,
                        $thisDateArray[1],
                        $thisDateArray[0],
                        $thisDateArray[2]
                    );

                    $theStartDate = strftime('%Y-%m-%dT%H:%M:%S', $thisStartDate);
                    //dump($theStartDate);
                    $thisEndDate = $thisStartDate + $durationRaw;

                    $theEndDate = strftime('%Y-%m-%dT%H:%M:%S', $thisEndDate);
                    //dump($theEndDate);

                    $booking['BatchId'] = $batchId;
                    $booking['ShiftId'] = $shiftId;
                    $booking['Start'] = $theStartDate;
                    $booking['End'] = $theEndDate;

                    $postBooking = $this->postBooking($booking);

                    array_push($models, $postBooking);

                }

            }

            $result['models'] = $models;

            //$allBookings = $this->bookings->getBookings();

            return $models;

        } else {

            $batchId = mt_rand(100000, 999999);
            $booking['BatchId'] = $batchId;

            $models = array();

            for ($u = 0; $u < sizeof($usersArray); $u++) {

                $thisUser = $usersArray[$u];

                //$shiftId = mt_rand(100000, 999999);
                $shiftId = (int)$maxShift + 1;
                $maxShift++;

                //dump($shiftId);
                //dump($maxShift);

                //$userMsg = "U" . $u . " :" . $thisUser;
                //dump($userMsg);

                //CREATE A UNIQUE USERID ARRAY FOR EACH USER AND ASSIGN TO BOOKING[USERID]

                $thisUserArray[] = $thisUser;

                $booking['UserId'] = $thisUserArray;
                $booking['ShiftId'] = $shiftId;

                $thisUserArray = array();

                $postBooking = $this->postBooking($booking);

                array_push($models, $postBooking);
            }

            return $models;

        }

    }

    public function postBooking(array $booking) {

        $booking['StartDay'] = strtotime($booking['Start']);
        $booking['EndDay'] = strtotime($booking['End']);

        $bookingId = mt_rand(100000, 999999);
        $booking['BookingId'] = $bookingId;
        $booking['UserId'] = implode(",",$booking['UserId']);

        //dump($booking['UserId']);

        $booking['RecurrenceRule'] = '';

        if($booking['IsAllDay'] == false){
            $booking['IsAllDay'] = 0;
        } else {
            $booking['IsAllDay'] = 1;
        }

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

        $booking['UserId'] = explode(",",$booking['UserId']);
        $booking['TranId'] = (int)$this->connection->lastInsertId();

        return $booking;

    }
}
