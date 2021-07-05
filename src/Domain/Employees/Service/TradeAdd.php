<?php

namespace App\Domain\Employees\Service;

use App\Domain\Employees\Repository\TradeAddRepository;

final class TradeAdd
{
    private $repository;
    public function __construct(TradeAddRepository $repository)
    {
        $this->repository = $repository;
    }

    public function createTrade(array $data)
    {
        $employeeId = $this->repository->insertTrade($data);

        return $employeeId;
    }

}

