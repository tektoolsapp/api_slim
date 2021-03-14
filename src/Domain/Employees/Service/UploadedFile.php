<?php

namespace App\Domain\Utility\Service;

use App\Domain\Utility\Repository\UploadedFileRepository;
//use App\Exception\ValidationException;

final class UploadedFile
{
    private $repository;
    public function __construct(UploadedFileRepository $repository)
    {
        $this->repository = $repository;
    }

    public function insertUploadedFile($fileName)
    {
        $uploaded = $this->repository->insertUploadedFile($fileName);

        return $uploaded;
    }

}