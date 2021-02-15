<?php

namespace App\Domain\Bookings\Service;

use App\Domain\Bookings\Repository\BookingsBatchFetchRepository;

final class BookingsBatchFetch
{
    private $repository;

    public function __construct(BookingsBatchFetchRepository $repository)
    {
        $this->repository = $repository;
    }

    public function getBookingsBatch($reqId)
    {
        $bookingsBatch = $this->repository->getBookingsBatch($reqId);

        return $bookingsBatch;
    }
}