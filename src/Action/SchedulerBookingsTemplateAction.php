<?php

namespace App\Action;

use App\Domain\Scheduler\Service\SchedulerBookingsTemplate;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Views\Twig;

final class SchedulerBookingsTemplateAction
{
    private $schedulerTemplate;
    private $twig;

    public function __construct(SchedulerBookingsTemplate $schedulerBookingsTemplate, Twig $twig)
    {
        $this->schedulerBookingsTemplate = $schedulerBookingsTemplate;
        $this->twig = $twig;
    }

    public function __invoke(
        ServerRequestInterface $request,
        ResponseInterface $response,
        array $args = []
    ): ResponseInterface {

        //dump($args);

        $data = $request->getParsedBody();

        extract($data);
        parse_str($form, $formDetails);

        //dump($formDetails);

        $templateData = $this->schedulerBookingsTemplate->bookingsFromTemplate($template_name, $formDetails);

        $response->getBody()->write((string)json_encode($templateData));

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);
    }
}