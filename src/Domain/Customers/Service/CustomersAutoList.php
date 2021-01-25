<?php

namespace App\Domain\Customers\Service;

use App\Domain\Customers\Repository\CustomersAutoRepository;

final class CustomersAutoList
{
    private $repository;

    public function __construct(CustomersAutoRepository $repository)
    {
        $this->repository = $repository;
    }

    public function getCustomers($term)
    {
        $customers = $this->repository->getCustomers($term);

        return $customers;
    }
}