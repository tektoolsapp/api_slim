<?php

namespace App\Domain\Employees\Service;

use App\Domain\Employees\Repository\TradeFetchRepository;

final class TradeFetch
{
    private $repository;

    public function __construct(TradeFetchRepository $repository)
    {
        $this->repository = $repository;
    }

    public function getTrade($tradeId)
    {
        $trade = $this->repository->getTrade($tradeId);

        return $trade;
    }
}