<?php

namespace App\Action;

use App\Domain\Bookings\Service\BookingsReqEmpFetch;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Views\Twig;

final class BookingsReqEmpFetchAction
{
    private $bookingsRequestFetch;
    private $twig;

    public function __construct(BookingsReqEmpFetch $bookingsReqEmpFetch, Twig $twig)
    {
        $this->bookingsReqEmpFetch = $bookingsReqEmpFetch;
        $this->twig = $twig;
    }

    public function __invoke(
        ServerRequestInterface $request,
        ResponseInterface $response,
        array $args = []
    ): ResponseInterface {

        //dump($args);

        $reqId = (int)$args['req_id'];
        $empId = (int)$args['emp_id'];

        //dump($reqId);

        $bookingsReqEmpData = $this->bookingsReqEmpFetch->getBookingsReqEmp($reqId, $empId);

        $response->getBody()->write((string)json_encode($bookingsReqEmpData));

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);
    }
}