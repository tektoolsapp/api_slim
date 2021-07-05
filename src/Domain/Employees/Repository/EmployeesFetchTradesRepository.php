<?php

namespace App\Domain\Employees\Repository;

use PDO;
use App\Domain\Employees\Repository\SkillsRepository;
use App\Domain\Employees\Repository\TradesRepository;
use App\Domain\Utility\Service\CommonFunctions;

class EmployeesFetchTradesRepository
{
    private $connection;
    private $skills;
    private $trades;
    private $common;

    public function __construct(
        PDO $connection,
        SkillsRepository $skills,
        TradesRepository $trades,
        CommonFunctions $common
    )
    {
        $this->connection = $connection;
        $this->skills = $skills;
        $this->trades = $trades;
        $this->common = $common;
    }

    public function getEmployees($tradeTypes)
    {        
        
        $skills = $this->skills->getSkills();
        $trades = $this->trades->getTrades();

        if($tradeTypes == 'all'){
            $sql = "SELECT * FROM employees";
            $statement = $this->connection->prepare($sql);
            $statement->execute();
    
            $employees = $statement->fetchAll(PDO::FETCH_ASSOC);

        } else {
        
            //dump($tradeTypes);

            $employees = array();

            $sql = "SELECT * FROM employees";
            $statement = $this->connection->prepare($sql);
            $statement->execute();
    
            $allEmployees = $statement->fetchAll(PDO::FETCH_ASSOC);

            //dump("EMPLOYEES");
            //dump($allEmployees);

            $tradesArray = explode(",",$tradeTypes);

            //dump("TRADES ARRAY");
            //dump($tradesArray);

            /* $tradeSelection = array();
            $thisTradeArray = array();

            for ($t=0; $t < sizeof($tradesArray); $t++) {
                $thisTrade = $tradesArray[$t];
                $thisTradeArray = array(
                    "trade_type" => $thisTrade
                );
                array_push($tradeSelection, $thisTradeArray);
            } */

            //dump($tradeSelection);

            for ($e = 0; $e < sizeof($allEmployees); $e++) {

                //if(!empty($skillFilterArray)) {

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
                    //if ($skillCount == sizeof($skillFilterArray)) {
                        array_push($employees, $allEmployees[$e]);
                    }

                //} else {
                  //  array_push($resources, $employees[$e]);
                //}

            }

            $tradeInitialsStr = '[';
            
            for ($e=0; $e < sizeof($employees); $e++) {
            
                $tradesArray = json_decode($employees[$e]['emp_trades']);
    
                for ($t=0; $t < sizeof($tradesArray); $t++) {
                    
                    $thisTrade = $tradesArray[$t];
                   
                    $tradesLookup = $this->common->searchArray($trades, 'trade_code', $thisTrade);
                    $tradeDesc = $tradesLookup[0]['trade_desc'];
                    $tradeInitials = $this->generate($tradeDesc);
    
                    $tradeInitialsStr .= $tradeInitials.",";                  
                }
                
                $tradeInitialsStr = rtrim($tradeInitialsStr, ',');
                $tradeInitialsStr .= ']';
    
                $employees[$e]['emp_trade_initials'] = $tradeInitialsStr;
                $tradeInitials = '';
                $tradeInitialsStr = '[';  
    
            }

        }

        return $employees;
    }

    public function generate(string $tradeDesc) : string
    {
        
        $words = explode(' ', $tradeDesc);
        
        $initialsStr = '';
        
        for ($w=0; $w < sizeof($words); $w++) {
            $initial = strtoupper(substr($words[$w], 0, 1));
            $initialsStr .= $initial."";
        }

        return $initialsStr;
    }
}