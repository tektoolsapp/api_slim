<?php

namespace App\Domain\Api\Service;

use App\Domain\Api\Repository\ApiMessagesFetchRepository;

final class ApiMessagesFetch
{
    private $repository;

    public function __construct(ApiMessagesFetchRepository $repository)
    {
        $this->repository = $repository;
    }

    public function getApiMessages($messageTo)
    {
        $messages = $this->repository->getApiMessages($messageTo);

        return $messages;
    }
}