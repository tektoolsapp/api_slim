<?php

namespace App\Domain\Scheduler\Service;

use App\Domain\Scheduler\Repository\SchedulerFetchTemplateRepository;

final class SchedulerFetchTemplate
{
    private $repository;

    public function __construct(SchedulerFetchTemplateRepository $repository)
    {
        $this->repository = $repository;
    }

    public function getTemplate($templateId)
    {
        $template = $this->repository->getTemplate($templateId);

        return $template;
    }
}