<?php

namespace App\Domain\Employees\Service;

use App\Domain\Employees\Repository\TradesRepository;

final class TradesList
{
    private $repository;

    public function __construct(TradesRepository $repository)
    {
        $this->repository = $repository;
    }

    public function getTrades()
    {
        $trades = $this->repository->getTrades();

        return $trades;
    }
}