<?php

namespace App\Domain\Bookings\Service;

use App\Domain\Bookings\Repository\BookingsShiftFetchRepository;

final class BookingsShiftFetch
{
    private $repository;

    public function __construct(BookingsShiftFetchRepository $repository)
    {
        $this->repository = $repository;
    }

    public function getBookingsShift($shiftId)
    {
        $bookingsShift = $this->repository->getBookingsShift($shiftId);

        return $bookingsShift;
    }
}