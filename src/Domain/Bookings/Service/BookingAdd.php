<?php

namespace App\Domain\Bookings\Service;

use App\Domain\Bookings\Repository\BookingAddRepository;

final class BookingAdd
{
    private $repository;
    public function __construct(BookingAddRepository $repository)
    {
        $this->repository = $repository;
    }

    public function createBooking(array $data)
    {
        $bookingId = $this->repository->insertBooking($data);

        return $bookingId;
    }

}

