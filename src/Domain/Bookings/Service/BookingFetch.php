<?php

namespace App\Domain\Bookings\Service;

use App\Domain\Bookings\Repository\BookingFetchRepository;

final class BookingFetch
{
    private $repository;

    public function __construct(BookingFetchRepository $repository)
    {
        $this->repository = $repository;
    }

    public function getBooking($bookingId)
    {
        $booking = $this->repository->getBooking($bookingId);

        return $booking;
    }
}