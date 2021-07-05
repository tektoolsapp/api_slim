<?php

namespace App\Action;

use App\Domain\Employees\Service\EmployeesFetchAuto;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Views\Twig;

final class EmployeesFetchAutoAction
{
    private $employeesFetchAuto;
    private $twig;

    public function __construct(EmployeesFetchAuto $employeesFetchAuto, Twig $twig)
    {
        $this->employeesFetchAuto = $employeesFetchAuto;
        $this->twig = $twig;
    }

    public function __invoke(
        ServerRequestInterface $request,
        ResponseInterface $response,
        array $args = []
    ): ResponseInterface {

        $term = $args['term'];

        $employees = $this->employeesFetchAuto->getEmployees($term);
        $response->getBody()->write((string)json_encode($employees));

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);
    }
}