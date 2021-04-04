<?php

namespace App\Action;

use App\Domain\Scheduler\Service\SchedulerWorkspaceFilter;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Views\Twig;

final class SchedulerWorkspaceFilterAction
{
    private $schedulerWorkspaceFilter;
    private $twig;

    public function __construct(SchedulerWorkspaceFilter $schedulerWorkspaceFilter, Twig $twig)
    {
        $this->schedulerWorkspaceFilter = $schedulerWorkspaceFilter;
        $this->twig = $twig;
    }

    public function __invoke(
        ServerRequestInterface $request,
        ResponseInterface $response,
        array $args = []
    ): ResponseInterface {

        $params = $request->getQueryParams();

        $schedulerData = $this->schedulerWorkspaceFilter->getResources($params);

        $response->getBody()->write((string)json_encode($schedulerData));

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);
    }
}