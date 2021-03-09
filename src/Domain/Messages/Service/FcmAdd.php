<?php

namespace App\Domain\Messages\Service;

use App\Domain\Messages\Repository\FcmAddRepository;

final class FcmAdd
{
    private $repository;
    public function __construct(FcmAddRepository $repository)
    {
        $this->repository = $repository;
    }

    public function insertMessage(array $message)
    {
        $messageId = $this->repository->insertMessage($message);

        return $messageId;
    }
}

