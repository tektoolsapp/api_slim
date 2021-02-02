<?php

namespace App\Domain\Customers\Service;

use App\Domain\Customers\Repository\CustomerSiteAddRepository;

final class CustomerSiteAdd
{
    private $repository;
    public function __construct(CustomerSiteAddRepository $repository)
    {
        $this->repository = $repository;
    }

    public function createCustomerSite(array $data)
    {
        $employeeId = $this->repository->insertCustomerSite($data);

        return $employeeId;
    }

}

