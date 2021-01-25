<?php

namespace App\Domain\Employees\Service;

use App\Domain\Employees\Repository\EmployeeUpdateRepository;

final class EmployeeUpdate
{
    private $repository;

    public function __construct(EmployeeUpdateRepository $repository)
    {
        $this->repository = $repository;
    }

    public function updateEmployee(array $data)
    {
        $employee = $this->repository->updateEmployee($data);

        return $employee;
    }

}

