<?php

namespace App\Action;

use App\Domain\Requests\Service\RequestsList;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Views\Twig;

final class RequestsAction
{
    private $requestsList;
    private $twig;

    public function __construct(RequestsList $requestsList, Twig $twig)
    {
        $this->requestsList = $requestsList;
        $this->twig = $twig;
    }

    public function __invoke(
        ServerRequestInterface $request,
        ResponseInterface $response,
        array $args = []
    ): ResponseInterface {

        //$data = $request->getParsedBody();

        //extract($data);

        $params = $request->getQueryParams();

        //dump($params);

        $page = $params['page'];

        $requestsData = $this->requestsList->getRequests($page);

        $response->getBody()->write((string)json_encode($requestsData));

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);

    }
}