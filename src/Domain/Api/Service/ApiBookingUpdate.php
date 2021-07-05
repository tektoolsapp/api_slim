<?php

namespace App\Domain\Api\Service;

use App\Domain\Api\Repository\ApiBookingUpdateRepository;

final class ApiBookingUpdate
{
    private $repository;

    public function __construct(ApiBookingUpdateRepository $repository)
    {
        $this->repository = $repository;
    }

    public function updateBooking(array $shiftData)
    {
        $update = $this->repository->updateBooking($shiftData);

        return $update;
    }

}