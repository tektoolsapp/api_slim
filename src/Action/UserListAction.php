<?php

namespace App\Action;

use App\Domain\User\Service\UserList;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Views\Twig;

final class UserListAction
{
    private $userReader;
    private $twig;

    public function __construct(UserList $userList, Twig $twig)
    {
        $this->userList = $userList;
        $this->twig = $twig;
    }

    public function __invoke(
        ServerRequestInterface $request,
        ResponseInterface $response,
        array $args = []
    ): ResponseInterface {
        $employeesData = $this->employeesList->getEmployees();

        $response->getBody()->write((string)json_encode($employeesData));

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);

    }
}