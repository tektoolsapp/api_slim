<?php

namespace App\Action;

use App\Domain\Api\Service\ApiEmployeeShiftFetch;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Views\Twig;

final class ApiEmployeeShiftFetchAction
{
    private $apiEmployeeShiftFetch;
    private $twig;

    public function __construct(
            ApiEmployeeShiftFetch $apiEmployeeShiftFetch, 
            Twig $twig
        )
    {
        $this->apiEmployeeShiftFetch = $apiEmployeeShiftFetch;
        $this->twig = $twig;
    }

    public function __invoke(
        ServerRequestInterface $request,
        ResponseInterface $response,
        array $args = []
    ): ResponseInterface {

        $shiftId = (int)$args['shift_id'];
        
        $apiEmployeeShiftData = $this->apiEmployeeShiftFetch->getApiEmployeeShift($shiftId);

        $response->getBody()->write((string)json_encode($apiEmployeeShiftData));
        
        //sleep(10);
        
        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);
    }
}