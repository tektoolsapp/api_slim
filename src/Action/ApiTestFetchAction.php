<?php

namespace App\Action;

use App\Domain\Api\Service\ApiTestFetch;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
//use Slim\Views\Twig;

final class ApiTestFetchAction
{
    private $apiTestFetch;
    //private $twig;

    public function __construct(
            ApiTestFetch $apiTestFetch 
            //Twig $twig
        )
    {
        $this->apiTestFetch = $apiTestFetch;
        //$this->twig = $twig;
    }

    public function __invoke(
        ServerRequestInterface $request,
        ResponseInterface $response,
        array $args = []
    ): ResponseInterface {

        //dump($args);
        $testId = $args['test_id'];

        $apiTestData = $this->apiTestFetch->getApiTest($testId);

        $response->getBody()->write((string)json_encode($apiTestData));
        
        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);
    }
}