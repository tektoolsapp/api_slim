<?php

namespace App\Domain\Utility\Service;

use App\Domain\Utility\Repository\PdfFieldsRepository;

final class PdfFields
{
    private $repository;

    public function __construct(PdfFieldsRepository $repository)
    {
        $this->repository = $repository;
    }

    public function getPdfFields($req,$pdf)
    {
        $customer = $this->repository->getPdfFields($req,$pdf);

        return $customer;
    }
}