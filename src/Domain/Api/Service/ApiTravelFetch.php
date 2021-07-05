<?php

namespace App\Domain\Api\Service;

use App\Domain\Api\Repository\ApiTravelFetchRepository;

final class ApiTravelFetch
{
    private $repository;

    public function __construct(ApiTravelFetchRepository $repository)
    {
        $this->repository = $repository;
    }

    public function getTravelDocs($swingId)
    {
        $travelDocs = $this->repository->getTravelDocs($swingId);

        return $travelDocs;
    }
}