<?php

namespace App\Domain\Employees\Repository;

use PDO;
use App\Domain\Employees\Repository\TradesRepository;
use App\Domain\Utility\Service\CommonFunctions;

class EmployeesCheckTradesRepository
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

    public function checkEmployeesTrades($data)
    {        
        
        //{"swing_id":"1","emps":"[\"1\",\"3\"]","trade":"1234567"}

        $trades = $this->trades->getTrades();

        $swingId = $data['swing_id'];
        $employeesArray = json_decode($data['emps'], true);
        $tradeId = $data['trade'];
        $prevTradeId = $data['prev_trade'];

        $numEmps = sizeof($employeesArray);

        $empSelection = array();

        for ($e=0; $e < sizeof($employeesArray); $e++) {

            $thisEmp = $employeesArray[$e];
            $thisEmpArray = array(
                "emp_id" => $thisEmp
            );
            array_push($empSelection, $thisEmpArray); 
            $thisEmpArray = array();   

        }  

        //dump($empSelection);

        //CHECK THAT ALL EMPLOYEES HAVE THE TRADE

        $empDetails = array();
        
        try {
            $qgj = "SELECT
                emp_id,
                first_name,
                last_name,
                emp_trades
            FROM employees WHERE
              emp_id = ?
            ";
            $gjd = $this->connection->prepare($qgj, array(PDO::ATTR_CURSOR => PDO::CURSOR_SCROLL));
            foreach($empSelection as $result) {
                $gjd->execute(array(
                    $result['emp_id']
                ));
                $row = $gjd->fetchAll(PDO::FETCH_ASSOC);
                $empDetails[] = $row[0];
                if($gjd->errorCode() != 0 ) {
                    $log->error($gjd->errorCode());
                }
            }
        }
        catch(PDOException $e) {
            $log->error($e->getMessage());
        }

        //dump($empDetails);

        $tradesErr = 0;
        $empTradesErrArray = array();

        for ($d=0; $d < sizeof($empDetails); $d++) {
            $thisEmp = $empDetails[$d]['emp_id'];
            $thisEmpName = $empDetails[$d]['first_name'] ." ".$empDetails[$d]['last_name'];
            $thisEmpTrades = json_decode($empDetails[$d]['emp_trades'], true);

            if(!in_array($tradeId, $thisEmpTrades)){
                $tradesErr++;
                $errorsArray[] = $thisEmpName; 
                $empTradesErrArray[] = $thisEmp;
            }
        }

        if($swingId == 1 || $swingId == 'edit'){
            //FIRST TRADE TYPE SELECTION IS ALWAYS TRUE IF EACH EMPLOYEE HAS THE TRADE
            if($tradesErr < 1){
                $checked = true;
            } else {
                $checked = false;
                $errorType = 'E';
            }
            
        } else {

            //dump("SWING: ");
            //dump($swingId);
            
            if($numEmps > 1){
                
                //IF TRADE IS NOT THE SAME AS TRADE TYPE 1

                if($prevTradeId != 'NA') {
                    if($prevTradeId != $tradeId){
                        $checked = false;
                        $errorType = 'M';
                    } else {
                        $checked = true;
                    }

                } else {
                    //$checked = false;
                    if($tradesErr < 1){
                        $checked = true;
                    } else {
                        $checked = false;
                        $errorType = 'E';
                    }
                }
            
            } else {
                //$checked = true;
                
                //dump("HERE");
                //dump("TR ERR:");
                //dump($tradesErr);
                
                if($tradesErr < 1){
                    $checked = true;
                } else {
                    $checked = false;
                    $errorType = 'E';
                }
            }

        }

        if(sizeof($errorsArray) < 1){
            $errorsArray = array();
        }

        if(!isset($errorType)){
            $errorType = 0;
        }
        
        $returnArray = array(   
            "check_value" => $checked,
            "error_type" => $errorType,
            "check_errors" => json_encode($errorsArray)
        );
        
        
        return $returnArray;

    }

}