<?php

namespace App\Domain\Bookings\Service;

use App\Domain\Bookings\Repository\BookingsQuoteFetchRepository;

final class BookingsQuoteFetch
{
    private $repository;

    public function __construct(BookingsQuoteFetchRepository $repository)
    {
        $this->repository = $repository;
    }

    public function getBookingsQuote($reqId)
    {
        $bookingsQuote = $this->repository->getBookingsQuote($reqId);

        return $bookingsQuote;
    }
}