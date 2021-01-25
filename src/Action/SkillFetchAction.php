<?php

namespace App\Action;

use App\Domain\Employees\Service\SkillFetch;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Views\Twig;

final class SkillFetchAction
{
    private $skillFetch;
    private $twig;

    public function __construct(SkillFetch $skillFetch, Twig $twig)
    {
        $this->skillFetch = $skillFetch;
        $this->twig = $twig;
    }

    public function __invoke(
        ServerRequestInterface $request,
        ResponseInterface $response,
        array $args = []
    ): ResponseInterface {

        $skillId = (int)$args['skill_id'];

        $skillData = $this->skillFetch->getSkill($skillId);

        $response->getBody()->write((string)json_encode($skillData));

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);
    }
}