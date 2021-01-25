<?php

namespace App\Domain\Requests\Service;

use App\Domain\Requests\Repository\RequestAddRepository;

final class RequestAdd
{
    private $repository;
    public function __construct(RequestAddRepository $repository)
    {
        $this->repository = $repository;
    }

    public function createRequest(array $data)
    {
        $employeeId = $this->repository->insertRequest($data);

        return $employeeId;
    }

}