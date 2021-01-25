<?php

namespace App\Domain\Requests\Service;

use App\Domain\Requests\Repository\RequestUpdateRepository;

final class RequestUpdate
{
    private $repository;

    public function __construct(RequestUpdateRepository $repository)
    {
        $this->repository = $repository;
    }

    public function updateRequest(array $data)
    {
        $skill = $this->repository->updateRequest($data);

        return $skill;
    }

}

