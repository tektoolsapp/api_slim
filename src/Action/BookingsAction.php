<?php

namespace App\Action;

use App\Domain\Bookings\Service\BookingsList;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Views\Twig;

final class BookingsAction
{
    private $userReader;
    private $bookingsList;
    private $twig;

    public function __construct(BookingsList $bookingsList, Twig $twig)
    {
        $this->bookingsList = $bookingsList;
        $this->twig = $twig;
    }

    public function __invoke(
        ServerRequestInterface $request,
        ResponseInterface $response,
        array $args = []
    ): ResponseInterface {

        $bookingsData = $this->bookingsList->getBookings();

        $response->getBody()->write((string)json_encode($bookingsData));

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);
    }
}