<?php

namespace App\Domain\Scheduler\Service;

use App\Domain\Scheduler\Repository\SchedulerBookingTemplateRepository;
use App\Exception\ValidationException;

final class SchedulerBookingTemplate
{
    private $repository;

    public function __construct(SchedulerBookingTemplateRepository $repository)
    {
        $this->repository = $repository;
    }

    public function updateTemplate($templateId, $template)
    {
        $bookings = $this->repository->updateTemplate($templateId, $template);

        return $bookings;
    }
}