<?php

namespace App\Action;

use App\Domain\User\Service\UsersList;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Views\Twig;

final class UsersAction
{
    private $usersList;
    private $twig;

    public function __construct(UsersList $usersList, Twig $twig)
    {
        $this->usersList = $usersList;
        $this->twig = $twig;
    }

    public function __invoke(
        ServerRequestInterface $request,
        ResponseInterface $response,
        array $args = []
    ): ResponseInterface {

        $usersData = $this->usersList->getUsers();

        $response->getBody()->write((string)json_encode($usersData));

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);
    }
}