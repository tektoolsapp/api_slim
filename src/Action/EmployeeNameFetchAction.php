<?php

namespace App\Action;

use App\Domain\Employees\Service\EmployeeNameFetch;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Views\Twig;

final class EmployeeNameFetchAction
{
    private $employeeNameFetch;
    private $twig;

    public function __construct(EmployeeNameFetch $employeeNameFetch, Twig $twig)
    {
        $this->employeeNameFetch = $employeeNameFetch;
        $this->twig = $twig;
    }

    public function __invoke(
        ServerRequestInterface $request,
        ResponseInterface $response,
        array $args = []
    ): ResponseInterface {

        $empName = $args['name'];

        //dump($empName);

        $employee = $this->employeeNameFetch->getEmployee($empName);
        $response->getBody()->write((string)json_encode($employee));

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);
    }
}