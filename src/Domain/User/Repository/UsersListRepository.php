<?php

namespace App\Domain\User\Repository;

use DomainException;
use PDO;

class UsersListRepository
{
    private $connection;
    
    public function __construct(PDO $connection)
    {
        $this->connection = $connection;
    }

    public function getUsers()
    {
        $sql = "SELECT id, first_name, last_name FROM users";
        $statement = $this->connection->prepare($sql);
        $statement->execute();

        $users = $statement->fetchAll(PDO::FETCH_ASSOC);

        return $users;

    }
}
