<?php

namespace App\Domain\Employees\Service;

use App\Domain\Employees\Repository\EmployeeAddRepository;
use App\Exception\ValidationException;

final class EmployeeAdd
{
    private $repository;
    public function __construct(EmployeeAddRepository $repository)
    {
        $this->repository = $repository;
    }

    public function createEmployee(array $data)
    {
        $employeeId = $this->repository->insertEmployee($data);

        // Logging here: User created successfully
        //$this->logger->info(sprintf('User created successfully: %s', $userId));

        return $employeeId;
    }

    private function validateNewUser(array $data): void
    {
        $errors = [];

        // Here you can also use your preferred validation library

        if (empty($data['username'])) {
            $errors['username'] = 'Input required';
        }

        if (empty($data['email'])) {
            $errors['email'] = 'Input required';
        } elseif (filter_var($data['email'], FILTER_VALIDATE_EMAIL) === false) {
            $errors['email'] = 'Invalid email address';
        }

        if ($errors) {
            throw new ValidationException('Please check your input', $errors);
        }
    }
}

