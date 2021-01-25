<?php

namespace App\Action;

use App\Domain\Employees\Service\EmployeeSkillAdd;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

final class EmployeeSkillAddAction
{
    private $employeeAdd;

    public function __construct(EmployeeSkillAdd $employeeSkillAdd)
    {
        $this->employeeSkillAdd = $employeeSkillAdd;
    }

    public function __invoke(
        ServerRequestInterface $request,
        ResponseInterface $response
    ): ResponseInterface {

        $data = $request->getParsedBody();

        extract($data);
        parse_str($form, $formDetails);

        $returnData = $this->employeeAdd->createSkill($formDetails);

        $response->getBody()->write((string)json_encode($returnData));

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);
    }
}
