<?php

namespace App\Domain\Requests\Service;

use App\Domain\Requests\Repository\RequestsSchedulerRepository;

final class RequestsSchedulerList
{
    private $repository;

    public function __construct(RequestsSchedulerRepository $repository)
    {
        $this->repository = $repository;
    }

    public function getRequests($param)
    {
        $requests = $this->repository->getRequests($param);

        return array(
            "data" => $requests,
        );
    }
}