<?php

namespace App\Action;

use App\Domain\Bookings\Service\BookingDelete;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

final class BookingDeleteAction
{
    private $bookingDelete;

    public function __construct(BookingDelete $bookingDelete)
    {
        $this->bookingDelete = $bookingDelete;
    }

    public function __invoke(
        ServerRequestInterface $request,
        ResponseInterface $response
    ): ResponseInterface {
        $data = $request->getParsedBody();
        $postData = $data['models'][0];

        $this->bookingDelete->deleteBooking($postData);

        $returndata = $data['models'];

        $response->getBody()->write((string)json_encode($returndata));

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);
    }
}
