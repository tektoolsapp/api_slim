<?php

namespace App\Action;

use App\Domain\Employees\Service\SkillUpdate;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

final class SkillUpdateAction
{
    private $skillUpdate;

    public function __construct(SkillUpdate $skillUpdate)
    {
        $this->skillUpdate = $skillUpdate;
    }

    public function __invoke(
        ServerRequestInterface $request,
        ResponseInterface $response
    ): ResponseInterface {

        $data = $request->getParsedBody();

        extract($data);
        parse_str($form, $formDetails);

        dump($formDetails);

        $returnData = $this->skillUpdate->updateSkill($formDetails);

        $response->getBody()->write((string)json_encode($returnData));

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);
    }
}
