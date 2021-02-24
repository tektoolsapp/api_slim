<?php

namespace App\Domain\Bookings\Service;

use App\Domain\Bookings\Repository\BookingsNewQuoteFetchRepository;

final class BookingsNewQuoteFetch
{
    private $repository;

    public function __construct(BookingsNewQuoteFetchRepository $repository)
    {
        $this->repository = $repository;
    }

    public function getBookingsQuote($reqId)
    {
        $bookingsQuote = $this->repository->getBookingsQuote($reqId);

        return $bookingsQuote;
    }
}