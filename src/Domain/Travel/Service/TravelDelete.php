<?php

namespace App\Domain\Travel\Service;

use App\Domain\Travel\Repository\TravelDeleteRepository;

final class TravelDelete
{
    private $repository;

    public function __construct(TravelDeleteRepository $repository)
    {
        $this->repository = $repository;
    }

    public function deleteTravelDoc($docId)
    {
        $deleteDoc = $this->repository->deleteTravelDoc($docId);

        return $deleteDoc;
    }
}