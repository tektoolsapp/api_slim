<?php

namespace App\Domain\Bookings\Service;

use App\Domain\Bookings\Repository\BookingsRequestFetchRepository;

final class BookingsRequestFetch
{
    private $repository;

    public function __construct(BookingsRequestFetchRepository $repository)
    {
        $this->repository = $repository;
    }

    public function getBookingsRequest($reqId)
    {
        $bookingsRequest = $this->repository->getBookingsRequest($reqId);

        return $bookingsRequest;
    }
}