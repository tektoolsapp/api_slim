<?php

namespace App\Action;

use App\Domain\Scheduler\Service\SchedulerFetchTemplate;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

final class SchedulerFetchTemplateAction
{
    private $schedulerFetchTemplate;

    public function __construct(SchedulerFetchTemplate $schedulerFetchTemplate)
    {
        $this->schedulerFetchTemplate = $schedulerFetchTemplate;
    }

    public function __invoke(
        ServerRequestInterface $request,
        ResponseInterface $response,
        array $args = []
    ): ResponseInterface {

        $templateId = (int)$args['template_id'];
        
        $template = $this->schedulerFetchTemplate->getTemplate($templateId);

        $response->getBody()->write((string)json_encode($template));

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);

    }
}