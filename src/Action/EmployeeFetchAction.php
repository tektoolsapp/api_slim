<?php

namespace App\Action;

use App\Domain\Employees\Service\EmployeeFetch;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Views\Twig;

final class EmployeeFetchAction
{
    private $employeeFetch;
    private $twig;

    public function __construct(EmployeeFetch $employeeFetch, Twig $twig)
    {
        $this->employeeFetch = $employeeFetch;
        $this->twig = $twig;
    }

    public function __invoke(
        ServerRequestInterface $request,
        ResponseInterface $response,
        array $args = []
    ): ResponseInterface {

        //dump($args);

        //$empId = $args['emp_id'];

        $empId = (int)$args['emp_id'];

        $employeeData = $this->employeeFetch->getEmployee($empId);




        $response->getBody()->write((string)json_encode($employeeData));

        //$employeeData = "bla";

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);
    }
}