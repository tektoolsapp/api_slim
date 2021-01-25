<?php

namespace App\Domain\Employees\Service;

use App\Domain\Employees\Repository\SkillAddRepository;

final class SkillAdd
{
    private $repository;
    public function __construct(SkillAddRepository $repository)
    {
        $this->repository = $repository;
    }

    public function createSkill(array $data)
    {
        $employeeId = $this->repository->insertSkill($data);

        return $employeeId;
    }

}

