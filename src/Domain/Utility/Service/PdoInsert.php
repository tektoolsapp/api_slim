<?php

namespace App\Domain\Utility\Service;

class PdoInsert
{

    public function pdoInsert($fields)
    {
        return "(" . implode(",", array_map(function ($f) { return "`$f`"; },
            array_keys($fields))) . ")"
        . " VALUES (" . implode(",", array_map(function ($f) { return ":$f"; },
            array_keys($fields))) . ")";
    }
}