<?php

namespace App\Action;

use App\Domain\Employees\Service\SkillsList;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Views\Twig;

final class SkillsAction
{
    private $skillsList;
    private $twig;

    public function __construct(SkillsList $skillsList, Twig $twig)
    {
        $this->skillsList = $skillsList;
        $this->twig = $twig;
    }

    public function __invoke(
        ServerRequestInterface $request,
        ResponseInterface $response,
        array $args = []
    ): ResponseInterface {

        $skillsData = $this->skillsList->getSkills();

        $response->getBody()->write((string)json_encode($skillsData));

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);

    }
}