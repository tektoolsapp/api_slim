<?php

namespace App\Action;

use App\Domain\Requests\Service\RequestFetch;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Views\Twig;

final class RequestFetchAction
{
    private $requestFetch;
    private $twig;

    public function __construct(RequestFetch $requestFetch, Twig $twig)
    {
        $this->requestFetch = $requestFetch;
        $this->twig = $twig;
    }

    public function __invoke(
        ServerRequestInterface $request,
        ResponseInterface $response,
        array $args = []
    ): ResponseInterface {

        //dump($args);

        $wsId = (int)$args['ws_id'];

        //dump($wsId);

        $requestData = $this->requestFetch->getRequest($wsId);

        $response->getBody()->write((string)json_encode($requestData));

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);
    }
}