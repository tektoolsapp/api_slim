<?php

namespace App\Domain\Employees\Service;

use App\Domain\Employees\Repository\SkillUpdateRepository;

final class SkillUpdate
{
    private $repository;

    public function __construct(SkillUpdateRepository $repository)
    {
        $this->repository = $repository;
    }

    public function updateSkill(array $data)
    {
        $skill = $this->repository->updateSkill($data);

        return $skill;
    }

}

