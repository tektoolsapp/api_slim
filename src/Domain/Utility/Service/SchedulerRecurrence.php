<?php

namespace App\Domain\Utility\Service;

use RRule\RRule;

class SchedulerRecurrence
{
    public function getRuleDates($rule)
    {

        $ruleArray = explode(";",$rule);

        //loop rule and create rrule array

        $ruleElementArray = array();

        foreach ($ruleArray as $ruleElement) {

            $ruleSplit = explode("=", $ruleElement);

            //dump($ruleSplit);

            $ruleElementArray[$ruleSplit[0]] = $ruleSplit[1];

        }


        if(isset($ruleElementArray['DTSTART'])){

            $startDate = $ruleElementArray['DTSTART'];

            $startDateStr = strtotime($startDate);

            $startDateFormat = date("Y-m-d",$startDateStr);

            $ruleElementArray['DTSTART'] = $startDateFormat;
        }

        //The UNTIL or COUNT rule parts MUST NOT occur in the same rule

        if(isset($ruleElementArray['COUNT']) && isset($ruleElementArray['UNTIL'])){

            unset($ruleElementArray['UNTIL']);

        }

        if(isset($ruleElementArray['UNTIL'])) {

            $endDate = $ruleElementArray['UNTIL'];

            $endDateStr = strtotime($endDate);

            $endDateFormat = date("Y-m-d", $endDateStr);

            $ruleElementArray['UNTIL'] = $endDateFormat;
        }

        //dump($ruleElementArray);

        $rrule = new RRule($ruleElementArray);

        $ruleOutputArray = array();

        foreach ($rrule as $occurrence) {
            //echo $occurrence->format('D d M Y'),", ";
            //dump($occurrence);
            $ruleOutputArray[] = $occurrence->format('D d M Y');
        }

        foreach ($ruleOutputArray as $key=>$val) {

            $schedulerDateStr = strtotime($val);
            //date_default_timezone_set('Australia/West');
            $schedulerDate = date("d-m-Y h:m", $schedulerDateStr);
            $ruleOutputArray[$key] = $schedulerDate;
        }

        return($ruleOutputArray);
    }
}