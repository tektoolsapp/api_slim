<?php

namespace App\Domain\Employees\Service;

use App\Domain\Employees\Repository\EmployeeFetchRepository;

final class EmployeeFetch
{
    private $repository;

    public function __construct(EmployeeFetchRepository $repository)
    {
        $this->repository = $repository;
    }

    public function getEmployee($empId)
    {
        $employee = $this->repository->getEmployee($empId);

        return $employee;
    }
}