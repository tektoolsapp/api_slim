<?php

namespace App\Domain\Bookings\Service;

use App\Domain\Bookings\Repository\BookingsDeleteRepository;

final class BookingsDelete
{
    private $repository;

    public function __construct(BookingsDeleteRepository $repository)
    {
        $this->repository = $repository;
    }

    public function deleteBookings($deleteType, $deleteId)
    {
        $deletion = $this->repository->deleteBookings($deleteType, $deleteId);

        return $deletion;
    }

}

