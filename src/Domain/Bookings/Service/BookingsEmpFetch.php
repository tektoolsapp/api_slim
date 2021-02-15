<?php

namespace App\Domain\Bookings\Service;

use App\Domain\Bookings\Repository\BookingsEmpFetchRepository;

final class BookingsEmpFetch
{
    private $repository;

    public function __construct(BookingsEmpFetchRepository $repository)
    {
        $this->repository = $repository;
    }

    public function getBookingsEmp($reqId)
    {
        $bookingsEmp = $this->repository->getBookingsEmp($reqId);

        return $bookingsEmp;
    }
}