<?php

namespace App\Action;

use App\Domain\Bookings\Service\BookingsQuoteFetch;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Views\Twig;

final class BookingsQuoteFetchAction
{
    private $bookingsQuoteFetch;
    private $twig;

    public function __construct(BookingsQuoteFetch $bookingsQuoteFetch, Twig $twig)
    {
        $this->bookingsQuoteFetch = $bookingsQuoteFetch;
        $this->twig = $twig;
    }

    public function __invoke(
        ServerRequestInterface $quote,
        ResponseInterface $response,
        array $args = []
    ): ResponseInterface {

        //dump($args);

        $reqId = (int)$args['req_id'];

        //dump($reqId);

        $bookingsQuoteData = $this->bookingsQuoteFetch->getBookingsQuote($reqId);

        $response->getBody()->write((string)json_encode($bookingsQuoteData));

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);
    }
}