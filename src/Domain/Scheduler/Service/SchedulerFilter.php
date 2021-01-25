<?php

namespace App\Domain\Scheduler\Service;

use App\Domain\Scheduler\Repository\SchedulerFilterRepository;
use App\Exception\ValidationException;

final class SchedulerFilter
{
    private $repository;

    public function __construct(SchedulerFilterRepository $repository)
    {
        $this->repository = $repository;
    }

    public function getResources($filter)
    {
        $resources = $this->repository->getResources($filter);

        return $resources;
    }
}