<?php

namespace App\Domain\Api\Service;

use App\Domain\Api\Repository\ApiTestUpdateRepository;

final class ApiTestUpdate
{
    private $repository;

    public function __construct(ApiTestUpdateRepository $repository)
    {
        $this->repository = $repository;
    }

    public function updateTest($testData)
    {
        $update = $this->repository->updateTest($testData);

        return $update;
    }

}