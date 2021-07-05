<?php

namespace App\Action;

use App\Domain\Scheduler\Service\SchedulerSwing;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

final class SchedulerSwingAction
{
    private $schedulerSwing;

    public function __construct(SchedulerSwing $schedulerSwing)
    {
        $this->schedulerSwing = $schedulerSwing;
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

        $swingData = $this->schedulerSwing->updateSwingBookings($formDetails);

        $response->getBody()->write((string)json_encode($swingData));

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);
    }
}