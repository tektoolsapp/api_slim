<?php

namespace App\Action;

use App\Domain\Bookings\Service\BookingsDelete;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

final class BookingsDeleteAction
{
    private $bookingsDelete;

    public function __construct(BookingsDelete $bookingsDelete)
    {
        $this->bookingsDelete = $bookingsDelete;
    }

    public function __invoke(
        ServerRequestInterface $request,
        ResponseInterface $response
    ): ResponseInterface {
        $data = $request->getParsedBody();
        
        extract($data);
        parse_str($form, $formDetails);

        //dump($formDetails);

        $deleteType = $data['delete_type'];
        
        if($deleteType == 'request'){
            $deleteId = $formDetails['delete_req_id'];
        } elseif($deleteType == 'batch' ){
            $deleteId = $formDetails['delete_batch_id'];
        } elseif($deleteType == 'shift' ){
            $deleteId = $formDetails['delete_shift_id'];
        }
        
        //dump($deleteType);
        //dump($deleteId);

        $deletion = $this->bookingsDelete->deleteBookings($deleteType, $deleteId);

        $response->getBody()->write((string)json_encode($deletion));

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);
    }
}
