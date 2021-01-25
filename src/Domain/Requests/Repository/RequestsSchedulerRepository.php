<?php

namespace App\Domain\Requests\Repository;

use DomainException;
use PDO;
use MongoDB\Client as Mongo;

class RequestsSchedulerRepository
{
    private $connection;
    private $mongo;

    public function __construct(PDO $connection, Mongo $mongo)
    {
        $this->connection = $connection;
        $this->mongo = $mongo;
    }

    public function getRequests($param)
    {

        $allRequests = array();

        $sql = "SELECT ws_id FROM workspaces WHERE ws_type = 'request'";
        $statement = $this->connection->prepare($sql);
        $statement->execute();

        //$requests = $statement->fetchAll(PDO::FETCH_ASSOC);

        $statement->bindColumn('ws_id', $thisReqId);
        //$stj->bindColumn('opp_notes', $thisOppSubject);
        //$stj->bindColumn('customer_name', $thisOppCustomer);
        while ($statement->fetch (PDO::FETCH_BOUND)) {
            //$thisOppSubject = "#".$thisOppId." - ".$thisOppCustomer." - ".$thisOppSubject;
            $thisReqSubject = "#".$thisReqId;
            array_push ($allRequests,
                array("req" => $thisReqSubject
                )
            );
        }

        $resultsArray = array();

        for ($r = 0; $r < sizeof($allRequests); $r++) {

            if(stripos($allRequests[$r]['req'], $param) !== false) {
                array_push ($resultsArray, array(
                        "name" => $allRequests[$r]['req']
                    )
                );
            }

        }

        //dump($resultsArray);

        return $resultsArray;
    }
}