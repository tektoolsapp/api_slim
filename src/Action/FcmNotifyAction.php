<?php

namespace App\Action;

use App\Domain\Messages\Service\FcmNotify;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

final class FcmNotifyAction
{
    private $fcmNotify;

    public function __construct(FcmNotify $fcmNotify)
    {
        $this->fcmNotify = $fcmNotify;
    }

    public function __invoke(
        ServerRequestInterface $request,
        ResponseInterface $response
    ): ResponseInterface {

        $data = $request->getParsedBody();

        $formDetails = $data['form'];

        //dump($formDetails);

        $returnData = $this->fcmNotify->insertMessage($formDetails);

        $response->getBody()->write((string)json_encode($returnData));

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);
    }
}
