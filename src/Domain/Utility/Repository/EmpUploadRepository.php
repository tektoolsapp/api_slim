<?php

namespace App\Domain\Utility\Repository;

use App\Domain\Utility\Repository\EmpUploadRepository;
use PDO;

class EmpUploadRepository
{
    private $connection;

    public function __construct(
            PDO $connection
        )
    {
        $this->connection = $connection;
    }

    public function getEmpUpload()
    {
        $sql = "SELECT * FROM employees_upload WHERE
            emp_desc = 'Employee' AND 
            emp_mobile <> '' AND
            emp_trades <> ''
        ";
        $statement = $this->connection->prepare($sql);
        $statement->execute();

        $empUpload = $statement->fetchAll(PDO::FETCH_ASSOC);

        $employees = array();
        $numPosted = 0;
        $numErrors = 0;

        for ($e = 0; $e < sizeof($empUpload); $e++) {
        //for ($e = 0; $e < 2; $e++) {

            $empTrades = $empUpload[$e]['emp_trades'];
            $empTrades = rtrim($empTrades, '_');
            $empTrades = explode(",",$empTrades);
            $empTrade = $empTrades[0];
            $empTradesJson = json_encode($empTrades);
            //$empUpload[$e]['emp_trades'] = $empTrades;
            //$empTradesArray = explode(",",$empTrades);
            $empTrade = $empTrades[0];

            $empStart = $empUpload[$e]['emp_start'];
            $empStartUnix = strtotime($empStart);
            $empStartDate = date("d-m-Y", $empStartUnix);
            //$empUpload[$e]['emp_start'] = $empStartDate;

            $empPin = random_int(100000, 999999);

            $firstName = $empUpload[$e]['first_name'];
            $middleNames = $empUpload[$e]['middle_names'];
            $lastName = $empUpload[$e]['last_name'];
            $empEmail = $empUpload[$e]['emp_email'];
            $empMobile = $empUpload[$e]['emp_mobile'];
            $empStatus = $empUpload[$e]['emp_status'];

            $employee = array(
                "emp_type" => "R",
                "color" => "#FFFFFF",
                "emp_pin" => $empPin,
                "first_name" => $firstName,
                "middle_names" => $middleNames,
                "last_name" => $lastName,
                //"preferred_name" => "",
                "emp_start_date" => $empStartDate,
                "emp_email" => $empEmail,
                "emp_mobile" => $empMobile,
                "emp_title" => "NA",
                "emp_gender" => "M",	
                //"birth_date" => $bla,
                "trade_type" => $empTrade,
                "emp_trades" => $empTradesJson,
                //"emp_skills" => $bla,
                //"emp_sap" => $bla,
                //"emp_fcm_token" => $bla,
                //"emp_rehire" => $bla,
                "emp_status" => $empStatus, 
            );

            $posted = $this->postEmpUpdates($employee);

            if($posted == 'OK'){
                $numPosted++;
            } else {
                $numErrors++;
            }

        }

        $returnArray = array(
           "total" => sizeof($empUpload),
           "ok" => $numPosted,
           "errors" => $numErrors
        );

        //return $empUpload;
        return $returnArray;
        
    }

    public function postEmpUpdates($employee){

        $columnsArray = array_keys($employee);
        $columnsString = implode(',', $columnsArray);
        $valuesArray = array_values($employee);
        $valuesCount = count($valuesArray);

        $valuesPlaceholder = '';
        for ($i=0; $i < $valuesCount; $i++) {
            $valuesPlaceholder .= '?,';
        }
        $valuesPlaceholder = rtrim($valuesPlaceholder, ',');

        try {
            $query = "INSERT INTO employees ($columnsString) VALUES ($valuesPlaceholder)";
            $this->connection->prepare($query)->execute($valuesArray);
        } catch(\PDOException $e) {
            //die("Oh noes! There's an error in the query!");
        }

        //$booking['UserId'] = explode(",",$booking['UserId']);
        //$booking['TranId'] = (int)$this->connection->lastInsertId();

        if(empty($e)){
            return 'OK';
        } else {
            return 'ERROR';
        }    
        
    }

}