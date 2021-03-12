<?php

namespace App\Domain\Api\Repository;

use PDO;

class ApiTestFetchRepository
{
    private $connection;
   
    public function __construct(
            PDO $connection
        )
    {
        $this->connection = $connection;
    }

    public function getApiTest($testId)
    {
        $sql = "SELECT * FROM test WHERE test_id = :test_id";
        $statement = $this->connection->prepare($sql);
        $statement->execute(['test_id' => $testId]);

        $test = $statement->fetch();

        $returnArray = array(
            "data" => $test
        ); 

        return $returnArray;
    }
}