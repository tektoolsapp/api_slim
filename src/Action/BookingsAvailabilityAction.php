<?php

namespace App\Action;

use App\Domain\Bookings\Service\BookingsAvailabilityList;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Views\Twig;

final class BookingsAvailabilityAction
{
    private $bookingsAvailabilityList;
    private $twig;

    public function __construct(BookingsAvailabilityList $bookingsAvailabilityList, Twig $twig)
    {
        $this->bookingsAvailabilityList = $bookingsAvailabilityList;
        $this->twig = $twig;
    }

    public function __invoke(
        ServerRequestInterface $request,
        ResponseInterface $response,
        array $args = []
    ): ResponseInterface {

        $params = $request->getQueryParams();

        //dump($params);
        
        extract($params);


        /*
        parse_str($form, $formDetails);

        extract($formDetails);

        $fromDateStr = strtotime($check_from_date);
        $fromDate = date("Y-m-d", $fromDateStr);

        $toDateStr = strtotime($check_to_date);
        $toDate = date("Y-m-d", $toDateStr);

        $begin = new \DateTime( $fromDate );
        $end = new \DateTime( $toDate );
        $end = $end->modify( '+1 day' );

        $interval = new \DateInterval('P1D');
        $daterange = new \DatePeriod($begin, $interval ,$end);

        $daterangeArray = array();

        foreach($daterange as $date){
            $thisDate = $date->format("d-m-Y");
            array_push($daterangeArray, $thisDate);

        } */

        $bookingsData = $this->bookingsAvailabilityList->getBookings($shift);

        $response->getBody()->write((string)json_encode($bookingsData));

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);
    }
}