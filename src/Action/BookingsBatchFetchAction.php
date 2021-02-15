<?php

namespace App\Action;

use App\Domain\Bookings\Service\BookingsBatchFetch;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Views\Twig;

final class BookingsBatchFetchAction
{
    private $bookingsBatchFetch;
    private $twig;

    public function __construct(BookingsBatchFetch $bookingsBatchFetch, Twig $twig)
    {
        $this->bookingsBatchFetch = $bookingsBatchFetch;
        $this->twig = $twig;
    }

    public function __invoke(
        ServerRequestInterface $request,
        ResponseInterface $response,
        array $args = []
    ): ResponseInterface {

        //dump($args);

        $batchId = (int)$args['batch_id'];

        //dump($batchId);

        $bookingsBatchData = $this->bookingsBatchFetch->getBookingsBatch($batchId);

        $response->getBody()->write((string)json_encode($bookingsBatchData));

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);
    }
}