<?php

namespace App\Domain\Scheduler\Repository;

use DomainException;
use PDO;
use MongoDB\Client as Mongo;

class SchedulerFilterRepository
{
    private $connection;
    private $mongo;

    public function __construct(PDO $connection, Mongo $mongo)
    {
        $this->connection = $connection;
        $this->mongo = $mongo;

    }

    public function getResources($filter)
    {
        if($filter == 'all') {

            $sql = "SELECT * FROM employees";
            $statement = $this->connection->prepare($sql);
            $statement->execute();

            $resources = $statement->fetchAll(PDO::FETCH_ASSOC);

        } else {

            //MOVE TO CLASS

            //dump("filter");

            //dump($filter);

            if(!empty($filter)){

                $sql = "SELECT * FROM employees";
                $statement = $this->connection->prepare($sql);
                $statement->execute();
                $employees = $statement->fetchAll(PDO::FETCH_ASSOC);

                $resources = array();

                for ($e = 0; $e < sizeof($employees); $e++) {

                    $empSkillsArray = json_decode($employees[$e]['emp_skills'], true);

                    //dump($empSkillsArray);

                    $skillCount = 0;

                    for ($s = 0; $s < sizeof($empSkillsArray); $s++) {
                        $thisSkill = $empSkillsArray[$s];
                        if (in_array($thisSkill, $filter)) {
                            $skillCount++;
                        }
                    }

                    //dump($skillCount);

                    if ($skillCount == sizeof($filter)) {
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