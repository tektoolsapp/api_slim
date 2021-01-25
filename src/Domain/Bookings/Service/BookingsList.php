<?php

namespace App\Domain\Bookings\Service;

use App\Domain\Bookings\Repository\BookingsRepository;
use App\Exception\ValidationException;

final class BookingsList
{
    private $repository;

    public function __construct(BookingsRepository $repository)
    {
        $this->repository = $repository;
    }

    public function getBookings()
    {
        $bookings = $this->repository->getBookings();

        return $bookings;
    }
}