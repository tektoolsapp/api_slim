<?php

namespace App\Domain\Employees\Service;

use App\Domain\Employees\Repository\EmployeesCheckTradesRepository;

final class EmployeesCheckTrades
{
    private $repository;

    public function __construct(EmployeesCheckTradesRepository $repository)
    {
        $this->repository = $repository;
    }

    public function checkEmployeesTrades($data)
    {
        $checkTrades = $this->repository->checkEmployeesTrades($data);

        return $checkTrades;
    }
}