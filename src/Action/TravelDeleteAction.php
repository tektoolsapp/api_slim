<?php

namespace App\Action;

use App\Domain\Travel\Service\TravelDelete;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

final class TravelDeleteAction
{
    private $travelDelete;

    public function __construct(TravelDelete $travelDelete)
    {
        $this->travelDelete = $travelDelete;
    }

    public function __invoke(
        ServerRequestInterface $request,
        ResponseInterface $response,
        array $args = []
    ): ResponseInterface {

        //dump($args);

        $docId = (int)$args['td_id'];

        //dump($swingId);

        $deleteDoc = $this->travelDelete->deleteTravelDoc($docId);

        $response->getBody()->write((string)json_encode($deleteDoc));

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);
    }
}