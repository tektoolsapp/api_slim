<?php

namespace App\Domain\Employees\Service;

use App\Domain\Employees\Repository\EmployeesFetchAutoRepository;

final class EmployeesFetchAuto
{
    private $repository;

    public function __construct(EmployeesFetchAutoRepository $repository)
    {
        $this->repository = $repository;
    }

    public function getEmployees($term)
    {
        $employees = $this->repository->getEmployees($term);

        return $employees;
    }
}