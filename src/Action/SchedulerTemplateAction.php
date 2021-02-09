<?php

namespace App\Action;

use App\Domain\Scheduler\Service\SchedulerTemplate;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Views\Twig;

final class SchedulerTemplateAction
{
    private $schedulerTemplate;
    private $twig;

    public function __construct(SchedulerTemplate $schedulerTemplate, Twig $twig)
    {
        $this->schedulerTemplate = $schedulerTemplate;
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

        $templateData = $this->schedulerTemplate->bookingsFromTemplate($formDetails);

        $response->getBody()->write((string)json_encode($templateData));

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);
    }
}