<?php

namespace App\Domain\Api\Service;

use App\Domain\Api\Repository\ApiTestFetchRepository;

final class ApiTestFetch
{
    private $repository;

    public function __construct(ApiTestFetchRepository $repository)
    {
        $this->repository = $repository;
    }

    public function getApiTest($testId)
    {
        $test = $this->repository->getApiTest($testId);

        return $test;
    }
}