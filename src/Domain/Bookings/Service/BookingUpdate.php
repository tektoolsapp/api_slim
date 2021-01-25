<?php

namespace App\Domain\Bookings\Service;

use App\Domain\Bookings\Repository\BookingUpdateRepository;

final class BookingUpdate
{
    private $repository;

    public function __construct(BookingUpdateRepository $repository)
    {
        $this->repository = $repository;
    }

    public function updateBooking(array $data)
    {
        $booking = $this->repository->updateBooking($data);

        return $booking;
    }

}

