<?php

namespace App\Action;

use App\Domain\Bookings\Service\BookingsShiftDetsFetch;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Views\Twig;

final class BookingsShiftDetsFetchAction
{
    private $bookingsShiftDetsFetch;
    private $twig;

    public function __construct(BookingsShiftDetsFetch $bookingsShiftDetsFetch, Twig $twig)
    {
        $this->bookingsShiftDetsFetch = $bookingsShiftDetsFetch;
        $this->twig = $twig;
    }

    public function __invoke(
        ServerRequestInterface $request,
        ResponseInterface $response,
        array $args = []
    ): ResponseInterface {

        //dump($args);

        $ShiftId = (int)$args['shift_id'];

        //dump($ShiftId);

        $bookingsShiftData = $this->bookingsShiftDetsFetch->getBookingsShift($ShiftId);

        $response->getBody()->write((string)json_encode($bookingsShiftData));

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);
    }
}