<?php

namespace App\Action;

use App\Domain\Employees\Service\EmployeeUpdate;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

final class EmployeeUpdateAction
{
    private $employeeUpdate;

    public function __construct(EmployeeUpdate $employeeUpdate)
    {
        $this->employeeUpdate = $employeeUpdate;
    }

    public function __invoke(
        ServerRequestInterface $request,
        ResponseInterface $response
    ): ResponseInterface {

        $data = $request->getParsedBody();

        extract($data);
        parse_str($form, $formDetails);

        //dump($formDetails);

        $returnData = $this->employeeUpdate->updateEmployee($formDetails);

        $response->getBody()->write((string)json_encode($returnData));

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);
    }
}
