<?php

namespace App\Domain\Bookings\Service;

use App\Domain\Bookings\Repository\BookingUpdateDetsRepository;

final class BookingUpdateDets
{
    private $repository;

    public function __construct(BookingUpdateDetsRepository $repository)
    {
        $this->repository = $repository;
    }

    public function updateBooking(array $data)
    {
        $booking = $this->repository->updateBooking($data);

        return $booking;
    }

}

