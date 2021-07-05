<?php

namespace App\Domain\Messages\Service;

use App\Domain\Messages\Repository\FcmNotifyRepository;

final class FcmNotify
{
    private $repository;
    public function __construct(FcmNotifyRepository $repository)
    {
        $this->repository = $repository;
    }

    public function insertMessage(array $message)
    {
        $messageId = $this->repository->insertMessage($message);

        return $messageId;
    }
}

