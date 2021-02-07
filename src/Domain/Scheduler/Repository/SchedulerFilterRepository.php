<?php

namespace App\Domain\Scheduler\Repository;

use DomainException;
use PDO;
//use MongoDB\Client as Mongo;

class SchedulerFilterRepository
{
    private $connection;
    //private $mongo;

    public function __construct(
            PDO $connection 
            //Mongo $mongo
        )
    {
        $this->connection = $connection;
        //$this->mongo = $mongo;

    }

    public function getResources($filter)
    {

        if($filter == 'all') {

            $sql = "SELECT * FROM employees";
            $statement = $this->connection->prepare($sql);
            $statement->execute();

            $resources = $statement->fetchAll(PDO::FETCH_ASSOC);

        } else {

            //SEPARATE FILTER ARRAY INTO FILTER TYPE ARRAYS

            $tradeFilterArray = array();
            $skillFilterArray = array();
            
            foreach ($filter as $value){

                if (substr($value, 0, 4) == 'trad') {

                    $tradeItemArray = explode("_", $value);
                    $tradeItem = $tradeItemArray[1];

                    $tradeItemLookupArray = array(
                        "trade_type" => $tradeItem
                    );

                    array_push($tradeFilterArray, $tradeItemLookupArray);
                    
                } elseif(substr($value, 0, 4) == 'skil'){

                    $skillItemArray = explode("_", $value);
                    $skillItem = $skillItemArray[1];
                    $skillFilterArray[] = $skillItem;
                    
                }
            }

            if(!empty($filter)){

                if(empty($tradeFilterArray)) {

                    $sql = "SELECT * FROM employees";
                    $statement = $this->connection->prepare($sql);
                    $statement->execute();
                    $employees = $statement->fetchAll(PDO::FETCH_ASSOC);

                } else {

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
                }

                $resources = array();

                for ($e = 0; $e < sizeof($employees); $e++) {

                    if(!empty($skillFilterArray)) {

                        $empSkillsArray = json_decode($employees[$e]['emp_skills'], true);

                        $skillCount = 0;

                        for ($s = 0; $s < sizeof($empSkillsArray); $s++) {
                            $thisSkill = $empSkillsArray[$s];
                            if (in_array($thisSkill, $skillFilterArray)) {
                                $skillCount++;
                            }
                        }

                        if ($skillCount == sizeof($skillFilterArray)) {
                            array_push($resources, $employees[$e]);
                        }

                    } else {
                        array_push($resources, $employees[$e]);
                    }

                }

            } else {
                $resources = array();
            }
        }

        //dump($resources);

        return $resources;
    }
}