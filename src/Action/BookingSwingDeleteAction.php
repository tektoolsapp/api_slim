<?php

namespace App\Action;

use App\Domain\Bookings\Service\BookingSwingDelete;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

final class BookingSwingDeleteAction
{
    private $bookingSwingDelete;

    public function __construct(BookingSwingDelete $bookingSwingDelete)
    {
        $this->bookingSwingDelete = $bookingSwingDelete;
    }

    public function __invoke(
        ServerRequestInterface $request,
        ResponseInterface $response,
        array $args = []

    ): ResponseInterface {
        
        //dump($args);
        
        $swingId = $args['swing_id']; 

        //dump($swingId);

        $returndata = $this->bookingSwingDelete->deleteSwing($swingId);

        $response->getBody()->write((string)json_encode($returndata));

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);
    }
}