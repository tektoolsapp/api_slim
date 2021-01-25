<?php

namespace App\Action;

use App\Domain\Requests\Service\RequestUpdate;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

final class RequestUpdateAction
{
    private $requestUpdate;

    public function __construct(RequestUpdate $requestUpdate)
    {
        $this->requestUpdate = $requestUpdate;
    }

    public function __invoke(
        ServerRequestInterface $request,
        ResponseInterface $response
    ): ResponseInterface {

        $data = $request->getParsedBody();

        extract($data);
        parse_str($form, $formDetails);

        //dump($formDetails);

        $returnData = $this->requestUpdate->updateRequest($formDetails);

        $response->getBody()->write((string)json_encode($returnData));

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);
    }
}
