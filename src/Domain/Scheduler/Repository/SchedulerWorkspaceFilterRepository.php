<?php

namespace App\Domain\Scheduler\Repository;

use DomainException;
use PDO;

class SchedulerWorkspaceFilterRepository
{
    private $connection;

    public function __construct(
            PDO $connection 
        )
    {
        $this->connection = $connection;
    }

    public function getResources($filter)
    {

        //dump($filter['trades']);

        $tradeArray = array();
        $tradeFilterArray = array();

        $tradesFilter = $filter['trades'];

        for ($f = 0; $f < sizeof($tradesFilter); $f++) {
            $thisTrade = $tradesFilter[$f];

            $tradeArray = array(
                'trade_type' => $thisTrade
            );

            array_push($tradeFilterArray,$tradeArray);
            $tradeArray = array();
        }    

        //dump($tradeFilterArray);

        $employees = array();

        $sql = "SELECT * FROM employees WHERE trade_type = ?";
        $statement = $this->connection->prepare($sql);
        foreach($tradeFilterArray as $result) {
            $statement->execute(array($result['trade_type']));
            $row = $statement->fetchAll(PDO::FETCH_ASSOC);
            foreach($row as $empsWithTrade){
                $employees[] = $empsWithTrade;
            }
        }

        $resources = array();

        for ($e = 0; $e < sizeof($employees); $e++) {
            array_push($resources, $employees[$e]);
        }
        
        return $resources;
    }
}