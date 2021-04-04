<?php

namespace App\Domain\Api\Repository;

use PDO;
use App\Domain\Utility\Service\GenerateToken;

class ApiSigninRepository
{
    private $connection;
    private $generateToken;

    public function __construct(PDO $connection, GenerateToken $generateToken)
    {
        $this->connection = $connection;
        $this->generateToken = $generateToken;

    }

    public function apiSignin($credentials, $fcmToken)
    {
        //SIGNIN

        //dump($credentials);

        $sql = "SELECT count(*) FROM employees WHERE emp_pin = :emp_pin"; 
        $statement = $this->connection->prepare($sql);
        $statement->execute(['emp_pin' => $credentials]);
        $numRows = $statement->fetchColumn(); 

        //dump($numRows);

        if($numRows > 0){

            $sql = "SELECT * FROM employees WHERE emp_pin = :emp_pin";
            $statement = $this->connection->prepare($sql);
            $statement->execute(['emp_pin' => $credentials]);

            $employee = $statement->fetch();

            $id = $employee['emp_id'];

            //dump($id);

            $token = $this->generateToken->generateToken($id);

            $signinData = array(
                "status" => 201,
                "payload" => array(
                    //"user" => $employee,
                    "token" => $token
                )
            );

            //UPDATE THE EMP RECORD WITH FMC TOKEN
            if(strlen($fcmToken) > 0 && !empty($id)){
                //
                
                $updateEmpArray = array(
                    "emp_fcm_token" => $fcmToken,
                    "emp_id" => $id
                );

                //$empId = $testData['test_id'];
                //unset($testData['test_id']);
                
                //$testData['test_id'] = $testId;
                $columnsArray = array_keys($updateEmpArray);
                $columnString = '';

                for ($c=0; $c < sizeof($columnsArray)-1; $c++) {
                    $columnString .= $columnsArray[$c]." = ?,";
                }

                $columnString = rtrim($columnString, ',');
                $valuesArray = array_values($updateEmpArray);

                try {
                    $query = "UPDATE employees SET $columnString WHERE emp_id = ?";
                    $this->connection->prepare($query)->execute($valuesArray);
                } catch(\PDOException $e) {
                    //die("Oh noes! There's an error in the query!");
                }
            }

        } else {
            $signinData = array(
                "status" => 401,
                "payload" => array(
                    "error" => "Incorrect Login details"
                )
            );
        }

        return $signinData;

    }
}
