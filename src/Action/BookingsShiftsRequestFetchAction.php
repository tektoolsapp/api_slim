<?php

namespace App\Action;

use App\Domain\Bookings\Service\BookingsShiftsRequestFetch;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Views\Twig;

final class BookingsShiftsRequestFetchAction
{
    private $bookingsShiftsRequestFetch;
    private $twig;

    public function __construct(BookingsShiftsRequestFetch $bookingsShiftsRequestFetch, Twig $twig)
    {
        $this->bookingsShiftsRequestFetch = $bookingsShiftsRequestFetch;
        $this->twig = $twig;
    }

    public function __invoke(
        ServerRequestInterface $request,
        ResponseInterface $response,
        array $args = []
    ): ResponseInterface {

        //dump($args);

        $reqId = (int)$args['req_id'];

        //dump($reqId);

        $bookingsShiftsRequestData = $this->bookingsShiftsRequestFetch->getBookingsShiftsRequest($reqId);

        $response->getBody()->write((string)json_encode($bookingsShiftsRequestData));

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);
    }
}