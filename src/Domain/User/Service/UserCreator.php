<?php

namespace App\Domain\User\Service;

use App\Domain\User\Repository\UserCreatorRepository;
use Selective\Validation\Exception\ValidationException;
use Selective\Validation\ValidationResult;

final class UserCreator
{
    private $repository;

    public function __construct(UserCreatorRepository $repository)
    {
        $this->repository = $repository;
    }

    public function createUser(array $data): int
    {

        $this->validateNewUser($data);

        $userId = $this->repository->insertUser($data);

        return $userId;
    }

    private function validateNewUser(array $data): void
    {

        $validation = new ValidationResult();

        // Validate username
        if (empty($data->username)) {
            $validation->addError('username', 'Input required');
        }

        // Check validation result
        if ($validation->fails()) {
            // Trigger the validation middleware
            throw new ValidationException('Please check your inputCCC', $validation);
        }

    }
}

