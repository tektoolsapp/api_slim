<?php

namespace App\Domain\User\Service;

use App\Domain\User\Repository\UserUpdateDetsRepository;

final class UserUpdateDets
{
    private $repository;

    public function __construct(UserUpdateDetsRepository $repository)
    {
        $this->repository = $repository;
    }

    public function updateUser(array $data)
    {
        $user = $this->repository->updateUser($data);

        return $user;
    }

}

