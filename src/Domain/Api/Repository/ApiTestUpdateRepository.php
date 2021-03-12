<?php

namespace App\Domain\Api\Repository;

use PDO;

class ApiTestUpdateRepository
{
    private $connection;

    public function __construct(PDO $connection)
    {
        $this->connection = $connection;
    }

    public function updateTest($testData)
    {
        
        //dump($testData);

        $testId = $testData['test_id'];
        unset($testData['test_id']);
        
        $testData['test_id'] = $testId;
        $columnsArray = array_keys($testData);
        $columnString = '';

        for ($c=0; $c < sizeof($columnsArray)-1; $c++) {
            $columnString .= $columnsArray[$c]." = ?,";
        }

        $columnString = rtrim($columnString, ',');
        $valuesArray = array_values($testData);

        try {
            $query = "UPDATE test SET $columnString WHERE test_id = ?";
            $this->connection->prepare($query)->execute($valuesArray);
        } catch(\PDOException $e) {
            //die("Oh noes! There's an error in the query!");
        }

        //dump($e);
        
        if($e){
            $result = $e->getMessage();
            $responseCode = 400;
        } else {
            $result = "ok";
            $responseCode = 201;
        }

        $test = array(
            "status" => $responseCode,
            "payload" => array(
                "result" => $result
            )
        );

        return $test;

    }
}
