<?php

namespace App\Domain\Employees\Service;

use App\Domain\Employees\Repository\TradeUpdateRepository;

final class TradeUpdate
{
    private $repository;

    public function __construct(TradeUpdateRepository $repository)
    {
        $this->repository = $repository;
    }

    public function updateTrade(array $data)
    {
        $trade = $this->repository->updateTrade($data);

        return $trade;
    }

}

