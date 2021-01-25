<?php

namespace App\Action;

use App\Domain\Requests\Service\RequestsSchedulerList;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Views\Twig;

final class RequestsSchedulerAction
{
    private $requestsSchedulerList;
    private $twig;

    public function __construct(RequestsSchedulerList $requestsSchedulerList, Twig $twig)
    {
        $this->requestsSchedulerList = $requestsSchedulerList;
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

        $param = $params['Contains'];

        //dump($param);

        $requestsData = $this->requestsSchedulerList->getRequests($param);

        $response->getBody()->write((string)json_encode($requestsData));

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);

    }
}