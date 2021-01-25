<?php

namespace App\Domain\Employees\Service;

use App\Domain\Employees\Repository\SkillsRepository;

final class SkillsList
{
    private $repository;

    public function __construct(SkillsRepository $repository)
    {
        $this->repository = $repository;
    }

    public function getSkills()
    {
        $skills = $this->repository->getSkills();

        return $skills;
    }
}