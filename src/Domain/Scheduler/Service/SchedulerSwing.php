<?php

namespace App\Domain\Scheduler\Service;

use App\Domain\Scheduler\Repository\SchedulerSwingRepository;
use App\Exception\ValidationException;

final class SchedulerSwing
{
    private $repository;

    public function __construct(SchedulerSwingRepository $repository)
    {
        $this->repository = $repository;
    }

    public function updateSwingBookings($swing)
    {
        $swing = $this->repository->updateSwingBookings($swing);

        return $swing;
    }
}