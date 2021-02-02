<?php

namespace App\Domain\Bookings\Service;

use App\Domain\Bookings\Repository\BookingsConflictRepository;

final class BookingsConflict
{
    private $repository;

    public function __construct(BookingsConflictRepository $repository)
    {
        $this->repository = $repository;
    }

    public function getBookingConflicts($bookingDetails)
    {
        $conflicts = $this->repository->getBookingConflicts($bookingDetails);

        return $conflicts;
    }
}