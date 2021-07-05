<?php

namespace App\Domain\Bookings\Service;

use App\Domain\Bookings\Repository\BookingSwingDeleteRepository;

final class BookingSwingDelete
{
    private $repository;

    public function __construct(BookingSwingDeleteRepository $repository)
    {
        $this->repository = $repository;
    }

    public function deleteSwing($swingId)
    {
        $swing = $this->repository->deleteSwing($swingId);

        return $swing;
    }

}

