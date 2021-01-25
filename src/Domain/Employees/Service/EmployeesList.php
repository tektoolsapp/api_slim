<?php

namespace App\Domain\Employees\Service;

use App\Domain\Employees\Repository\EmployeesRepository;

final class EmployeesList
{
    private $repository;

    public function __construct(EmployeesRepository $repository)
    {
        $this->repository = $repository;
    }

    public function getEmployees()
    {
        $employees = $this->repository->getEmployees();

        return $employees;
    }
}