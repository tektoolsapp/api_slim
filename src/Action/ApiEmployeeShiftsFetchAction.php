<?php

namespace App\Action;

use App\Domain\Employees\Service\ApiEmployeeShiftsFetch;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Views\Twig;

final class ApiEmployeeShiftsFetchAction
{
    private $apiEmployeeShiftsFetch;
    private $twig;

    public function __construct(
            ApiEmployeeShiftsFetch $apiEmployeeShiftsFetch, 
            Twig $twig
        )
    {
        $this->apiEmployeeShiftsFetch = $apiEmployeeShiftsFetch;
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

        //$apiEmployeeShiftsData = 'bla';

        $apiEmployeeShiftsData = $this->apiEmployeeShiftsFetch->getApiEmployeeShifts($authHeader);

        $response->getBody()->write((string)json_encode($apiEmployeeShiftsData));
        
        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);
    }
}