<?php

namespace App\Action;

use App\Domain\Bookings\Service\BookingsConflict;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Views\Twig;

final class BookingsConflictAction
{
    private $bookingsConflict;
    private $twig;

    public function __construct(BookingsConflict $bookingsConflict, Twig $twig)
    {
        $this->bookingsConflict = $bookingsConflict;
        $this->twig = $twig;
    }

    public function __invoke(
        ServerRequestInterface $request,
        ResponseInterface $response,
        array $args = []
    ): ResponseInterface {

        $bookingDetails = $request->getQueryParams();

        //dump($bookingDetails);

        $conflicts = $this->bookingsConflict->getBookingConflicts($bookingDetails);

        $response->getBody()->write((string)json_encode($conflicts));

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);
    }
}