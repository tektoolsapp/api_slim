<?php

namespace App\Action;

use App\Domain\Bookings\Service\BookingsShiftFetch;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Views\Twig;

final class BookingsshiftFetchAction
{
    private $bookingsShiftFetch;
    private $twig;

    public function __construct(BookingsShiftFetch $bookingsShiftFetch, Twig $twig)
    {
        $this->bookingsShiftFetch = $bookingsShiftFetch;
        $this->twig = $twig;
    }

    public function __invoke(
        ServerRequestInterface $request,
        ResponseInterface $response,
        array $args = []
    ): ResponseInterface {

        dump($args);

        $ShiftId = (int)$args['shift_id'];

        dump($ShiftId);

        $bookingsShiftData = $this->bookingsShiftFetch->getBookingsShift($ShiftId);

        $response->getBody()->write((string)json_encode($bookingsShiftData));

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);
    }
}