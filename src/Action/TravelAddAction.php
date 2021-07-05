<?php

namespace App\Action;

use App\Domain\Travel\Service\TravelAdd;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

final class TravelAddAction
{
    private $travelAdd;

    public function __construct(TravelAdd $travelAdd)
    {
        $this->travelAdd = $travelAdd;
    }

    public function __invoke(
        ServerRequestInterface $request,
        ResponseInterface $response
    ): ResponseInterface {

        $data = $request->getParsedBody();

        //extract($data);

        $returnData = $this->travelAdd->createTravelDoc($data);

        $response->getBody()->write((string)json_encode($returnData));

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);
    }
}
