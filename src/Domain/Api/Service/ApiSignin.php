<?php

namespace App\Domain\Api\Service;

use App\Domain\Api\Repository\ApiSigninRepository;

final class ApiSignin
{
    private $repository;
    public function __construct(ApiSigninRepository $repository)
    {
        $this->repository = $repository;
    }

    public function apiSignin($credentials, $fcmToken)
    {
        $signin = $this->repository->apiSignin($credentials, $fcmToken);

        return $signin;
    }

}

