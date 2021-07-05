<?php

namespace App\Domain\Travel\Service;

use App\Domain\Travel\Repository\TravelAddRepository;

final class TravelAdd
{
    private $repository;
    public function __construct(TravelAddRepository $repository)
    {
        $this->repository = $repository;
    }

    public function createTravelDoc(array $data)
    {
        $travelDoc = $this->repository->createTravelDoc($data);

        return $travelDoc;
    }
}