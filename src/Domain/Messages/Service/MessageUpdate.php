<?php

namespace App\Domain\Messages\Service;

use App\Domain\Messages\Repository\MessageUpdateRepository;

final class MessageUpdate
{
    private $repository;

    public function __construct(MessageUpdateRepository $repository)
    {
        $this->repository = $repository;
    }

    public function updateMessage(array $data)
    {
        $message = $this->repository->updateMessage($data);

        return $message;
    }

}

