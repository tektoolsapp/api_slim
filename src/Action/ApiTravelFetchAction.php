<?php

namespace App\Action;

use App\Domain\Api\Service\ApiTravelFetch;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

final class ApiTravelFetchAction
{
    private $apiTravelFetch;

    public function __construct(ApiTravelFetch $apiTravelFetch)
    {
        $this->apiTravelFetch = $apiTravelFetch;
    }

    public function __invoke(
        ServerRequestInterface $request,
        ResponseInterface $response,
        array $args = []
    ): ResponseInterface {

        //dump($args);

        $swingId = (int)$args['td_swing'];

        //dump($swingId);

        $travelDocs = $this->apiTravelFetch->getTravelDocs($swingId);

        $response->getBody()->write((string)json_encode($travelDocs));

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);
    }
}