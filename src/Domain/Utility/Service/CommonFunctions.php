<?php

namespace App\Domain\Utility\Service;

class CommonFunctions
{
    public function searchArray($array, $key, $value)
    {
        $return = array();
        foreach ($array as $k => $subarray) {
            if (isset($subarray[$key]) && $subarray[$key] == $value) {
                $return[0] = $subarray;
                return $return;
            }
        }
    }

}




