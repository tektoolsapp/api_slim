<?php

namespace App\Action;

use App\Domain\Api\Service\ApiMessagesFetch;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

final class ApiMessagesFetchAction
{
    private $apiMessagesFetch;
    private $twig;

    public function __construct(ApiMessagesFetch $apiMessagesFetch)
    {
        $this->apiMessagesFetch = $apiMessagesFetch;
    }

    public function __invoke(
        ServerRequestInterface $request,
        ResponseInterface $response,
        array $args = []
    ): ResponseInterface {

        $messageTo = (int)$args['message_to'];
        
        $apiMessagesData = $this->apiMessagesFetch->getApiMessages($messageTo);

        $response->getBody()->write((string)json_encode($apiMessagesData));
        
        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);
    }
}