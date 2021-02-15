<?php

namespace App\Domain\Scheduler\Service;

use App\Domain\Scheduler\Repository\SchedulerTemplatesRepository;

final class SchedulerTemplates
{
    private $repository;

    public function __construct(SchedulerTemplatesRepository $repository)
    {
        $this->repository = $repository;
    }

    public function getTemplates()
    {
        $templates = $this->repository->getTemplates();

        return $templates;
    }
}