<?php

namespace App\Action;

use App\Domain\Employees\Service\SkillAdd;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

final class SkillAddAction
{
    private $skillAdd;

    public function __construct(SkillAdd $skillAdd)
    {
        $this->skillAdd = $skillAdd;
    }

    public function __invoke(
        ServerRequestInterface $request,
        ResponseInterface $response
    ): ResponseInterface {

        $data = $request->getParsedBody();

        extract($data);
        parse_str($form, $formDetails);

        dump($formDetails);

        $returnData = $this->skillAdd->createSkill($formDetails);

        $response->getBody()->write((string)json_encode($returnData));

        //$response = $formDetails;

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);
    }
}
