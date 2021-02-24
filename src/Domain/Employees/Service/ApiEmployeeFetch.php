<?php

namespace App\Domain\Employees\Service;

use App\Domain\Employees\Repository\ApiEmployeeFetchRepository;

final class ApiEmployeeFetch
{
    private $repository;

    public function __construct(ApiEmployeeFetchRepository $repository)
    {
        $this->repository = $repository;
    }

    public function getApiEmployee($jwt)
    {
        $employee = $this->repository->getApiEmployee($jwt);

        return $employee;
    }
}