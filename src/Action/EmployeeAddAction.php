<?php

namespace App\Action;

use App\Domain\Employees\Service\EmployeeAdd;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

final class EmployeeAddAction
{
    private $employeeAdd;

    public function __construct(EmployeeAdd $employeeAdd)
    {
        $this->employeeAdd = $employeeAdd;
    }

    public function __invoke(
        ServerRequestInterface $request,
        ResponseInterface $response
    ): ResponseInterface {

        $data = $request->getParsedBody();

        extract($data);
        parse_str($form, $formDetails);

        //dump($formDetails);

        $returnData = $this->employeeAdd->createEmployee($formDetails);

        $response->getBody()->write((string)json_encode($returnData));

        //$response = $formDetails;

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);
    }
}
