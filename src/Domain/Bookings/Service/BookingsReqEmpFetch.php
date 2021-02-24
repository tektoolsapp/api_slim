<?php

namespace App\Domain\Bookings\Service;

use App\Domain\Bookings\Repository\BookingsReqEmpFetchRepository;

final class BookingsReqEmpFetch
{
    private $repository;

    public function __construct(BookingsReqEmpFetchRepository $repository)
    {
        $this->repository = $repository;
    }

    public function getBookingsReqEmp($reqId, $empId)
    {
        $bookingsReqEmp = $this->repository->getBookingsReqEmp($reqId, $empId);

        return $bookingsReqEmp;
    }
}