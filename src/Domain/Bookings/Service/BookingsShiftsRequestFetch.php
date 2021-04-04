<?php

namespace App\Domain\Bookings\Service;

use App\Domain\Bookings\Repository\BookingsShiftsRequestFetchRepository;

final class BookingsShiftsRequestFetch
{
    private $repository;

    public function __construct(BookingsShiftsRequestFetchRepository $repository)
    {
        $this->repository = $repository;
    }

    public function getBookingsShiftsRequest($reqId)
    {
        $bookingsRequestShifts = $this->repository->getBookingsShiftsRequest($reqId);

        return $bookingsRequestShifts;
    }
}