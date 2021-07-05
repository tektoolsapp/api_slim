<?php

namespace App\Domain\Messages\Service;

use App\Domain\Messages\Repository\MessagesFetchRepository;

final class MessagesFetch
{
    private $repository;

    public function __construct(MessagesFetchRepository $repository)
    {
        $this->repository = $repository;
    }

    public function getMessages($messageTo)
    {
        $messages = $this->repository->getMessages($messageTo);

        return $messages;
    }
}