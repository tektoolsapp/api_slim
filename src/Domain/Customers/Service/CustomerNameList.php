<?php

namespace App\Domain\Customers\Service;

use App\Domain\Customers\Repository\CustomerNameRepository;

final class CustomerNameList
{
    private $repository;

    public function __construct(CustomerNameRepository $repository)
    {
        $this->repository = $repository;
    }

    public function getCustomer($name)
    {
        $customers = $this->repository->getCustomer($name);

        return $customers;
    }
}