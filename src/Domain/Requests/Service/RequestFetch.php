<?php

namespace App\Domain\Requests\Service;

use App\Domain\Requests\Repository\RequestFetchRepository;

final class RequestFetch
{
    private $repository;

    public function __construct(RequestFetchRepository $repository)
    {
        $this->repository = $repository;
    }

    public function getRequest($wsId)
    {
        console.log($wsId);

        $request = $this->repository->getRequest($wsId);

        return $request;
    }
}