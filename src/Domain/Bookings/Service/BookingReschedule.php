<?php

namespace App\Domain\Bookings\Service;

use App\Domain\Bookings\Repository\BookingRescheduleRepository;

final class BookingReschedule
{
    private $repository;

    public function __construct(BookingRescheduleRepository $repository)
    {
        $this->repository = $repository;
    }

    public function rescheduleBooking(array $data)
    {
        $booking = $this->repository->rescheduleBooking($data);

        return $booking;
    }

}

