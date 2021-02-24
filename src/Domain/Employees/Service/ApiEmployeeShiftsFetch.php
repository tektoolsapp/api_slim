<?php

namespace App\Domain\Employees\Service;

use App\Domain\Employees\Repository\ApiEmployeeShiftsFetchRepository;

final class ApiEmployeeShiftsFetch
{
    private $repository;

    public function __construct(ApiEmployeeShiftsFetchRepository $repository)
    {
        $this->repository = $repository;
    }

    public function getApiEmployeeShifts($jwt)
    {
        $shifts = $this->repository->getApiEmployeeShifts($jwt);

        return $shifts;
    }
}