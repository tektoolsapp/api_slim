<?php

namespace App\Domain\Utility\Service;

//use PDO;
use Firebase\JWT\JWT;

class GenerateToken
{
    /* private $connection;

    public function __construct(
            PDO $connection 
        )
    {
        $this->connection = $connection;
    } */

    public static function generateToken($id)
    {
        
        $now = time();
        $future = strtotime('+1 hour',$now);
        $secretKey = $_SERVER['JWT_SECRET'];
        $payload = [
         "jti"=>$id,
         "iat"=>$now,
         "exp"=>$future
        ];

        return JWT::encode($payload,$secretKey,"HS256");

    }
}