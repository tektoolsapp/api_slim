<?php

namespace App\Domain\Requests\Service;

use App\Domain\Requests\Repository\RequestSchedulerRawRepository;

final class RequestSchedulerRawList
{
    private $repository;

    public function __construct(RequestSchedulerRawRepository $repository)
    {
        $this->repository = $repository;
    }

    public function getRequest($checkRequest)
    {
        $requests = $this->repository->getRequest($checkRequest);

        return $requests;
    }
}