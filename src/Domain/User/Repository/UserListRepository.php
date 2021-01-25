<?php

namespace App\Domain\User\Repository;

use App\Domain\User\Data\UserReaderData;
use DomainException;
use PDO;
use MongoDB\Client as Mongo;

/**
 * Repository.
 */
class UserListRepository
{
    /**
     * @var PDO The database connection
     * @var Mongo The mongoDB database connection
     */
    private $connection;
    private $mongo;

    /**
     * Constructor.
     *
     * @param PDO $connection The database connection
     * @param Mongo $mongo The mongoDB database connection
     */
    public function __construct(PDO $connection, Mongo $mongo)
    {
        $this->connection = $connection;
        $this->mongo = $mongo;

    }

    /**
     * Get all users
     *
     * @throws DomainException
     *
     * @return UserReaderData The user data
     */

    //public function getUserList(): UserReaderData

    public function getUserList()
    {

        $db = 'contactsDB';
        $coll = 'contacts';

        //$db = $this->mongo->$contactsDB;
        //$collection = $db->contacts;

        $collection = $this->mongo->$db->$coll;
        $result = $collection->find()->toArray();

        return $result;

        /*
        $sql = "SELECT id, username, first_name, last_name, email FROM users";
        $statement = $this->connection->prepare($sql);
        $statement->execute();

        $users = $statement->fetchAll(PDO::FETCH_ASSOC);

        if (!$users) {
            throw new DomainException(sprintf('No Users found: %s', ""));
        }
        */

        // Map array to data object
        /*
        $user = new UserReaderData();
        $user->id = (int)$row['id'];
        $user->username = (string)$row['username'];
        $user->firstName = (string)$row['first_name'];
        $user->lastName = (string)$row['last_name'];
        $user->email = (string)$row['email'];
        */

        //return $users;
    }
}
