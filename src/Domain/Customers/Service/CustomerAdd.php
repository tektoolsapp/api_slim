<?php

namespace App\Domain\Customers\Service;

use App\Domain\Customers\Repository\CustomerAddRepository;

final class CustomerAdd
{
    private $repository;
    public function __construct(CustomerAddRepository $repository)
    {
        $this->repository = $repository;
    }

    public function createCustomer(array $data)
    {
        $employeeId = $this->repository->insertCustomer($data);

        return $employeeId;
    }

}

