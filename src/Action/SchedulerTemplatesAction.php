<?php

namespace App\Action;

use App\Domain\Scheduler\Service\SchedulerTemplates;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

final class SchedulerTemplatesAction
{
    private $schedulerTemplates;

    public function __construct(SchedulerTemplates $schedulerTemplates)
    {
        $this->schedulerTemplates = $schedulerTemplates;
    }

    public function __invoke(
        ServerRequestInterface $request,
        ResponseInterface $response,
        array $args = []
    ): ResponseInterface {

        $templatesData = $this->schedulerTemplates->getTemplates();

        $response->getBody()->write((string)json_encode($templatesData));

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);

    }
}