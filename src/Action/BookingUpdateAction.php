<?php

namespace App\Action;

use App\Domain\Bookings\Service\BookingUpdate;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

final class BookingUpdateAction
{
    private $bookingUpdate;

    public function __construct(BookingUpdate $bookingUpdate)
    {
        $this->bookingUpdate = $bookingUpdate;
    }

    public function __invoke(
        ServerRequestInterface $request,
        ResponseInterface $response
    ): ResponseInterface {
        $data = $request->getParsedBody();
        $postData = $data['models'][0];

        //dump($postData);

        $updateResult = $this->bookingUpdate->updateBooking($postData);

        //dump($updateResult);

        //if($updateResult == 'OK') {
            $returndata = $data['models'];
        //} else {
          //  $returndata = $updateResult;
        //}

        $response->getBody()->write((string)json_encode($updateResult));

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);
    }
}
