<?php

namespace App\Domain\Travel\Service;

use App\Domain\Travel\Repository\TravelFetchRepository;

final class TravelFetch
{
    private $repository;

    public function __construct(TravelFetchRepository $repository)
    {
        $this->repository = $repository;
    }

    public function getTravelDocs($swingId)
    {
        $travelDocs = $this->repository->getTravelDocs($swingId);

        return $travelDocs;
    }
}