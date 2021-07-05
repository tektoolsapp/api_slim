<?php

namespace App\Action;

use App\Domain\User\Service\UserCheck;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

final class UserCheckAction
{
    private $userCheck;

    public function __construct(UserCheck $userCheck)
    {
        $this->userCheck = $userCheck;
    }

    public function __invoke(
        ServerRequestInterface $request,
        ResponseInterface $response,
        array $args = []
    ): ResponseInterface {

        //dump($args);
        
        $userId = $args['id'];
        $username = $args['username'];

        $checkUsername = $this->userCheck->checkUsername($userId, $username);

        $response->getBody()->write((string)json_encode($checkUsername));

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);
    }
}
