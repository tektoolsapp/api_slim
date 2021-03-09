<?php

namespace App\Domain\User\Service;

use App\Domain\User\Repository\UsersListRepository;
use App\Exception\ValidationException;

final class UsersList
{
    
    private $repository;

    public function __construct(UsersListRepository $repository)
    {
        $this->repository = $repository;
    }

    public function getUsers()
    {
    
        $users = $this->repository->getUsers();

        return $users;
    }
}