<?php

namespace App\Domain\Employees\Service;

use App\Domain\Employees\Repository\EmployeeNameFetchRepository;

final class EmployeeNameFetch
{
    private $repository;

    public function __construct(EmployeeNameFetchRepository $repository)
    {
        $this->repository = $repository;
    }

    public function getEmployee($empName)
    {
        $employee = $this->repository->getEmployee($empName);

        return $employee;
    }
}