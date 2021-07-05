<?php

namespace App\Domain\User\Service;

use App\Domain\User\Repository\UserCheckRepository;

final class UserCheck
{
    private $repository;
    public function __construct(UserCheckRepository $repository)
    {
        $this->repository = $repository;
    }

    public function checkUsername($userId, $username)
    {
        $checkUsername = $this->repository->checkUsername($userId, $username);

        return $checkUsername;
    }

}

