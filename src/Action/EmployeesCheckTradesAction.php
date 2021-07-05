<?php

namespace App\Action;

use App\Domain\Employees\Service\EmployeesCheckTrades;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

final class EmployeesCheckTradesAction
{
    private $employeesCheckTrades;

    public function __construct(EmployeesCheckTrades $employeesCheckTrades)
    {
        $this->employeesCheckTrades = $employeesCheckTrades;
    }

    public function __invoke(
        ServerRequestInterface $request,
        ResponseInterface $response,
        array $args = []
    ): ResponseInterface {

        $data = $request->getParsedBody();

        $tradesCheck = $this->employeesCheckTrades->checkEmployeesTrades($data);

        $response->getBody()->write((string)json_encode($tradesCheck));

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);
    }
}