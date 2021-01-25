<?php

namespace App\Domain\Employees\Service;

use App\Domain\Employees\Repository\SkillFetchRepository;

final class SkillFetch
{
    private $repository;

    public function __construct(SkillFetchRepository $repository)
    {
        $this->repository = $repository;
    }

    public function getSkill($skillId)
    {
        $skill = $this->repository->getSkill($skillId);

        return $skill;
    }
}