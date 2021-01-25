<?php

namespace App\Domain\Employees\Service;

use App\Domain\Employees\Repository\EmployeeSkillAddRepository;

final class EmployeeSkillAdd
{
    private $repository;

    public function __construct(EmployeeSkillAddRepository $repository)
    {
        $this->repository = $repository;
    }

    public function createEmployee(array $data)
    {
        $skillId = $this->repository->insertSkill($data);

        return $skillId;
    }

}

