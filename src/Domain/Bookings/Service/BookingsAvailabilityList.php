<?php

namespace App\Domain\Bookings\Service;

use App\Domain\Bookings\Repository\BookingsAvailabilityRepository;

final class BookingsAvailabilityList
{
    private $repository;

    public function __construct(BookingsAvailabilityRepository $repository)
    {
        $this->repository = $repository;
    }

    public function getBookings($shift)
    {
        $bookings = $this->repository->getBookings($shift);

        return $bookings;
    }
}