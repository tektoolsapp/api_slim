<?php

namespace App\Domain\User\Repository;

use PDO;

class UserCheckRepository
{
    private $connection;

    public function __construct(PDO $connection)
    {
        $this->connection = $connection;
    }

    public function checkUsername($userId, $username)
    {
        //dump($userId);
        //dump($username);
        
        $execute = array();

        $execute['username'] = $username;

        if($userId > 0){
            $execute['id'] = $userId;
            $checkId = ' AND id <> :id'; 
        } else {
            $checkId = '';
        }

        //dump($execute);

        $sql = "SELECT count(*) FROM users WHERE username = :username".$checkId; 
        $statement = $this->connection->prepare($sql);
        $statement->execute($execute);
        $numRows = $statement->fetchColumn();
        
        return $numRows;

    }
}
