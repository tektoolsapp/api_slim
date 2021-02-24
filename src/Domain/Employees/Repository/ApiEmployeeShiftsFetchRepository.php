<?php

namespace App\Domain\Employees\Repository;

use PDO;
//use MongoDB\Client as Mongo;
//use App\Domain\Employees\Repository\SkillsRepository;
//use App\Domain\Employees\Repository\TradesRepository;
use Firebase\JWT\JWT;

class ApiEmployeeShiftsFetchRepository
{
    private $connection;
    //private $skills;
    //private $trades;

    public function __construct(
        PDO $connection
        //SkillsRepository $skills,
        //TradesRepository $trades
    )
    {
        $this->connection = $connection;
        //$this->skills = $skills;
        //$this->trades = $trades;
    }

    public function getApiEmployeeShifts($jwt)
    {
        //$skills = $this->skills->getSkills();
        //$trades = $this->trades->getTrades();

        $secretKey = $_SERVER['JWT_SECRET'];
        $decoded_array = (array) JWT::decode($jwt, $secretKey, array('HS256'));

        $empId = $decoded_array['jti'];

        $sql = "SELECT * FROM bookings WHERE UserId = :UserId;";
        $statement = $this->connection->prepare($sql);
        $statement->execute(['UserId' => $empId]);

        $shifts = $statement->fetchAll(PDO::FETCH_ASSOC);

        $returnArray = array(
            "data" => $shifts
        ); 

        return $returnArray;
    }
}