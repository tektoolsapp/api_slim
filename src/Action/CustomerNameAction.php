<?php

namespace App\Action;

use App\Domain\Customers\Service\CustomerNameList;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Views\Twig;

final class CustomerNameAction
{
    private $customerNameList;
    private $twig;

    public function __construct(CustomerNameList $customerNameList, Twig $twig)
    {
        $this->customerNameList = $customerNameList;
        $this->twig = $twig;
    }

    public function __invoke(
        ServerRequestInterface $request,
        ResponseInterface $response,
        array $args = []
    ): ResponseInterface {

        $params = $request->getQueryParams();

        $name = $params['name'];

        $customersData = $this->customerNameList->getCustomer($name);

        $response->getBody()->write((string)json_encode($customersData));

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);

    }
}