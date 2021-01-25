<?php

namespace App\Domain\Requests\Service;

use App\Domain\Requests\Repository\RequestsRepository;
use App\Domain\Utility\Repository\RecordCountRepository;

final class RequestsList
{
    private $repository;
    private $recordCount;

    public function __construct(RequestsRepository $repository, RecordCountRepository $recordCount)
    {
        $this->repository = $repository;
        $this->recordCount = $recordCount;
    }

    public function getRequests($page)
    {
        $totalRecords = $this->recordCount->getRecordCount();

        //dump($totalRecords);

        $requests = $this->repository->getRequests($page);

        return array(
            "requests" => $requests,
            "total_requests" => $totalRecords
        );
    }
}