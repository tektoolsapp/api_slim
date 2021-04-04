<?php

namespace App\Domain\Scheduler\Service;

use App\Domain\Scheduler\Repository\SchedulerWorkspaceFilterRepository;
use App\Exception\ValidationException;

final class SchedulerWorkspaceFilter
{
    private $repository;

    public function __construct(SchedulerWorkspaceFilterRepository $repository)
    {
        $this->repository = $repository;
    }

    public function getResources($filter)
    {
        $resources = $this->repository->getResources($filter);

        return $resources;
    }
}