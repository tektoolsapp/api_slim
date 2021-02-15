<?php

namespace App\Domain\Scheduler\Service;

use App\Domain\Scheduler\Repository\SchedulerBookingsTemplateRepository;
use App\Exception\ValidationException;

final class SchedulerBookingsTemplate
{
    private $repository;

    public function __construct(SchedulerBookingsTemplateRepository $repository)
    {
        $this->repository = $repository;
    }

    public function bookingsFromTemplate($templateName, $template)
    {
        $bookings = $this->repository->bookingsFromTemplate($templateName, $template);

        return $bookings;
    }
}