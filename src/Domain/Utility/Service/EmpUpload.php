<?php

namespace App\Domain\Utility\Service;

use App\Domain\Utility\Repository\EmpUploadRepository;

final class EmpUpload
{
    private $repository;
    private $recordCount;

    public function __construct(
        EmpUploadRepository $repository)
    {
        $this->repository = $repository;
    }

    public function getEmpUpload()
    {

        $empUpload = $this->repository->getEmpUpload();

        return $empUpload;
    }
}