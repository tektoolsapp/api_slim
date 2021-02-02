<?php

namespace App\Action;

use App\Domain\Bookings\Service\BookingFetch;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Views\Twig;

final class BookingFetchAction
{
    private $bookingFetch;
    private $twig;

    public function __construct(BookingFetch $bookingFetch, Twig $twig)
    {
        $this->bookingFetch = $bookingFetch;
        $this->twig = $twig;
    }

    public function __invoke(
        ServerRequestInterface $request,
        ResponseInterface $response,
        array $args = []
    ): ResponseInterface {

        //dump($args);

        $bookingId = (int)$args['booking_id'];

        //dump($bookingId);

        $booking = $this->bookingFetch->getBooking($bookingId);

        $response->getBody()->write((string)json_encode($booking));

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);
    }
}