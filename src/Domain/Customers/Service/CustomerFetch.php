<?php

namespace App\Domain\Customers\Service;

use App\Domain\Customers\Repository\CustomerFetchRepository;

final class CustomerFetch
{
    private $repository;

    public function __construct(CustomerFetchRepository $repository)
    {
        $this->repository = $repository;
    }

    public function getCustomer($customerId)
    {
        $customer = $this->repository->getCustomer($customerId);

        return $customer;
    }
}