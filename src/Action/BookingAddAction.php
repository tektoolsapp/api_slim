<?php

namespace App\Action;

use App\Domain\Bookings\Service\BookingAdd;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

final class BookingAddAction
{
    private $bookingAdd;

    public function __construct(BookingAdd $bookingAdd)
    {
        $this->bookingAdd = $bookingAdd;
    }

    public function __invoke(
        ServerRequestInterface $request,
        ResponseInterface $response
    ): ResponseInterface {

        $data = $request->getParsedBody();
        $postData = $data['models'][0];
        $returnData = $this->bookingAdd->createBooking($postData);

        $response->getBody()->write((string)json_encode($returnData));

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);
    }
}
