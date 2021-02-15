<?php

namespace App\Action;

use App\Domain\Bookings\Service\BookingsEmpFetch;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Views\Twig;

final class BookingsEmpFetchAction
{
    private $bookingsEmpFetch;
    private $twig;

    public function __construct(BookingsEmpFetch $bookingsEmpFetch, Twig $twig)
    {
        $this->bookingsEmpFetch = $bookingsEmpFetch;
        $this->twig = $twig;
    }

    public function __invoke(
        ServerRequestInterface $request,
        ResponseInterface $response,
        array $args = []
    ): ResponseInterface {

        //dump($args);

        $EmpId = (int)$args['Emp_id'];

        //dump($EmpId);

        $bookingsEmpData = $this->bookingsEmpFetch->getBookingsEmp($EmpId);

        $response->getBody()->write((string)json_encode($bookingsEmpData));

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);
    }
}