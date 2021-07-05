<?php

namespace App\Domain\Employees\Service;

use App\Domain\Employees\Repository\EmployeesFetchTradesRepository;

final class EmployeesFetchTrades
{
    private $repository;

    public function __construct(EmployeesFetchTradesRepository $repository)
    {
        $this->repository = $repository;
    }

    public function getEmployees($tradeTypes)
    {
        $employee = $this->repository->getEmployees($tradeTypes);

        return $employee;
    }
}