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

    public function apiSignin($credentials)
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
