<?php

namespace App\Domain\User\Repository;

use PDO;

class UserUpdateDetsRepository
{
    private $connection;
    private $trades;
    private $common;

    public function __construct(
            PDO $connection
        )
    {
        $this->connection = $connection;
    }

    public function updateUser(array $user)
    {

        $userId = $user['id'];
        unset($user['id']);
        $user['id'] = $userId;

        $columnsArray = array_keys($user);
        $columnString = '';

        for ($c=0; $c < sizeof($columnsArray)-1; $c++) {
            $columnString .= $columnsArray[$c]." = ?,";
        }

        $columnString = rtrim($columnString, ',');
        $valuesArray = array_values($user);

        $query = "UPDATE users SET $columnString WHERE id = ?";
        $this->connection->prepare($query)->execute($valuesArray);

        return 'OK';

    }
}

