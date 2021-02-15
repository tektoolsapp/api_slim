<?php

namespace App\Domain\Scheduler\Service;

use App\Domain\Scheduler\Repository\SchedulerBookingDeleteTemplateRepository;
use App\Exception\ValidationException;

final class SchedulerBookingDeleteTemplate
{
    private $repository;

    public function __construct(SchedulerBookingDeleteTemplateRepository $repository)
    {
        $this->repository = $repository;
    }

    public function deleteTemplate($templateId)
    {
        $bookings = $this->repository->deleteTemplate($templateId);

        return $bookings;
    }
}