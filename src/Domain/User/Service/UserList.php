<?php

namespace App\Domain\User\Service;

use App\Domain\User\Data\UserReaderData;
use App\Domain\User\Repository\UserListRepository;
use App\Exception\ValidationException;

/**
 * Service.
 */
final class UserList
{
    /**
     * @var UserListRepository
     */
    private $repository;

    /**
     * The constructor.
     *
     * @param UserListRepository $repository The repository
     */
    public function __construct(UserListRepository $repository)
    {
        $this->repository = $repository;
    }

    /**
     * Read a user by the given user id.
     *
     * @param int $userId The user id
     *
     * @throws ValidationException
     *
     * @return UserReaderData The user data
     */
    //public function getUserList(): UserReaderData
    public function getUserList()
    {
        // Validation
        //if (empty($userId)) {
          //  throw new ValidationException('User ID required');
        //}

        $users = $this->repository->getUserList();

        return $users;
    }
}