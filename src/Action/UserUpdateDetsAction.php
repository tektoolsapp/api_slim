<?php

namespace App\Action;

use App\Domain\User\Service\UserUpdateDets;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

final class UserUpdateDetsAction
{
    private $userUpdateDets;

    public function __construct(UserUpdateDets $userUpdateDets)
    {
        $this->userUpdateDets = $userUpdateDets;
    }

    public function __invoke(
        ServerRequestInterface $request,
        ResponseInterface $response
    ): ResponseInterface {

        $data = $request->getParsedBody();

        $returnData = $this->userUpdateDets->updateUser($data);

        $response->getBody()->write((string)json_encode($returnData));

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);
    }
}
