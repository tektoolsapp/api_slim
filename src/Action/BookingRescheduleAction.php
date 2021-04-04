<?php

namespace App\Action;

use App\Domain\Bookings\Service\BookingReschedule;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

final class BookingRescheduleAction
{
    private $bookingReschedule;

    public function __construct(BookingReschedule $bookingReschedule)
    {
        $this->bookingReschedule = $bookingReschedule;
    }

    public function __invoke(
        ServerRequestInterface $request,
        ResponseInterface $response
    ): ResponseInterface {
        
        $data = $request->getParsedBody(); 
        $updateResult = $this->bookingReschedule->rescheduleBooking($data);

        $response->getBody()->write((string)json_encode($updateResult));

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);
    }
}
