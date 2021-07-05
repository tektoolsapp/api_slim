<?php

namespace App\Domain\Bookings\Service;

use App\Domain\Bookings\Repository\BookingsShiftDetsFetchRepository;

final class BookingsShiftDetsFetch
{
    private $repository;

    public function __construct(BookingsShiftDetsFetchRepository $repository)
    {
        $this->repository = $repository;
    }

    public function getBookingsShift($shiftId)
    {
        $bookingsShift = $this->repository->getBookingsShift($shiftId);

        return $bookingsShift;
    }
}