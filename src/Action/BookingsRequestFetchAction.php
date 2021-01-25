<?php

namespace App\Action;

use App\Domain\Bookings\Service\BookingsRequestFetch;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Views\Twig;

final class BookingsRequestFetchAction
{
    private $bookingsRequestFetch;
    private $twig;

    public function __construct(BookingsRequestFetch $bookingsRequestFetch, Twig $twig)
    {
        $this->bookingsRequestFetch = $bookingsRequestFetch;
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

        $bookingsRequestData = $this->bookingsRequestFetch->getBookingsRequest($reqId);

        $response->getBody()->write((string)json_encode($bookingsRequestData));

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);
    }
}