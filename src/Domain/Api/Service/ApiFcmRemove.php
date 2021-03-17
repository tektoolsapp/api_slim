<?php

namespace App\Domain\Api\Service;

use App\Domain\Api\Repository\ApiFcmRemoveRepository;

final class ApiFcmRemove
{
    private $repository;

    public function __construct(ApiFcmRemoveRepository $repository)
    {
        $this->repository = $repository;
    }

    public function removeMessage(array $data)
    {
        $message = $this->repository->removeMessage($data);

        return $message;
    }

}

