<?php

namespace App\Domain\User\Repository;

use App\Domain\User\Data\UserReaderData;
use DomainException;
use PDO;

/**
 * Repository.
 */
class UserReaderRepository
{
    /**
     * @var PDO The database connection
     */
    private $connection;

    /**
     * Constructor.
     *
     * @param PDO $connection The database connection
     */
    public function __construct(PDO $connection)
    {
        $this->connection = $connection;
    }

    /**
     * Get user by the given user id.
     *
     * @param int $userId The user id
     *
     * @throws DomainException
     *
     * @return UserReaderData The user data
     */
    public function getUserById(int $userId): UserReaderData
    {
        $sql = "SELECT id, email, username, password, user_fcm_token, first_name, last_name FROM users WHERE id = :id;";
        $statement = $this->connection->prepare($sql);
        $statement->execute(['id' => $userId]);

        $row = $statement->fetch();

        //if (!$row) {
          //  throw new DomainException(sprintf('User not found: %s', $userId));
        //}

        // Map array to data object
        $user = new UserReaderData();
        $user->id = (int)$row['id'];
        $user->username = (string)$row['username'];
        $user->password = (string)$row['password'];
        $user->fcm_token = (string)$row['user_fcm_token'];
        $user->firstName = (string)$row['first_name'];
        $user->lastName = (string)$row['last_name'];
        $user->email = (string)$row['email'];

        return $user;
    }
}
