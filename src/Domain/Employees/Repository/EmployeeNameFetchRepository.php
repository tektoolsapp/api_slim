<?php

namespace App\Domain\Employees\Repository;

use PDO;
use App\Domain\Employees\Repository\TradesRepository;
use App\Domain\Utility\Service\CommonFunctions;

class EmployeeNameFetchRepository
{
    private $connection;
    private $trades;
    private $common;

    public function __construct(
        PDO $connection,
        TradesRepository $trades,
        CommonFunctions $common
    )
    {
        $this->connection = $connection;
        $this->trades = $trades;
        $this->common = $common;
    }

    public function getEmployee($empName)
    {
        
        //dump($empName);
        
        $empNamesArray = explode(" ", $empName);

        $firstName = $empNamesArray[0];
        $lastName = $empNamesArray[1];
        
        $trades = $this->trades->getTrades();

        try {
            $sqc = "SELECT * FROM employees WHERE
                first_name = :first_name AND
                last_name = :last_name
                ORDER BY last_name ASC
            ";
            $stc = $this->connection->prepare($sqc, array(PDO::ATTR_CURSOR => PDO::CURSOR_SCROLL) );
            $stc->bindParam(":first_name", $firstName, PDO::PARAM_STR);
            $stc->bindParam(":last_name", $lastName, PDO::PARAM_STR);
            $stc->execute();
            if($stc->errorCode() != 0 ) {
                $log->error($stc->errorCode());
            }
            $employees = $stc->fetchAll(PDO::FETCH_ASSOC); 
        }
        catch(PDOException $e) {
            $log->error($e->getMessage());
        }

        //dump($employees);

        $tradeTypesStr = '';
        $tradeInitialsStr = '[';
        
        for ($e=0; $e < sizeof($employees); $e++) {
            
            $tradesArray = json_decode($employees[$e]['emp_trades']);

            for ($t=0; $t < sizeof($tradesArray); $t++) {
                
                $thisTrade = $tradesArray[$t];
               
                $tradesLookup = $this->common->searchArray($trades, 'trade_code', $thisTrade);
                $tradeDesc = $tradesLookup[0]['trade_desc'];
                $tradeTypeStr .= $tradeDesc.", ";

                $tradeInitials = $this->generate($tradeDesc);

                $tradeInitialsStr .= $tradeInitials.",";                  
            }
            
            $tradeInitialsStr = rtrim($tradeInitialsStr, ',');
            $tradeInitialsStr .= ']';
            $tradeTypeStr = rtrim($tradeTypeStr, ', ');
            $employees[$e]['emp_trade_description'] = $tradeTypeStr;
            $tradeTypeStr = ''; 

            //dump("TRADE INITIALS");
            //dump($tradeInitialsStr);

            $employees[$e]['emp_trade_initials'] = $tradeInitialsStr;
            $tradeInitials = '';
            $tradeInitialsStr = '[';  

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