<?php

namespace App\Domain\Customers\Service;

use App\Domain\Customers\Repository\CustomerUpdateRepository;

final class CustomerUpdate
{
    private $repository;

    public function __construct(CustomerUpdateRepository $repository)
    {
        $this->repository = $repository;
    }

    public function updateCustomer(array $data)
    {
        $skill = $this->repository->updateCustomer($data);

        return $skill;
    }

}

