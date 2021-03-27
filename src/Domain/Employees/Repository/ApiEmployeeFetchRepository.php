<?php

namespace App\Domain\Employees\Repository;

use PDO;
//use MongoDB\Client as Mongo;
use App\Domain\Employees\Repository\SkillsRepository;
use App\Domain\Employees\Repository\TradesRepository;
use Firebase\JWT\JWT;

class ApiEmployeeFetchRepository
{
    private $connection;
    private $skills;
    private $trades;

    public function __construct(
        PDO $connection,
        SkillsRepository $skills,
        TradesRepository $trades
    )
    {
        $this->connection = $connection;
        $this->skills = $skills;
        $this->trades = $trades;
    }

    public function getApiEmployee($jwt)
    {
        $skills = $this->skills->getSkills();
        $trades = $this->trades->getTrades();

        $secretKey = $_SERVER['JWT_SECRET'];

        $decoded_array = (array) JWT::decode($jwt, $secretKey, array('HS256'));

        //dump($decoded_array);

        $empId = $decoded_array['jti'];

        $sql = "SELECT emp_id, first_name, emp_email FROM employees WHERE emp_id = :emp_id;";
        $statement = $this->connection->prepare($sql);
        $statement->execute(['emp_id' => $empId]);

        $employee = $statement->fetch();

        //GET NUM OF UNREAD MESSAGES
        $sql = "SELECT count(*) FROM messages WHERE message_status = 'P' AND message_to = :message_to";
        $statement = $this->connection->prepare($sql);
        $statement->execute(['message_to' => $empId]);

        $numMessages = $statement->fetch(PDO::FETCH_NUM);

        $employee['num_messages'] = $numMessages[0]; 

        //$employee = 'bla';

        /* $returnArray = array(
            "status" => 201,
            "data" => $employee
        ); */

        $returnArray = array(
            "data" => $employee
        ); 

        return $returnArray;
    }
}