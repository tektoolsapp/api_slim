<?php

namespace App\Domain\Scheduler\Service;

use App\Domain\Scheduler\Repository\SchedulerTemplateRepository;
use App\Exception\ValidationException;

final class SchedulerTemplate
{
    private $repository;

    public function __construct(SchedulerTemplateRepository $repository)
    {
        $this->repository = $repository;
    }

    public function bookingsFromTemplate($template)
    {
        $bookings = $this->repository->bookingsFromTemplate($template);

        return $bookings;
    }
}