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

        //dump("DATA");
        //dump($filter['trades']);

        /* $tradeArray = array();
        $tradeFilterArray = array();

        $tradesFilter = $filter['trades'];

        for ($f = 0; $f < sizeof($tradesFilter); $f++) {
            $thisTrade = $tradesFilter[$f];

            $tradeArray = array(
                'trade_type' => $thisTrade
            );

            array_push($tradeFilterArray,$tradeArray);
            $tradeArray = array();
        }     */

        //dump("FILTER TRADES");
        //dump($tradeFilterArray);

        $employees = array();

        $sql = "SELECT * FROM employees";
        $statement = $this->connection->prepare($sql);
        $statement->execute();

        $allEmployees = $statement->fetchAll(PDO::FETCH_ASSOC);

        //dump("EMPLOYEES");
        //dump($allEmployees);

        //$tradesArray = explode(",",$tradeTypes);
        $tradesArray = $filter['trades'];

        //dump("TRADES ARRAY");
        ///dump($tradesArray);

        for ($e = 0; $e < sizeof($allEmployees); $e++) {

            $empTradesArray = json_decode($allEmployees[$e]['emp_trades'], true);

            //dump("EMP TRADES ARRAY");
            //dump($empTradesArray);

            $tradeCount = 0;

            for ($t = 0; $t < sizeof($empTradesArray); $t++) {
                $thisTrade = $empTradesArray[$t];
                //dump("THIS TRADE");
                //dump($thisTrade);
                if (in_array($thisTrade, $tradesArray)) {
                    //dump("COUNTING A TRADE");
                    $tradeCount++;
                }
            }

            if($tradeCount > 0){
                array_push($employees, $allEmployees[$e]);
            }
        }
       
        $resources = array();

        for ($e = 0; $e < sizeof($employees); $e++) {
            array_push($resources, $employees[$e]);
        }
        
        return $resources;
    }
}