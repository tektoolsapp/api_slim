<?php

namespace App\Action;

use App\Domain\Travel\Service\TravelFetch;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

final class TravelFetchAction
{
    private $travelFetch;

    public function __construct(TravelFetch $travelFetch)
    {
        $this->travelFetch = $travelFetch;
    }

    public function __invoke(
        ServerRequestInterface $request,
        ResponseInterface $response,
        array $args = []
    ): ResponseInterface {

        //dump($args);

        $swingId = (int)$args['td_swing'];

        //dump($swingId);

        $travelDocs = $this->travelFetch->getTravelDocs($swingId);

        $response->getBody()->write((string)json_encode($travelDocs));

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);
    }
}