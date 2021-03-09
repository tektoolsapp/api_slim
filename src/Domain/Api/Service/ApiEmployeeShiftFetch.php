<?php

namespace App\Domain\Api\Service;

use App\Domain\Api\Repository\ApiEmployeeShiftFetchRepository;

final class ApiEmployeeShiftFetch
{
    private $repository;

    public function __construct(ApiEmployeeShiftFetchRepository $repository)
    {
        $this->repository = $repository;
    }

    public function getApiEmployeeShift($shiftId)
    {
        $shift = $this->repository->getApiEmployeeShift($shiftId);

        return $shift;
    }
}