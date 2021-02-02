<?php

namespace App\Domain\Customers\Service;

use App\Domain\Customers\Repository\CustomerSiteFetchRepository;

final class CustomerSiteFetch
{
    private $repository;

    public function __construct(CustomerSiteFetchRepository $repository)
    {
        $this->repository = $repository;
    }

    public function getCustomerSite($customerSiteId)
    {
        $customerSite = $this->repository->getCustomerSite($customerSiteId);

        return $customerSite;
    }
}