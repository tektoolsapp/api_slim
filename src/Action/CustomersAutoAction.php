<?php

namespace App\Action;

use App\Domain\Customers\Service\CustomersAutoList;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Views\Twig;

final class CustomersAutoAction
{
    private $customersAutoList;
    private $twig;

    public function __construct(CustomersAutoList $customersAutoList, Twig $twig)
    {
        $this->customersAutoList = $customersAutoList;
        $this->twig = $twig;
    }

    public function __invoke(
        ServerRequestInterface $request,
        ResponseInterface $response,
        array $args = []
    ): ResponseInterface {

        $params = $request->getQueryParams();

        $term = $params['term'];

        $customersData = $this->customersAutoList->getCustomers($term);

        $response->getBody()->write((string)json_encode($customersData));

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);

    }
}