<?php

namespace App\Domain\Bookings\Service;

use App\Domain\Bookings\Repository\BookingsAvailabilityRepository;
use App\Exception\ValidationException;

final class BookingsAvailabilityList
{
    private $repository;

    public function __construct(BookingsAvailabilityRepository $repository)
    {
        $this->repository = $repository;
    }

    public function getBookings()
    {
        $bookings = $this->repository->getBookings();

        return $bookings;
    }
}