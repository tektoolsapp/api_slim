<?php

namespace App\Action;

use App\Domain\Employees\Service\ApiEmployeeFetch;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Views\Twig;

final class ApiEmployeeFetchAction
{
    private $apiEmployeeFetch;
    private $twig;

    public function __construct(ApiEmployeeFetch $apiEmployeeFetch, Twig $twig)
    {
        $this->apiEmployeeFetch = $apiEmployeeFetch;
        $this->twig = $twig;
    }

    public function __invoke(
        ServerRequestInterface $request,
        ResponseInterface $response,
        array $args = []
    ): ResponseInterface {

        //dump($args);
        //$empId = $args['emp_id'];
        //$empId = (int)$args['emp_id'];

        $authHeaderStr = $request->getHeader('Authorization');
        //dump($authHeaderStr);
        $authHeaderArray = explode(" ",$authHeaderStr[0]);
        //dump($authHeaderArray);
        $authHeader = $authHeaderArray[1];
        //dump($authHeader);
    
        //$data = $request->getParsedBody();
        //$params = $request->getQueryParams();
        //dump($params);
        //extract($params);

        $apiEmployeeData = $this->apiEmployeeFetch->getApiEmployee($authHeader);

        $response->getBody()->write((string)json_encode($apiEmployeeData));
        
        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);
    }
}