<?php

namespace App\Action;

use App\Domain\Scheduler\Service\SchedulerBookingTemplate;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Views\Twig;

final class SchedulerBookingTemplateAction
{
    private $schedulerBookingTemplate;
    private $twig;

    public function __construct(SchedulerBookingTemplate $schedulerBookingTemplate, Twig $twig)
    {
        $this->schedulerBookingTemplate = $schedulerBookingTemplate;
        $this->twig = $twig;
    }

    public function __invoke(
        ServerRequestInterface $request,
        ResponseInterface $response,
        array $args = []
    ): ResponseInterface {

        $data = $request->getParsedBody();

        extract($data);
        parse_str($form, $formDetails);

        //dump($formDetails);

        $template = $this->schedulerBookingTemplate->updateTemplate($template_id, $formDetails);

        $response->getBody()->write((string)json_encode($template));

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);
    }
}