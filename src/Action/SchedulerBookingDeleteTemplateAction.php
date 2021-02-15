<?php

namespace App\Action;

use App\Domain\Scheduler\Service\SchedulerBookingDeleteTemplate;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

final class SchedulerBookingDeleteTemplateAction
{
    private $schedulerBookingDeleteTemplate;

    public function __construct(SchedulerBookingDeleteTemplate $schedulerBookingDeleteTemplate)
    {
        $this->schedulerBookingDeleteTemplate = $schedulerBookingDeleteTemplate;
    }

    public function __invoke(
        ServerRequestInterface $request,
        ResponseInterface $response,
        array $args = []
    ): ResponseInterface {

        $data = $request->getParsedBody();

        extract($data);
        
        //parse_str($form, $formDetails);
        //dump($formDetails);

        $template = $this->schedulerBookingDeleteTemplate->deleteTemplate($template_id,);

        $response->getBody()->write((string)json_encode($template));

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);
    }
}