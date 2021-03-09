<?php

namespace App\Action;

use App\Domain\Messages\Service\FcmAdd;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

final class FcmAddAction
{
    private $fcmAdd;

    public function __construct(FcmAdd $fcmAdd)
    {
        $this->fcmAdd = $fcmAdd;
    }

    public function __invoke(
        ServerRequestInterface $request,
        ResponseInterface $response
    ): ResponseInterface {

        $data = $request->getParsedBody();

        extract($data);
        parse_str($form, $formDetails);

        //dump($formDetails);

        $returnData = $this->fcmAdd->insertMessage($formDetails);

        $response->getBody()->write((string)json_encode($returnData));

        //$response = $formDetails;

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);
    }
}
