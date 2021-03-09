<?php

namespace App\Domain\Messages\Service;

use App\Domain\Messages\Repository\FcmFetchRepository;

final class FcmFetch
{
    private $repository;

    public function __construct(FcmFetchRepository $repository)
    {
        $this->repository = $repository;
    }

    public function getMessages($messageTo)
    {
        //dump($messageTo);
        
        $messages = $this->repository->getMessages($messageTo);

        return $messages;
    }
}