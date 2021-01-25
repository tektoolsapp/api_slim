<?php

namespace App\Domain\Customers\Service;

use App\Domain\Customers\Repository\CustomersRepository;

final class CustomersList
{
    private $repository;

    public function __construct(CustomersRepository $repository)
    {
        $this->repository = $repository;
    }

    public function getCustomers()
    {
        $customers = $this->repository->getCustomers();

        return $customers;
    }
}