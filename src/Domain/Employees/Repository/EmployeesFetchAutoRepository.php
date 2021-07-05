<?php

namespace App\Domain\Employees\Repository;

use PDO;

class EmployeesFetchAutoRepository
{
    private $connection;
    
    public function __construct(
        PDO $connection        
    )
    {
        $this->connection = $connection;
    }

    public function getEmployees($term)
    {        

        $param = strip_tags($term);

        $employees = array();

        try {
            $sqc = "SELECT first_name, last_name FROM employees WHERE
                last_name LIKE concat('%', :param, '%')
                ORDER BY last_name ASC
            ";
            $stc = $this->connection->prepare($sqc, array(PDO::ATTR_CURSOR => PDO::CURSOR_SCROLL) );
            $stc->bindParam(":param", $param, PDO::PARAM_STR);
            $stc->execute();
            if($stc->errorCode() != 0 ) {
                $log->error($stc->errorCode());
            }
            $stc->bindColumn('first_name', $firstName);
            $stc->bindColumn('last_name', $lastName);
            while ($stc->fetch (PDO::FETCH_BOUND)) {   	
                $employees[] = $firstName." ".$lastName;
            }
        }
        catch(PDOException $e) {
            $log->error($e->getMessage());
        }

        return $employees;

    }

}