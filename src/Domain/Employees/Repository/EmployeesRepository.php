<?php

namespace App\Domain\Employees\Repository;

use PDO;
use App\Domain\Employees\Repository\TradesRepository;
use App\Domain\Utility\Service\CommonFunctions;

class EmployeesRepository
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

    public function getEmployees()
    {

        $trades = $this->trades->getTrades();
        
        $sql = "SELECT * FROM employees ORDER BY last_name ASC";
        $statement = $this->connection->prepare($sql);
        $statement->execute();

        $employees = $statement->fetchAll(PDO::FETCH_ASSOC);

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
        
        //dump($words);
        $initialsStr = '';
        
        for ($w=0; $w < sizeof($words); $w++) {
            $initial = strtoupper(substr($words[$w], 0, 1));
            $initialsStr .= $initial."";
        }

        //dump($initialsStr); 

        return $initialsStr;
    }
}
