<?php

namespace App\Domain\Bookings\Service;

use App\Domain\Bookings\Repository\BookingDeleteRepository;

final class BookingDelete
{
    private $repository;

    public function __construct(BookingDeleteRepository $repository)
    {
        $this->repository = $repository;
    }

    public function deleteBooking(array $data)
    {
        $booking = $this->repository->deleteBooking($data);

        return $booking;
    }

}

