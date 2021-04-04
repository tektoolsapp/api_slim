<?php

namespace App\Action;

use App\Domain\Api\Service\ApiSignin;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

final class ApiSigninAction
{
    private $apiSignin;

    public function __construct(ApiSignin $apiSignin)
    {
        $this->apiSignin = $apiSignin;
    }

    public function __invoke(
        ServerRequestInterface $request,
        ResponseInterface $response
    ): ResponseInterface {

        $data = $request->getParsedBody();

        extract($data);
        //parse_str($form, $formDetails);

        //dump($data);

        //$data = json_decode($data, true);


        $empPin = $data['emp_pin'];
        $fcmToken = $data['fcm_token'];

        //dump($empPin);

        $signinData = $this->apiSignin->apiSignin($empPin, $fcmToken);

        $status = $signinData['status'];
        $payload = $signinData['payload'];

        $response->getBody()->write((string)json_encode($payload));

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus($status);
    }
}
