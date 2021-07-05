<?php

namespace App\Action;

use App\Domain\Bookings\Service\BookingUpdateDets;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

final class BookingUpdateDetsAction
{
    private $bookingUpdateDets;

    public function __construct(BookingUpdateDets $bookingUpdateDets)
    {
        $this->bookingUpdateDets = $bookingUpdateDets;
    }

    public function __invoke(
        ServerRequestInterface $request,
        ResponseInterface $response
    ): ResponseInterface {
        
        $data = $request->getParsedBody(); 
        $updateResult = $this->bookingUpdateDets->updateBooking($data);

        $response->getBody()->write((string)json_encode($updateResult));

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);
    }
}
