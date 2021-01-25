<?php

namespace App\Action;

use App\Domain\Requests\Service\RequestSchedulerRawList;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Views\Twig;

final class RequestSchedulerRawAction
{
    private $requestSchedulerRawList;
    private $twig;

    public function __construct(RequestSchedulerRawList $requestSchedulerRawList, Twig $twig)
    {
        $this->requestSchedulerRawList = $requestSchedulerRawList;
        $this->twig = $twig;
    }

    public function __invoke(
        ServerRequestInterface $request,
        ResponseInterface $response,
        array $args = []
    ): ResponseInterface {

        $rawRequest = $args['raw'];
        $requestId = (int)(substr($rawRequest,0,6));

        //dump($rawRequest);

        $requestsData = $this->requestSchedulerRawList->getRequest($requestId);

        $response->getBody()->write((string)json_encode($requestsData));

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);

    }
}