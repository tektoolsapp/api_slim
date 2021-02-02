<?php

namespace App\Domain\Customers\Service;

use App\Domain\Customers\Repository\CustomerSitesFetchRepository;

final class CustomerSitesFetch
{
    private $repository;

    public function __construct(CustomerSitesFetchRepository $repository)
    {
        $this->repository = $repository;
    }

    public function getCustomerSites($customerId)
    {
        $customer = $this->repository->getCustomerSites($customerId);

        return $customer;
    }
}