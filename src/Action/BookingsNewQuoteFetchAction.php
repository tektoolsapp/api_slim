<?php

namespace App\Action;

use App\Domain\Bookings\Service\BookingsNewQuoteFetch;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Views\Twig;

final class BookingsNewQuoteFetchAction
{
    private $bookingsNewQuoteFetch;
    private $twig;

    public function __construct(
        BookingsNewQuoteFetch $bookingsNewQuoteFetch,
        Twig $twig)
    {
        $this->bookingsNewQuoteFetch = $bookingsNewQuoteFetch;
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

        //die();

        $bookingsQuoteData = $this->bookingsNewQuoteFetch->getBookingsQuote($reqId);

        $response->getBody()->write((string)json_encode($bookingsQuoteData));

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);
    }
}