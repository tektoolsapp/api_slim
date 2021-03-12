<?php

namespace App\Domain\Messages\Service;

use App\Domain\Employees\Repository\FcmUpdateRepository;

final class FcmUpdate
{
    private $repository;

    public function __construct(FcmUpdateRepository $repository)
    {
        $this->repository = $repository;
    }

    public function updateMessage(array $data)
    {
        $employee = $this->repository->updateMessage($data);

        return $message;
    }

}

