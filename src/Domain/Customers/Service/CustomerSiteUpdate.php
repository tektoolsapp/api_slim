<?php

namespace App\Domain\Customers\Service;

use App\Domain\Customers\Repository\CustomerSiteUpdateRepository;

final class CustomerSiteUpdate
{
    private $repository;

    public function __construct(CustomerSiteUpdateRepository $repository)
    {
        $this->repository = $repository;
    }

    public function updateCustomerSite(array $data)
    {
        $customerSite = $this->repository->updateCustomerSite($data);

        return $customerSite;
    }

}

