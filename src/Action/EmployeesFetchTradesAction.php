<?php

namespace App\Action;

use App\Domain\Employees\Service\EmployeesFetchTrades;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Views\Twig;

final class EmployeesFetchTradesAction
{
    private $employeesFetchTrades;
    private $twig;

    public function __construct(EmployeesFetchTrades $employeesFetchTrades, Twig $twig)
    {
        $this->employeesFetchTrades = $employeesFetchTrades;
        $this->twig = $twig;
    }

    public function __invoke(
        ServerRequestInterface $request,
        ResponseInterface $response,
        array $args = []
    ): ResponseInterface {

        //dump($args);

        //$empId = $args['emp_id'];

        //$empId = (int)$args['emp_id'];
        $tradeTypes = $args['trade_types'];

        //dump($tradeTypes);

        $employeeData = $this->employeesFetchTrades->getEmployees($tradeTypes);

        $response->getBody()->write((string)json_encode($employeeData));

        //$employeeData = "bla";

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);
    }
}