<?php

namespace App\Action;

use App\Domain\Api\Service\ApiBookingUpdate;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

final class ApiBookingUpdateAction
{
    private $apiBookingUpdate;

    public function __construct(
            ApiBookingUpdate $apiBookingUpdate
        )
    {
        $this->apiBookingUpdate = $apiBookingUpdate;
    }

    public function __invoke(
        ServerRequestInterface $request,
        ResponseInterface $response
    ): ResponseInterface {

        $data = $request->getParsedBody();

        //dump($data);

        //extract($data);
        //parse_str($form, $formDetails);

        //dump($formDetails);

        $returnData = $this->apiBookingUpdate->updateBooking($data);

        //$returnData = $data;

        $response->getBody()->write((string)json_encode($returnData));

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);
    }
}
