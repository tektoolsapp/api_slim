<?php

namespace App\Action;

use App\Domain\Employees\Service\EmployeesList;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Views\Twig;

final class EmployeesAction
{
    private $employeesList;
    private $twig;

    public function __construct(EmployeesList $employeesList, Twig $twig)
    {
        $this->employeesList = $employeesList;
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